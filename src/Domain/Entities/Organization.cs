namespace DotForge.Domain.Entities;

public class Organization
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public ICollection<OrganizationMembership> Memberships { get; set; } = [];
    public ICollection<Invitation> Invitations { get; set; } = [];
    public ICollection<ApiKey> ApiKeys { get; set; } = [];
}
