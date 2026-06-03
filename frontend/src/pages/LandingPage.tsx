import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { ThemeToggle } from '../components/ThemeToggle'

const features = [
  { icon: '🔐', title: 'Auth + JWT', description: 'Register, login, refresh token rotation, forgot/reset password. HttpOnly cookies, BCrypt, SHA-256 token hashing.' },
  { icon: '🏢', title: 'Multi-tenancy', description: 'Row-level isolation via EF Core Global Query Filters. One account, many orgs. Switch orgs without re-login.' },
  { icon: '💳', title: 'Stripe Billing', description: 'Checkout sessions, webhooks, Billing Portal, subscription management. Cancel-at-period-end, upgrades, downgrades.' },
  { icon: '👥', title: 'Team Invitations', description: '7-day SHA-256 invitation tokens. Atomic account + membership creation. Revokable, replay prevention.' },
  { icon: '🔑', title: 'API Keys', description: 'Create, revoke, scope API keys with prefix-based identification. Perfect for AI/LLM integrations.' },
  { icon: '🔗', title: 'OAuth (Google + GitHub)', description: 'Sign in with Google or GitHub. Auto-creates account and organization on first login.' },
  { icon: '🧪', title: '60+ Integration Tests', description: 'Testcontainers with real PostgreSQL. Auth, multi-tenant isolation, invitations, billing, API keys.' },
  { icon: '🐳', title: 'Docker + CI/CD', description: 'Multi-stage Dockerfile, docker-compose with PostgreSQL, GitHub Actions pipeline.' },
  { icon: '⚛️', title: 'React 19 + Tailwind v4', description: 'TypeScript strict, shadcn/ui components, dark mode, responsive dashboard. Vite-powered dev server.' },
]

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

      <section id="features" className="relative py-24 border-t border-neutral-200/60 dark:border-neutral-800/60">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
        </div>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to ship</h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
              9 battle-tested modules. Zero config. One codebase.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/50 hover:border-brand-500/30 dark:hover:border-brand-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/5 hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="text-2xl mb-4">{f.icon}</div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{f.description}</p>
                </div>
              </div>
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
