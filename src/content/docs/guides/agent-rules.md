---
title: "Agent Rules"
description: "Tell your AI agent to use vfs before grep — required for token savings."
---

:::caution[This step is required]
Installing vfs is not enough. AI agents don't automatically know vfs exists. Without an explicit rule, the agent will still default to grep and reading entire files — wasting the tokens vfs is designed to save.
:::

You must create a **rule file** in your project that instructs the agent: "use vfs before grep for code discovery."

## Rule file locations

Each AI tool has its own rule system:

| Tool | Rule file location | How to reuse `vfs-agent-search.mdc` |
|------|-------------------|--------------------------------------|
| **Cursor** | `.cursor/rules/vfs.mdc` | Copy directly: `cp vfs-agent-search.mdc yourproject/.cursor/rules/` |
| **Claude Code** | `CLAUDE.md` | Copy the content into your `CLAUDE.md` (strip the YAML frontmatter) |
| **Antigravity** | `GEMINI.md` | Copy the content into your `GEMINI.md` (strip the YAML frontmatter). Also reads `AGENTS.md`. |
| **Windsurf** | `.windsurf/rules/vfs.md` | Copy as-is: `cp vfs-agent-search.mdc yourproject/.windsurf/rules/vfs.md` |
| **Cline** | `.clinerules` | Copy the content into your `.clinerules` (strip the YAML frontmatter) |
| **Continue** | `.continue/rules/vfs.md` | Copy as-is: `cp vfs-agent-search.mdc yourproject/.continue/rules/vfs.md` |
| **Aider** | `.aider.conventions.md` | Copy the content into your `.aider.conventions.md` (strip the YAML frontmatter) |

## Rule content

The core instruction is the same regardless of tool. Create the rule file for your tool (see table above) and add this content:

```markdown

```

## Setup examples

### Cursor

```bash
mkdir -p .cursor/rules
```

Create `.cursor/rules/vfs.mdc` with the rule content above. The vfs repository includes a production-ready Cursor rule at `.cursor/rules/vfs-agent-search.mdc` that you can copy directly:

```bash
cp /path/to/vfs/.cursor/rules/vfs-agent-search.mdc .cursor/rules/
```

### Claude Code

Create or append to `CLAUDE.md` in your project root with the rule content above. Claude Code reads this file at the start of every session.

### Antigravity

Create `GEMINI.md` in your project root with the rule content above. Antigravity reads `GEMINI.md` as its native config. It also reads `AGENTS.md` for general agent instructions.

### Windsurf

```bash
mkdir -p .windsurf/rules
```

Create `.windsurf/rules/vfs.md` with the rule content above.

## The difference it makes

Without the rule file:

```
You: "Where is the login handler?"

Without rule:  Agent runs grep -r "HandleLogin" . → reads 200 lines → 3,500 tokens
With rule:     Agent calls vfs search("HandleLogin") → reads 23 lines → 370 tokens
```

The rule file is what turns vfs from "installed but ignored" into "actively saving tokens on every search."
