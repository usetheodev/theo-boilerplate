# Theo Boilerplate - Official Starter for Theo Platform

> **Production-ready, full-stack boilerplate for building modern web applications on Theo Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Theo Platform](https://img.shields.io/badge/Theo-Platform-purple)](https://usetheo.dev)

---

## 🎯 What is This?

The **Theo Boilerplate** is the official, production-ready starter template for building full-stack applications on Theo Platform. It provides a **minimal, yet complete** foundation that you can extend with **modular features** via the Theo CLI.

**Philosophy:**
- ✅ **Minimal by default** - Start with just what you need
- ✅ **Modular features** - Add functionality with `theo add <feature>`
- ✅ **Theo-exclusive** - Optimized for deployment on Theo Platform
- ✅ **Production-ready** - Enterprise-grade architecture from day one
- ✅ **Type-safe** - End-to-end TypeScript with strict mode

---

## 🚀 Quick Start

### 1. Create a New Project

```bash
# Create new Theo app (interactive prompts)
npx create-theo-app@latest my-app

# Or with specific template
npx create-theo-app@latest my-app --template next-nest

cd my-app
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Run Development Server

```bash
# Run all apps (parallel)
pnpm dev

# Run specific app
pnpm dev --filter=web   # Frontend on http://localhost:3000
pnpm dev --filter=api   # Backend on http://localhost:3001
```

### 4. Add Features

```bash
# Add authentication system
theo add auth

# Add Stripe payments
theo add stripe

# Add email service
theo add email

# Add admin panel
theo add admin-panel
```

### 5. Deploy to Theo Platform

```bash
# Login to Theo Platform
theo login

# Deploy your app
theo deploy
```

---

## 📁 Project Structure

```
my-app/
├── apps/
│   ├── web/                    # Frontend (Vite + React)
│   │   ├── src/
│   │   │   ├── App.tsx        # Root component
│   │   │   ├── main.tsx       # Entry point
│   │   │   └── components/    # React components
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── api/                    # Backend (NestJS)
│       ├── src/
│       │   ├── app.module.ts  # Root module
│       │   ├── main.ts        # Entry point
│       │   └── modules/       # Feature modules
│       ├── package.json
│       └── nest-cli.json
│
├── packages/                   # Shared packages (optional)
│   └── shared/                # Shared types, utils
│
├── .theo/                      # Theo configuration
│   ├── generators/            # Local generators
│   └── config.json            # Theo settings
│
├── theo.config.ts             # Theo Platform config
├── package.json               # Root workspace
├── pnpm-workspace.yaml        # pnpm workspaces
├── turbo.json                 # Turborepo config
└── README.md
```

---

## 🏗️ Architecture

### Monorepo Setup

- **Package Manager:** pnpm (workspaces)
- **Build System:** Turborepo (caching + orchestration)
- **Frontend:** Vite 5 + React 18 (SPA)
- **Backend:** NestJS 10 (TypeScript)
- **Type Safety:** End-to-end TypeScript (strict mode)

### Technology Stack

**Frontend (apps/web):**
- **Framework:** Vite 5 + React 18
- **Routing:** React Router 6
- **State Management:** Tanstack Query 5
- **Styling:** Tailwind CSS 3.4
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios

**Backend (apps/api):**
- **Framework:** NestJS 10
- **Runtime:** Node.js 18+
- **Validation:** Class Validator + Class Transformer
- **OpenAPI:** Swagger (auto-generated)
- **Testing:** Jest + Supertest

**Development:**
- **Monorepo:** pnpm workspaces + Turborepo
- **Linting:** ESLint + Prettier
- **Type Checking:** TypeScript 5.0
- **Git Hooks:** Husky (optional)

---

## 🎨 Features System

Theo uses a **modular features system** inspired by [shadcn/ui](https://ui.shadcn.com), [create-t3-app](https://create.t3.gg), and [Nx](https://nx.dev).

### Available Features

#### Core Features

| Feature | Command | Description |
|---------|---------|-------------|
| **Authentication** | `theo add auth` | JWT + OAuth (Google, GitHub) + RBAC |
| **Database** | `theo add database` | Prisma + PostgreSQL with migrations |
| **Email** | `theo add email` | Email service (Resend/SendGrid) |
| **Storage** | `theo add storage` | File uploads (S3/R2 compatible) |

#### Payment & Billing

| Feature | Command | Description |
|---------|---------|-------------|
| **Stripe** | `theo add stripe` | Stripe payments + webhooks |
| **Subscriptions** | `theo add subscriptions` | Recurring billing (requires Stripe) |

#### Monitoring & Analytics

| Feature | Command | Description |
|---------|---------|-------------|
| **Analytics** | `theo add analytics` | Posthog/Plausible integration |
| **Error Tracking** | `theo add sentry` | Sentry error tracking |
| **Logging** | `theo add logging` | Structured logging (Pino) |

#### Admin & Tools

| Feature | Command | Description |
|---------|---------|-------------|
| **Admin Panel** | `theo add admin-panel` | Admin UI (React Admin) |
| **Feature Flags** | `theo add feature-flags` | LaunchDarkly integration |
| **Background Jobs** | `theo add jobs` | BullMQ + Redis |

### UI Components

Add UI components to your project (copy-paste, shadcn-style):

```bash
# Add individual components
theo add-ui button
theo add-ui form
theo add-ui data-table
theo add-ui dialog

# Add multiple components
theo add-ui button form dialog
```

**Component Library:**
- Built with **Radix UI** primitives
- Styled with **Tailwind CSS**
- Fully customizable (code is **yours**)
- Accessible by default (ARIA compliant)

---

## 🔧 Configuration

### Theo Platform Configuration

```typescript
// theo.config.ts
import { defineTheoConfig } from '@theo/core'

export default defineTheoConfig({
  // App metadata
  app: {
    name: 'my-app',
    version: '1.0.0',
  },

  // Build configuration
  build: {
    outputDir: 'dist',
    cache: true,
  },

  // Deployment
  deploy: {
    region: 'nyc3',
    replicas: 2,
    resources: {
      cpu: '500m',
      memory: '512Mi',
    },
  },

  // Environment variables (auto-injected)
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
  },

  // Features (managed by `theo add`)
  features: [
    // Added automatically when you run `theo add <feature>`
  ],
})
```

### Environment Variables

Create `.env.local` file:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# JWT (generate with: openssl rand -base64 32)
JWT_SECRET="your-secret-key"

# Optional: OAuth (if using auth feature)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Optional: Stripe (if using payments)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

---

## 📚 Development Workflow

### Common Commands

```bash
# Install dependencies
pnpm install

# Development (all apps)
pnpm dev

# Build (production)
pnpm build

# Lint
pnpm lint

# Type check
pnpm type-check

# Run tests
pnpm test

# Clean build cache
pnpm clean
```

### Turborepo Tasks

```bash
# Run specific task in specific app
turbo run dev --filter=web
turbo run build --filter=api
turbo run test --filter=shared

# Run task in all packages
turbo run lint

# Clear Turborepo cache
turbo run clean
```

### Adding New Features

```bash
# 1. Add feature via CLI (recommended)
theo add auth

# 2. Or manually install integration
pnpm add @theo/auth
# Then configure in theo.config.ts
```

### Creating Custom Generators

Create local generators for your team's patterns:

```typescript
// .theo/generators/my-feature/generator.ts
import { defineGenerator } from '@theo/cli'

export default defineGenerator({
  name: 'my-feature',
  description: 'Add custom feature',

  async generate(tree, options) {
    // Add files
    tree.generateFiles({
      template: './templates',
      target: './src/features/my-feature',
    })

    // Add dependencies
    tree.addDependencies({
      'some-package': '^1.0.0',
    })

    console.log('✅ Feature added!')
  },
})
```

Run your generator:

```bash
theo add my-feature
```

---

## 🚢 Deployment

### Deploy to Theo Platform

```bash
# 1. Login
theo login

# 2. Deploy (builds & deploys automatically)
theo deploy

# 3. Monitor
theo logs --tail
theo status
```

### Configuration

```yaml
# theo.yaml (auto-generated)
app:
  id: my-app
  name: My App
  runtime: nodejs

environments:
  production:
    replicas: 2
    resources:
      cpu: "500m"
      memory: "512Mi"
    env:
      NODE_ENV: production

  staging:
    replicas: 1
    resources:
      cpu: "250m"
      memory: "256Mi"
```

### CI/CD

GitHub Actions example:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Theo

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install Theo CLI
        run: npm install -g @theo/cli

      - name: Deploy
        run: theo deploy --env production
        env:
          THEO_TOKEN: ${{ secrets.THEO_TOKEN }}
```

---

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

### E2E Tests

```bash
# Run E2E tests
pnpm test:e2e
```

### Example Test

```typescript
// apps/api/src/app.controller.spec.ts
import { Test } from '@nestjs/testing'
import { AppController } from './app.controller'

describe('AppController', () => {
  let controller: AppController

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AppController],
    }).compile()

    controller = module.get(AppController)
  })

  it('should return "Hello World!"', () => {
    expect(controller.getHello()).toBe('Hello World!')
  })
})
```

---

## 📖 Documentation

### Official Docs

- **Theo Platform:** [docs.usetheo.dev](https://docs.usetheo.dev)
- **CLI Reference:** [docs.usetheo.dev/cli](https://docs.usetheo.dev/cli)
- **API Reference:** [docs.usetheo.dev/api](https://docs.usetheo.dev/api)

### Architecture Decisions

- [ADR-001: Hybrid Distribution Strategy](./docs/adr/ADR-001-hybrid-distribution.md)
- [ADR-002: AST Transformations](./docs/adr/ADR-002-ast-transformations.md)
- [ADR-003: Git-First Transparency](./docs/adr/ADR-003-git-transparency.md)
- [ADR-004: Idempotent Generators](./docs/adr/ADR-004-idempotent-generators.md)
- [ADR-005: Virtual Filesystem](./docs/adr/ADR-005-virtual-filesystem.md)

### Community

- **GitHub:** [github.com/usetheo/platform](https://github.com/usetheo/platform)
- **Discord:** [discord.gg/theo](https://discord.gg/theo)
- **Twitter:** [@usetheohq](https://twitter.com/usetheohq)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone repo
git clone https://github.com/usetheo/theo-boilerplate
cd theo-boilerplate

# Install dependencies
pnpm install

# Run in dev mode
pnpm dev

# Run tests
pnpm test
```

---

## 📝 License

MIT © [Theo Platform](https://usetheo.dev)

---

## 🙏 Acknowledgments

This project is inspired by excellent work from:

- [shadcn/ui](https://ui.shadcn.com) - Copy-paste component architecture
- [create-t3-app](https://create.t3.gg) - Modular installer system
- [Nx](https://nx.dev) - Generator API and Tree abstraction
- [Blitz.js](https://blitzjs.com) - Recipe system
- [Astro](https://astro.build) - Integration hooks

---

## 🗺️ Roadmap

### v1.0 (Current)

- [x] Minimal boilerplate (Vite + NestJS)
- [x] Turborepo + pnpm workspaces
- [x] Basic CLI (`theo deploy`)
- [ ] Feature system (`theo add <feature>`)
- [ ] UI component registry (`theo add-ui <component>`)

### v1.1 (Next)

- [ ] Auth feature (JWT + OAuth + RBAC)
- [ ] Database feature (Prisma + PostgreSQL)
- [ ] Email feature (Resend)
- [ ] Stripe payments feature
- [ ] Admin panel feature

### v2.0 (Future)

- [ ] Multiple templates (Next.js, Nuxt, Remix)
- [ ] Custom generator API
- [ ] Integration hooks (Astro-style)
- [ ] VitePress documentation site
- [ ] Example apps (blog, dashboard, e-commerce)

---

## 📊 Status

**Current Version:** 0.1.0 (Alpha)
**Status:** 🚧 Under Active Development
**Production Ready:** ❌ Not Yet (use for testing only)

---

**Built with ❤️ by the Theo Platform team**
