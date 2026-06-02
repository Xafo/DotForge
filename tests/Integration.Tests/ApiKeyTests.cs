using System.Net.Http.Headers;
using System.Net.Http.Json;
using DotForge.Application.DTOs;

namespace Integration.Tests;

[Collection("Tests")]
public class ApiKeyTests
{
    private readonly TestFactory _factory;

    public ApiKeyTests(TestFactory factory) => _factory = factory;

    [Fact]
    public async Task Create_List_And_Revoke_ApiKey()
    {
        var client = _factory.CreateClient();

        var regResponse = await client.PostAsJsonAsync("/api/auth/register", new
        {
            email = $"apikey{Guid.NewGuid():N}@example.com",
            password = "Password123!",
            name = "API Key User"
        });
        var auth = await regResponse.Content.ReadFromJsonAsync<AuthResponse>()!;
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", auth!.AccessToken);

        var createResponse = await client.PostAsJsonAsync(
            $"/api/organizations/{auth.CurrentOrganizationId}/api-keys",
            new { name = "Test Key", scopes = new[] { "read", "write" } });

        Assert.True(createResponse.IsSuccessStatusCode);
        var created = await createResponse.Content.ReadFromJsonAsync<ApiKeyCreatedDto>();
        Assert.NotNull(created);
        Assert.StartsWith("df_", created.PlainKey);

        var listResponse = await client.GetFromJsonAsync<List<ApiKeyDto>>(
            $"/api/organizations/{auth.CurrentOrganizationId}/api-keys");
        Assert.NotNull(listResponse);
        Assert.Single(listResponse);
        Assert.Equal("Test Key", listResponse[0].Name);

        var revokeResponse = await client.DeleteAsync(
            $"/api/organizations/{auth.CurrentOrganizationId}/api-keys/{created.Id}");
        Assert.True(revokeResponse.IsSuccessStatusCode);

        var listAfter = await client.GetFromJsonAsync<List<ApiKeyDto>>(
            $"/api/organizations/{auth.CurrentOrganizationId}/api-keys");
        Assert.NotNull(listAfter);
        Assert.False(listAfter[0].IsActive);
    }
}
