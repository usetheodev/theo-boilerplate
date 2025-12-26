# CLAUDE.md - theo-boilerplate

This file provides guidance to Claude Code when working with code in this repository.

---

## 🎯 Purpose

This is a **professional full-stack boilerplate** with enterprise-grade authentication and type-safety. It contains two applications:
- **apps/web**: Vite + React 18 frontend (TypeScript, SPA)
- **apps/api**: NestJS 10 backend (TypeScript)

This monorepo provides a production-ready foundation with complete auth system, optimized builds, and modern developer experience using **Turborepo** (turbo.build).

---

## 🛠️ Commands

### Installation
```bash
# Install all dependencies (uses pnpm workspaces)
pnpm install
```

### Development
```bash
# Run all apps in dev mode (parallel via Turborepo)
pnpm dev              # or: turbo run dev

# Run specific app
turbo run dev --filter=web      # Vite on port 3000 (with HMR)
turbo run dev --filter=api      # NestJS on port 3001

# Or navigate to app directory
cd apps/web && pnpm dev
cd apps/api && pnpm dev
```

### Build
```bash
# Build all apps (uses Turborepo pipeline)
pnpm build            # or: turbo run build

# Build specific app
turbo run build --filter=web    # Build frontend only
turbo run build --filter=api    # Build backend only
```

### Linting & Type Checking
```bash
# Lint all apps
pnpm lint             # or: turbo run lint

# Type-check all apps
pnpm typecheck        # or: turbo run typecheck

# Lint specific app
turbo run lint --filter=web
turbo run lint --filter=api
```

### Testing
```bash
# Run API tests
turbo run test --filter=api

# Run with coverage
turbo run test:cov --filter=api

# Run E2E tests
turbo run test:e2e --filter=api
```

### Database (Prisma)
```bash
# Run migrations
pnpm db:migrate       # or: turbo run prisma:migrate --filter=api

# Open Prisma Studio
pnpm db:studio        # or: turbo run prisma:studio --filter=api

# Reset database
pnpm db:reset
```

---

## 🏗️ Architecture

### Monorepo Structure

```
theo-boilerplate/
├── turbo.json                # Turborepo configuration
├── apps/
│   ├── web/                  # Vite + React (standalone output)
│   │   └── dist/             # Build output
│   └── api/                  # NestJS (compiled to dist/)
│       └── dist/             # Build output
├── packages/
│   ├── types/                # Shared TypeScript types
│   ├── validators/           # Zod validation schemas
│   ├── tsconfig/             # Shared tsconfig
│   └── eslint-config/        # Shared ESLint config
├── package.json              # Root workspace config
├── pnpm-workspace.yaml       # pnpm workspace definition
└── theo.yaml                 # THEO Platform config
```

### Apps Overview

**apps/web (Vite + React)**
- Framework: Vite 5 + React 18 (SPA)
- TypeScript: Yes (strict mode)
- Styling: Tailwind CSS 3.4
- Router: React Router 6
- State: Tanstack Query 5
- Output: Static files in `dist/` directory
- Build: Fast HMR, optimized production builds
- Config: `vite.config.ts`, `package.json`

**apps/api (NestJS)**
- Framework: NestJS 10
- TypeScript: Yes (strict mode)
- ORM: Prisma
- Output: Compiled to `dist/` directory
- Entry: `dist/main.js`
- Config: `nest-cli.json`, `package.json`

### Turborepo Task Runner

**Why Turborepo?**
- ✅ Installs as npm dependency (zero external setup)
- ✅ Automatic dependency graph detection
- ✅ Smart caching (local + remote)
- ✅ Parallel execution
- ✅ Simple configuration
- ✅ Widely adopted (Vercel, popular ecosystem)

**Defined in `turbo.json`**:
- **build**: Production builds with caching, `dependsOn: ["^build"]`
- **dev**: Development servers (no cache, persistent)
- **lint**: ESLint checks (cached)
- **typecheck**: TypeScript type checking (cached)
- **test**: Jest tests (cached)

### Workspace Management

- **Package manager**: pnpm 8.15.0 (specified in `package.json`)
- **Task runner**: Turborepo 2.3+ (installed as devDependency)
- **Workspaces**: Defined in `pnpm-workspace.yaml`
  - `apps/*` - Applications
  - `packages/*` - Shared packages

---

## 🎯 Key Features

### Complete Authentication
- JWT tokens + Refresh tokens
- OAuth 2.0 (Google, GitHub)
- Email verification
- RBAC (Role-Based Access Control)
- Password reset flow

### Type-Safety End-to-End
- Shared types via `@repo/types`
- Zod validation via `@repo/validators`
- Prisma ORM with generated types
- TypeScript strict mode everywhere

### Modern Frontend
- Vite HMR (instant feedback)
- React 18 with concurrent features
- Tailwind CSS with dark mode support
- React Router 6 (type-safe routes)
- Tanstack Query (server state management)

### Enterprise Backend
- NestJS modular architecture
- Guards & Decorators
- Dependency Injection
- Swagger API documentation
- Health checks & Terminus

### Developer Experience
- Turborepo task runner (parallel builds, smart caching)
- pnpm workspaces (fast installs)
- ESLint + Prettier (code quality)
- Husky + lint-staged (pre-commit hooks)
- Commitlint (conventional commits)

---

## 🚀 Turborepo Configuration

### turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    }
  }
}
```

**Key Concepts:**
- **`dependsOn: ["^build"]`**: Wait for dependencies to build first
- **`outputs`**: Cache these directories
- **`cache: false`**: Don't cache dev servers
- **`persistent: true`**: Long-running processes

### Dependency Graph (Auto-Generated)

Turborepo automatically discovers that:
- **types** and **validators** have no dependencies → Build first (parallel)
- **web** and **api** depend on types + validators → Build after (parallel)

Therefore, when running `turbo run build`:
1. **types** and **validators** build first (in parallel)
2. Then **web** and **api** build (in parallel, after step 1)

### Caching

Turborepo provides intelligent caching:

**Local Cache Location**: `.turbo/` (gitignored)

**Cache Strategy**:
- Cache keys: Based on file hashes + dependencies
- Cache outputs: `dist/`, `coverage/`
- Cache hit rate: 80-95% typical

**Performance Metrics**:
- First build: ~4-5 seconds (no cache)
- Subsequent builds (with cache): ~1 second (-80% faster)
- Remote cache (future): Share cache across team/CI

---

## 📊 Performance Metrics

Development and build performance with Turborepo:

- **Turborepo auto-detection**: ~100ms
- **Vite dev server startup**: ~500ms (instant HMR)
- **NestJS dev server startup**: ~2-3s (with watch mode)
- **Frontend production build**: ~3s (turbo run build --filter=web)
- **Backend production build**: ~4s (turbo run build --filter=api)
- **Full monorepo build**: ~4s parallel (turbo run build)
- **Bundle size** (Vite):
  - Initial: ~245KB (gzipped: ~80KB)
  - With code splitting: ~50KB per route
- **Cache hit rate**: 80-95% (Turborepo local cache)

**Note**: Second builds with cache are near-instant (~1s).

---

## 🔧 Integration: theo-boilerplate & Theo Platform

### theo.yaml Configuration
```yaml
app:
  id: theo-boilerplate
  name: THEO Boilerplate (Vite + NestJS)
  runtime: nodejs
  buildTool: turbo              # ← Turborepo is the build tool

projects:
  web:
    type: frontend
    framework: vite
    path: apps/web
    buildCommand: turbo run build --filter=web
    outputDir: apps/web/dist

  api:
    type: backend
    framework: nestjs
    path: apps/api
    buildCommand: turbo run build --filter=api
    outputDir: apps/api/dist
    entrypoint: dist/main.js
    startCommand: node dist/main.js
```

### Theo CLI Integration
The Theo CLI uses Turborepo commands to:
- Build applications (`theo deploy` → `turbo run build`)
- Run development servers (`turbo run dev`)
- Execute tests (`turbo run test`)
- Type-check code (`turbo run typecheck`)

---

## 📁 Key Configuration Files & Locations

| File | Purpose | Location |
|------|---------|----------|
| **turbo.json** | Turborepo configuration (pipeline, caching) | `turbo.json` |
| **package.json** | Root workspace scripts (all use `turbo run`) | `package.json` |
| **pnpm-workspace.yaml** | pnpm workspaces definition | `pnpm-workspace.yaml` |
| **theo.yaml** | Theo Platform config (specifies Turbo as buildTool) | `theo.yaml` |
| **CLAUDE.md** | Project guidelines (Turborepo commands, architecture) | `CLAUDE.md` |

---

## 🚨 Important Notes

1. **This is a boilerplate** - Production applications should customize security, auth flows, and business logic
2. **No Git repository** - This directory is part of the larger THEO Platform workspace
3. **Turborepo integration** - All builds and tasks use Turborepo (turbo.build)
4. **Port conflicts** - Both apps default to port 3000; run separately or configure `PORT` env
5. **User-friendly** - Turborepo installs as npm dependency, no external setup needed

---

## 📚 Documentation

- **Turborepo Docs**: https://turbo.build/repo/docs
- **Vite Docs**: https://vitejs.dev
- **NestJS Docs**: https://nestjs.com
- **Prisma Docs**: https://prisma.io
- **Platform docs**: `../docs/` - THEO Platform architecture

---

## 🔗 Why Turborepo for theo-boilerplate?

**Decision Rationale:**

1. **Zero external setup** - Installs via `npm install` (as devDependency)
2. **Beginner-friendly** - Users with little dev experience don't need to install separate tools
3. **Widely adopted** - Large community, abundant Stack Overflow answers
4. **Simple config** - Single `turbo.json` file (vs multiple config files)
5. **Great DX** - Fast builds, smart caching, clear error messages

**Alternative considered**: Moon (moonrepo.dev)
- Moon requires separate installation (`curl | bash` or npm global)
- Moon has multi-language support (Python, Go, Rust) - not needed for this boilerplate
- Moon has smaller ecosystem (less community support)

**Conclusion**: Turborepo is the best choice for a user-friendly boilerplate targeting developers with limited experience.

---

**Last Updated**: 2025-12-13
**Build System**: Turborepo 2.3+
**Package Manager**: pnpm 8.15.0
