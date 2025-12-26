# ADR-001: Hybrid Distribution Strategy

**Status:** Accepted
**Date:** 2025-11-27
**Deciders:** Theo Platform Team
**Technical Story:** Feature distribution architecture for Theo Boilerplate

---

## Context and Problem Statement

Theo Platform needs a robust system for distributing features/add-ons to boilerplate projects. The system must support multiple use cases:

1. **One-time scaffolding** - Creating new projects with selected features
2. **Incremental feature addition** - Adding features to existing projects
3. **UI component distribution** - Copy-paste components (shadcn-style)
4. **Runtime integrations** - npm packages that need updates

**Question:** Should we use a single distribution strategy (npm packages, templates, generators) or a hybrid approach?

---

## Decision Drivers

- **Developer Experience** - Must be intuitive and frictionless
- **Flexibility** - Support multiple use cases (scaffold, add features, UI)
- **Maintenance** - Easy to update and maintain over time
- **Ownership** - Developers need control over generated code
- **Updates** - Some features need updates (security), others don't
- **Community Standards** - Follow best practices from leading projects

---

## Considered Options

### Option 1: npm Packages Only (Astro/Nuxt Style)

**How it works:**
```bash
pnpm add @theo/auth @theo/stripe
```

**Pros:**
- ✅ Easy versioning and updates
- ✅ Single source of truth
- ✅ npm ecosystem benefits (caching, security audits)

**Cons:**
- ❌ Vendor lock-in (difficult to customize deeply)
- ❌ Bundle bloat (unused code in packages)
- ❌ Breaking changes on updates

**Research:** Astro Integrations, Nuxt Modules use this approach successfully for runtime integrations.

---

### Option 2: Copy-Paste Templates Only (shadcn/ui Style)

**How it works:**
```bash
theo add-ui button
# Copies code to your project
```

**Pros:**
- ✅ Total ownership (code is yours)
- ✅ Zero vendor lock-in
- ✅ Customizable without limits
- ✅ AI-friendly (LLMs can read/modify)

**Cons:**
- ❌ No automatic updates
- ❌ Code divergence over time
- ❌ Duplication across projects

**Research:** shadcn/ui pioneered this approach. 180k+ GitHub stars prove developer love for code ownership.

---

### Option 3: One-Time Scaffold (create-t3-app Style)

**How it works:**
```bash
npx create-theo-app
# Select features via prompts
# Generates project once
```

**Pros:**
- ✅ Simple mental model (one decision)
- ✅ Opinionated (decisions made for you)
- ✅ Fast time-to-first-code

**Cons:**
- ❌ Can't add features later
- ❌ All-or-nothing at creation
- ❌ Inflexible for iterative development

**Research:** create-t3-app uses this successfully for initial scaffolding. 25k+ GitHub stars.

---

### Option 4: **Hybrid Approach** (Recommended)

**How it works:**
- **One-time scaffold** for initial project creation (`create-theo-app`)
- **Re-runnable generators** for adding features (`theo add auth`)
- **Copy-paste registry** for UI components (`theo add-ui button`)
- **npm integrations** for runtime features that need updates

**Pros:**
- ✅ **Flexibility:** Right tool for each use case
- ✅ **DX optimized:** Each approach used where it excels
- ✅ **Future-proof:** Can evolve each strategy independently
- ✅ **Community proven:** Combines best of shadcn, T3, Nx, Astro

**Cons:**
- ❌ **Complexity:** Four systems to maintain
- ❌ **Documentation:** Must explain when to use each
- ❌ **Learning curve:** Developers need to understand differences

**Research:**
- **shadcn/ui:** 180k stars - proves copy-paste works for UI
- **create-t3-app:** 25k stars - proves modular scaffold works
- **Nx:** 23k stars - proves generators work for code generation
- **Astro:** 46k stars - proves npm integrations work for runtime

---

## Decision Outcome

**Chosen option:** Option 4 (Hybrid Approach)

**Rationale:**
- No single approach covers all use cases well
- Leading projects (shadcn, T3, Nx, Astro) each excel at different strategies
- Hybrid approach allows us to use the **right tool for each job**:
  - **Initial scaffold:** create-t3-app style (modular one-time generation)
  - **Feature addition:** Nx-style generators (re-runnable, idempotent)
  - **UI components:** shadcn-style (copy-paste for ownership)
  - **Runtime integrations:** Astro-style (npm packages for updates)

**Implementation:**

| Use Case | Strategy | Inspiration | Why |
|----------|----------|-------------|-----|
| **Initial project** | One-time modular scaffold | create-t3-app | Fast start, opinionated defaults |
| **Add features** | Re-runnable generators | Nx | Flexibility, can add incrementally |
| **UI components** | Copy-paste registry | shadcn/ui | Ownership, customization, AI-friendly |
| **Runtime integrations** | npm packages | Astro/Nuxt | Updates, security patches |

---

## Consequences

### Positive

- ✅ **Best DX** - Each approach used where it works best
- ✅ **Flexibility** - Supports all workflows (scaffold, add, customize, update)
- ✅ **Future-proof** - Can evolve each strategy independently
- ✅ **Community validation** - Each approach proven by major projects

### Negative

- ❌ **Complexity** - Maintaining 4 systems instead of 1
- ❌ **Documentation burden** - Must clearly explain when to use what
- ❌ **Learning curve** - Developers need to understand nuances

### Mitigation Strategies

1. **Clear documentation** - Decision tree for "which approach to use"
2. **CLI hints** - `theo help` explains options clearly
3. **Sensible defaults** - Auto-select right approach based on context
4. **Unified interface** - `theo add` works for all (internally delegates)

---

## Validation

**Questions to validate this decision:**

1. ✅ Does it support initial scaffolding? **Yes** (create-theo-app)
2. ✅ Can features be added later? **Yes** (theo add <feature>)
3. ✅ Do developers own the code? **Yes** (copy-paste for UI, generators for features)
4. ✅ Can security updates be pushed? **Yes** (npm integrations where needed)
5. ✅ Is it proven by community? **Yes** (4 major projects use components of this)

---

## Related Decisions

- [ADR-002: AST Transformations](./ADR-002-ast-transformations.md) - When to use AST vs templates
- [ADR-003: Git-First Transparency](./ADR-003-git-transparency.md) - How to show changes
- [ADR-004: Idempotent Generators](./ADR-004-idempotent-generators.md) - How to make generators re-runnable
- [ADR-005: Virtual Filesystem](./ADR-005-virtual-filesystem.md) - How to stage changes

---

## References

- [shadcn/ui Architecture](https://ui.shadcn.com/docs/registry) - Copy-paste approach
- [create-t3-app Source](https://github.com/t3-oss/create-t3-app) - Modular scaffold
- [Nx Generators](https://nx.dev/extending-nx/recipes/local-generators) - Generator system
- [Astro Integrations API](https://docs.astro.build/en/reference/integrations-reference/) - npm integrations
- [Research Report](../research/package-distribution-research.md) - Full analysis of 8 projects

---

**Last Updated:** 2025-11-27
**Author:** Theo Platform Team
**Status:** ✅ Accepted and Implemented
