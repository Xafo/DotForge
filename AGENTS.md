# DotForge — AI Agent Context

This file provides everything an AI coding assistant needs to work effectively with the DotForge SaaS Starter Kit.

## Project Overview

DotForge is a production-ready .NET 10 + React 19 SaaS starter kit. It ships with auth, multi-tenancy, Stripe billing, team invitations, API keys, OAuth (Google + GitHub), 60+ integration tests, and a bilingual (English/Spanish) UI — all wired up and ready to deploy.

```
GitHub: github.com/Xafo/DotForge
Deployed: dotforge-production.up.railway.app
License: Commercial (Gumroad purchase required for production use)
```

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend Runtime | .NET | 10.0 |
| ORM | Entity Framework Core + Npgsql | 10.0.2 |
| Database | PostgreSQL | 16 |
| Auth | JWT (HMAC-SHA256) + BCrypt | — |
| Payments | Stripe | 51.2.0 |
| Email | Resend | 0.5.1 |
| Frontend | React | 19.2.6 |
| Build Tool | Vite | 8.0 |
| Styling | Tailwind CSS | 4.3 |
| UI Components | shadcn/ui-style (custom) | — |
| Tests | xUnit + Testcontainers | 2.9.3 / 4.12.0 |

## Project Structure

```
├── src/
│   ├── Domain/          # Entities, enums, interfaces (no dependencies)
│   ├── Application/     # DTOs, service/repo interfaces
│   ├── Infrastructure/  # EF Core, services, repos, integrations
│   └── Web/             # ASP.NET controllers, Program.cs
├── tests/
│   ├── Domain.Tests/
│   ├── Application.Tests/
│   └── Integration.Tests/   # Testcontainers + WebApplicationFactory
├── frontend/
│   └── src/
│       ├── config/api.ts       # API client with auto-refresh
│       ├── context/            # AuthContext, ThemeContext
│       ├── components/ui/      # Button, Card, Input, Dialog
│       └── pages/              # Landing, Login, Register, Dashboard, etc.
├── AGENTS.md             # This file — AI context
├── Dockerfile            # Multi-stage build
└── docker-compose.yml    # Local dev with PostgreSQL
```

## Architecture Constraints

### Clean Architecture (dependencies flow inward)

```
Web → Infrastructure → Application → Domain
```

- **Domain** must have zero dependencies (no NuGet packages other than .NET runtime)
- **Application** may only reference Domain
- **Infrastructure** implements Application interfaces (repos, services, DbContext)
- **Web** references Infrastructure (which transitively brings Application + Domain)

### Key Files

| File | Purpose |
|------|---------|
| `src/Infrastructure/DependencyInjection.cs` | All DI registration in `AddInfrastructure()` |
| `src/Web/Program.cs` | Middleware pipeline, CORS, JWT, migration on startup |
| `frontend/src/config/api.ts` | API client with 401 → refresh → retry logic |
| `frontend/src/context/AuthContext.tsx` | Auth state management + localStorage persistence |
| `src/Infrastructure/Data/AppDbContext.cs` | EF Core DbContext with all DbSets |
| `frontend/src/i18n/index.ts` | Bilingual translations (250+ keys, English + Spanish) |
| `frontend/src/context/I18nContext.tsx` | I18n context provider + `useI18n()` hook |
| `frontend/src/components/LanguageToggle.tsx` | EN/ES toggle button |

## C# Coding Conventions

### Always use file-scoped namespaces
```csharp
namespace DotForge.Domain.Entities;
// NOT: namespace DotForge.Domain.Entities { }
```

### Always use primary constructors for DI classes
```csharp
public class UserRepository(AppDbContext db) : IUserRepository
public class AuthService(IUserRepository users, ...) : IAuthService
```

### Always use `record` for DTOs
```csharp
public record RegisterRequest(string Email, string Password, string Name);
public record AuthResponse(Guid UserId, string Email, string Name, string? AvatarUrl, string AccessToken, Guid? CurrentOrganizationId, List<OrganizationDto> Organizations);
```

### Entity classes use plain `class` with `{ get; set; }` properties
```csharp
public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
}
```

### Error handling pattern
```csharp
// Service layer: throw InvalidOperationException with user-friendly messages
throw new InvalidOperationException("Email already registered.");

// Controller: catch and return appropriate HTTP response
catch (InvalidOperationException ex)
{
    return BadRequest(new { error = ex.Message });
}
```

### Controller conventions
```csharp
[Authorize]
[ApiController]
[Route("api/[resource]")]
public class SomeController : ControllerBase
{
    // Extract user identity via claims
    var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    var orgId = Guid.Parse(User.FindFirstValue("OrganizationId")!);
}
```

## TypeScript / React Conventions

### i18n / Internationalization
- All user-facing strings use `useI18n()` hook: `const { t } = useI18n()`
- Translations live in `frontend/src/i18n/index.ts` (flat key-value, 250+ keys per locale)
- Supported locales: `'en'` (English) and `'es'` (Spanish)
- Parameter interpolation: `t('key', { name: 'value' })` replaces `{name}` in the string
- Locale is persisted in `localStorage` under key `locale`
- LanguageToggle component renders EN/ES flag button, available on all pages
- I18nProvider wraps the entire app (inside ErrorBoundary)
- ErrorBoundary uses `I18nContext` via `contextType` for class component access

### Component patterns
- **Named function exports** (no `export default` except `App.tsx`)
- **No barrel/index.ts files** — import directly from file path
- **Loading, error, empty states** must be rendered explicitly
- **Always use `cn()`** from `lib/utils` for conditional Tailwind classes

### API client usage
```typescript
import { api } from '../config/api'

// GET request
const data = await api<DashboardDto>('/dashboard')

// POST request with body
const result = await api<AuthResponse>('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
})
```

### Styling
- Tailwind CSS v4 — no `tailwind.config.js`, configured via `@import "tailwindcss"` in `index.css`
- Custom brand colors via `@theme` directive: `bg-brand-500`, `text-brand-600`, etc.
- Dark mode via `.dark` class on `<html>`, toggled via `ThemeContext`
- CSS custom properties for theme tokens in `index.css`

## Security Patterns

### Authentication flow
1. User registers/logs in → receives `AuthResponse` with `accessToken`
2. Access token (JWT, 15min expiry) sent as `Authorization: Bearer <token>`
3. On 401 response, frontend auto-refreshes via `POST /api/auth/refresh`
4. Refresh token uses SHA-256 hashing with rotation + replay detection
5. On refresh failure, localStorage is cleared and user redirected to `/login`

### Connection string resolution (in order)
1. `DATABASE_URL` env var (parsed from `postgres://` URI format)
2. `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` individual vars
3. `ConnectionStrings:DefaultConnection` from config

### JWT configuration
- HMAC-SHA256 with 32+ byte secret from `Jwt:Secret`
- Claims: `sub` (userId), `email`, `OrganizationId`, `jti`
- Clock skew: `TimeSpan.Zero`
- Issuer + audience validated

## Testing

### Running tests
```bash
# All tests
dotnet test

# Integration tests only
dotnet test tests/Integration.Tests

# With specific connection string
ConnectionStrings__DefaultConnection="Host=localhost;..." dotnet test
```

### Test patterns
- xUnit + Testcontainers (real PostgreSQL 16)
- `[Collection("Tests")]` + `ICollectionFixture<TestFactory>` for shared container
- `TestFactory` handles: container lifecycle, migrations, `WebApplicationFactory`
- CI runs tests against GitHub Actions service container

## Database

### Migrations
```bash
dotnet ef migrations add MigrationName --project src/Infrastructure --startup-project src/Web
```
- Migrations auto-apply on startup via `db.Database.Migrate()` in `Program.cs`

### Key EF Core conventions
- Enum properties stored as strings (`.HasConversion<string>()`)
- Unique indexes on: `Email`, `Slug`, `TokenHash`, `KeyHash`
- All string properties have `MaxLength` constraints
- Navigation properties use `= null!` for required relationships

## Common Development Tasks

### Add a new API endpoint
1. Add DTO record in `src/Application/DTOs/AuthDtos.cs`
2. Add interface method in `src/Application/Interfaces/IServices.cs`
3. Implement in `src/Infrastructure/Services/`
4. Register service in `src/Infrastructure/DependencyInjection.cs`
5. Add controller in `src/Web/Controllers/`

### Add a new entity
1. Create class in `src/Domain/Entities/`
2. Add `DbSet` in `src/Infrastructure/Data/AppDbContext.cs`
3. Add repository interface in `src/Application/Interfaces/IRepositories.cs`
4. Implement repository in `src/Infrastructure/Data/Repositories.cs`
5. Create migration

### Add a new frontend page
1. Create page component in `frontend/src/pages/`
2. Add route in `frontend/src/App.tsx`
3. Add nav item in `frontend/src/components/DashboardLayout.tsx`

## Deployment

- Production: Railway (auto-deploys from GitHub `main` branch)
- Docker: Multi-stage build, exposed on port 8080
- The `ASPNETCORE_URLS=http://+:8080` env var is set in Dockerfile
- SPA fallback: `app.MapFallbackToFile("index.html")` handles client-side routing
