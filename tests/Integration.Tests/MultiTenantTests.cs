using System.Net.Http.Headers;
using System.Net.Http.Json;
using DotForge.Application.DTOs;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Integration.Tests;

[Collection("Tests")]
public class MultiTenantTests
{
    private readonly TestFactory _factory;

    public MultiTenantTests(TestFactory factory) => _factory = factory;

    private async Task<(HttpClient client, AuthResponse auth)> CreateAuthenticatedUser(string email)
    {
        var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/auth/register", new
        {
            email = $"{email}{Guid.NewGuid():N}@example.com",
            password = "Password123!",
            name = "Test User"
        });
        var auth = await response.Content.ReadFromJsonAsync<AuthResponse>()!;
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", auth!.AccessToken);
        return (client, auth);
    }

    [Fact]
    public async Task User_Sees_Only_Own_Members()
    {
        var (client1, auth1) = await CreateAuthenticatedUser("user1");
        var (client2, auth2) = await CreateAuthenticatedUser("user2");

        var members1 = await client1.GetFromJsonAsync<List<MemberDto>>(
            $"/api/organizations/{auth1.CurrentOrganizationId}/members");
        var members2 = await client2.GetFromJsonAsync<List<MemberDto>>(
            $"/api/organizations/{auth2.CurrentOrganizationId}/members");

        Assert.NotNull(members1);
        Assert.NotNull(members2);
        Assert.Single(members1);
        Assert.Single(members2);
        Assert.NotEqual(members1[0].Email, members2[0].Email);
    }

    [Fact]
    public async Task User_Cannot_Access_Other_Org_Members()
    {
        var (client1, auth1) = await CreateAuthenticatedUser("org_a");
        var (_, auth2) = await CreateAuthenticatedUser("org_b");

        var response = await client1.GetAsync(
            $"/api/organizations/{auth2.CurrentOrganizationId}/members");

        Assert.Equal(401, (int)response.StatusCode);
    }

    [Fact]
    public async Task Create_Second_Organization()
    {
        var (client, auth) = await CreateAuthenticatedUser("multi_org");

        var response = await client.PostAsJsonAsync("/api/organizations", new
        {
            name = "Second Org",
            slug = $"second-{Guid.NewGuid():N}"[..16]
        });

        Assert.True(response.IsSuccessStatusCode);
        var org = await response.Content.ReadFromJsonAsync<OrganizationDto>();
        Assert.NotNull(org);
        Assert.Equal("Second Org", org.Name);

        var orgs = await client.GetFromJsonAsync<List<OrganizationDto>>("/api/organizations");
        Assert.NotNull(orgs);
        Assert.Equal(2, orgs.Count);
    }

    [Fact]
    public async Task Switch_Organization_Updates_Context()
    {
        var (client, auth) = await CreateAuthenticatedUser("switcher");

        var createResponse = await client.PostAsJsonAsync("/api/organizations", new
        {
            name = "Org Two",
            slug = $"org2-{Guid.NewGuid():N}"[..12]
        });
        var org2 = await createResponse.Content.ReadFromJsonAsync<OrganizationDto>();

        var switchResponse = await client.PostAsJsonAsync("/api/organizations/switch", new
        {
            organizationId = org2!.Id
        });

        Assert.True(switchResponse.IsSuccessStatusCode);
        var switched = await switchResponse.Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(switched);
        Assert.Equal(org2.Id, switched.CurrentOrganizationId);
    }

    [Fact]
    public async Task Invitation_Creates_Membership()
    {
        var (adminClient, adminAuth) = await CreateAuthenticatedUser("admin_invite");

        var inviteResponse = await adminClient.PostAsJsonAsync(
            $"/api/organizations/{adminAuth.CurrentOrganizationId}/members/invite",
            new { email = $"invitee{Guid.NewGuid():N}@example.com" });

        Assert.True(inviteResponse.IsSuccessStatusCode);
        var invitation = await inviteResponse.Content.ReadFromJsonAsync<InvitationDto>();
        Assert.NotNull(invitation);
        Assert.True(invitation.IsValid);
    }
}
