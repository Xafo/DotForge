using System.Security.Cryptography;
using System.Text;
using DotForge.Application.DTOs;
using DotForge.Application.Interfaces;
using DotForge.Domain.Entities;
using DotForge.Domain.Enums;
using DotForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace DotForge.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _users;
    private readonly IOrganizationRepository _orgs;
    private readonly IOrganizationMembershipRepository _memberships;
    private readonly IRefreshTokenRepository _refreshTokens;
    private readonly ITokenService _tokens;
    private readonly IOAuthService _oauth;
    private readonly IUnitOfWork _unitOfWork;
    private readonly JwtOptions _jwt;

    public AuthService(
        IUserRepository users,
        IOrganizationRepository orgs,
        IOrganizationMembershipRepository memberships,
        IRefreshTokenRepository refreshTokens,
        ITokenService tokens,
        IOAuthService oauth,
        IUnitOfWork unitOfWork,
        IOptions<JwtOptions> jwt)
    {
        _users = users;
        _orgs = orgs;
        _memberships = memberships;
        _refreshTokens = refreshTokens;
        _tokens = tokens;
        _oauth = oauth;
        _unitOfWork = unitOfWork;
        _jwt = jwt.Value;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        if (await _users.EmailExistsAsync(request.Email))
            throw new InvalidOperationException("Email already registered.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email.ToLowerInvariant().Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Name = request.Name.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        await _users.AddAsync(user);

        var org = new Organization
        {
            Id = Guid.NewGuid(),
            Name = $"{user.Name}'s Organization",
            Slug = CreateSlug(user.Name),
            CreatedAt = DateTime.UtcNow
        };

        await _orgs.AddAsync(org);

        var membership = new OrganizationMembership
        {
            OrganizationId = org.Id,
            UserId = user.Id,
            Role = MemberRole.Admin,
            JoinedAt = DateTime.UtcNow
        };

        await _memberships.AddAsync(membership);
        await _unitOfWork.SaveChangesAsync();

        return await CreateAuthResponse(user, org.Id);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _users.GetByEmailAsync(request.Email.ToLowerInvariant().Trim());
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new InvalidOperationException("Invalid email or password.");

        if (string.IsNullOrEmpty(user.PasswordHash))
            throw new InvalidOperationException("Account uses OAuth. Please sign in with your provider.");

        var orgId = await _memberships.GetLastActiveOrganizationIdAsync(user.Id)
                    ?? (await _memberships.GetUserMembershipsAsync(user.Id)).FirstOrDefault()?.OrganizationId;

        if (orgId is null)
            throw new InvalidOperationException("No organizations found.");

        return await CreateAuthResponse(user, orgId.Value);
    }

    public async Task LogoutAsync(Guid userId, Guid organizationId)
    {
        await _refreshTokens.RevokeAllForUserAsync(userId, organizationId);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
    {
        var tokenHash = HashToken(refreshToken);
        var storedToken = await _refreshTokens.GetByTokenHashAsync(tokenHash);

        if (storedToken is null || !storedToken.IsActive)
            throw new InvalidOperationException("Invalid or expired refresh token.");

        await _refreshTokens.RevokeAsync(storedToken.Id);
        await _unitOfWork.SaveChangesAsync();

        var user = await _users.GetByIdAsync(storedToken.UserId)
                   ?? throw new InvalidOperationException("User not found.");

        return await CreateAuthResponse(user, storedToken.OrganizationId);
    }

    public Task ForgotPasswordAsync(string email)
    {
        var normalizedEmail = email.ToLowerInvariant().Trim();
        if (!string.IsNullOrEmpty(normalizedEmail))
        {
            var token = _tokens.GeneratePasswordResetToken();
        }

        return Task.CompletedTask;
    }

    public async Task ResetPasswordAsync(string email, string token, string newPassword)
    {
        var user = await _users.GetByEmailAsync(email.ToLowerInvariant().Trim());
        if (user is null)
            throw new InvalidOperationException("Invalid request.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await _users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<AuthResponse> HandleOAuthAsync(string provider, string code, string redirectUri)
    {
        var oauthInfo = await _oauth.ExchangeCodeAsync(provider, code);

        var user = await _users.GetByEmailAsync(oauthInfo.Email);
        if (user is null)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                Email = oauthInfo.Email,
                Name = oauthInfo.Name,
                AvatarUrl = oauthInfo.AvatarUrl,
                OAuthProvider = oauthInfo.Provider,
                OAuthSubject = oauthInfo.Subject,
                CreatedAt = DateTime.UtcNow
            };
            await _users.AddAsync(user);

            var org = new Organization
            {
                Id = Guid.NewGuid(),
                Name = $"{user.Name}'s Organization",
                Slug = CreateSlugForOrg(user.Name),
                CreatedAt = DateTime.UtcNow
            };
            await _orgs.AddAsync(org);

            await _memberships.AddAsync(new OrganizationMembership
            {
                OrganizationId = org.Id, UserId = user.Id,
                Role = MemberRole.Admin, JoinedAt = DateTime.UtcNow
            });

            await _unitOfWork.SaveChangesAsync();
        }
        else
        {
            user.Name = oauthInfo.Name;
            user.AvatarUrl = oauthInfo.AvatarUrl;
            user.OAuthProvider = oauthInfo.Provider;
            user.OAuthSubject = oauthInfo.Subject;
            await _users.UpdateAsync(user);
            await _unitOfWork.SaveChangesAsync();
        }

        var orgId = (await _memberships.GetLastActiveOrganizationIdAsync(user.Id))
                    ?? (await _memberships.GetUserMembershipsAsync(user.Id)).FirstOrDefault()?.OrganizationId;
        if (orgId is null)
            throw new InvalidOperationException("No organizations found.");

        return await CreateAuthResponse(user, orgId.Value);
    }

    private static string CreateSlugForOrg(string name)
    {
        var slug = name.ToLowerInvariant()
            .Replace(" ", "-")
            .Replace(".", "-");
        slug = new string(slug.Where(c => char.IsLetterOrDigit(c) || c == '-').ToArray());
        slug = slug.Trim('-');
        return string.IsNullOrEmpty(slug) ? $"org-{Guid.NewGuid():N}"[..12] : slug;
    }

    private async Task<AuthResponse> CreateAuthResponse(User user, Guid organizationId)
    {
        var accessToken = _tokens.GenerateAccessToken(user, organizationId);
        var refreshTokenPlain = _tokens.GenerateRefreshToken();

        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            OrganizationId = organizationId,
            TokenHash = HashToken(refreshTokenPlain),
            ExpiresAt = DateTime.UtcNow.AddDays(_jwt.RefreshTokenExpirationDays),
            CreatedAt = DateTime.UtcNow
        };

        await _refreshTokens.AddAsync(refreshToken);
        await _unitOfWork.SaveChangesAsync();

        var memberships = await _memberships.GetUserMembershipsAsync(user.Id);
        var orgs = memberships.Select(m => new OrganizationDto(
            m.OrganizationId, m.Organization.Name, m.Organization.Slug, m.Role)).ToList();

        return new AuthResponse(
            user.Id, user.Email, user.Name, user.AvatarUrl,
            accessToken, organizationId, orgs
        );
    }

    internal static string HashTokenStatic(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }

    private static string HashToken(string token) => HashTokenStatic(token);

    private static string CreateSlug(string name)
    {
        var slug = name.ToLowerInvariant()
            .Replace(" ", "-")
            .Replace(".", "-");
        slug = new string(slug.Where(c => char.IsLetterOrDigit(c) || c == '-').ToArray());
        slug = slug.Trim('-');
        return string.IsNullOrEmpty(slug) ? $"org-{Guid.NewGuid():N}"[..12] : slug;
    }
}

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _db;

    public UnitOfWork(AppDbContext db) => _db = db;

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) =>
        await _db.SaveChangesAsync(cancellationToken);
}
