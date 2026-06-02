using DotForge.Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace DotForge.Infrastructure.Services;

public class TenantProvider : ITenantProvider
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public TenantProvider(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid? GetCurrentTenantId()
    {
        var orgClaim = _httpContextAccessor.HttpContext?.User?
            .FindFirst("OrganizationId")?.Value;

        if (Guid.TryParse(orgClaim, out var orgId))
            return orgId;

        return null;
    }
}
