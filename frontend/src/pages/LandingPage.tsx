import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { ThemeToggle } from '../components/ThemeToggle'

const features = [
  {
    icon: '🔐',
    title: 'Auth + JWT',
    summary: 'Register, login, refresh token rotation, forgot/reset password.',
    details: [
      'BCrypt password hashing with configurable work factor',
      'HMAC-SHA256 signed JWT access tokens with configurable expiry',
      'Refresh token rotation — each refresh invalidates the previous token',
      'Refresh replay detection — used tokens are rejected even if stolen',
      'Forgot/reset password flow with time-limited SHA-256 tokens',
      'Claims-based identity: userId, email, organizationId embedded in every token',
      'All authentication flows covered by integration tests',
    ],
  },
  {
    icon: '🏢',
    title: 'Multi-tenancy',
    summary: 'Row-level isolation via EF Core Global Query Filters.',
    details: [
      'Every entity scoped to an organization — no cross-org data leaks',
      'EF CoreGlobal Query Filters auto-apply tenant filter to every query',
      'One account, many organizations — switch orgs without re-login',
      'Organization slug with unique constraint and random suffix',
      'Last-active-org tracking for seamless return',
      'Membership roles: Admin and Member with permission checks',
      'Tenant provider extracts orgId from JWT in every request',
    ],
  },
  {
    icon: '💳',
    title: 'Stripe Billing',
    summary: 'Checkout sessions, webhooks, Billing Portal, subscription management.',
    details: [
      'Stripe Checkout integration — create one-time or subscription sessions',
      'Webhook handling with signature verification (no replay attacks)',
      'Stripe Billing Portal — customers manage their own subscriptions',
      'Cancel-at-period-end, upgrades, downgrades handled automatically',
      'Subscription status tracked in local DB with Stripe sync',
      'Plan ID mapping for multiple price tiers',
      'Webhook idempotency via Stripe-Idempotent-Key header',
    ],
  },
  {
    icon: '👥',
    title: 'Team Invitations',
    summary: '7-day SHA-256 invitation tokens with atomic account creation.',
    details: [
      'Send invitations by email with automatic token generation',
      'SHA-256 hashed tokens stored in DB — plaintext never persisted',
      '7-day expiry with built-in IsValid computed property',
      'Atomic flow: existing users join org directly, new users get account + membership',
      'Invitations are revokable — cancel before acceptance',
      'Replay prevention — already-accepted tokens are rejected',
      'Pending invitations tracked per organization',
    ],
  },
  {
    icon: '🔑',
    title: 'API Keys',
    summary: 'Create, revoke, scope API keys with prefix-based identification.',
    details: [
      'Prefix-based identification — keys are identified by prefix for UX',
      'Full key hashed with SHA-256 before storage',
      'Scopes system — restrict keys to specific operations',
      'Expiration support — keys auto-expire after set date',
      'Revoke individual keys without affecting others',
      'IsActive computed property checks both revoked and expired states',
      'LastUsedAt tracking for monitoring key usage',
    ],
  },
  {
    icon: '🔗',
    title: 'OAuth (Google + GitHub)',
    summary: 'Sign in with Google or GitHub. First-login auto-creates account.',
    details: [
      'Authorization code flow with PKCE support built in',
      'Google OAuth 2.0 — configured with Client ID and Secret',
      'GitHub OAuth App — configured with Client ID and Secret',
      'Auto-creates user account and personal organization on first login',
      'Returns same AuthResponse shape as email/password login',
      'Provider-agnostic service — add new providers easily',
      'Token exchange handled server-side — no client secrets exposed',
    ],
  },
  {
    icon: '🧪',
    title: '60+ Integration Tests',
    summary: 'Testcontainers with real PostgreSQL for every feature.',
    details: [
      '14 test classes covering auth, multi-tenant, invitations, billing, API keys',
      'Testcontainers spins up real PostgreSQL 16 for each test run',
      'Tests verify tenant isolation — cross-org access is rejected',
      'Auth tests: register, login, refresh, logout, token rotation',
      'Invitation tests: invite, accept, expire, revoke, edge cases',
      'API key tests: create, list, revoke, scope validation',
      'CI pipeline runs all tests on every push to main',
    ],
  },
  {
    icon: '🐳',
    title: 'Docker + CI/CD',
    summary: 'Multi-stage Dockerfile, docker-compose, GitHub Actions pipeline.',
    details: [
      'Multi-stage Docker build — SDK layer, build layer, runtime layer',
      'Final image uses distroless-like slim runtime (only 180MB)',
      'docker-compose with PostgreSQL 16 for local development',
      'GitHub Actions CI — build, test, and Docker image on every push',
      'Integration tests run against service container PostgreSQL',
      'Frontend built and embedded in the same Docker image',
      'SPA fallback routing — all paths serve index.html in production',
    ],
  },
  {
    icon: '⚛️',
    title: 'React 19 + Tailwind v4',
    summary: 'TypeScript strict, shadcn/ui components, dark mode, responsive.',
    details: [
      'React 19 with TypeScript strict mode — full type safety',
      'Tailwind CSS v4 with custom brand color palette via @theme directive',
      'shadcn/ui components — Button, Card, Input, Dialog',
      'Dark mode with CSS custom properties and .dark class toggle',
      'Persisted theme preference (localStorage + system preference fallback)',
      'Responsive sidebar layout with org switcher and nav',
      'Vite 8 dev server with HMR and optimized production builds',
    ],
  },
]

function FeatureSection({ f, reversed }: { f: typeof features[number]; reversed: boolean }) {
  return (
    <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-16 items-center`}>
      <div className="flex-1 min-w-0">
        <div className="text-4xl mb-4">{f.icon}</div>
        <h3 className="text-2xl font-bold mb-2">{f.title}</h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6 text-lg">{f.summary}</p>
        <ul className="space-y-2.5">
          {f.details.map((d) => (
            <li key={d} className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300">
              <svg className="size-5 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {d}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 w-full max-w-md lg:max-w-none">
        <div className="rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/50 p-6 lg:p-8">
          <div className="text-xs font-mono text-neutral-400 mb-4">// package includes</div>
          <div className="space-y-3">
            {f.details.slice(0, 3).map((d) => (
              <div key={d} className="flex items-center gap-3 text-sm">
                <span className="size-2 rounded-full bg-brand-500/60 shrink-0" />
                <span className="text-neutral-600 dark:text-neutral-400">{d}</span>
              </div>
            ))}
            <div className="pt-2 text-xs text-brand-600 dark:text-brand-400 font-medium">
              +{f.details.length - 3} more capabilities
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200/60 dark:border-neutral-800/60 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
            DotForge
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login"><Button variant="ghost">Sign in</Button></Link>
            <Link to="/register"><Button>Get started</Button></Link>
          </div>
        </div>
      </header>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-700/10 dark:bg-brand-700/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4 py-24 text-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-brand-500/10 text-brand-600 dark:text-brand-400 mb-8 border border-brand-500/20">
              <span className="size-2 rounded-full bg-brand-500 animate-pulse" />
              .NET 10 + React 19 — Production Ready
            </div>
          </div>
          <h1 className="animate-fade-in-up animate-fade-in-up-delay-1 text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Ship your .NET SaaS
            <br />
            <span className="bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 bg-clip-text text-transparent">
              in minutes, not weeks
            </span>
          </h1>
          <p className="animate-fade-in-up animate-fade-in-up-delay-2 text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Production-ready starter kit with auth, multi-tenancy, Stripe billing,
            team invitations, API keys, OAuth, and 60+ integration tests.
            Everything you need to launch your next SaaS.
          </p>
          <div className="animate-fade-in-up animate-fade-in-up-delay-3 flex flex-wrap gap-4 justify-center">
            <Link to="/register"><Button size="lg" className="bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25">Start building free →</Button></Link>
            <a href="#features"><Button variant="outline" size="lg">See features</Button></a>
          </div>
        </div>
      </section>

      <section id="features" className="relative py-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
        </div>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to ship</h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
              9 battle-tested modules. Zero config. One codebase. Heres exactly what each one does.
            </p>
          </div>

          <div className="space-y-24">
            {features.map((f, i) => (
              <FeatureSection key={f.title} f={f} reversed={i % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 border-t border-neutral-200/60 dark:border-neutral-800/60">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-12 max-w-lg mx-auto">
            One purchase. Ship everything. No recurring fees.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="relative p-8 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/50">
              <h3 className="text-lg font-semibold mb-2">Solo</h3>
              <div className="text-4xl font-bold mb-1">$69</div>
              <p className="text-sm text-neutral-500 mb-6">Single developer</p>
              <ul className="text-sm space-y-3 text-left mb-8">
                {['Full source code', '1 year updates', 'Unlimited projects', 'Email support'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <svg className="size-4 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25">Buy Solo</Button>
            </div>
            <div className="relative p-8 rounded-2xl border-2 border-brand-500/40 dark:border-brand-500/40 bg-white dark:bg-neutral-900/50 shadow-xl shadow-brand-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-brand-600 text-white text-xs font-medium rounded-full">
                Popular
              </div>
              <h3 className="text-lg font-semibold mb-2">Team</h3>
              <div className="text-4xl font-bold mb-1">$149</div>
              <p className="text-sm text-neutral-500 mb-6">Up to 5 developers</p>
              <ul className="text-sm space-y-3 text-left mb-8">
                {['Everything in Solo', 'Team license (5 devs)', 'Priority support', 'Commercial license'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <svg className="size-4 text-brand-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25">Buy Team</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 border-t border-neutral-200/60 dark:border-neutral-800/60">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to launch?</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
            Join developers shipping faster with DotForge. Start building for free.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register"><Button size="lg" className="bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25">Get started free</Button></Link>
            <a href="#features"><Button variant="outline" size="lg">Learn more</Button></a>
          </div>
        </div>
      </section>

      <footer className="border-t border-neutral-200/60 dark:border-neutral-800/60 py-8 text-center text-sm text-neutral-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-semibold bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">DotForge</span>
          <span>Built with .NET 10 and React 19</span>
          <ThemeToggle />
        </div>
      </footer>
    </div>
  )
}
