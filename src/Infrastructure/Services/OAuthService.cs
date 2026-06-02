using System.Net.Http.Json;
using DotForge.Application.Interfaces;

namespace DotForge.Infrastructure.Services;

public class OAuthOptions
{
    public const string SectionName = "OAuth";
    public OAuthProviderOptions Google { get; set; } = new();
    public OAuthProviderOptions GitHub { get; set; } = new();
}

public class OAuthProviderOptions
{
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string RedirectUri { get; set; } = string.Empty;
}

public class OAuthService : IOAuthService
{
    private readonly HttpClient _http;
    private readonly OAuthOptions _options;

    public OAuthService(HttpClient http, Microsoft.Extensions.Options.IOptions<OAuthOptions> options)
    {
        _http = http;
        _options = options.Value;
    }

    public string GetAuthorizationUrl(string provider)
    {
        var opts = GetOptions(provider);
        return provider.ToLowerInvariant() switch
        {
            "google" => $"https://accounts.google.com/o/oauth2/v2/auth?client_id={opts.ClientId}&redirect_uri={opts.RedirectUri}&response_type=code&scope=openid%20email%20profile&access_type=offline",
            "github" => $"https://github.com/login/oauth/authorize?client_id={opts.ClientId}&redirect_uri={opts.RedirectUri}&scope=user:email",
            _ => throw new InvalidOperationException($"Unknown OAuth provider: {provider}")
        };
    }

    public async Task<OAuthUserInfo> ExchangeCodeAsync(string provider, string code)
    {
        return provider.ToLowerInvariant() switch
        {
            "google" => await ExchangeGoogleAsync(code),
            "github" => await ExchangeGitHubAsync(code),
            _ => throw new InvalidOperationException($"Unknown OAuth provider: {provider}")
        };
    }

    private async Task<OAuthUserInfo> ExchangeGoogleAsync(string code)
    {
        var opts = _options.Google;

        var tokenResponse = await _http.PostAsync("https://oauth2.googleapis.com/token", new FormUrlEncodedContent([
            new KeyValuePair<string, string>("code", code),
            new KeyValuePair<string, string>("client_id", opts.ClientId),
            new KeyValuePair<string, string>("client_secret", opts.ClientSecret),
            new KeyValuePair<string, string>("redirect_uri", opts.RedirectUri),
            new KeyValuePair<string, string>("grant_type", "authorization_code"),
        ]));

        tokenResponse.EnsureSuccessStatusCode();
        var tokenData = await tokenResponse.Content.ReadFromJsonAsync<GoogleTokenResponse>()
                        ?? throw new InvalidOperationException("Failed to parse Google token response");

        var userResponse = await _http.GetAsync($"https://www.googleapis.com/oauth2/v2/userinfo?access_token={tokenData.AccessToken}");
        userResponse.EnsureSuccessStatusCode();
        var userData = await userResponse.Content.ReadFromJsonAsync<GoogleUserResponse>()
                       ?? throw new InvalidOperationException("Failed to parse Google user response");

        return new OAuthUserInfo
        {
            Email = userData.Email,
            Name = userData.Name,
            Provider = "google",
            Subject = userData.Id,
            AvatarUrl = userData.Picture
        };
    }

    private async Task<OAuthUserInfo> ExchangeGitHubAsync(string code)
    {
        var opts = _options.GitHub;

        var tokenResponse = await _http.PostAsync("https://github.com/login/oauth/access_token", new FormUrlEncodedContent([
            new KeyValuePair<string, string>("client_id", opts.ClientId),
            new KeyValuePair<string, string>("client_secret", opts.ClientSecret),
            new KeyValuePair<string, string>("code", code),
            new KeyValuePair<string, string>("redirect_uri", opts.RedirectUri),
        ]));

        tokenResponse.EnsureSuccessStatusCode();
        var body = await tokenResponse.Content.ReadAsStringAsync();
        var parsed = System.Web.HttpUtility.ParseQueryString(body);
        var accessToken = parsed["access_token"]
                          ?? throw new InvalidOperationException("Failed to get GitHub access token");

        _http.DefaultRequestHeaders.UserAgent.ParseAdd("DotForge");
        _http.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

        var userResponse = await _http.GetAsync("https://api.github.com/user");
        userResponse.EnsureSuccessStatusCode();
        var userData = await userResponse.Content.ReadFromJsonAsync<GitHubUserResponse>()
                       ?? throw new InvalidOperationException("Failed to parse GitHub user response");

        var emailResponse = await _http.GetAsync("https://api.github.com/user/emails");
        emailResponse.EnsureSuccessStatusCode();
        var emails = await emailResponse.Content.ReadFromJsonAsync<GitHubEmail[]>()
                     ?? [];
        var primaryEmail = emails.FirstOrDefault(e => e.Primary)?.Email ?? userData.Email ?? "";

        _http.DefaultRequestHeaders.UserAgent.Clear();
        _http.DefaultRequestHeaders.Authorization = null;

        return new OAuthUserInfo
        {
            Email = primaryEmail,
            Name = userData.Name ?? userData.Login,
            Provider = "github",
            Subject = userData.Id.ToString(),
            AvatarUrl = userData.AvatarUrl
        };
    }

    private OAuthProviderOptions GetOptions(string provider) => provider.ToLowerInvariant() switch
    {
        "google" => _options.Google,
        "github" => _options.GitHub,
        _ => throw new InvalidOperationException($"Unknown OAuth provider: {provider}")
    };

    private record GoogleTokenResponse(string AccessToken, string IdToken, int ExpiresIn);
    private record GoogleUserResponse(string Id, string Email, string Name, string? Picture);
    private record GitHubUserResponse(long Id, string Login, string? Name, string? Email, string? AvatarUrl);
    private record GitHubEmail(string Email, bool Primary, bool Verified);
}
