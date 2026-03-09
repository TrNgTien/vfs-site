---
title: Benchmark
description: Token savings data — vfs vs grep vs reading entire files.
---

## Self-benchmark results

Benchmark on the vfs repository itself (pattern `"Extract"`, 4,178 lines of source):

|                 | Read all files | grep       | vfs        |
|-----------------|----------------|------------|------------|
| Output size     | 101.9 KB       | 13.8 KB    | 1.5 KB     |
| Lines           | 4,178          | 148        | 15         |
| Est. tokens     | 26,079         | 3,537      | 373        |

### Key takeaways

- **vfs saves 98.6% tokens** vs reading all files (26,079 → 373)
- **vfs saves 89.5% tokens** vs grep (3,537 → 373)

Even grep, which is already a significant improvement over reading everything, still returns 9.5x more tokens than vfs.

## Why the difference?

**Reading all files** returns everything — imports, comments, function bodies, blank lines. An AI agent processing this pays for every token, even though most of it is irrelevant.

**Grep** narrows it down to matching lines, but still includes partial function bodies, duplicate matches, and surrounding context that isn't useful for discovering function locations.

**vfs** parses source via AST and returns only the exported signature — one line per function with the exact file and line number. No bodies, no noise.

## Run your own benchmark

```bash
# Self-test on vfs source code
vfs bench --self

# Benchmark on any project
vfs bench -f HandleLogin /path/to/go-project

# Show actual output from each method
vfs bench -f Login /path/to/project --show-output
```

The benchmark command compares three approaches on your codebase and prints a side-by-side table of output size, line count, and estimated token count.

## Real-world impact

For an AI coding agent making 10 code searches per session, the difference compounds:

| Method | Tokens per search | 10 searches | Cost impact |
|--------|------------------|-------------|-------------|
| Read files | ~26,000 | ~260,000 | High |
| grep | ~3,500 | ~35,000 | Medium |
| vfs | ~370 | ~3,700 | Low |

Over a typical development session, vfs can save hundreds of thousands of tokens — which translates directly to faster responses, lower costs, and longer context windows for the AI.
