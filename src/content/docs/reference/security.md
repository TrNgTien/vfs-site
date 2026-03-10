---
title: "Security & Privacy — 100% Local, Zero Telemetry"
description: "vfs is local-first by design. Zero network access, no telemetry, no data collection, no code storage. Your source code never leaves your machine. Fully offline after install."
---

:::note[Local-first by design]
Your source code never leaves your machine.
:::

## Principles

### Zero network access

All parsing is performed locally via AST and tree-sitter. vfs makes **no outbound connections**, ever. There are no update checks, no usage pings, no remote APIs.

### No secrets exposure

vfs does not read, access, or store API keys, credentials, or environment variables. It only parses source code structure (function signatures, class declarations) and discards everything else.

### No data collection

There is no telemetry, no analytics, and no tracking of any kind. vfs does not phone home.

### No code storage

Source files are parsed in memory and discarded immediately after extracting signatures. The only file vfs writes is `~/.vfs/history.jsonl`, which contains **scan statistics** (invocation count, token savings) — never source code.

### Fully offline

Install once, use forever. vfs requires no internet connection after installation. Pre-built binaries have zero runtime dependencies.

## What gets stored

The only persistent data is `~/.vfs/history.jsonl`, which logs:

- Timestamp of each invocation
- Number of files scanned
- Raw vs. vfs output sizes (for token savings calculation)
- Filter pattern used

This file contains **no source code** — only aggregate statistics. You can view it with `vfs stats` and clear it with `vfs stats --reset`.
