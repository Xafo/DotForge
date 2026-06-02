using System.Net.Http.Headers;
using System.Net.Http.Json;
using DotForge.Application.DTOs;

namespace Integration.Tests;

[Collection("Tests")]
public class UserProfileTests
{
    private readonly TestFactory _factory;

    public UserProfileTests(TestFactory factory) => _factory = factory;

    [Fact]
    public async Task Get_And_Update_Profile()
    {
        var client = _factory.CreateClient();

        var regResponse = await client.PostAsJsonAsync("/api/auth/register", new
        {
            email = $"profile{Guid.NewGuid():N}@example.com",
            password = "Password123!",
            name = "Profile User"
        });
        var auth = await regResponse.Content.ReadFromJsonAsync<AuthResponse>()!;
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", auth!.AccessToken);

        var profileResponse = await client.GetFromJsonAsync<UserProfileDto>("/api/user/profile");
        Assert.NotNull(profileResponse);
        Assert.Equal("Profile User", profileResponse.Name);

        var updateResponse = await client.PutAsJsonAsync("/api/user/profile", new
        {
            name = "Updated Name",
            avatarUrl = (string?)null
        });
        Assert.True(updateResponse.IsSuccessStatusCode);
        var updated = await updateResponse.Content.ReadFromJsonAsync<UserProfileDto>();
        Assert.NotNull(updated);
        Assert.Equal("Updated Name", updated.Name);
    }

    [Fact]
    public async Task Change_Password()
    {
        var client = _factory.CreateClient();
        var email = $"changepw{Guid.NewGuid():N}@example.com";

        var regResponse = await client.PostAsJsonAsync("/api/auth/register", new
        {
            email,
            password = "Password123!",
            name = "Change PW User"
        });
        var auth = await regResponse.Content.ReadFromJsonAsync<AuthResponse>()!;
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", auth!.AccessToken);

        var changeResponse = await client.PutAsJsonAsync("/api/user/password", new
        {
            currentPassword = "Password123!",
            newPassword = "NewPassword456!"
        });
        Assert.True(changeResponse.IsSuccessStatusCode);

        client.DefaultRequestHeaders.Authorization = null;
        var loginResponse = await client.PostAsJsonAsync("/api/auth/login", new
        {
            email,
            password = "NewPassword456!"
        });
        Assert.True(loginResponse.IsSuccessStatusCode);
    }
}
