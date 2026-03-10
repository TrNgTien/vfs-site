---
title: "AI Tools Setup"
description: "Connect vfs to your AI coding tool via MCP or CLI."
---

Setting up vfs requires **two steps**:

1. **Connect vfs** — configure MCP or make the CLI available so the agent *can* call vfs.
2. **[Add an agent rule](/guides/agent-rules/)** — tell the agent it *should* call vfs before grep.

:::caution[Step 2 is critical]
AI agents don't automatically know vfs exists. Without an explicit rule, the agent will still default to grep and reading entire files — wasting the tokens vfs is designed to save.
:::

This page covers **Step 1**. See [Agent Rules](/guides/agent-rules/) for Step 2.

---

## Choosing a method

| Method | How it works | Best for |
|--------|-------------|----------|
| **MCP (recommended)** | Agent calls vfs tools directly via MCP protocol | Editors with MCP support (most modern AI editors) |
| **CLI** | Agent runs `vfs` as a shell command | Terminal-based tools, scripts, tools without MCP |

#### Method 1: MCP Integration (recommended)

MCP lets the AI agent call vfs tools (`search`, `extract`, `stats`, `list_languages`) directly without shell access. This works even in sandboxed environments where the agent can't run arbitrary binaries.

#### MCP Tools

| MCP Tool | Description | Parameters |
|------|-------------|------------|
| `search` | Find signatures matching a pattern | `paths` (string[]), `pattern` (string) |
| `extract` | Return all exported signatures | `paths` (string[]) |
| `stats` | Lifetime usage statistics | none |
| `list_languages` | Supported languages and extensions | none |

Most tools use the same stdio JSON config. The only difference is where the file lives:

| Tool | MCP config location |
|------|-------------------|
| **Cursor** | `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global) |
| **Claude Code** | `.mcp.json` (project) or `claude mcp add vfs -- vfs mcp` |
| **Claude Desktop** | `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows) |
| **Antigravity** | MCP settings panel, or project MCP config |
| **Windsurf** | `.windsurf/mcp.json` (project) or global via Windsurf settings |
| **Cline** | MCP config in VS Code Cline extension settings |
| **Continue** | `.continue/config.json` under `experimental.modelContextProtocolServers` |
| **Zed** | `~/.config/zed/settings.json` under `context_servers` |

**Stdio config** (Cursor, Claude Code, Claude Desktop, Antigravity, Windsurf, Cline):

```json
{
  "mcpServers": {
    "vfs": {
      "command": "vfs",
      "args": ["mcp"]
    }
  }
}
```

**Continue** uses a different structure:

```json
{
  "experimental": {
    "modelContextProtocolServers": [
      {
        "transport": {
          "type": "stdio",
          "command": "vfs",
          "args": ["mcp"]
        }
      }
    ]
  }
}
```

**Zed** uses a different structure:

```json
{
  "context_servers": {
    "vfs": {
      "command": {
        "path": "vfs",
        "args": ["mcp"]
      }
    }
  }
}
```

**HTTP config** (for Docker, remote setups, or any tool that supports HTTP-based MCP):

```bash
vfs up    # starts MCP on :8080 and dashboard on :3000
```

```json
{
  "mcpServers": {
    "vfs": {
      "url": "http://localhost:8080/mcp"
    }
  }
}
```

#### Method 2: CLI Integration

For tools that don't support MCP (Aider, custom scripts, CI), use vfs as a shell command:

```bash
vfs . -f CreateUser
# Output: internal/services/user.go:42: func CreateUser(name string, email string) (*User, error)

vfs . -f handler | head -20

LOCATION=$(vfs . -f CreateUser | head -1)
FILE=$(echo "$LOCATION" | cut -d: -f1)
LINE=$(echo "$LOCATION" | cut -d: -f2)
echo "Found at $FILE line $LINE"
```

---

## Method 1: MCP integration (recommended)



#### MCP tools



### Config file locations

Most tools use the same stdio JSON config. The only difference is where the file lives:

| Tool | MCP config location |
|------|-------------------|
| **Cursor** | `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global) |
| **Claude Code** | `.mcp.json` (project) or `claude mcp add vfs -- vfs mcp` |
| **Claude Desktop** | `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows) |
| **Antigravity** | MCP settings panel, or project MCP config |
| **Windsurf** | `.windsurf/mcp.json` (project) or global via Windsurf settings |
| **Cline** | MCP config in VS Code Cline extension settings |
| **Continue** | `.continue/config.json` under `experimental.modelContextProtocolServers` |
| **Zed** | `~/.config/zed/settings.json` under `context_servers` |

### Stdio config (most tools)

Works for Cursor, Claude Code, Claude Desktop, Antigravity, Windsurf, and Cline:

```json
{
  "mcpServers": {
    "vfs": {
      "command": "vfs",
      "args": ["mcp"]
    }
  }
}
```

### Continue config

Continue uses a different structure:

```json
{
  "experimental": {
    "modelContextProtocolServers": [
      {
        "transport": {
          "type": "stdio",
          "command": "vfs",
          "args": ["mcp"]
        }
      }
    ]
  }
}
```

### Zed config

```json
{
  "context_servers": {
    "vfs": {
      "command": {
        "path": "vfs",
        "args": ["mcp"]
      }
    }
  }
}
```

### HTTP config (Docker / remote)

For Docker, remote setups, or any tool that supports HTTP-based MCP:

```bash
vfs up    # starts MCP on :8080 and dashboard on :3000
```

```json
{
  "mcpServers": {
    "vfs": {
      "url": "http://localhost:8080/mcp"
    }
  }
}
```

---

## Method 2: CLI integration



The CLI works in any environment with shell access — terminal-based tools like Aider, Claude Code, Antigravity, or custom scripts.

---

## Next: add an agent rule

Connecting vfs is only half the setup. You must also **tell the agent to use it**. See [Agent Rules](/guides/agent-rules/) for the required rule file.
