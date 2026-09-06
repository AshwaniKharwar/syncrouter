<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Frontend Agent Guidelines

## 1. Package Manager & Tooling: Always Use Bun
- **MANDATORY**: Always use **Bun** (`bun`) as the package manager and script runner.
- **Commands**:
  - Install dependencies: `bun install`
  - Add packages: `bun add <package>` (or `bun add -d <package>` for dev dependencies)
  - Remove packages: `bun remove <package>`
  - Run development server: `bun run dev`
  - Build project: `bun run build`
  - Linting: `bun run lint`
- **DO NOT** use `npm`, `yarn`, or `pnpm` under any circumstances. Always preserve and update `bun.lock`.

## 2. Project Architecture & Modular Structure
Follow a strict modular directory layout. Never dump unrelated code or large monolithic components into single files.

```text
frontend/
├── app/                  # Next.js App Router (Routing layer only)
│   ├── (auth)/           # Route group for authentication flows
│   ├── (dashboard)/      # Route group for dashboard views
│   ├── layout.tsx        # Root layout & global shell
│   └── page.tsx          # Landing page
├── components/           # Reusable UI components organized by domain
│   ├── ui/               # Base design system primitives (Shadcn / Base UI)
│   ├── layout/           # Shared layout components (Navbar, Sidebar, etc.)
│   ├── auth/             # Authentication-specific components
│   ├── api-keys/         # API key management components
│   ├── models/           # AI models / provider catalog components
│   └── shared/           # Cross-cutting reusable UI blocks
├── hooks/                # Custom reusable React hooks
├── lib/                  # Utility functions, clients, helpers (e.g., utils.ts, api client)
├── providers/            # React context and query providers (e.g., QueryProvider)
└── types/                # Shared TypeScript interfaces, types, and DTOs
```

## 3. Code Writing & Engineering Standards
- **Routing vs Logic Separation**:
  - `app/` routes should only define page composition and routing logic.
  - Extract all presentation and business UI into domain folders inside `components/`.
  - Extract reusable logic into `hooks/` or `lib/`.
- **Client vs Server Components**:
  - Keep components Server Components by default.
  - Add `"use client"` directive **only** when interactivity, client hooks (`useState`, `useEffect`, `useQuery`), or browser APIs are strictly needed. Keep client boundaries as small and low in the tree as possible.
- **Strict TypeScript**:
  - Explicitly type props, function arguments, and API responses.
  - Avoid `any`. Place shared types in `types/` or domain-specific type files.
- **Styling & Design System**:
  - Use Tailwind CSS v4 utility classes.
  - Use `cn()` helper from `lib/utils` for conditional class merging.
  - Maintain aesthetic consistency with existing design tokens, dark theme support, and responsive design.
- **Data Fetching & State**:
  - Use `@tanstack/react-query` for asynchronous server state, caching, and mutation workflows.
  - Keep local UI state minimal and localized.
