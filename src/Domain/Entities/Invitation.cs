namespace DotForge.Domain.Entities;

public class Invitation
{
    public Guid Id { get; set; }
    public Guid OrganizationId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string TokenHash { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? AcceptedAt { get; set; }
    public Guid CreatedByUserId { get; set; }
    public bool IsCancelled { get; set; }

    public Organization Organization { get; set; } = null!;
    public User CreatedByUser { get; set; } = null!;

    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    public bool IsAccepted => AcceptedAt is not null;
    public bool IsValid => !IsExpired && !IsAccepted && !IsCancelled;
}
