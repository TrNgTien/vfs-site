---
title: "CLI Reference — All vfs Commands, Flags & Usage Patterns"
description: "Complete reference for vfs CLI: search signatures, run benchmarks, view stats, start MCP server, manage background processes, and launch the dashboard."
---

---

## `vfs [paths...] -f <pattern>`

The main command. Scans files/directories and prints exported signatures.

```bash
vfs .                          # all signatures in current directory (recursive)
vfs ./src ./lib                # scan multiple directories
vfs handler.go                 # single file
vfs . -f auth                  # filter by pattern (case-insensitive)
vfs . -f auth --stats          # show token efficiency stats after output
vfs . -f auth --no-record      # skip logging to history
```

### Flags

| Flag | Description |
|------|-------------|
| `-f`, `--filter` | Case-insensitive substring filter on signature names |
| `--stats` | Print token efficiency stats (raw vs vfs) to stderr |
| `--no-record` | Skip logging this invocation to `~/.vfs/history.jsonl` |

---

## `vfs bench`

Compare token usage: reading all files vs grep vs vfs.

```bash
vfs bench --self                              # benchmark on vfs's own source
vfs bench -f HandleLogin /path/to/project     # benchmark on any project
vfs bench -f Login /path/to/project --show-output  # also print actual output
```

---

## `vfs stats`

Show lifetime token savings across all recorded invocations.

```bash
vfs stats            # show summary
vfs stats --reset    # clear all history
```

Example output:

```
--- vfs lifetime stats ---
Invocations:         142
Total tokens saved:  ~52,300
Total raw scanned:   2.3 MB  (48,200 lines)
Total vfs output:    89.5 KB  (1,420 lines)
Avg reduction:       72.3%
First recorded:      2025-01-15 09:30
Last recorded:       2025-03-09 14:22
```

---

## `vfs mcp`

Start the MCP server for AI tool integration.

```bash
vfs mcp                  # stdio transport (default, for editor integration)
vfs mcp --http :8080     # HTTP transport (for Docker / remote setups)
```

---

## `vfs serve`

Run the MCP server (HTTP) and dashboard together in the foreground.

```bash
vfs serve                                    # defaults: MCP on :8080, dashboard on :3000
vfs serve --port 9090                        # MCP on :9090
vfs serve --port 9090 --dashboard-port 4000  # both custom
vfs serve --mcp :9090 --dashboard-port 4000  # equivalent (full address form)
```

---

## `vfs up` / `vfs down` / `vfs status`

Manage the server as a background process.

```bash
vfs up                  # start MCP + dashboard in background (default port 8080)
vfs up --port 9090      # start on custom MCP port
vfs status              # check if running, show endpoints
vfs status --port 9090  # check custom port
vfs down                # stop the background server
```

---

## `vfs dashboard`

Run just the dashboard web UI (without MCP server).

```bash
vfs dashboard                # default port 3000
vfs dashboard --port 4000    # custom port
```

See [AI Tools Setup](/guides/ai-tools-setup/) for MCP server configuration details.
