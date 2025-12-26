# ADR-003: Git-First Transparency

**Status:** Accepted
**Date:** 2025-11-27
**Deciders:** Theo Platform Team
**Technical Story:** How to show developers what generators change in their codebase

---

## Context and Problem Statement

When running `theo add auth`, the generator modifies the codebase by:
- Creating new files
- Modifying existing files
- Adding dependencies
- Updating configuration

**Question:** How do we ensure developers understand and trust what generators do to their code?

---

## Decision Drivers

- **Trust** - Developers must trust generators won't break their code
- **Transparency** - Changes must be visible and reviewable
- **Safety** - Easy to rollback if something goes wrong
- **Auditability** - Changes should be tracked in version control
- **Developer Control** - Developers should validate before committing

---

## Considered Options

### Option 1: Silent Execution (No Git Requirement)

**How it works:**
```bash
theo add auth
# ✅ Auth feature added!
# (No indication of what changed)
```

**Pros:**
- ✅ Fast and frictionless
- ✅ Works in any state (dirty git, no git)
- ✅ No interruptions

**Cons:**
- ❌ **No transparency** - Developer doesn't see changes
- ❌ **Trust issues** - "What did it just do?"
- ❌ **Hard to debug** - If something breaks, hard to trace
- ❌ **No rollback** - Can't easily undo changes

**Risk:** Developers lose trust in generators.

---

### Option 2: Git Required + Auto-Commit

**How it works:**
```bash
theo add auth
# Auto-commits changes with message:
# "feat: add auth feature via theo generator"
```

**Pros:**
- ✅ Changes tracked in git history
- ✅ Easy to review via `git show`
- ✅ Can rollback via `git revert`

**Cons:**
- ❌ **Auto-commit is opinionated** - Forces commit message style
- ❌ **Loss of control** - Developer can't review before committing
- ❌ **Pollutes history** - Generator commits mixed with developer commits

**Risk:** Developers feel generators are too "magic" and controlling.

---

### Option 3: **Git Required + Show Diff** (Recommended - Blitz.js Style)

**How it works:**
```bash
theo add auth

# ⚠️  Working directory not clean. Please commit or stash changes first.
# Run: git status

# (after git is clean)

theo add auth

# ✅ Auth feature added!
#
# 📝 Changes made:
#   Created:
#     src/auth/auth.module.ts
#     src/auth/auth.controller.ts
#     src/auth/auth.service.ts
#   Modified:
#     src/app.module.ts
#     package.json
#
# 🔍 Review changes:
#   git diff
#   git diff --staged (if using --stage flag)
#
# ✅ If looks good, commit:
#   git add .
#   git commit -m "feat: add authentication feature"
#
# ❌ To undo:
#   git restore .
```

**Pros:**
- ✅ **Full transparency** - Developer sees all changes via git diff
- ✅ **Developer control** - Review before committing
- ✅ **Git workflow** - Fits standard development workflow
- ✅ **Easy rollback** - `git restore .` undoes everything
- ✅ **Trust building** - "I can see exactly what it did"

**Cons:**
- ❌ **Friction** - Requires clean git state
- ⚠️ **Learning curve** - Developers need to understand git

**Community Validation:** Blitz.js uses this approach successfully. Developers appreciate transparency.

---

### Option 4: Dry-Run Mode (Optional)

**Enhancement to Option 3:**
```bash
# Preview changes without applying
theo add auth --dry-run

# 📋 Would make these changes:
#   Create: src/auth/auth.module.ts (120 lines)
#   Create: src/auth/auth.controller.ts (45 lines)
#   Modify: src/app.module.ts (+3 lines)
#   Add dependency: @nestjs/jwt@^10.0.0
#
# Run without --dry-run to apply changes
```

**Pros:**
- ✅ **Zero risk preview** - See changes before applying
- ✅ **Educational** - Learn what generator does
- ✅ **Debugging** - Identify issues before execution

**Cons:**
- ⚠️ **Implementation complexity** - Need virtual filesystem

---

## Decision Outcome

**Chosen option:** Option 3 (Git Required + Show Diff) + Option 4 (Dry-Run)

**Implementation:**

```typescript
// @theo/cli implementation
async function runGenerator(generatorName: string, options: Options) {
  // 1. Check git status
  if (!isGitClean() && !options.force) {
    Logger.error('Working directory not clean.')
    Logger.info('Please commit or stash changes first.')
    Logger.info('Or use --force to proceed anyway.')
    process.exit(1)
  }

  // 2. Run generator
  const tree = new VirtualTree() // Virtual filesystem
  await generator.generate(tree, options)

  // 3. Show dry-run preview
  if (options.dryRun) {
    Logger.info('📋 Would make these changes:')
    tree.changes.forEach(change => {
      Logger.info(`  ${change.type}: ${change.path}`)
    })
    Logger.info('\nRun without --dry-run to apply changes.')
    return
  }

  // 4. Apply changes
  tree.commitChanges()

  // 5. Show what changed
  Logger.success('✅ Feature added successfully!')
  Logger.info('\n📝 Changes made:')

  const created = tree.changes.filter(c => c.type === 'create')
  const modified = tree.changes.filter(c => c.type === 'modify')

  if (created.length > 0) {
    Logger.info('  Created:')
    created.forEach(c => Logger.info(`    ${c.path}`))
  }

  if (modified.length > 0) {
    Logger.info('  Modified:')
    modified.forEach(c => Logger.info(`    ${c.path}`))
  }

  // 6. Guide next steps
  Logger.info('\n🔍 Review changes:')
  Logger.info('  git diff')
  Logger.info('\n✅ If looks good, commit:')
  Logger.info('  git add .')
  Logger.info('  git commit -m "feat: add <feature>"')
  Logger.info('\n❌ To undo:')
  Logger.info('  git restore .')
}
```

---

## Consequences

### Positive

- ✅ **Trust** - Developers can see exactly what changed
- ✅ **Control** - Review before committing
- ✅ **Safety** - Easy rollback via git
- ✅ **Git-native** - Fits standard workflow
- ✅ **Dry-run** - Preview without risk

### Negative

- ❌ **Friction** - Requires clean git state
- ⚠️ **Education** - Need to communicate why git is required

### Mitigation

1. **Clear error messages** - Explain why git clean is required
2. **--force flag** - Bypass check for advanced users
3. **Documentation** - Explain benefits in docs
4. **Onboarding** - CLI hints guide developers

---

## User Experience Examples

### Success Flow

```bash
$ theo add auth

✅ Auth feature added successfully!

📝 Changes made:
  Created:
    src/auth/auth.module.ts
    src/auth/auth.controller.ts
    src/auth/auth.service.ts
    src/auth/guards/jwt.guard.ts
  Modified:
    src/app.module.ts (+5 lines)
    package.json (+2 dependencies)

🔍 Review changes:
  git diff

✅ If looks good, commit:
  git add .
  git commit -m "feat: add authentication feature"

❌ To undo:
  git restore .
```

### Error Flow (Dirty Git)

```bash
$ theo add auth

❌ Error: Working directory is not clean.

You have uncommitted changes. Please commit or stash them first.

Uncommitted files:
  modified: src/app.module.ts
  modified: package.json

Options:
  1. Commit changes:
     git add .
     git commit -m "your message"

  2. Stash changes:
     git stash

  3. Force run (not recommended):
     theo add auth --force

Why is this required?
  • Generators modify your codebase
  • Git makes changes transparent and reversible
  • You can review via 'git diff' before committing
  • Easy rollback via 'git restore .' if needed
```

### Dry-Run Flow

```bash
$ theo add auth --dry-run

📋 Dry-run mode: No changes will be made

Would create:
  src/auth/auth.module.ts (143 lines)
  src/auth/auth.controller.ts (67 lines)
  src/auth/auth.service.ts (89 lines)
  src/auth/guards/jwt.guard.ts (34 lines)
  src/auth/strategies/jwt.strategy.ts (45 lines)

Would modify:
  src/app.module.ts
    + import { AuthModule } from './auth/auth.module'
    + imports: [..., AuthModule]

  package.json
    + "@nestjs/jwt": "^10.0.0"
    + "@nestjs/passport": "^10.0.0"

Would run:
  pnpm install (to install new dependencies)
  prisma generate (to update Prisma client)

Run without --dry-run to apply these changes.
```

---

## Validation

**Test cases:**

1. ✅ Blocks execution if git dirty? **Yes**
2. ✅ Shows clear error message? **Yes**
3. ✅ Lists changes after execution? **Yes**
4. ✅ Guides next steps? **Yes**
5. ✅ Easy to rollback? **Yes** (git restore .)
6. ✅ Dry-run preview works? **Yes**

---

## Related Decisions

- [ADR-001: Hybrid Distribution Strategy](./ADR-001-hybrid-distribution.md) - Overall architecture
- [ADR-004: Idempotent Generators](./ADR-004-idempotent-generators.md) - Re-runnable generators
- [ADR-005: Virtual Filesystem](./ADR-005-virtual-filesystem.md) - Enables dry-run

---

## References

- [Blitz Recipes](https://blitzjs.com/docs/writing-recipes) - Git-first approach
- [Git Best Practices](https://git-scm.com/book/en/v2) - Version control
- [CLI UX Guide](https://clig.dev/) - Command-line interface guidelines

---

**Last Updated:** 2025-11-27
**Author:** Theo Platform Team
**Status:** ✅ Accepted
