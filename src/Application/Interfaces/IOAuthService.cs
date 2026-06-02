namespace DotForge.Application.Interfaces;

public class OAuthUserInfo
{
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Provider { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
}

public interface IOAuthService
{
    Task<OAuthUserInfo> ExchangeCodeAsync(string provider, string code);
    string GetAuthorizationUrl(string provider);
}
