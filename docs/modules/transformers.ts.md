---
title: transformers.ts
nav_order: 19
parent: Modules
---

# transformers overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Model (interface)](#model-interface)
- [Model (interface)](#model-interface-1)
- [Declaration (type alias)](#declaration-type-alias)
- [printDeclaration](#printdeclaration)
- [printNode](#printnode)
- [toDeclaration](#todeclaration)
- [toExpression](#toexpression)
- [toTypeNode](#totypenode)

---

# Model (interface)

**Signature**

```ts
export interface Model {
  readonly statement: ts.VariableStatement
  readonly typeNode: O.Option<ts.TypeAliasDeclaration>
}
```

Added in v3.0.0

# Model (interface)

**Signature**

```ts
export interface Model {
  readonly statement: ts.VariableStatement
  readonly typeNode: O.Option<ts.TypeAliasDeclaration>
}
```

Added in v3.0.0

# Declaration (type alias)

**Signature**

```ts
export type Declaration<A> = C.Const<Model, A>
```

Added in v3.0.0

# printDeclaration

**Signature**

```ts
export function printDeclaration<A>(declaration: Declaration<A>): string { ... }
```

Added in v3.0.0

# printNode

**Signature**

```ts
export function printNode(node: ts.Node): string { ... }
```

Added in v3.0.0

# toDeclaration

**Signature**

```ts
export function toDeclaration<A>(declaration: DSL.Declaration<A>): Declaration<A> { ... }
```

Added in v3.0.0

# toExpression

**Signature**

```ts
export function toExpression(model: DSL.Model): E.Expression<unknown> { ... }
```

Added in v3.0.0

# toTypeNode

**Signature**

```ts
export function toTypeNode(model: DSL.Model): T.TypeNode<unknown> { ... }
```

Added in v3.0.0
