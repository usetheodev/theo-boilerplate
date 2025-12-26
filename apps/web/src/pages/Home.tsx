import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight">
            Theo Boilerplate
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Professional full-stack TypeScript boilerplate with{' '}
            <span className="font-semibold text-primary">Vite + React</span> and{' '}
            <span className="font-semibold text-primary">NestJS</span>
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">🔐 Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Complete auth system with JWT, OAuth (Google, GitHub), and RBAC
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">⚡ Vite + React</h3>
              <p className="text-sm text-muted-foreground">
                Lightning-fast HMR, optimized builds, and modern tooling
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">🛡️ Type-Safe</h3>
              <p className="text-sm text-muted-foreground">
                End-to-end TypeScript with Prisma ORM and Zod validation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
