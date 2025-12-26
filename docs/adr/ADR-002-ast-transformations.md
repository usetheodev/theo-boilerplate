# ADR-002: AST Transformations - When and How

**Status:** Accepted
**Date:** 2025-11-27
**Deciders:** Theo Platform Team
**Technical Story:** Deciding when to use AST transformations vs template-based file generation

---

## Context and Problem Statement

When generating code for features (`theo add auth`), we can either:
1. **Create new files** from templates (simple, predictable)
2. **Modify existing files** via AST transformations (powerful, complex)

**Question:** Should we use AST transformations for all code generation, or only when absolutely necessary?

---

## Decision Drivers

- **Simplicity** - Easier to develop and maintain
- **Power** - Ability to modify existing code precisely
- **Developer Experience** - Authors creating generators need good DX
- **Debugging** - Must be debuggable when things go wrong
- **Type Safety** - Modifications should be type-aware
- **Learning Curve** - New contributors can understand the system

---

## Considered Options

### Option 1: Templates Only (Redwood Style)

**How it works:**
```typescript
// Generator just creates new files
generator.generateFiles({
  template: './templates',
  target: './src/features/auth'
})
```

**Pros:**
- ✅ Simple to understand and debug
- ✅ Predictable output
- ✅ Low learning curve
- ✅ Works for 80% of cases

**Cons:**
- ❌ Cannot modify existing files
- ❌ Cannot add imports to existing code
- ❌ Manual integration required by developer

**Example Limitation:**
```typescript
// Can't automatically add this to existing app.module.ts:
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [AuthModule] // ← Can't inject this
})
```

---

### Option 2: AST Everywhere (Blitz Recipes Style)

**How it works:**
```typescript
// Use jscodeshift for all code generation
generator.transform('src/app.module.ts', (file, api) => {
  const j = api.jscodeshift
  const root = j(file.source)

  // Add import
  root.find(j.ImportDeclaration)
    .at(-1)
    .insertAfter(
      j.importDeclaration(
        [j.importSpecifier(j.identifier('AuthModule'))],
        j.literal('./auth/auth.module')
      )
    )

  // Add to imports array
  // ... complex AST manipulation

  return root.toSource()
})
```

**Pros:**
- ✅ Can modify any code
- ✅ Type-aware transformations possible
- ✅ Powerful refactoring capabilities

**Cons:**
- ❌ High complexity
- ❌ Steep learning curve (AST APIs are hard)
- ❌ Difficult to debug
- ❌ Brittle (breaks with code structure changes)
- ❌ Overkill for simple file creation

**Research:** Blitz.js used jscodeshift extensively, but community feedback indicated it was **too complex** for most contributors.

---

### Option 3: **Hybrid - Templates First, AST When Needed** (Recommended)

**How it works:**
- **Default:** Use templates for creating new files
- **Only use AST** when you need to modify existing files

**Example:**
```typescript
import { defineGenerator, Tree } from '@theo/cli'

export default defineGenerator({
  name: 'auth',

  async generate(tree: Tree) {
    // 1. Create new files (templates)
    tree.generateFiles({
      template: './templates/auth',
      target: './src/auth'
    })

    // 2. Modify existing file (AST - when necessary)
    tree.modifyFile('src/app.module.ts', (source) => {
      return addModuleImport(source, 'AuthModule', './auth/auth.module')
    })

    // 3. Helper abstracts AST complexity
    function addModuleImport(source, moduleName, path) {
      // Internal implementation uses jscodeshift
      // But generator author doesn't need to know AST APIs
    }
  }
})
```

**Pros:**
- ✅ Simple for 80% (templates)
- ✅ Powerful for 20% (AST when needed)
- ✅ **Helper functions** abstract AST complexity
- ✅ Generator authors don't need to learn AST
- ✅ Core team maintains AST helpers

**Cons:**
- ❌ Need to maintain AST helper library
- ⚠️ Risk of helpers not covering all cases

---

## Decision Outcome

**Chosen option:** Option 3 (Hybrid - Templates First, AST When Needed)

**Rationale:**
- **80/20 rule:** 80% of generators just create files (templates are perfect)
- **20% complexity:** Only modify existing files when absolutely necessary
- **Developer-friendly:** Helpers like `addModuleImport()` abstract AST complexity
- **Extensible:** Advanced users can still use raw jscodeshift if needed
- **Community validation:** Nx successfully uses this hybrid approach

---

## Implementation Strategy

### AST Helper Functions (Provided by @theo/cli)

```typescript
// @theo/cli exports these helpers
import { Tree, addImport, addToArray, addToObject } from '@theo/cli'

tree.modifyFile('src/app.module.ts', (source) => {
  // Helper 1: Add import statement
  source = addImport(source, {
    named: ['AuthModule'],
    from: './auth/auth.module'
  })

  // Helper 2: Add to array (e.g., imports: [...])
  source = addToArray(source, {
    object: 'Module',
    property: 'imports',
    value: 'AuthModule'
  })

  return source
})
```

### When to Use AST

**✅ Use AST when:**
- Adding imports to existing files
- Adding items to arrays/objects (Module.imports, providers, etc.)
- Modifying configuration files programmatically
- Refactoring code structure

**❌ Don't use AST when:**
- Creating new files (use templates)
- Generating boilerplate (use templates)
- Simple string replacement (use string operations)

### Escape Hatch

Advanced users can still use raw jscodeshift:

```typescript
tree.modifyFile('src/complex.ts', (source) => {
  const j = require('jscodeshift')
  const root = j(source)

  // Raw jscodeshift manipulation
  // ...

  return root.toSource()
})
```

---

## Consequences

### Positive

- ✅ **Low barrier to entry** - Templates for common cases
- ✅ **Powerful when needed** - AST for complex modifications
- ✅ **Maintainable** - Helper functions tested by core team
- ✅ **Debuggable** - Templates are easy to debug, helpers have clear errors

### Negative

- ❌ **Helper maintenance** - Core team must maintain AST helper library
- ⚠️ **Incomplete coverage** - Helpers may not cover all AST use cases

### Mitigation

1. **Document helpers** - Clear docs with examples
2. **Escape hatch** - Raw jscodeshift always available
3. **Community feedback** - Add helpers based on real requests
4. **Testing** - Comprehensive tests for all helpers

---

## Validation

**Test cases:**

1. ✅ Can generate new files? **Yes** (templates)
2. ✅ Can add imports to existing files? **Yes** (addImport helper)
3. ✅ Can modify NestJS modules? **Yes** (addToArray helper)
4. ✅ Easy for beginners? **Yes** (templates + helpers)
5. ✅ Powerful for advanced cases? **Yes** (raw jscodeshift escape hatch)

---

## Examples

### Example 1: Simple Generator (Templates Only)

```typescript
// theo add email
export default defineGenerator({
  name: 'email',

  async generate(tree) {
    // Just create files - no AST needed
    tree.generateFiles({
      template: './templates/email',
      target: './src/email'
    })
  }
})
```

### Example 2: Complex Generator (Templates + AST)

```typescript
// theo add auth
export default defineGenerator({
  name: 'auth',

  async generate(tree) {
    // 1. Create auth module files (templates)
    tree.generateFiles({
      template: './templates/auth',
      target: './src/auth'
    })

    // 2. Add to app.module.ts (AST helper)
    tree.modifyFile('src/app.module.ts', (source) => {
      source = addImport(source, {
        named: ['AuthModule'],
        from: './auth/auth.module'
      })

      source = addToArray(source, {
        decorator: 'Module',
        property: 'imports',
        value: 'AuthModule'
      })

      return source
    })

    // 3. Add to main.ts (string operation)
    tree.modifyFile('src/main.ts', (source) => {
      // Simple string insertion (no AST needed)
      return source.replace(
        'await app.listen(3000)',
        'app.enableCors()\n  await app.listen(3000)'
      )
    })
  }
})
```

---

## Related Decisions

- [ADR-001: Hybrid Distribution Strategy](./ADR-001-hybrid-distribution.md) - Overall architecture
- [ADR-004: Idempotent Generators](./ADR-004-idempotent-generators.md) - Re-runnable generators
- [ADR-005: Virtual Filesystem](./ADR-005-virtual-filesystem.md) - Tree API for staging changes

---

## References

- [jscodeshift Documentation](https://github.com/facebook/jscodeshift) - AST transformation tool
- [ts-morph](https://ts-morph.com/) - TypeScript AST manipulation (alternative)
- [Nx AST Utilities](https://nx.dev/recipes/generators/ast-utils) - Helper functions
- [Blitz Recipes](https://blitzjs.com/docs/writing-recipes) - jscodeshift usage

---

**Last Updated:** 2025-11-27
**Author:** Theo Platform Team
**Status:** ✅ Accepted
