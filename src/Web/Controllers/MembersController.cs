using System.Security.Claims;
using DotForge.Application.DTOs;
using DotForge.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DotForge.Web.Controllers;

[Authorize]
[ApiController]
[Route("api/organizations/{orgId:guid}/members")]
public class MembersController : ControllerBase
{
    private readonly IMemberService _members;

    public MembersController(IMemberService members) => _members = members;

    [HttpGet]
    public async Task<ActionResult<List<MemberDto>>> GetAll(Guid orgId)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            return Ok(await _members.GetMembersAsync(orgId, userId));
        }
        catch (InvalidOperationException ex)
        {
            return Unauthorized(new { error = ex.Message });
        }
    }

    [HttpPost("invite")]
    public async Task<ActionResult<InvitationDto>> Invite(Guid orgId, [FromBody] InviteMemberRequest request)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var result = await _members.InviteAsync(orgId, userId, request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("{userId:guid}")]
    public async Task<ActionResult> Remove(Guid orgId, Guid userId)
    {
        try
        {
            var removedBy = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _members.RemoveMemberAsync(orgId, userId, removedBy);
            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{userId:guid}/role")]
    public async Task<ActionResult> ChangeRole(Guid orgId, Guid userId, [FromBody] ChangeRoleRequest request)
    {
        try
        {
            var changedBy = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _members.ChangeMemberRoleAsync(orgId, userId, request.Role, changedBy);
            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}

public record ChangeRoleRequest(Domain.Enums.MemberRole Role);
