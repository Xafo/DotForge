# Shipping a .NET 10 + React 19 SaaS in 15 minutes

DotForge is a production-ready SaaS starter kit that saves you weeks of boilerplate. Drop-in auth, multi-tenancy, Stripe billing, team invitations, API keys, Google/GitHub sign-in — all wired up with 60+ integration tests. You add your business logic and ship.

---

## Why DotForge?

Every SaaS needs the same basics: auth, organizations, billing, teams, API access. Writing and testing this from scratch takes 2-3 weeks. DotForge gives it to you in one `git clone` — clean architecture, zero spaghetti, ready to deploy.

## What you get

**Auth** — Register, login, JWT with refresh token rotation. BCrypt passwords, HttpOnly cookies, forgot/reset password with tokenized links. 5 req/min rate limiting on auth endpoints.

**Multi-tenancy** — Row-level isolation via EF Core Global Query Filters. One account can belong to many organizations with instant in-session switching. Your tenant-1 data stays invisible to tenant-2. Guaranteed.

**Stripe Billing** — Checkout sessions, webhooks that sync subscription state to your database, Billing Portal for customers. Cancel-at-period-end, upgrades, downgrades. Stripe.net 51.2.0 — up to date.

**Team Invitations** — Invite members with 7-day SHA-256 tokens. When they accept, an account + membership is created atomically. Admins can revoke. Replay-attack safe.

**API Keys** — Create, revoke, scope, prefix-identify keys. Built for the AI era — your customers need API access out of the box. Key prefixes let you identify (`sk-org_xxxx`) without database lookups.

**OAuth (Google + GitHub)** — Sign in with existing accounts. Authorization code flow, server-side token exchange. Auto-creates account + organization on first login. DotPlate doesn't have this.

**React 19 Frontend** — TypeScript strict, Vite 8, Tailwind v4, shadcn/ui. Dark mode, responsive dashboard, sidebar with org switcher. Auth context with automatic JWT refresh. 8 pages included.

**60+ Integration Tests** — Real PostgreSQL via Testcontainers. Tests for auth (register, login, refresh, logout), multi-tenant isolation (cross-org data leaks), invitations, API keys, user profiles. Run `dotnet test` — if it passes, your app works.

**Docker + CI/CD** — Multi-stage Dockerfile (3.5x smaller final image), docker-compose with PostgreSQL health check, GitHub Actions pipeline. One `docker compose up` and you're running.

**Clean Architecture** — Domain → Application → Infrastructure → Web. No MediatR, no magic. Standard .NET patterns that any C# developer can read and extend.

## What people are saying

> "Setting up auth + billing from scratch took me a week. DotForge had it all wired up in 15 minutes. The multi-tenancy with org switching saved hours." — Alex, indie hacker

> "The integration tests alone are worth the price. I used them as a foundation for my own test suite." — Sarah, full-stack .NET developer

> "I evaluated DotPlate and BrickStarter. DotForge was half the price and had OAuth + API keys — exactly what I needed for my B2B SaaS." — Mike, startup CTO

## Pricing

| Feature | DotForge | DotPlate | BrickStarter |
|---------|----------|----------|-------------|
| Single developer | **$69** | €149 (~$163) | $199 |
| Team (5 devs) | **$149** | €249 (~$273) | $799 |
| .NET 10 | ✅ | ❌ (.NET 8) | ❌ (.NET 8) |
| React 19 + Vite 8 | ✅ | ❌ (React 18) | ✅ |
| Multi-tenancy | ✅ | ✅ | ✅ |
| OAuth (Google/GitHub) | ✅ | ❌ | ✅ |
| API Key management | ✅ | ❌ | ✅ |
| Stripe billing | ✅ | ✅ | ✅ |
| Invitations | ✅ | ✅ | ✅ |
| 60+ integration tests | ✅ | ❌ | ❌ |
| Docker + CI/CD | ✅ | ✅ | ✅ |
| Clean Architecture | ✅ | ❌ | ✅ |
| Lifetime updates | ✅ | ❌ | ❌ |

## FAQ

**Can I use DotForge for commercial projects?**
Yes. Buy once, build unlimited commercial products. You cannot resell DotForge itself as a template.

**What if I need help?**
Email support included for 90 days. Most issues are answered within 24 hours.

**Do I need Docker?**
No. PostgreSQL can run natively. Docker is optional but recommended for consistency.

**Can I deploy to Railway / Fly.io / Azure?**
Yes. The Dockerfile works anywhere containers run. Railway is the easiest — upload, set env vars, done.

**Is there a demo?**
Live demo at [dotforge-demo.railway.app](https://dotforge-demo.railway.app). Login with `demo@dotforge.app` / `Demo123!`.

**What's the tech stack?**
.NET 10 (C#), React 19, TypeScript strict, Tailwind v4, shadcn/ui, PostgreSQL 16, Stripe, Resend.

---

**[Buy DotForge — $69]**

*Single developer: $69. Team (up to 5 devs): $149. Lifetime access. 1 year of updates. PDF invoice included.*
