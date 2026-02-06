# OctoCAT Supply Chain – Frontend Repository Instructions

This repository is the **React + Vite + Tailwind CSS** frontend for the OctoCAT Supply Chain Management application, part of the `octocat-supply-platform` ecosystem.

## Tech Stack

- **Framework:** React 18+ with TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS (utility-first; dark mode via `ThemeContext`)
- **Routing:** React Router v7 — routes: `/`, `/about`, `/products`, `/login`, `/admin/products`
- **Data Fetching:** React Query for server-state cache
- **Auth:** `AuthContext` provider wrapping the app

## Multi-Repo Workflow

When assigned an issue that references `octocat-supply-platform#<number>`:

1. This issue was spawned by the orchestrator in the master repo
2. Implement the required changes following the task description
3. Use the `report-to-master` skill to create properly linked PRs
4. The master issue will be automatically updated with your progress

## PR Conventions

- **Title Format:** `[octocat-supply-platform#<issue>] <description>`
- **Always link** to both the master issue and local issue
- **Include integration notes** if your changes depend on other repos

## Frontend Guidelines

- Semantic HTML, proper ARIA labels, focus management
- Tailwind utility classes; extract repeated patterns into small components
- Components < 150 LOC; split data + presentation
- Use React Query for data fetching (not bare useEffect)
- Avoid `any`; type API responses with shared DTOs
- Responsive: test at mobile (≤640px), md (~768px), lg (≥1024px)

## Build & Dev

```bash
npm install
npm run dev          # Vite dev server
npm run build        # Production build
npm run test         # Run tests
npm run lint         # ESLint
```

## Architecture Reference

For architecture context, refer to:
- `your-org/octocat-supply-platform/architecture/`
- `your-org/octocat-supply-platform/specs/`
- `your-org/octocat-supply-platform/docs/architecture.md`
