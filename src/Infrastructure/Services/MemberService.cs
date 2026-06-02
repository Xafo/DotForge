using System.Security.Cryptography;
using System.Text;
using DotForge.Application.DTOs;
using DotForge.Application.Interfaces;
using DotForge.Domain.Entities;
using DotForge.Domain.Enums;

namespace DotForge.Infrastructure.Services;

public class MemberService : IMemberService
{
    private readonly IUserRepository _users;
    private readonly IOrganizationRepository _orgs;
    private readonly IOrganizationMembershipRepository _memberships;
    private readonly IInvitationRepository _invitations;
    private readonly ITokenService _tokens;
    private readonly IUnitOfWork _unitOfWork;

    public MemberService(
        IUserRepository users,
        IOrganizationRepository orgs,
        IOrganizationMembershipRepository memberships,
        IInvitationRepository invitations,
        ITokenService tokens,
        IUnitOfWork unitOfWork)
    {
        _users = users;
        _orgs = orgs;
        _memberships = memberships;
        _invitations = invitations;
        _tokens = tokens;
        _unitOfWork = unitOfWork;
    }

    public async Task<List<MemberDto>> GetMembersAsync(Guid organizationId)
    {
        var memberships = await _memberships.GetOrganizationMembersAsync(organizationId);
        return memberships.Select(m => new MemberDto(
            m.UserId, m.User.Email, m.User.Name, m.Role.ToString(), m.JoinedAt)).ToList();
    }

    public async Task<InvitationDto> InviteAsync(Guid organizationId, Guid invitedByUserId, InviteMemberRequest request)
    {
        var org = await _orgs.GetByIdAsync(organizationId)
                  ?? throw new InvalidOperationException("Organization not found.");

        var existingMember = await _memberships.GetAsync(organizationId, invitedByUserId);
        if (existingMember?.Role != MemberRole.Admin)
            throw new InvalidOperationException("Only admins can invite members.");

        var token = _tokens.GeneratePasswordResetToken();
        var invitation = new Invitation
        {
            Id = Guid.NewGuid(),
            OrganizationId = organizationId,
            Email = request.Email.ToLowerInvariant().Trim(),
            TokenHash = HashToken(token),
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            CreatedAt = DateTime.UtcNow,
            CreatedByUserId = invitedByUserId
        };

        await _invitations.AddAsync(invitation);
        await _unitOfWork.SaveChangesAsync();

        return new InvitationDto(
            invitation.Id, invitation.Email, invitation.CreatedAt,
            invitation.ExpiresAt, true, org.Id, org.Name
        );
    }

    public async Task<InvitationDto?> GetInvitationByTokenAsync(string token)
    {
        var tokenHash = HashToken(token);
        var invitation = await _invitations.GetByTokenHashAsync(tokenHash);
        if (invitation is null) return null;

        return new InvitationDto(
            invitation.Id, invitation.Email, invitation.CreatedAt,
            invitation.ExpiresAt, invitation.IsValid,
            invitation.OrganizationId, invitation.Organization.Name
        );
    }

    public async Task AcceptInvitationAsync(Guid userId, string token)
    {
        var tokenHash = HashToken(token);
        var invitation = await _invitations.GetByTokenHashAsync(tokenHash)
                         ?? throw new InvalidOperationException("Invalid invitation.");

        if (!invitation.IsValid)
            throw new InvalidOperationException("Invitation is expired or already used.");

        var existingMember = await _memberships.GetAsync(invitation.OrganizationId, userId);
        if (existingMember is not null)
            throw new InvalidOperationException("Already a member of this organization.");

        var membership = new OrganizationMembership
        {
            OrganizationId = invitation.OrganizationId,
            UserId = userId,
            Role = MemberRole.Member,
            JoinedAt = DateTime.UtcNow
        };

        invitation.AcceptedAt = DateTime.UtcNow;

        await _memberships.AddAsync(membership);
        await _invitations.UpdateAsync(invitation);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task RemoveMemberAsync(Guid organizationId, Guid userId, Guid removedByUserId)
    {
        if (userId == removedByUserId)
            throw new InvalidOperationException("Cannot remove yourself.");

        var actor = await _memberships.GetAsync(organizationId, removedByUserId)
                    ?? throw new InvalidOperationException("Not a member.");

        if (actor.Role != MemberRole.Admin)
            throw new InvalidOperationException("Only admins can remove members.");

        var membership = await _memberships.GetAsync(organizationId, userId)
                         ?? throw new InvalidOperationException("Member not found.");

        await _memberships.RemoveAsync(membership);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task ChangeMemberRoleAsync(Guid organizationId, Guid userId, MemberRole newRole, Guid changedByUserId)
    {
        if (userId == changedByUserId)
            throw new InvalidOperationException("Cannot change your own role.");

        var actor = await _memberships.GetAsync(organizationId, changedByUserId)
                    ?? throw new InvalidOperationException("Not a member.");

        if (actor.Role != MemberRole.Admin)
            throw new InvalidOperationException("Only admins can change roles.");

        var membership = await _memberships.GetAsync(organizationId, userId)
                         ?? throw new InvalidOperationException("Member not found.");

        membership.Role = newRole;
        await _memberships.UpdateAsync(membership);
        await _unitOfWork.SaveChangesAsync();
    }

    private static string HashToken(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }
}
