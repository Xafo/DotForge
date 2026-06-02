using DotForge.Application.DTOs;
using DotForge.Application.Interfaces;
using DotForge.Domain.Entities;
using DotForge.Domain.Enums;
using DotForge.Infrastructure.Data;

namespace DotForge.Infrastructure.Services;

public class OrganizationService : IOrganizationService
{
    private readonly IOrganizationRepository _orgs;
    private readonly IOrganizationMembershipRepository _memberships;
    private readonly IUserRepository _users;
    private readonly IRefreshTokenRepository _refreshTokens;
    private readonly ITokenService _tokens;
    private readonly IUnitOfWork _unitOfWork;
    private readonly JwtOptions _jwt;

    public OrganizationService(
        IOrganizationRepository orgs,
        IOrganizationMembershipRepository memberships,
        IUserRepository users,
        IRefreshTokenRepository refreshTokens,
        ITokenService tokens,
        IUnitOfWork unitOfWork,
        Microsoft.Extensions.Options.IOptions<JwtOptions> jwt)
    {
        _orgs = orgs;
        _memberships = memberships;
        _users = users;
        _refreshTokens = refreshTokens;
        _tokens = tokens;
        _unitOfWork = unitOfWork;
        _jwt = jwt.Value;
    }

    public async Task<List<OrganizationDto>> GetUserOrganizationsAsync(Guid userId)
    {
        var memberships = await _memberships.GetUserMembershipsAsync(userId);
        return memberships.Select(m => new OrganizationDto(
            m.OrganizationId, m.Organization.Name, m.Organization.Slug, m.Role)).ToList();
    }

    public async Task<OrganizationDto> CreateAsync(Guid userId, CreateOrganizationRequest request)
    {
        if (await _orgs.SlugExistsAsync(request.Slug))
            throw new InvalidOperationException("Organization slug already exists.");

        var org = new Organization
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            Slug = request.Slug.ToLowerInvariant().Trim(),
            CreatedAt = DateTime.UtcNow
        };

        await _orgs.AddAsync(org);

        var membership = new OrganizationMembership
        {
            OrganizationId = org.Id,
            UserId = userId,
            Role = MemberRole.Admin,
            JoinedAt = DateTime.UtcNow
        };

        await _memberships.AddAsync(membership);
        await _unitOfWork.SaveChangesAsync();

        return new OrganizationDto(org.Id, org.Name, org.Slug, MemberRole.Admin);
    }

    public async Task<OrganizationDto> UpdateAsync(Guid organizationId, UpdateOrganizationRequest request)
    {
        var org = await _orgs.GetByIdAsync(organizationId)
                  ?? throw new InvalidOperationException("Organization not found.");

        org.Name = request.Name.Trim();
        org.Slug = request.Slug.ToLowerInvariant().Trim();
        org.UpdatedAt = DateTime.UtcNow;

        await _orgs.UpdateAsync(org);
        await _unitOfWork.SaveChangesAsync();

        return new OrganizationDto(org.Id, org.Name, org.Slug, MemberRole.Admin);
    }

    public async Task<AuthResponse> SwitchOrganizationAsync(Guid userId, Guid organizationId)
    {
        var membership = await _memberships.GetAsync(organizationId, userId)
                         ?? throw new InvalidOperationException("Not a member of this organization.");

        var user = await _users.GetByIdAsync(userId)
                   ?? throw new InvalidOperationException("User not found.");

        var accessToken = _tokens.GenerateAccessToken(user, organizationId);

        var refreshTokenPlain = _tokens.GenerateRefreshToken();
        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            OrganizationId = organizationId,
            TokenHash = AuthService.HashTokenStatic(refreshTokenPlain),
            ExpiresAt = DateTime.UtcNow.AddDays(_jwt.RefreshTokenExpirationDays),
            CreatedAt = DateTime.UtcNow
        };

        await _refreshTokens.RevokeAllForUserAsync(userId, organizationId);
        await _refreshTokens.AddAsync(refreshToken);
        await _unitOfWork.SaveChangesAsync();

        var memberships = await _memberships.GetUserMembershipsAsync(userId);
        var orgs = memberships.Select(m => new OrganizationDto(
            m.OrganizationId, m.Organization.Name, m.Organization.Slug, m.Role)).ToList();

        return new AuthResponse(
            user.Id, user.Email, user.Name, user.AvatarUrl,
            accessToken, organizationId, orgs
        );
    }
}
