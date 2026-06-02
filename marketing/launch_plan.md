# DotForge Launch Action Plan

Goal: $80k total ($8k month for 10 months) from template sales + transition to B2B AI SaaS.

## Phase 1: Build-in-public (Days 1-14)

### dev.to post — "I built a .NET 10 SaaS starter kit. Here's what 3 weeks of nights & weekends looks like"
- **Angle**: Full transparency. Share the architecture diagram, the testing stack, the pricing research.
- **Hook**: "I needed a .NET SaaS starter with OAuth and API keys. Nothing existed at a fair price. So I built it."
- **Include**: Architecture diagram, code snippets (JWT rotation, multi-tenancy filter), test output, landing page screenshot
- **Tags**: dotnet, react, saas, webdev, opensource
- **Cross-post**: Medium, Hashnode

### Reddit — r/dotnet + r/reactjs + r/SaaS
- **r/dotnet post**: "Show & Tell: DotForge — open-core .NET 10 + React 19 SaaS starter. OAuth, multi-tenancy, 60+ tests."
  - Best time: Tuesday 10am ET
  - Include GitHub link, direct question: "What feature would you add?"
  - Respond to EVERY comment for 2 hours
  - **Backup**: r/csharp, r/programming
- **r/reactjs post**: "Which SaaS starter did you use for your last project? I built one with React 19 + Vite 8 + shadcn."
  - Angle: Discussion disguised as launch. Share lessons learned from the React side.
- **r/SaaS post**: "Pricing feedback: .NET 10 SaaS starter at $69 single / $149 team. Too high? Too low?"
  - Angle: Community pricing advice. Gets engagement + free validation.

### Hacker News Show — "Show HN: DotForge – .NET 10 SaaS starter with OAuth and 60 integration tests"
- **Timing**: Wednesday 8am ET (highest engagement)
- **Title options** (test both, split 50%):
  - A: "Show HN: DotForge – .NET 10 SaaS Starter with OAuth, Stripe, and 60 Integration Tests"
  - B: "Show HN: I built a .NET 10 SaaS Kit because DotPlate didn't have OAuth"
  - **Recommendation**: B is more controversial → more engagement
- **Prep**: Have a live demo URL ready. Screenshots loaded on imgur. README polished. Anticipate "Why not just use [free alternative]?" — answer: "OAuth + API keys + multi-tenancy + tests at $69. You'd spend 20 hours integrating all of that for free options."
- **Stick strategy**: First comment adds value + genuine question. "What's the hardest part of building a SaaS these days?"

## Phase 2: Launch (Day 15 — Product Hunt)

### Product Hunt launch
- **Hunter**: Find a .NET/C# maker on PH with 200+ followers. DM them: "Will you hunt DotForge? I'll send a lifetime team license."
- **Listing assets**:
  - Tagline: "Production-ready .NET 10 SaaS starter with auth, billing, and OAuth"
  - First comment: The story — "I spent 3 weeks building what every SaaS needs. Here's what I learned about auth, multi-tenancy, and testing."
  - Gallery: Screenshots (dashboard, members, API keys, billing, landing) + GIF of org switching + demo video
  - Makers: You + hunter
- **Promotion**: Email list if any, dev.to readers, Reddit thread from Phase 1 (edit to add PH link)
- **Post-launch**: 60% discount code for 7 days. "PH60" — creates urgency + tracks PH-driven sales.
- **Goal**: Top 5 Product of the Day

### Discount strategy
- Launch week: PH60 (60% off — $27 single / $59 team)
- Week 2: LAUNCH40 (40% off — $41 single / $89 team)
- Week 3-4: WELCOME20 (20% off — $55 single / $119 team)
- After: Full price ($69 / $149)

## Phase 3: Earned media (Days 16-30)

### Newsletter pitches
- **.NET Monthly** — "The .NET ecosystem finally has a modern SaaS starter. Here's my take."
- **Coding Horror** (Jeff Atwood) — Less likely but high impact
- **SaaS Club** — "How I built a SaaS starter in 3 weeks as a solo dev"
- **Indie Hackers** — Interview format

### YouTube
- Upload demo video and "How I built DotForge" devlog
- Post in comments on .NET / React videos: "I built a SaaS starter with this stack — link in bio"
- Pitch to: Nick Chapsas, James Montemagno, Web Dev Simplified (React angle)

## Phase 4: Traffic loops (ongoing)

### SEO content
- "How to build a multi-tenant SaaS with .NET 10" — targets devs googling for multi-tenancy solutions
- "Best .NET SaaS starters in 2026" — targets comparison shoppers
- "How to add Stripe billing to .NET 10" — tutorial that funnels to DotForge
- "Setting up Google OAuth in .NET 10" — tutorial with redirect to docs

### Gumroad discovery
- Tag: dotnet, saas, starter-kit, react, template
- Ask buyers to leave a review — social proof drives Gumroad search ranking
- Offer 20% affiliate commission — tweet to dev community

## Success metrics

| Metric | Week 1 | Week 4 | Month 3 | Month 6 |
|--------|--------|--------|---------|---------|
| Sales | 10 | 50 | 200 | 500 |
| Revenue | $270 (discount) | $2,450 (mix) | $10,000 | $29,000 |
| GitHub stars | 50 | 200 | 500 | 1000 |
| Email list | 100 | 500 | 2000 | 5000 |

## When to pivot to B2B

At **$3,000-5,000/month** recurring from template sales, start building Phase 2:
- .NET AI Proxy/SDK — the product, not the template
- B2B SaaS with recurring revenue
- $49-149/month pricing
- Target: AI startups building on .NET

## Resources

- Gumroad affiliate program: Settings → Affiliates → 20%
- Hunter outreach template: "Hey [name], I'm a big fan of your work on Product Hunt. I'm launching DotForge — a .NET SaaS starter — on [date]. Would you be interested in hunting it? Happy to comp you a lifetime team license."
- Live demo: Railway deploy (free tier handles demo traffic)
- Discount codes: Create in Gumroad before launch day
