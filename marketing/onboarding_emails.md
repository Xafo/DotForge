# Buyer Onboarding Emails

Gumroad sends a purchase receipt automatically. These are optional follow-up emails sent via Resend (or any email provider) after purchase to ensure a successful first experience.

---

## Email 1: Welcome + Setup Instructions (sent immediately after purchase)

**Subject**: Welcome to DotForge — your first 15 minutes

---

Hi {{buyer_name}},

Thanks for buying DotForge. You now own a production-ready .NET 10 + React 19 SaaS starter kit.

**Quick start**

```bash
git clone {{repo_url}}
cd dotforge
# Or download the zip from Gumroad
```

**1. Configure your database**

Copy `src/Web/appsettings.json` and set:
- `ConnectionStrings:DefaultConnection` — your PostgreSQL connection string
- `Jwt:Secret` — a 32+ byte random string (run `openssl rand -base64 32`)
- `Stripe:SecretKey` and `Stripe:WebhookSecret` — from Stripe dashboard
- `Resend:ApiKey` — from Resend dashboard

**2. Run the backend**

```bash
dotnet run --project src/Web
```

Migrations apply automatically. Visit http://localhost:5120.

**3. Run the frontend**

```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173. Register an account. You're in.

**Need Docker?**

```bash
docker compose up
```

PostgreSQL + the full app at http://localhost:8080.

**Full documentation**: {{docs_url}}
**Demo**: {{demo_url}}

Reply to this email if you get stuck. I usually answer within 24 hours.

Happy shipping,

{{your_name}}

---

## Email 2: Learning the Codebase (day 2)

**Subject**: Navigating the DotForge codebase

---

Hi {{buyer_name}},

A quick roadmap to help you find your way around:

**src/Domain/** — 8 entities (User, Organization, OrganizationMembership, RefreshToken, Invitation, Subscription, ApiKey, AuditLog). Start here if you're adding new domain objects.

**src/Application/** — DTOs, service interfaces, repository interfaces. This is the contract layer — your business logic lives behind these interfaces.

**src/Infrastructure/Services/** — The implementation. AuthService (register, login, refresh, JWT rotation), BillingService (Stripe), OrganizationService (CRUD + switching), OAuthService (Google + GitHub code exchange), ApiKeyService, UserService.

**src/Infrastructure/Data/** — EF Core DbContext with full entity configs, Global Query Filters for multi-tenancy, and repository implementations.

**src/Web/Controllers/** — 8 API controllers. Straightforward REST endpoints. No MediatR, no magic.

**frontend/src/** — React 19 with TypeScript strict. AuthContext handles JWT storage and automatic refresh. Pages are in pages/, UI components in components/ui/.

**tests/Integration.Tests/** — 60+ tests using Testcontainers with real PostgreSQL. Run `dotnet test` to verify everything works.

The architecture: Domain → Application → Infrastructure → Web. Dependencies flow inward.

**Pro tip**: Run the integration tests first to see how each feature works end-to-end. They're the best documentation.

Questions? Just reply.

{{your_name}}

---

## Email 3: Deployment Guide (day 5)

**Subject**: Deploying DotForge to production

---

Hi {{buyer_name}},

Time to ship. Here's how to deploy DotForge to production:

**Option 1: Railway (simplest)**

1. Push your code to a GitHub repo
2. Create a Railway project from the repo
3. Add PostgreSQL via Railway plugins
4. Set environment variables (from appsettings.json)
5. Set start command: `cd src/Web && dotnet run`
6. Done. Railway handles HTTPS, domains, and scaling.

**Option 2: Docker anywhere**

```bash
docker build -t dotforge .
docker run -p 8080:8080 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -e ConnectionStrings__DefaultConnection="..." \
  -e Jwt__Secret="..." \
  -e Stripe__SecretKey="..." \
  dotforge
```

**Option 3: Azure Container Apps**

Same Docker image. Push to ACR, create Container App with ingress.

**Env vars reference** (all required):

| Variable | Where to get it |
|----------|-----------------|
| ConnectionStrings__DefaultConnection | Your PostgreSQL provider |
| Jwt__Secret | `openssl rand -base64 32` |
| Stripe__SecretKey | Stripe dashboard |
| Stripe__WebhookSecret | Stripe webhook settings |
| Resend__ApiKey | Resend dashboard |
| OAuth__Google__ClientId | Google Cloud Console |
| OAuth__Google__ClientSecret | Google Cloud Console |
| OAuth__GitHub__ClientId | GitHub OAuth Apps |
| OAuth__GitHub__ClientSecret | GitHub OAuth Apps |

**Don't forget**: Set the webhook URL in Stripe dashboard to `https://your-domain.com/api/webhooks/stripe`.

Reply if you hit any issues.

{{your_name}}

---

## Email 4: Tips + What's Next (day 14)

**Subject**: Making DotForge yours + what's coming next

---

Hi {{buyer_name}},

Two weeks in. Here are some tips to make DotForge truly yours:

**Customize the brand**
- Replace the logo in `frontend/src/` and rename the app in `appsettings.json`
- Update Tailwind's color palette in `frontend/src/index.css`
- Swap the favicon in `frontend/public/`

**Add your domain**
- Change the CORS origins in `Program.cs`
- Update `frontend/src/config/api.ts` with your production API URL
- Set `ASPNETCORE_URLS` env var in production

**What's coming next**
- Email templates for team invitations and password resets
- Admin dashboard for managing users and orgs
- Audit log viewer
- Webhook retry mechanism

You'll get all future updates for free (1 year from purchase).

**I'd love your help**
- Leave a review on Gumroad — it helps other developers find DotForge
- Star the GitHub repo if you found it useful
- Reply with one thing you'd improve — I read every response

Happy shipping,

{{your_name}}
