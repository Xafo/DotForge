using System.Security.Claims;
using DotForge.Application.DTOs;
using DotForge.Application.Interfaces;
using DotForge.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace DotForge.Web.Controllers;

[ApiController]
public class WebhooksController : ControllerBase
{
    private readonly IBillingService _billing;

    public WebhooksController(IBillingService billing) => _billing = billing;

    [HttpPost("api/webhooks/stripe")]
    public async Task<ActionResult> HandleStripe()
    {
        using var reader = new StreamReader(Request.Body);
        var json = await reader.ReadToEndAsync();
        var signature = Request.Headers["Stripe-Signature"].FirstOrDefault() ?? "";

        try
        {
            await _billing.HandleStripeWebhookAsync(json, signature);
            return Ok();
        }
        catch (Exception)
        {
            return BadRequest();
        }
    }
}
