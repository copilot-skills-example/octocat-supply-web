# OctoCAT Supply – Web Frontend

React + Vite + Tailwind CSS frontend for the **OctoCAT Supply Chain Management** application.

## Tech Stack

- **Framework:** React 18+ with TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v7
- **Data Fetching:** React Query (TanStack Query)
- **State:** AuthContext, ThemeContext
- **Testing:** Playwright (E2E), Vitest (unit)

## Quick Start

```bash
npm install
npm run dev          # Start dev server with HMR
npm run build        # Production build → dist/
npm run preview      # Preview production build
npm test             # Run Playwright E2E tests
```

Dev server runs at `http://localhost:5173` by default.

## Directory Structure

```
src/
  App.tsx              # Root component with router
  main.tsx             # Entry point
  index.css            # Tailwind directives
  api/                 # API client config
  assets/              # Static assets
  components/          # React components (About, Footer, etc.)
  context/             # AuthContext, ThemeContext providers
public/
  runtime-config.js    # Runtime API URL config
tests/
  e2e/                 # Playwright end-to-end tests
  features/            # Feature test specs
```

## Environment Configuration

Set the API base URL via `public/runtime-config.js`:

```javascript
window.__RUNTIME_CONFIG__ = {
  API_URL: "http://localhost:3001"
};
```

## Part Of

| Repo | Purpose |
|------|---------|
| [octocat-supply-platform](https://github.com/copilot-skills-example/octocat-supply-platform) | Master orchestrator |
| **octocat-supply-web** (this) | Frontend |
| [octocat-supply-api](https://github.com/copilot-skills-example/octocat-supply-api) | REST API |

## License

MIT
