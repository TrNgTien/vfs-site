---
title: "Supported Languages"
description: "Languages and file extensions supported by vfs."
---

vfs supports **16 languages** using a combination of Go's native AST parser, tree-sitter grammars, and line-based heuristics.

## Language table

| Language        | Extensions                              | Parser      |
|-----------------|-----------------------------------------|-------------|
| Go              | `.go`                                   | `go/ast`    |
| JavaScript      | `.js`, `.mjs`, `.cjs`, `.jsx`           | tree-sitter |
| TypeScript      | `.ts`, `.mts`, `.cts`, `.tsx`           | tree-sitter |
| Python          | `.py`                                   | tree-sitter |
| Rust            | `.rs`                                   | tree-sitter |
| Java            | `.java`                                 | tree-sitter |
| C#              | `.cs`                                   | tree-sitter |
| Dart            | `.dart`                                 | tree-sitter |
| Kotlin          | `.kt`, `.kts`                           | tree-sitter |
| Swift           | `.swift`                                | tree-sitter |
| Ruby            | `.rb`                                   | tree-sitter |
| HCL / Terraform | `.tf`, `.hcl`                           | tree-sitter |
| Dockerfile      | `Dockerfile`, `Dockerfile.*`            | line-based  |
| Protobuf        | `.proto`                                | line-based  |
| SQL             | `.sql`                                  | line-based  |
| YAML            | `.yml`, `.yaml`                         | line-based  |

## Parser types

### Go AST (`go/ast`)

Go files are parsed using Go's built-in `go/ast` package. This provides the most accurate extraction since it uses the same parser as the Go compiler.

### Tree-sitter

JavaScript, TypeScript, Python, Rust, Java, C#, Dart, Kotlin, Swift, Ruby, and HCL / Terraform are parsed using [tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammars. Tree-sitter produces concrete syntax trees that vfs traverses to extract exported declarations.

### Line-based

Dockerfiles, Protobuf, SQL, and YAML use pattern-based heuristics. These formats have simple enough structure that AST parsing is unnecessary.

## What gets extracted

vfs extracts **exported** signatures — the public API surface of your code:

- **Functions and methods** (exported/public)
- **Classes and interfaces**
- **Type declarations** (structs, enums, type aliases)
- **Constants and variables** (exported)

Function bodies, imports, and comments are stripped from the output.

## Unsupported languages

For languages not in the table above, use `grep` or `rg` directly. You can check at any time with:

```bash
vfs mcp
# Then call the list_languages MCP tool
```
