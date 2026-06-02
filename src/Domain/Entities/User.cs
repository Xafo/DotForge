namespace DotForge.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? OAuthProvider { get; set; }
    public string? OAuthSubject { get; set; }
    public DateTime CreatedAt { get; set; }

    public ICollection<OrganizationMembership> Memberships { get; set; } = [];
    public ICollection<RefreshToken> RefreshTokens { get; set; } = [];
}
