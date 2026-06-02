using System.Security.Claims;
using DotForge.Application.DTOs;
using DotForge.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DotForge.Web.Controllers;

[ApiController]
[Route("api/invitations")]
public class InvitationsController : ControllerBase
{
    private readonly IMemberService _members;

    public InvitationsController(IMemberService members) => _members = members;

    [HttpGet("{token}")]
    public async Task<ActionResult<InvitationDto>> GetByToken(string token)
    {
        var result = await _members.GetInvitationByTokenAsync(token);
        if (result is null)
            return NotFound(new { error = "Invalid invitation." });
        return Ok(result);
    }

    [Authorize]
    [HttpPost("{token}/accept")]
    public async Task<ActionResult> Accept(string token)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(System.Security.Claims.ClaimTypes.NameIdentifier)!);
            await _members.AcceptInvitationAsync(userId, token);
            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
