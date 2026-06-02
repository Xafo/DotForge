import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold">DotForge</span>
          <div className="flex gap-3">
            <Link to="/login"><Button variant="ghost">Sign in</Button></Link>
            <Link to="/register"><Button>Get started</Button></Link>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Ship your .NET SaaS<br />
          <span className="text-neutral-500">in 15 minutes</span>
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-10">
          Production-ready .NET 10 + React 19 starter kit with auth, multi-tenancy, Stripe billing,
          team invitations, API keys, OAuth, and 60+ integration tests — all wired up.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register"><Button size="lg">Start building →</Button></Link>
          <a href="#features"><Button variant="outline" size="lg">See features</Button></a>
        </div>
      </section>

      <section id="features" className="border-t border-neutral-200 dark:border-neutral-800 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Everything included</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 dark:border-neutral-800 py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">One purchase. Ship everything.</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            $69 single developer · $149 team (5 devs) · Unlimited projects · 1 year updates
          </p>
          <a href="https://gumroad.com" target="_blank" rel="noopener noreferrer">
            <Button size="lg">Buy DotForge</Button>
          </a>
        </div>
      </section>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8 text-center text-sm text-neutral-500">
        DotForge · Built with .NET 10 and React 19
      </footer>
    </div>
  )
}

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
