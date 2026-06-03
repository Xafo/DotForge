import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { ThemePicker } from '../components/ThemePicker'
import { cn } from '../lib/utils'

const features = [
  {
    icon: '🔐',
    title: 'Auth + JWT',
    description: 'Register, login, refresh token rotation, forgot/reset password. HttpOnly cookies, BCrypt, SHA-256 token hashing.',
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
    description: 'Row-level isolation via EF Core Global Query Filters. One account, many orgs. Switch orgs without re-login.',
    details: [
      'Every entity scoped to an organization — no cross-org data leaks',
      'EF Core Global Query Filters auto-apply tenant filter to every query',
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
    description: 'Checkout sessions, webhooks, Billing Portal, subscription management. Cancel-at-period-end, upgrades, downgrades.',
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
    description: '7-day SHA-256 invitation tokens. Atomic account + membership creation. Revokable, replay prevention.',
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
    description: 'Create, revoke, scope API keys with prefix-based identification. Perfect for AI/LLM integrations.',
    details: [
      'Prefix-based identification — keys identified by prefix for UX',
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
    description: 'Sign in with Google or GitHub. Auto-creates account and organization on first login.',
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
    description: 'Testcontainers with real PostgreSQL. Auth, multi-tenant isolation, invitations, billing, API keys.',
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
    description: 'Multi-stage Dockerfile, docker-compose with PostgreSQL, GitHub Actions pipeline.',
    details: [
      'Multi-stage Docker build — SDK layer, build layer, runtime layer',
      'Final image uses slim runtime (only ~180MB)',
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
    description: 'TypeScript strict, shadcn/ui components, dark mode, responsive dashboard. Vite-powered dev server.',
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

export function LandingPage() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200/60 dark:border-neutral-800/60 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
            DotForge
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemePicker />
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
          <div className="animate-fade-in-up flex flex-wrap items-center justify-center gap-3 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              <span className="size-2 rounded-full bg-brand-500 animate-pulse" />
              .NET 10 + React 19
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              AI-ready agents included
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
            Pre-configured AI agents included. Production-ready starter kit with auth, multi-tenancy, Stripe billing,
            team invitations, API keys, OAuth, and 60+ integration tests.
            Everything you need to launch your next SaaS.
          </p>
          <div className="animate-fade-in-up animate-fade-in-up-delay-3 flex flex-wrap gap-4 justify-center">
            <Link to="/register"><Button size="lg" className="bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25">Start building free →</Button></Link>
            <a href="#features"><Button variant="outline" size="lg">See features</Button></a>
          </div>
        </div>
      </section>

      <section id="features" className="relative py-24 border-t border-neutral-200/60 dark:border-neutral-800/60">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
        </div>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to ship</h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
              9 battle-tested modules. Zero config. One codebase. <strong>Click any card</strong> for full details.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const isOpen = expanded === i
              return (
                <div
                  key={f.title}
                  className={cn(
                    'group relative rounded-2xl border transition-all duration-300 bg-white dark:bg-neutral-900/50 cursor-pointer',
                    isOpen
                      ? 'border-brand-500/40 dark:border-brand-500/40 shadow-lg shadow-brand-500/10'
                      : 'border-neutral-200/60 dark:border-neutral-800/60 hover:border-brand-500/30 dark:hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/5 hover:-translate-y-0.5'
                  )}
                  onClick={() => setExpanded(isOpen ? null : i)}
                >
                  <div className={cn(
                    'absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/[0.03] to-transparent transition-opacity duration-300',
                    isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  )} />
                  <div className="relative p-6">
                    <div className={cn('flex items-start justify-between mb-3')}>
                      <div className="text-2xl">{f.icon}</div>
                      <svg
                        className={cn(
                          'size-5 text-neutral-400 transition-transform duration-300',
                          isOpen && 'rotate-180'
                        )}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <h3 className="font-semibold mb-2">{f.title}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {f.description}
                    </p>
                    <div className={cn(
                      'overflow-hidden transition-all duration-300',
                      isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                    )}>
                      <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60">
                        <ul className="space-y-2">
                          {f.details.map((d) => (
                            <li key={d} className="flex items-start gap-2.5 text-sm text-neutral-700 dark:text-neutral-300">
                              <svg className="size-4 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative py-24 overflow-hidden border-t border-neutral-200/60 dark:border-neutral-800/60">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/5 dark:bg-brand-500/[0.03] rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 mb-6">
                New — included in every purchase
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">AI Agents,<br />pre-configured for your codebase</h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                Every purchase ships with <strong className="text-foreground">AGENTS.md</strong> — a 200+ line
                context file that teaches any AI coding assistant exactly how your project works.
                No more explaining your architecture to AI. It already knows.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  ['Architecture', 'Clean Architecture layer rules'],
                  ['Security', 'JWT, BCrypt, refresh rotation'],
                  ['Conventions', 'Primary constructors, records'],
                  ['Testing', 'xUnit + Testcontainers patterns'],
                  ['Database', 'EF Core, migrations, connection strings'],
                  ['Deploy', 'Docker, Railway, env vars'],
                ].map(([a, b]) => (
                  <div key={a} className="flex items-start gap-2.5">
                    <svg className="size-4 text-brand-500 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    <div>
                      <div className="text-sm font-medium">{a}</div>
                      <div className="text-xs text-neutral-500">{b}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/register">
                <Button size="lg" className="bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25">
                  Start building with AI →
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/50 shadow-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50 dark:bg-neutral-900">
                  <span className="size-3 rounded-full bg-red-500/80" />
                  <span className="size-3 rounded-full bg-amber-500/80" />
                  <span className="size-3 rounded-full bg-green-500/80" />
                  <span className="text-xs text-neutral-500 font-mono ml-2">AGENTS.md</span>
                </div>
                <div className="p-4 font-mono text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 overflow-x-auto">
                  <div><span className="text-neutral-400"># </span><span className="text-brand-500">DotForge — AI Agent Context</span></div>
                  <div className="mt-2"><span className="text-neutral-400"># Tech Stack</span></div>
                  <div><span className="text-neutral-500">- Backend: </span>.NET 10 + EF Core + Npgsql</div>
                  <div><span className="text-neutral-500">- Frontend: </span>React 19 + Tailwind v4</div>
                  <div><span className="text-neutral-500">- Auth: </span>JWT (HMAC-SHA256) + BCrypt</div>
                  <div><span className="text-neutral-500">- Tests: </span>xUnit + Testcontainers</div>
                  <div className="mt-2"><span className="text-neutral-400"># Key Rule</span></div>
                  <div>Primary constructors for DI classes.</div>
                  <div>Records for DTOs. File-scoped namespaces.</div>
                  <div className="mt-2"><span className="text-neutral-400"># Security</span></div>
                  <div>Refresh token rotation + replay detection.</div>
                  <div>BCrypt for passwords. SHA-256 for tokens.</div>
                  <div className="mt-3 text-brand-500 font-semibold">→ 200+ lines · 10 sections · Zero config</div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 -z-10 w-48 h-48 bg-brand-500/10 rounded-full blur-2xl" />
            </div>
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
                {['Full source code', 'Pre-configured AI agents', '1 year updates', 'Unlimited projects', 'Email support'].map((item) => (
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
          <ThemePicker />
        </div>
      </footer>
    </div>
  )
}
