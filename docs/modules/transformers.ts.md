---
title: transformers.ts
nav_order: 17
parent: Modules
---

# transformers overview

Added in v3.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [print](#print)
- [toExpression](#toexpression)
- [toTypeNode](#totypenode)
- [toVariableStatement](#tovariablestatement)

---

# print

**Signature**

```ts
export function print(node: ts.Node): string { ... }
```

Added in v3.0.0

# toExpression

**Signature**

```ts
export function toExpression(model: DSL.Expression): ts.Expression { ... }
```

Added in v3.0.0

# toTypeNode

**Signature**

```ts
export function toTypeNode(model: DSL.Expression): ts.TypeNode { ... }
```

Added in v3.0.0

# toVariableStatement

**Signature**

```ts
export function toVariableStatement(
  declaration: DSL.Declaration
): { statement: ts.VariableStatement; typeNode: O.Option<ts.TypeAliasDeclaration> } { ... }
```

Added in v3.0.0
