using DotForge.Application.DTOs;
using DotForge.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DotForge.Infrastructure.Services;

public class DashboardService : IDashboardService
{
    private readonly IOrganizationRepository _orgs;
    private readonly IOrganizationMembershipRepository _memberships;
    private readonly IInvitationRepository _invitations;
    private readonly IApiKeyRepository _apiKeys;
    private readonly IBillingService _billing;

    public DashboardService(
        IOrganizationRepository orgs,
        IOrganizationMembershipRepository memberships,
        IInvitationRepository invitations,
        IApiKeyRepository apiKeys,
        IBillingService billing)
    {
        _orgs = orgs;
        _memberships = memberships;
        _invitations = invitations;
        _apiKeys = apiKeys;
        _billing = billing;
    }

    public async Task<DashboardDto> GetDashboardAsync(Guid organizationId, Guid userId)
    {
        var org = await _orgs.GetByIdAsync(organizationId)
            ?? throw new InvalidOperationException("Organization not found.");

        var membership = await _memberships.GetAsync(organizationId, userId)
            ?? throw new InvalidOperationException("You are not a member of this organization.");

        var members = await _memberships.GetOrganizationMembersAsync(organizationId);
        var invitations = await _invitations.GetByOrganizationAsync(organizationId);
        var apiKeyList = await _apiKeys.GetByOrganizationAsync(organizationId);
        var subscription = await _billing.GetSubscriptionAsync(organizationId);

        return new DashboardDto(
            OrganizationName: org.Name,
            OrganizationSlug: org.Slug,
            Role: membership.Role.ToString(),
            MemberCount: members.Count,
            PendingInvitations: invitations.Count(i => i.IsValid),
            ApiKeyCount: apiKeyList.Count,
            ActiveApiKeys: apiKeyList.Count(k => k.IsActive),
            Subscription: subscription
        );
    }
}
