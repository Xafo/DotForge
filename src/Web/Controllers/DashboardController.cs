using System.Security.Claims;
using DotForge.Application.DTOs;
using DotForge.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DotForge.Web.Controllers;

[Authorize]
[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboard;

    public DashboardController(IDashboardService dashboard) => _dashboard = dashboard;

    [HttpGet]
    public async Task<ActionResult<DashboardDto>> GetDashboard()
    {
        try
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var orgId = Guid.Parse(User.FindFirstValue("OrganizationId")!);
            return Ok(await _dashboard.GetDashboardAsync(orgId, userId));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
