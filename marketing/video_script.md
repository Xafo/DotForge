# DotForge Demo — 5-Minute Walkthrough Script

**Total time**: ~5 minutes
**Audio**: Voiceover over screen recording
**Music**: No background music (keeps it professional)
**Resolution**: 1920x1080
**Format**: Screen recording (CleanShot X / OBS) + voiceover

---

## Opening (0:00-0:30)

**Visual**: DotForge landing page → scroll through features

**Script**:
> "Every SaaS needs the same stuff: auth, organizations, billing, team invitations, API keys. And yet, every time you start a new project, you spend two weeks wiring it up instead of building what makes your product unique.
>
> DotForge is a production-ready .NET 10 and React 19 starter kit that gives you all of that in one clone. Auth with JWT rotation, multi-tenancy with org switching, Stripe billing, team invitations, Google and GitHub sign-in, and 60-plus integration tests. Nothing is copy-pasted from a blog post — it's all wired up, tested, and ready to deploy."

---

## 1. Register + Login (0:30-1:15)

**Visual**: Browser → navigate to live demo → click "Get started" → fill register form → submit → redirect to dashboard

**Script**:
> "Let's start from scratch. Click 'Get started', fill in a name, email, password. Hit enter, and you're in.
>
> Notice what happened: a new account was created, a personal organization was automatically provisioned, and a JWT token was issued — all in one round trip. The frontend stores the token and sets up automatic refresh.
>
> When you come back tomorrow, the refresh token rotation kicks in. Each refresh invalidates the previous token. If someone steals your token and tries to replay it, the system detects the reuse and invalidates the entire session."

---

## 2. Multi-tenancy + Org Switching (1:15-2:00)

**Visual**: Dashboard → sidebar org selector → "Switch to Acme Corp" → dashboard shows Acme data → switch back

**Script**:
> "Now let's look at multi-tenancy. Most SaaS apps need to isolate data between organizations. DotForge uses EF Core Global Query Filters under the hood — every query automatically filters by the current organization ID.
>
> In the sidebar, you can switch organizations instantly without logging out. The dashboard, members, billing — all scoped to the active organization. No cross-org data leaks. The integration tests verify this explicitly — they create data in two orgs and assert that querying from one never returns the other's data."

---

## 3. Team Invitations (2:00-2:35)

**Visual**: Navigate to Members → invite → enter email → submit → log out → open invitation link → create account → see new org

**Script**:
> "Inviting team members is a two-click flow. Go to Members, enter an email, and hit invite.
>
> Behind the scenes, DotForge generates a SHA-256-hashed token valid for 7 days. When the recipient opens the link, if they don't have an account yet, one is created atomically along with their membership. The invitation is marked accepted and can't be reused. Admins can revoke pending invitations at any time."

---

## 4. API Keys (2:35-3:10)

**Visual**: Navigate to API Keys → create a new key → copy → show usage → revoke

**Script**:
> "API Keys are a first-class feature — essential if you're building a product that other developers integrate with.
>
> Create a key, choose a name, and DotForge generates a prefixed key — something like 'df-org_a1b2c3d4'. The prefix lets you identify the organization without a database lookup, ideal for middleware and rate limiting.
>
> Keys are hashed with SHA-256 before storage, so even if your database is compromised, keys are unusable. Revoke them instantly from this page."

---

## 5. Stripe Billing (3:10-3:50)

**Visual**: Navigate to Billing → "Manage subscription" → Stripe Checkout redirect → subscribe → redirect back → billing page shows active

**Script**:
> "Billing is integrated with Stripe's latest Checkout and Customer Portal APIs.
>
> Click 'Manage subscription' and you're redirected to a Stripe-hosted Checkout page — no PCI scope on your end. After payment, Stripe sends a webhook that syncs the subscription status back to DotForge's database.
>
> The webhook handler verifies the Stripe signature, updates the subscription record, and handles all edge cases — cancel-at-period-end, upgrades, downgrades. And since it's server-side only, your frontend never touches a Stripe secret."

---

## 6. OAuth — Google + GitHub (3:50-4:20)

**Visual**: Logout → Login page → "Continue with Google" → Google consent → redirect back → logged in (new account + org created)

**Script**:
> "DotForge ships with Google and GitHub OAuth out of the box. This is something DotPlate doesn't have — you'd need to integrate it yourself.
>
> Click 'Continue with Google', authorize, and you're redirected back. If it's your first time, an account and personal organization are created automatically. If you already have an account, you're logged in immediately.
>
> The flow uses server-side authorization code exchange — your client ID never leaks to the browser."

---

## 7. Code Overview + Tests (4:20-4:50)

**Visual**: Open VS Code → solution explorer → `dotnet test` in terminal → all green

**Script**:
> "This is the part I'm most proud of: the codebase follows Clean Architecture — Domain, Application, Infrastructure, Web. No MediatR, no magic. Just plain interfaces and services that any .NET developer can read.
>
> And more than 60 integration tests run against a real PostgreSQL database inside Docker via Testcontainers. Run `dotnet test` and if it's green, your app works. These aren't unit tests that mock the database — they test real auth flows, real tenant isolation, real token rotation."

---

## Closing (4:50-5:00)

**Visual**: Gumroad purchase page

**Script**:
> "DotForge is $69 for a single developer, $149 for a team of five. Lifetime access, one year of updates, and you can build unlimited commercial products.
>
> Link in the description. Happy shipping."

---

## Production Notes

- **Cursor**: Use a large cursor with a visible click ring
- **Typing**: Type slow enough to read (or use typing simulator)
- **Zoom**: Zoom in 1.5x on code / terminal sections
- **Demo URL**: Deploy to Railway before recording
- **Credentials**: Reset demo database before recording
- **Retakes**: Record each section separately, stitch in Final Cut / DaVinci Resolve
- **Thumbnail**: DotForge logo + "15 minutes to SaaS" text overlay
- **End screen**: Subscribe button + Gumroad link + GitHub link
