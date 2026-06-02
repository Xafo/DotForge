using DotForge.Domain.Entities;

namespace DotForge.Application.Interfaces;

public interface ITenantProvider
{
    Guid? GetCurrentTenantId();
}
