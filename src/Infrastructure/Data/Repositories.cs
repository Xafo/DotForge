using DotForge.Application.Interfaces;
using DotForge.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DotForge.Infrastructure.Data;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _db;

    public UserRepository(AppDbContext db) => _db = db;

    public Task<User?> GetByIdAsync(Guid id) =>
        _db.Users.FirstOrDefaultAsync(u => u.Id == id);

    public Task<User?> GetByEmailAsync(string email) =>
        _db.Users.FirstOrDefaultAsync(u => u.Email == email);

    public Task<bool> EmailExistsAsync(string email) =>
        _db.Users.AnyAsync(u => u.Email == email);

    public async Task AddAsync(User user)
    {
        await _db.Users.AddAsync(user);
    }

    public Task UpdateAsync(User user)
    {
        _db.Users.Update(user);
        return Task.CompletedTask;
    }
}

public class OrganizationRepository : IOrganizationRepository
{
    private readonly AppDbContext _db;

    public OrganizationRepository(AppDbContext db) => _db = db;

    public Task<Organization?> GetByIdAsync(Guid id) =>
        _db.Organizations.FirstOrDefaultAsync(o => o.Id == id);

    public Task<Organization?> GetBySlugAsync(string slug) =>
        _db.Organizations.FirstOrDefaultAsync(o => o.Slug == slug);

    public Task<bool> SlugExistsAsync(string slug) =>
        _db.Organizations.AnyAsync(o => o.Slug == slug);

    public async Task AddAsync(Organization organization)
    {
        await _db.Organizations.AddAsync(organization);
    }

    public Task UpdateAsync(Organization organization)
    {
        _db.Organizations.Update(organization);
        return Task.CompletedTask;
    }
}

public class OrganizationMembershipRepository : IOrganizationMembershipRepository
{
    private readonly AppDbContext _db;

    public OrganizationMembershipRepository(AppDbContext db) => _db = db;

    public Task<OrganizationMembership?> GetAsync(Guid organizationId, Guid userId) =>
        _db.OrganizationMemberships
            .FirstOrDefaultAsync(m => m.OrganizationId == organizationId && m.UserId == userId);

    public Task<List<OrganizationMembership>> GetUserMembershipsAsync(Guid userId) =>
        _db.OrganizationMemberships
            .Include(m => m.Organization)
            .Where(m => m.UserId == userId)
            .ToListAsync();

    public Task<List<OrganizationMembership>> GetOrganizationMembersAsync(Guid organizationId) =>
        _db.OrganizationMemberships
            .Include(m => m.User)
            .Where(m => m.OrganizationId == organizationId)
            .ToListAsync();

    public async Task AddAsync(OrganizationMembership membership)
    {
        await _db.OrganizationMemberships.AddAsync(membership);
    }

    public Task UpdateAsync(OrganizationMembership membership)
    {
        _db.OrganizationMemberships.Update(membership);
        return Task.CompletedTask;
    }

    public Task RemoveAsync(OrganizationMembership membership)
    {
        _db.OrganizationMemberships.Remove(membership);
        return Task.CompletedTask;
    }

    public async Task<Guid?> GetLastActiveOrganizationIdAsync(Guid userId)
    {
        var membership = await _db.OrganizationMemberships
            .Where(m => m.UserId == userId)
            .OrderByDescending(m => m.JoinedAt)
            .FirstOrDefaultAsync();
        return membership?.OrganizationId;
    }

    public async Task SetLastActiveOrganizationIdAsync(Guid userId, Guid organizationId)
    {
        await Task.CompletedTask;
    }
}

public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly AppDbContext _db;

    public RefreshTokenRepository(AppDbContext db) => _db = db;

    public Task<RefreshToken?> GetByTokenHashAsync(string tokenHash) =>
        _db.RefreshTokens.FirstOrDefaultAsync(t => t.TokenHash == tokenHash);

    public async Task AddAsync(RefreshToken token)
    {
        await _db.RefreshTokens.AddAsync(token);
    }

    public async Task RevokeAsync(Guid tokenId, Guid? replacedByTokenId = null)
    {
        var token = await _db.RefreshTokens.FindAsync(tokenId);
        if (token is not null)
        {
            token.RevokedAt = DateTime.UtcNow;
            token.ReplacedByTokenId = replacedByTokenId;
        }
    }

    public async Task RevokeAllForUserAsync(Guid userId, Guid organizationId)
    {
        var tokens = await _db.RefreshTokens
            .Where(t => t.UserId == userId && t.OrganizationId == organizationId && t.RevokedAt == null)
            .ToListAsync();

        foreach (var token in tokens)
            token.RevokedAt = DateTime.UtcNow;
    }

    public Task CleanupExpiredAsync()
    {
        var expired = _db.RefreshTokens.Where(t => t.ExpiresAt < DateTime.UtcNow);
        _db.RefreshTokens.RemoveRange(expired);
        return Task.CompletedTask;
    }
}

public class InvitationRepository : IInvitationRepository
{
    private readonly AppDbContext _db;

    public InvitationRepository(AppDbContext db) => _db = db;

    public Task<Invitation?> GetByIdAsync(Guid id) =>
        _db.Invitations.Include(i => i.Organization).FirstOrDefaultAsync(i => i.Id == id);

    public Task<Invitation?> GetByTokenHashAsync(string tokenHash) =>
        _db.Invitations.Include(i => i.Organization).FirstOrDefaultAsync(i => i.TokenHash == tokenHash);

    public Task<List<Invitation>> GetByOrganizationAsync(Guid organizationId) =>
        _db.Invitations
            .Where(i => i.OrganizationId == organizationId && !i.IsCancelled)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();

    public async Task AddAsync(Invitation invitation)
    {
        await _db.Invitations.AddAsync(invitation);
    }

    public Task UpdateAsync(Invitation invitation)
    {
        _db.Invitations.Update(invitation);
        return Task.CompletedTask;
    }
}

public class SubscriptionRepository : ISubscriptionRepository
{
    private readonly AppDbContext _db;

    public SubscriptionRepository(AppDbContext db) => _db = db;

    public Task<Subscription?> GetByOrganizationAsync(Guid organizationId) =>
        _db.Subscriptions.FirstOrDefaultAsync(s => s.OrganizationId == organizationId);

    public Task<Subscription?> GetByStripeCustomerIdAsync(string stripeCustomerId) =>
        _db.Subscriptions.FirstOrDefaultAsync(s => s.StripeCustomerId == stripeCustomerId);

    public Task<Subscription?> GetByStripeSubscriptionIdAsync(string stripeSubscriptionId) =>
        _db.Subscriptions.FirstOrDefaultAsync(s => s.StripeSubscriptionId == stripeSubscriptionId);

    public async Task AddAsync(Subscription subscription)
    {
        await _db.Subscriptions.AddAsync(subscription);
    }

    public Task UpdateAsync(Subscription subscription)
    {
        _db.Subscriptions.Update(subscription);
        return Task.CompletedTask;
    }
}

public class ApiKeyRepository : IApiKeyRepository
{
    private readonly AppDbContext _db;

    public ApiKeyRepository(AppDbContext db) => _db = db;

    public Task<List<ApiKey>> GetByOrganizationAsync(Guid organizationId) =>
        _db.ApiKeys.Where(k => k.OrganizationId == organizationId).OrderByDescending(k => k.CreatedAt).ToListAsync();

    public Task<ApiKey?> GetByIdAsync(Guid id) =>
        _db.ApiKeys.FirstOrDefaultAsync(k => k.Id == id);

    public Task<ApiKey?> GetByKeyHashAsync(string keyHash) =>
        _db.ApiKeys.FirstOrDefaultAsync(k => k.KeyHash == keyHash);

    public async Task AddAsync(ApiKey apiKey)
    {
        await _db.ApiKeys.AddAsync(apiKey);
    }

    public Task UpdateAsync(ApiKey apiKey)
    {
        _db.ApiKeys.Update(apiKey);
        return Task.CompletedTask;
    }
}

public class AuditLogRepository : IAuditLogRepository
{
    private readonly AppDbContext _db;

    public AuditLogRepository(AppDbContext db) => _db = db;

    public async Task AddAsync(AuditLog auditLog)
    {
        await _db.AuditLogs.AddAsync(auditLog);
    }
}
