using System.Security.Claims;
using DotForge.Application.DTOs;
using DotForge.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DotForge.Web.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;
    private readonly IOAuthService _oauth;

    public AuthController(IAuthService auth, IOAuthService oauth)
    {
        _auth = auth;
        _oauth = oauth;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var result = await _auth.RegisterAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var result = await _auth.LoginAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var orgId = Guid.Parse(User.FindFirstValue("OrganizationId")!);
        await _auth.LogoutAsync(userId, orgId);
        return Ok();
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponse>> Refresh([FromBody] RefreshTokenRequest request)
    {
        try
        {
            var result = await _auth.RefreshTokenAsync(request.RefreshToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Unauthorized(new { error = ex.Message });
        }
    }

    [HttpPost("forgot-password")]
    public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        await _auth.ForgotPasswordAsync(request.Email);
        return Ok();
    }

    [HttpPost("reset-password")]
    public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        try
        {
            await _auth.ResetPasswordAsync(request.Email, request.Token, request.NewPassword);
            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("oauth/{provider}/url")]
    public ActionResult GetOAuthUrl(string provider)
    {
        var url = _oauth.GetAuthorizationUrl(provider);
        return Ok(new { url });
    }

    [HttpPost("oauth/{provider}/callback")]
    public async Task<ActionResult<AuthResponse>> HandleOAuthCallback(string provider, [FromBody] OAuthCallbackRequest request)
    {
        try
        {
            var result = await _auth.HandleOAuthAsync(provider, request.Code, request.RedirectUri);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}

public record RefreshTokenRequest(string RefreshToken);
public record OAuthCallbackRequest(string Code, string RedirectUri);
