---
title: "Quick Start — Your First vfs Commands in 60 Seconds"
description: "Get started with vfs in 60 seconds. Learn to search function signatures, scan directories, view token savings stats, and start the MCP server."
---

Once [installed](/getting-started/installation/), you can start scanning code immediately.

## Find a function by name

```bash
vfs . -f HandleLogin
```

Output:

```
internal/handlers/auth.go:23: func HandleLogin(w http.ResponseWriter, r *http.Request)
```

The `-f` flag is **case-insensitive** — searching for `handlelogin`, `HANDLELOGIN`, or `HandleLogin` all return the same results.

## Scan specific directories

```bash
vfs ./internal ./pkg
```

## List all signatures in a single file

```bash
vfs server.go
```

## Show token savings stats

```bash
vfs . -f auth --stats
```

Appends a stats summary to stderr showing how many tokens vfs saved compared to reading the raw files.

## Start the MCP server and dashboard

```bash
vfs up          # start MCP + dashboard in background
vfs status      # check if running, show endpoints
vfs down        # stop the background server
```

Open the dashboard at `http://localhost:3000` to see usage statistics and token savings over time.

## Get help

```bash
vfs --help
```

## What's next?

- **[AI Tools Setup](/guides/ai-tools-setup/)** — connect vfs to Cursor, Claude Code, Windsurf, and other AI editors
- **[CLI Reference](/reference/cli/)** — full command documentation
- **[Agent Rules](/guides/agent-rules/)** — tell your AI agent to prefer vfs over grep
