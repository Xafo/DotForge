using DotForge.Domain.Enums;

namespace DotForge.Application.DTOs;

public record RegisterRequest(string Email, string Password, string Name);
public record LoginRequest(string Email, string Password);
public record ForgotPasswordRequest(string Email);
public record ResetPasswordRequest(string Email, string Token, string NewPassword);
public record OAuthRequest(string Provider, string Code, string RedirectUri);
public record SwitchOrganizationRequest(Guid OrganizationId);

public record CreateOrganizationRequest(string Name, string Slug);
public record UpdateOrganizationRequest(string Name, string Slug);
public record InviteMemberRequest(string Email);

public record CreateApiKeyRequest(string Name, List<string> Scopes, DateTime? ExpiresAt);

public record UpdateProfileRequest(string Name, string? AvatarUrl);
public record ChangePasswordRequest(string CurrentPassword, string NewPassword);

public record AuthResponse(
    Guid UserId,
    string Email,
    string Name,
    string? AvatarUrl,
    string AccessToken,
    Guid? CurrentOrganizationId,
    List<OrganizationDto> Organizations
);

public record OrganizationDto(Guid Id, string Name, string Slug, MemberRole Role);

public record MemberDto(Guid UserId, string Email, string Name, string Role, DateTime JoinedAt);

public record InvitationDto(
    Guid Id,
    string Email,
    DateTime CreatedAt,
    DateTime ExpiresAt,
    bool IsValid,
    Guid OrganizationId,
    string OrganizationName
);

public record ApiKeyDto(
    Guid Id,
    string Name,
    string Prefix,
    List<string> Scopes,
    DateTime? LastUsedAt,
    DateTime? ExpiresAt,
    DateTime CreatedAt,
    bool IsActive
);

public record ApiKeyCreatedDto(Guid Id, string Name, string Prefix, string PlainKey, DateTime CreatedAt);

public record SubscriptionDto(
    string Status,
    string? PlanId,
    DateTime? PeriodEnd,
    bool IsActive
);

public record UserProfileDto(Guid Id, string Email, string Name, string? AvatarUrl, DateTime CreatedAt);

public record DashboardDto(
    string OrganizationName,
    string OrganizationSlug,
    string Role,
    int MemberCount,
    int PendingInvitations,
    int ApiKeyCount,
    int ActiveApiKeys,
    SubscriptionDto? Subscription
);
