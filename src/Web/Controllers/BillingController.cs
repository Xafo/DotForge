using System.Security.Claims;
using DotForge.Application.DTOs;
using DotForge.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DotForge.Web.Controllers;

[Authorize]
[ApiController]
[Route("api/billing")]
public class BillingController : ControllerBase
{
    private readonly IBillingService _billing;

    public BillingController(IBillingService billing) => _billing = billing;

    [HttpPost("create-checkout-session")]
    public async Task<ActionResult<CheckoutResponse>> CreateCheckoutSession([FromBody] CreateCheckoutRequest request)
    {
        try
        {
            var orgId = Guid.Parse(User.FindFirstValue("OrganizationId")!);
            var url = await _billing.CreateCheckoutSessionAsync(orgId, request.PriceId, request.SuccessUrl, request.CancelUrl);
            return Ok(new CheckoutResponse(url));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("create-portal-session")]
    public async Task<ActionResult<CheckoutResponse>> CreatePortalSession([FromBody] PortalRequest request)
    {
        try
        {
            var orgId = Guid.Parse(User.FindFirstValue("OrganizationId")!);
            var url = await _billing.CreatePortalSessionAsync(orgId, request.ReturnUrl);
            return Ok(new CheckoutResponse(url));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("subscription")]
    public async Task<ActionResult<SubscriptionDto?>> GetSubscription()
    {
        var orgId = Guid.Parse(User.FindFirstValue("OrganizationId")!);
        return Ok(await _billing.GetSubscriptionAsync(orgId));
    }
}

public record CreateCheckoutRequest(string PriceId, string SuccessUrl, string CancelUrl);
public record PortalRequest(string ReturnUrl);
public record CheckoutResponse(string Url);
