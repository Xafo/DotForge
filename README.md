# DotForge

Production-ready .NET 10 + React 19 SaaS starter kit. Auth, multi-tenancy, Stripe billing, team invitations, API keys, OAuth, and 60+ integration tests — all wired up.

## Quick Start

### Prerequisites
- .NET 10 SDK
- Node.js 20+
- PostgreSQL 16 (or Docker)

### 1. Clone and configure

```bash
git clone <repo> dotforge
cd dotforge
```

Copy `src/Web/appsettings.json` and set:
- `Jwt:Secret` — a 32+ byte key
- `ConnectionStrings:DefaultConnection` — your PostgreSQL connection string
- `Stripe:SecretKey` — your Stripe secret key
- `Stripe:WebhookSecret` — your Stripe webhook signing secret
- `Resend:ApiKey` — your Resend API key for emails
- `OAuth:Google` / `OAuth:GitHub` — OAuth client credentials (optional)

### 2. Run the backend

```bash
dotnet run --project src/Web
```

Applies migrations on startup. API available at `http://localhost:5120`.

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend at `http://localhost:5173` — proxies API calls to the backend.

### 4. Docker

```bash
docker compose up
```

Runs PostgreSQL + the full app at `http://localhost:8080`.

## Architecture

```
src/
├── Domain/          Entities, enums, domain interfaces
├── Application/     DTOs, service interfaces, repository interfaces
├── Infrastructure/  EF Core DbContext, repositories, services
└── Web/             API controllers, middleware, Program.cs
```

Clean Architecture, 4 layers. Backend references flow inward (Web → Infrastructure → Application → Domain).

## Features

- **Auth** — Register, login, logout, JWT refresh rotation with replay detection
- **Multi-tenancy** — Row-level isolation via EF Core Global Query Filters
- **Multi-org** — One account, many organizations, in-session switching
- **Stripe billing** — Checkout sessions, webhooks, Billing Portal
- **Team invitations** — 7-day SHA-256 tokens, atomic membership creation
- **Roles** — Admin / Member with permission checks
- **API keys** — Create, revoke, scoped with prefix identification
- **OAuth** — Sign in with Google or GitHub
- **Password reset** — Forgot/reset with tokenized links
- **Profile management** — Update name, avatar, change password
- **Rate limiting** — 5/min on auth, 200/min global
- **Security** — BCrypt, CSRF, HttpOnly cookies, security headers
- **CI/CD** — GitHub Actions pipeline with PostgreSQL service
- **Docker** — Multi-stage build, docker-compose with health checks

## Testing

```bash
dotnet test
```

60+ integration tests with Testcontainers (real PostgreSQL in Docker).

## CI/CD Setup

The CI workflow is included as `ci-workflow.yml` in the project root. To activate it:

```bash
# 1. Authorize the GitHub CLI for workflow access (opens browser)
gh auth refresh --hostname github.com --scopes workflow

# 2. Move the workflow file into place
mkdir -p .github/workflows
cp ci-workflow.yml .github/workflows/ci.yml

# 3. Commit and push
git add .github/workflows/ci.yml
git commit -m "Add CI workflow"
git push
```

Or run `bash scripts/setup-ci.sh` to do all of the above automatically.

## License

Single-developer license. Use DotForge to build unlimited commercial products. You may not resell DotForge itself as a template.
