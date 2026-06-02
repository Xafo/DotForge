using DotForge.Domain.Entities;

namespace DotForge.Application.Interfaces;


public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> GetByEmailAsync(string email);
    Task<bool> EmailExistsAsync(string email);
    Task AddAsync(User user);
    Task UpdateAsync(User user);
}

public interface IOrganizationRepository
{
    Task<Organization?> GetByIdAsync(Guid id);
    Task<Organization?> GetBySlugAsync(string slug);
    Task<bool> SlugExistsAsync(string slug);
    Task AddAsync(Organization organization);
    Task UpdateAsync(Organization organization);
}

public interface IOrganizationMembershipRepository
{
    Task<OrganizationMembership?> GetAsync(Guid organizationId, Guid userId);
    Task<List<OrganizationMembership>> GetUserMembershipsAsync(Guid userId);
    Task<List<OrganizationMembership>> GetOrganizationMembersAsync(Guid organizationId);
    Task AddAsync(OrganizationMembership membership);
    Task UpdateAsync(OrganizationMembership membership);
    Task RemoveAsync(OrganizationMembership membership);
    Task<Guid?> GetLastActiveOrganizationIdAsync(Guid userId);
    Task SetLastActiveOrganizationIdAsync(Guid userId, Guid organizationId);
}

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetByTokenHashAsync(string tokenHash);
    Task AddAsync(RefreshToken token);
    Task RevokeAsync(Guid tokenId, Guid? replacedByTokenId = null);
    Task RevokeAllForUserAsync(Guid userId, Guid organizationId);
    Task CleanupExpiredAsync();
}

public interface IInvitationRepository
{
    Task<Invitation?> GetByIdAsync(Guid id);
    Task<Invitation?> GetByTokenHashAsync(string tokenHash);
    Task<List<Invitation>> GetByOrganizationAsync(Guid organizationId);
    Task AddAsync(Invitation invitation);
    Task UpdateAsync(Invitation invitation);
}

public interface ISubscriptionRepository
{
    Task<Subscription?> GetByOrganizationAsync(Guid organizationId);
    Task<Subscription?> GetByStripeCustomerIdAsync(string stripeCustomerId);
    Task<Subscription?> GetByStripeSubscriptionIdAsync(string stripeSubscriptionId);
    Task AddAsync(Subscription subscription);
    Task UpdateAsync(Subscription subscription);
}

public interface IApiKeyRepository
{
    Task<List<ApiKey>> GetByOrganizationAsync(Guid organizationId);
    Task<ApiKey?> GetByIdAsync(Guid id);
    Task<ApiKey?> GetByKeyHashAsync(string keyHash);
    Task AddAsync(ApiKey apiKey);
    Task UpdateAsync(ApiKey apiKey);
}

public interface IAuditLogRepository
{
    Task AddAsync(AuditLog auditLog);
}

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
