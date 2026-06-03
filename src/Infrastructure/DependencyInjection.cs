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
    static string ResolveConnectionString(IConfiguration config)
    {
        var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
        if (databaseUrl is not null)
        {
            Console.WriteLine("[DotForge] PostgreSQL: DATABASE_URL");
            return databaseUrl;
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

        services.AddHttpContextAccessor();

        services.AddResend(options =>
        {
            options.ApiToken = config["Resend:ApiKey"] ?? "";
        });

        return services;
    }
}
