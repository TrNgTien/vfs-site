---
title: CLI Commands
description: Complete reference for all vfs commands and flags.
---

## `vfs [paths...] -f <pattern>`

The main command. Scans files and directories, printing exported signatures.

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

Compare token usage across three methods: reading all files, grep, and vfs.

```bash
vfs bench --self                                   # benchmark on vfs source
vfs bench -f HandleLogin /path/to/go-project       # benchmark on any project
vfs bench -f Login /path/to/project --show-output  # show actual output
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

See [AI Tools Setup](/guides/ai-tools-setup/) for configuration details.

---

## `vfs serve`

Run the MCP server (HTTP) and dashboard together in the foreground.

```bash
vfs serve                                    # defaults: MCP on :8080, dashboard on :3000
vfs serve --mcp :9090 --dashboard-port 4000  # custom ports
```

---

## `vfs up` / `vfs down` / `vfs status`

Manage the server as a background process.

```bash
vfs up          # start MCP + dashboard in background
vfs status      # check if running, show endpoints
vfs down        # stop the background server
```

---

## `vfs dashboard`

Run just the dashboard web UI (without MCP server).

```bash
vfs dashboard                # default port 3000
vfs dashboard --port 4000    # custom port
```

Open `http://localhost:3000` to see usage statistics and token savings over time.
