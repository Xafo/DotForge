using System.Text.Json;
using DotForge.Application.DTOs;
using DotForge.Application.Interfaces;
using DotForge.Domain.Entities;
using DotForge.Domain.Enums;
using Stripe;
using Stripe.Checkout;

namespace DotForge.Infrastructure.Services;

public class BillingService : IBillingService
{
    private readonly ISubscriptionRepository _subscriptions;
    private readonly IOrganizationRepository _orgs;
    private readonly IUnitOfWork _unitOfWork;

    public BillingService(
        ISubscriptionRepository subscriptions,
        IOrganizationRepository orgs,
        IUnitOfWork unitOfWork)
    {
        _subscriptions = subscriptions;
        _orgs = orgs;
        _unitOfWork = unitOfWork;
    }

    public async Task<string> CreateCheckoutSessionAsync(Guid organizationId, string priceId, string successUrl, string cancelUrl)
    {
        var org = await _orgs.GetByIdAsync(organizationId)
                  ?? throw new InvalidOperationException("Organization not found.");

        var sub = await _subscriptions.GetByOrganizationAsync(organizationId);
        var customerId = sub?.StripeCustomerId;

        var options = new SessionCreateOptions
        {
            Customer = customerId,
            CustomerEmail = customerId is null ? null : null,
            Mode = "subscription",
            LineItems = [new SessionLineItemOptions { Price = priceId, Quantity = 1 }],
            SuccessUrl = successUrl,
            CancelUrl = cancelUrl,
            Metadata = new Dictionary<string, string>
            {
                ["organization_id"] = organizationId.ToString()
            },
            SubscriptionData = new SessionSubscriptionDataOptions
            {
                Metadata = new Dictionary<string, string>
                {
                    ["organization_id"] = organizationId.ToString()
                }
            }
        };

        if (customerId is null)
            options.CustomerCreation = "always";

        var service = new SessionService();
        var session = await service.CreateAsync(options);

        if (sub is null)
        {
            sub = new DotForge.Domain.Entities.Subscription
            {
                Id = Guid.NewGuid(),
                OrganizationId = organizationId,
                StripeCustomerId = session.CustomerId,
                Status = SubscriptionStatus.Incomplete,
                CreatedAt = DateTime.UtcNow
            };
            await _subscriptions.AddAsync(sub);
        }
        else
        {
            sub.StripeCustomerId = session.CustomerId;
            sub.UpdatedAt = DateTime.UtcNow;
            await _subscriptions.UpdateAsync(sub);
        }

        await _unitOfWork.SaveChangesAsync();
        return session.Url;
    }

    public async Task<string> CreatePortalSessionAsync(Guid organizationId, string returnUrl)
    {
        var sub = await _subscriptions.GetByOrganizationAsync(organizationId)
                  ?? throw new InvalidOperationException("No subscription found.");

        var options = new Stripe.BillingPortal.SessionCreateOptions
        {
            Customer = sub.StripeCustomerId,
            ReturnUrl = returnUrl
        };

        var service = new Stripe.BillingPortal.SessionService();
        var session = await service.CreateAsync(options);
        return session.Url;
    }

    public async Task HandleStripeWebhookAsync(string json, string signature)
    {
        var endpointSecret = Environment.GetEnvironmentVariable("STRIPE_WEBHOOK_SECRET") ?? "";
        var stripeEvent = EventUtility.ConstructEvent(json, signature, endpointSecret);

        switch (stripeEvent.Type)
        {
            case "checkout.session.completed":
                var checkoutSession = stripeEvent.Data.Object as Session;
                if (checkoutSession?.SubscriptionId is not null)
                {
                    var sub = await _subscriptions.GetByStripeCustomerIdAsync(checkoutSession.CustomerId);
                    if (sub is not null)
                    {
                        sub.StripeSubscriptionId = checkoutSession.SubscriptionId;
                        sub.Status = MapStripeStatus(checkoutSession.Status);
                        sub.UpdatedAt = DateTime.UtcNow;
                        await _subscriptions.UpdateAsync(sub);
                        await _unitOfWork.SaveChangesAsync();
                    }
                }
                break;

            case "customer.subscription.updated":
            case "customer.subscription.deleted":
                var stripeSubscription = stripeEvent.Data.Object as Stripe.Subscription;
                if (stripeSubscription?.Id is not null)
                {
                    var sub = await _subscriptions.GetByStripeSubscriptionIdAsync(stripeSubscription.Id);
                    if (sub is not null)
                    {
                        sub.Status = MapStripeStatus(stripeSubscription.Status);
                        sub.PlanId = stripeSubscription.Items?.Data?.FirstOrDefault()?.Price?.Id;
                        var item = stripeSubscription.Items?.Data?.FirstOrDefault();
                        if (item is not null)
                            sub.PeriodEnd = item.CurrentPeriodEnd.ToUniversalTime();
                        sub.UpdatedAt = DateTime.UtcNow;
                        await _subscriptions.UpdateAsync(sub);
                        await _unitOfWork.SaveChangesAsync();
                    }
                }
                break;

            case "invoice.payment_succeeded":
            case "invoice.payment_failed":
                break;
        }
    }

    public async Task<SubscriptionDto?> GetSubscriptionAsync(Guid organizationId)
    {
        var sub = await _subscriptions.GetByOrganizationAsync(organizationId);
        return sub is null ? null : new SubscriptionDto(
            sub.Status.ToString(), sub.PlanId, sub.PeriodEnd, sub.IsActive
        );
    }

    private static SubscriptionStatus MapStripeStatus(string status) => status switch
    {
        "trialing" => SubscriptionStatus.Trialing,
        "active" => SubscriptionStatus.Active,
        "past_due" => SubscriptionStatus.PastDue,
        "canceled" => SubscriptionStatus.Canceled,
        "unpaid" => SubscriptionStatus.Unpaid,
        "incomplete" => SubscriptionStatus.Incomplete,
        "incomplete_expired" => SubscriptionStatus.IncompleteExpired,
        "paused" => SubscriptionStatus.Paused,
        _ => SubscriptionStatus.Incomplete
    };
}
