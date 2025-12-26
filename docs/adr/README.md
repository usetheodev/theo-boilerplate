# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records for the Theo Boilerplate project.

## What are ADRs?

Architecture Decision Records (ADRs) are documents that capture important architectural decisions made along with their context and consequences.

**Format:** We follow the [MADR](https://adr.github.io/madr/) (Markdown Any Decision Records) template.

---

## Index

### Core Architecture

- [ADR-001: Hybrid Distribution Strategy](./ADR-001-hybrid-distribution.md) ✅ **Accepted**
  - **Decision:** Use hybrid approach (scaffold + generators + copy-paste + npm)
  - **Why:** No single strategy covers all use cases
  - **Inspired by:** shadcn/ui, create-t3-app, Nx, Astro

- [ADR-002: AST Transformations - When and How](./ADR-002-ast-transformations.md) ✅ **Accepted**
  - **Decision:** Templates first, AST only when necessary
  - **Why:** 80% of generators just create files (templates sufficient)
  - **Inspired by:** Nx, Blitz.js

- [ADR-003: Git-First Transparency](./ADR-003-git-transparency.md) ✅ **Accepted**
  - **Decision:** Require clean git + show diffs + dry-run mode
  - **Why:** Trust and transparency are critical for adoption
  - **Inspired by:** Blitz.js recipes

- [ADR-004: Idempotent Generators](./ADR-004-idempotent-generators.md) ✅ **Accepted**
  - **Decision:** Generators detect existing installations and skip gracefully
  - **Why:** Safety first - never lose developer's code
  - **Inspired by:** Ansible, Nx

- [ADR-005: Virtual Filesystem (Tree API)](./ADR-005-virtual-filesystem.md) ✅ **Accepted**
  - **Decision:** Use virtual filesystem for atomic operations
  - **Why:** Enables dry-run, testing, and atomic commits
  - **Inspired by:** Nx Tree API, Angular Schematics

---

## Status Legend

- ✅ **Accepted** - Decision approved and being implemented
- 🚧 **Proposed** - Under discussion
- ❌ **Rejected** - Considered but not chosen
- 📦 **Deprecated** - Previously accepted, now obsolete
- ♻️ **Superseded** - Replaced by newer ADR

---

## Decision Process

### When to Create an ADR

Create an ADR when:
- Making architectural decisions that are hard to reverse
- Choosing between multiple viable options
- Making decisions that affect developer experience
- Introducing new patterns or paradigms

### ADR Template

Use this template for new ADRs:

```markdown
# ADR-XXX: Title

**Status:** [Proposed|Accepted|Rejected|Deprecated]
**Date:** YYYY-MM-DD
**Deciders:** Team/Person
**Technical Story:** Brief context

## Context and Problem Statement

What problem are we trying to solve?

## Decision Drivers

- Driver 1
- Driver 2

## Considered Options

### Option 1: Name

**How it works:** ...

**Pros:**
- ✅ Pro 1

**Cons:**
- ❌ Con 1

### Option 2: Name (Recommended)

...

## Decision Outcome

**Chosen option:** Option 2

**Rationale:** Why this option?

## Consequences

### Positive
- ✅ Benefit 1

### Negative
- ❌ Cost 1

### Mitigation
- How we address negative consequences

## Related Decisions

- Link to related ADRs

## References

- Links to research, docs, etc.
```

---

## Research

All ADRs are backed by comprehensive research:

- [Package Distribution Research](../research/package-distribution-research.md) - Analysis of 8 major open-source projects
  - shadcn/ui (180k ⭐)
  - create-t3-app (25k ⭐)
  - Nx (23k ⭐)
  - Blitz.js (13k ⭐)
  - RedwoodJS (17k ⭐)
  - Remix (29k ⭐)
  - Astro (46k ⭐)
  - Nuxt (54k ⭐)

---

## Contributing

### Proposing a New ADR

1. Copy the template above
2. Create file: `ADR-XXX-short-title.md`
3. Fill in all sections
4. Set status to **Proposed**
5. Open PR for team review
6. After approval, update status to **Accepted**

### Updating an Existing ADR

ADRs should be immutable once accepted. If context changes:

1. Create a new ADR that supersedes the old one
2. Mark old ADR as **Superseded**
3. Link new ADR in old ADR's header

**Example:**
```markdown
# ADR-001: Old Decision

**Status:** ♻️ Superseded by [ADR-010](./ADR-010-new-decision.md)
```

---

## Further Reading

- [Architecture Decision Records](https://adr.github.io/) - ADR overview
- [MADR Template](https://adr.github.io/madr/) - Format we use
- [When to Write an ADR](https://github.com/joelparkerhenderson/architecture-decision-record#when-to-write-an-adr)

---

**Last Updated:** 2025-11-27
**Maintained by:** Theo Platform Team
