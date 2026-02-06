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

## GitHub MCP Server Setup (Required for Cross-Repo Reporting)

The `report-to-master` skill requires the GitHub MCP Server so Copilot coding agent can comment on issues in the master `octocat-supply-platform` repo.

### Setup Steps

| Step | Action |
|------|--------|
| 1 | Go to **Settings → Copilot → Coding agent → MCP configuration** and add the GitHub MCP server JSON config (see below) |
| 2 | Use `https://api.githubcopilot.com/mcp` as the server URL (not `/readonly`) for write access |
| 3 | Include `issues` in the `X-MCP-Toolsets` header so the agent can comment on and create issues |
| 4 | Add a GitHub PAT as `COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN` in the repo's **Copilot environment secrets** |
| 5 | Instruct the agent in your issue to report back to the master repo when done |

### MCP Configuration JSON

```json
{
  "mcpServers": {
    "github": {
      "url": "https://api.githubcopilot.com/mcp",
      "headers": {
        "X-MCP-Toolsets": "issues"
      }
    }
  }
}
```

### PAT Scopes Required

The PAT stored in `COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN` needs:
- `repo` — full control of private repositories (or `public_repo` for public-only)
- `issues:write` — create/update issues and comments across repos

> **Note:** Without this setup, the `report-to-master` skill will not be able to comment on the master issue in `octocat-supply-platform`.

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
