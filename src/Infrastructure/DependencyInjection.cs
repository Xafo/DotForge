using DotForge.Application.Interfaces;
using DotForge.Infrastructure.Data;
using DotForge.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Resend;

namespace DotForge.Infrastructure;

public static class DependencyInjection
{
    static string ParsePostgresUrl(string url)
    {
        var uri = new Uri(url);
        var userInfoParts = uri.UserInfo.Split([':'], 2);
        var username = Uri.UnescapeDataString(userInfoParts[0]);
        var password = userInfoParts.Length > 1 ? Uri.UnescapeDataString(userInfoParts[1]) : "";
        var database = uri.AbsolutePath.TrimStart('/').Split('?')[0];

        var sslMode = "";
        var query = uri.Query;
        if (!string.IsNullOrEmpty(query))
        {
            var queryParams = query.TrimStart('?').Split('&')
                .Select(p => p.Split('=', 2))
                .ToDictionary(p => p[0], p => p.Length > 1 ? Uri.UnescapeDataString(p[1]) : "");
            if (queryParams.TryGetValue("sslmode", out var ssl))
            {
                sslMode = ssl switch
                {
                    "require" => "Require",
                    "prefer" => "Prefer",
                    "disable" => "Disable",
                    "verify-ca" => "VerifyCA",
                    "verify-full" => "VerifyFull",
                    _ => ssl
                };
            }
        }

        var port = uri.Port > 0 ? uri.Port.ToString() : "5432";
        var sslPart = string.IsNullOrEmpty(sslMode) ? "" : $";SSL Mode={sslMode}";
        return $"Host={uri.Host};Port={port};Database={database};Username={username};Password={password};Include Error Detail=true{sslPart}";
    }

    static string ResolveConnectionString(IConfiguration config)
    {
        var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL")?.Trim();
        if (!string.IsNullOrEmpty(databaseUrl))
        {
            Console.WriteLine("[DotForge] PostgreSQL: DATABASE_URL");
            return ParsePostgresUrl(databaseUrl);
        }

        var pgHost = Environment.GetEnvironmentVariable("PGHOST");
        if (pgHost is not null)
        {
            var pgPort = Environment.GetEnvironmentVariable("PGPORT") ?? "5432";
            var pgUser = Environment.GetEnvironmentVariable("PGUSER") ?? "postgres";
            var pgPass = Environment.GetEnvironmentVariable("PGPASSWORD") ?? "";
            var pgDb = Environment.GetEnvironmentVariable("PGDATABASE") ?? "railway";
            Console.WriteLine("[DotForge] PostgreSQL: PG* env vars");
            return $"Host={pgHost};Port={pgPort};Database={pgDb};Username={pgUser};Password={pgPass};Include Error Detail=true";
        }

        Console.WriteLine("[DotForge] PostgreSQL: appsettings.json");
        return config.GetConnectionString("DefaultConnection")!;
    }

    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(ResolveConnectionString(config)));

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<ITenantProvider, TenantProvider>();

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IOrganizationRepository, OrganizationRepository>();
        services.AddScoped<IOrganizationMembershipRepository, OrganizationMembershipRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        services.AddScoped<IInvitationRepository, InvitationRepository>();
        services.AddScoped<ISubscriptionRepository, SubscriptionRepository>();
        services.AddScoped<IApiKeyRepository, ApiKeyRepository>();
        services.AddScoped<IAuditLogRepository, AuditLogRepository>();

        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddHttpClient<IOAuthService, OAuthService>();
        services.Configure<OAuthOptions>(config.GetSection(OAuthOptions.SectionName));
        services.AddScoped<IOrganizationService, OrganizationService>();
        services.AddScoped<IMemberService, MemberService>();
        services.AddScoped<IBillingService, BillingService>();
        services.AddScoped<IApiKeyService, ApiKeyService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IDashboardService, DashboardService>();

        services.AddHttpContextAccessor();

        services.AddResend(options =>
        {
            options.ApiToken = config["Resend:ApiKey"] ?? "";
        });

        return services;
    }
}
