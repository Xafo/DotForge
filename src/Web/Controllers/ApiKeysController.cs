using System.Security.Claims;
using DotForge.Application.DTOs;
using DotForge.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DotForge.Web.Controllers;

[Authorize]
[ApiController]
[Route("api/organizations/{orgId:guid}/api-keys")]
public class ApiKeysController : ControllerBase
{
    private readonly IApiKeyService _apiKeys;

    public ApiKeysController(IApiKeyService apiKeys) => _apiKeys = apiKeys;

    [HttpGet]
    public async Task<ActionResult<List<ApiKeyDto>>> GetAll(Guid orgId)
    {
        return Ok(await _apiKeys.GetApiKeysAsync(orgId));
    }

    [HttpPost]
    public async Task<ActionResult<ApiKeyCreatedDto>> Create(Guid orgId, [FromBody] CreateApiKeyRequest request)
    {
        var result = await _apiKeys.CreateApiKeyAsync(orgId, request);
        return Ok(result);
    }

    [HttpDelete("{keyId:guid}")]
    public async Task<ActionResult> Revoke(Guid orgId, Guid keyId)
    {
        try
        {
            await _apiKeys.RevokeApiKeyAsync(orgId, keyId);
            return Ok();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
