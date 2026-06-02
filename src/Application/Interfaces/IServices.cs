using DotForge.Application.DTOs;
using DotForge.Domain.Entities;
using DotForge.Domain.Enums;

namespace DotForge.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task LogoutAsync(Guid userId, Guid organizationId);
    Task<AuthResponse> RefreshTokenAsync(string refreshToken);
    Task ForgotPasswordAsync(string email);
    Task ResetPasswordAsync(string email, string token, string newPassword);
    Task<AuthResponse> HandleOAuthAsync(string provider, string code, string redirectUri);
}

public interface IOrganizationService
{
    Task<List<OrganizationDto>> GetUserOrganizationsAsync(Guid userId);
    Task<OrganizationDto> CreateAsync(Guid userId, CreateOrganizationRequest request);
    Task<OrganizationDto> UpdateAsync(Guid organizationId, UpdateOrganizationRequest request);
    Task<AuthResponse> SwitchOrganizationAsync(Guid userId, Guid organizationId);
}

public interface IMemberService
{
    Task<List<MemberDto>> GetMembersAsync(Guid organizationId);
    Task<InvitationDto> InviteAsync(Guid organizationId, Guid invitedByUserId, InviteMemberRequest request);
    Task<InvitationDto?> GetInvitationByTokenAsync(string token);
    Task AcceptInvitationAsync(Guid userId, string token);
    Task RemoveMemberAsync(Guid organizationId, Guid userId, Guid removedByUserId);
    Task ChangeMemberRoleAsync(Guid organizationId, Guid userId, MemberRole newRole, Guid changedByUserId);
}

public interface IBillingService
{
    Task<string> CreateCheckoutSessionAsync(Guid organizationId, string priceId, string successUrl, string cancelUrl);
    Task<string> CreatePortalSessionAsync(Guid organizationId, string returnUrl);
    Task HandleStripeWebhookAsync(string json, string signature);
    Task<SubscriptionDto?> GetSubscriptionAsync(Guid organizationId);
}

public interface IApiKeyService
{
    Task<List<ApiKeyDto>> GetApiKeysAsync(Guid organizationId);
    Task<ApiKeyCreatedDto> CreateApiKeyAsync(Guid organizationId, CreateApiKeyRequest request);
    Task RevokeApiKeyAsync(Guid organizationId, Guid apiKeyId);
}

public interface IUserService
{
    Task<UserProfileDto> GetProfileAsync(Guid userId);
    Task<UserProfileDto> UpdateProfileAsync(Guid userId, UpdateProfileRequest request);
    Task ChangePasswordAsync(Guid userId, ChangePasswordRequest request);
}

public interface ITokenService
{
    string GenerateAccessToken(User user, Guid organizationId);
    string GenerateRefreshToken();
    string GeneratePasswordResetToken();
}
