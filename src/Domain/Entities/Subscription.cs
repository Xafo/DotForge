using DotForge.Domain.Enums;

namespace DotForge.Domain.Entities;

public class Subscription
{
    public Guid Id { get; set; }
    public Guid OrganizationId { get; set; }
    public string StripeCustomerId { get; set; } = string.Empty;
    public string? StripeSubscriptionId { get; set; }
    public SubscriptionStatus Status { get; set; }
    public string? PlanId { get; set; }
    public DateTime? PeriodEnd { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Organization Organization { get; set; } = null!;

    public bool IsActive => Status is SubscriptionStatus.Active or SubscriptionStatus.Trialing;
}
