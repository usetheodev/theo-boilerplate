# ADR-004: Idempotent Generators

**Status:** Accepted
**Date:** 2025-11-27
**Deciders:** Theo Platform Team
**Technical Story:** Making generators safely re-runnable

---

## Context and Problem Statement

When a developer runs `theo add auth` twice, what should happen?

1. **Error** - "Auth already installed"
2. **Overwrite** - Replace existing code (data loss risk)
3. **Skip** - Detect existing code and skip gracefully
4. **Update** - Smart merge of changes

**Question:** Should generators be idempotent (safely re-runnable)?

---

## Decision Drivers

- **Safety** - Never lose developer's code
- **Flexibility** - Allow re-running for updates
- **DX** - Clear feedback on what happened
- **Simplicity** - Easy for generator authors to implement
- **Error Recovery** - Allow fixing partial installations

---

## Considered Options

### Option 1: Error on Re-Run

**How it works:**
```bash
theo add auth
# ✅ Auth installed

theo add auth
# ❌ Error: Auth already installed
# Use --force to reinstall
```

**Pros:**
- ✅ Simple to implement
- ✅ Safe (prevents accidents)
- ✅ Clear error message

**Cons:**
- ❌ Cannot update/fix installation
- ❌ Inflexible for iteration
- ❌ Bad UX if installation was partial

---

### Option 2: Always Overwrite (Dangerous)

**How it works:**
```bash
theo add auth
# ✅ Auth installed

theo add auth
# ⚠️  Overwriting existing auth module...
# ✅ Auth reinstalled
```

**Pros:**
- ✅ Can update/fix installations
- ✅ Simple logic

**Cons:**
- ❌ **Data loss risk** - Overwrites customizations
- ❌ **Dangerous** - No safety net
- ❌ **Trust issues** - Developers fear running commands

**Verdict:** Too risky. Rejected.

---

### Option 3: **Idempotent with Skip Detection** (Recommended)

**How it works:**
```bash
theo add auth
# ✅ Auth feature added!

theo add auth
# ℹ️  Auth already installed. Skipping.
#
# Files found:
#   ✓ src/auth/auth.module.ts
#   ✓ src/auth/auth.controller.ts
#
# Dependencies found:
#   ✓ @nestjs/jwt
#   ✓ @nestjs/passport
#
# Use --force to reinstall (will overwrite files)
```

**With --force:**
```bash
theo add auth --force
# ⚠️  Warning: This will overwrite existing files!
# ⚠️  Make sure you have committed your changes.
#
# Continue? (y/N): y
#
# ✅ Auth feature reinstalled.
```

**Pros:**
- ✅ **Safe by default** - Never loses code
- ✅ **Flexible** - Can force reinstall if needed
- ✅ **Good DX** - Clear feedback
- ✅ **Error recovery** - Can fix broken installations with --force

**Cons:**
- ⚠️ **Detection logic** - Generator authors must implement checks
- ⚠️ **Partial installs** - Need to handle edge cases

---

### Option 4: Smart Merge (Future Enhancement)

**How it works:**
- Detect existing installation
- Compare with latest version
- Only update changed files
- Preserve customizations

**Example:**
```bash
theo add auth
# ℹ️  Auth v1.0 already installed.
# 📦 Auth v1.2 is available.
#
# Updates:
#   • src/auth/auth.service.ts (security fix)
#   • src/auth/guards/jwt.guard.ts (new feature)
#
# Your customizations in auth.controller.ts will be preserved.
#
# Update? (Y/n): y
```

**Pros:**
- ✅ **Best DX** - Automatic updates
- ✅ **Preserves customizations** - Smart merging

**Cons:**
- ❌ **Very complex** - Requires diffing + merging logic
- ❌ **V2 feature** - Too ambitious for MVP

**Decision:** Defer to V2.

---

## Decision Outcome

**Chosen option:** Option 3 (Idempotent with Skip Detection)

**Implementation:**

```typescript
// Generator implementation
import { defineGenerator, Tree } from '@theo/cli'

export default defineGenerator({
  name: 'auth',

  async generate(tree: Tree, options) {
    // 1. Check if already installed
    const alreadyInstalled = await this.checkInstalled(tree)

    if (alreadyInstalled && !options.force) {
      Logger.info('ℹ️  Auth already installed. Skipping.')
      Logger.info('\nFiles found:')
      Logger.info('  ✓ src/auth/auth.module.ts')
      Logger.info('  ✓ src/auth/auth.controller.ts')
      Logger.info('\nUse --force to reinstall.')
      return
    }

    if (alreadyInstalled && options.force) {
      Logger.warn('⚠️  Reinstalling auth (will overwrite files)')
    }

    // 2. Generate files
    tree.generateFiles({
      template: './templates/auth',
      target: './src/auth'
    })

    // 3. Add dependencies (idempotent - won't duplicate)
    tree.addDependencies({
      '@nestjs/jwt': '^10.0.0',
      '@nestjs/passport': '^10.0.0'
    })

    Logger.success('✅ Auth feature installed!')
  },

  // Helper method
  async checkInstalled(tree: Tree): Promise<boolean> {
    // Check for marker files
    const markerFiles = [
      'src/auth/auth.module.ts',
      'src/auth/auth.controller.ts'
    ]

    return markerFiles.every(file => tree.exists(file))
  }
})
```

---

## Implementation Guidelines for Generator Authors

### 1. Implement `checkInstalled()`

Every generator should detect if feature is already installed:

```typescript
async checkInstalled(tree: Tree): Promise<boolean> {
  // Option A: Check for marker file
  return tree.exists('src/my-feature/index.ts')

  // Option B: Check multiple files
  const requiredFiles = ['file1.ts', 'file2.ts']
  return requiredFiles.every(f => tree.exists(f))

  // Option C: Check package.json dependency
  const pkg = tree.readJson('package.json')
  return pkg.dependencies?.['my-package'] !== undefined
}
```

### 2. Respect `options.force`

```typescript
if (alreadyInstalled && !options.force) {
  Logger.info('ℹ️  Feature already installed.')
  return // Skip gracefully
}

if (alreadyInstalled && options.force) {
  Logger.warn('⚠️  Reinstalling (will overwrite)')
}
```

### 3. Make Operations Idempotent

```typescript
// ✅ Good: Idempotent dependency addition
tree.addDependencies({
  'package-a': '^1.0.0' // Won't duplicate if already exists
})

// ✅ Good: Idempotent file creation
if (!tree.exists('src/config.ts')) {
  tree.generateFile('src/config.ts', template)
}

// ❌ Bad: Always overwrites
tree.generateFile('src/config.ts', template) // Overwrites!
```

### 4. Provide Clear Feedback

```typescript
if (alreadyInstalled) {
  Logger.info('ℹ️  Feature already installed. Skipping.')
  Logger.info('\nFound:')
  Logger.info('  ✓ src/feature/index.ts')
  Logger.info('  ✓ @my/package in package.json')
  Logger.info('\nUse --force to reinstall.')
  return
}
```

---

## Consequences

### Positive

- ✅ **Safe** - Never loses code without explicit --force
- ✅ **Flexible** - Can fix broken installations
- ✅ **Good DX** - Clear feedback on what's happening
- ✅ **Error recovery** - Easy to retry failed installations

### Negative

- ⚠️ **Generator complexity** - Authors must implement detection
- ⚠️ **Partial installs** - Need to handle edge cases
- ⚠️ **Documentation** - Must explain --force behavior

### Mitigation

1. **Helper methods** - Provide `tree.isInstalled(pattern)` helper
2. **Templates** - Generator templates include detection logic
3. **Documentation** - Clear guidelines for generator authors
4. **Testing** - Test re-run scenarios in generator tests

---

## User Experience Examples

### First Install

```bash
$ theo add auth

✅ Auth feature added successfully!

Created:
  src/auth/auth.module.ts
  src/auth/auth.controller.ts
  src/auth/auth.service.ts

Modified:
  src/app.module.ts
  package.json
```

### Re-Run (Already Installed)

```bash
$ theo add auth

ℹ️  Auth already installed. Skipping.

Files found:
  ✓ src/auth/auth.module.ts
  ✓ src/auth/auth.controller.ts
  ✓ src/auth/auth.service.ts

Dependencies found:
  ✓ @nestjs/jwt@^10.0.0
  ✓ @nestjs/passport@^10.0.0

Everything looks good! No changes needed.

Use --force to reinstall (will overwrite files).
```

### Force Reinstall

```bash
$ theo add auth --force

⚠️  Warning: Auth is already installed.
⚠️  This will overwrite existing files!

Files that will be overwritten:
  • src/auth/auth.module.ts
  • src/auth/auth.controller.ts
  • src/auth/auth.service.ts

Make sure you have committed your changes.

Continue? (y/N): y

✅ Auth feature reinstalled.

Modified:
  src/auth/auth.module.ts
  src/auth/auth.controller.ts
  src/auth/auth.service.ts
```

### Partial Install Recovery

```bash
# Scenario: First install failed midway

$ theo add auth

ℹ️  Partial installation detected.

Found:
  ✓ src/auth/auth.module.ts
  ✗ src/auth/auth.controller.ts (missing)
  ✗ src/auth/auth.service.ts (missing)

Use --force to complete installation.

$ theo add auth --force

✅ Completing auth installation...

Created:
  src/auth/auth.controller.ts
  src/auth/auth.service.ts

Updated:
  src/auth/auth.module.ts
```

---

## Validation

**Test cases:**

1. ✅ First install works? **Yes**
2. ✅ Re-run skips gracefully? **Yes**
3. ✅ --force overwrites? **Yes**
4. ✅ Shows clear feedback? **Yes**
5. ✅ Recovers from partial install? **Yes**

---

## Related Decisions

- [ADR-001: Hybrid Distribution Strategy](./ADR-001-hybrid-distribution.md) - Generator system
- [ADR-003: Git-First Transparency](./ADR-003-git-transparency.md) - Safe rollback
- [ADR-005: Virtual Filesystem](./ADR-005-virtual-filesystem.md) - File existence checks

---

## References

- [Idempotence](https://en.wikipedia.org/wiki/Idempotence) - Computer science concept
- [Nx Generators](https://nx.dev/extending-nx/recipes/local-generators) - Re-runnable generators
- [Ansible](https://docs.ansible.com/ansible/latest/user_guide/playbooks_intro.html#desired-state-and-idempotency) - Idempotent operations

---

**Last Updated:** 2025-11-27
**Author:** Theo Platform Team
**Status:** ✅ Accepted
