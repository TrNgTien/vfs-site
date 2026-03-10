/**
 * Fetches the latest README.md from the vfs GitHub repo and generates
 * all Starlight doc pages. Run before `astro build` so every deploy
 * automatically picks up README changes.
 *
 * Usage:
 *   node scripts/sync-readme.js            # fetch from GitHub
 *   node scripts/sync-readme.js ./path     # read from local file instead
 */

import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const README_URL =
  'https://raw.githubusercontent.com/TrNgTien/vfs/main/README.md';
const DOCS_DIR = resolve(__dirname, '../src/content/docs');

// ---------------------------------------------------------------------------
// 1. Fetch or read the README
// ---------------------------------------------------------------------------

async function getReadme() {
  const localPath = process.argv[2];
  if (localPath) {
    console.log(`[sync] Reading local file: ${localPath}`);
    return readFileSync(localPath, 'utf-8');
  }
  console.log(`[sync] Fetching ${README_URL}`);
  const res = await fetch(README_URL);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  return res.text();
}

// ---------------------------------------------------------------------------
// 2. Parse README into a map of { sectionName: content }
// ---------------------------------------------------------------------------

function parseReadme(md) {
  const sections = {};
  let current = '_preamble';
  const lines = md.split('\n');

  for (const line of lines) {
    const h2 = line.match(/^## (.+)/);
    if (h2) {
      current = h2[1].trim();
      sections[current] = '';
    } else {
      sections[current] = (sections[current] || '') + line + '\n';
    }
  }

  for (const key of Object.keys(sections)) {
    sections[key] = sections[key].trimEnd() + '\n';
  }
  return sections;
}

/**
 * Split a section at ### sub-headers, returning { subName: content }.
 */
function parseSubs(content) {
  const subs = {};
  let current = '_intro';
  for (const line of content.split('\n')) {
    const h3 = line.match(/^### (.+)/);
    if (h3) {
      current = h3[1].trim();
      subs[current] = '';
    } else {
      subs[current] = (subs[current] || '') + line + '\n';
    }
  }
  for (const key of Object.keys(subs)) {
    subs[key] = subs[key].trimEnd() + '\n';
  }
  return subs;
}

// ---------------------------------------------------------------------------
// 3. Helpers
// ---------------------------------------------------------------------------

function write(relPath, content) {
  const full = resolve(DOCS_DIR, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content);
  console.log(`[sync] wrote ${relPath}`);
}

function frontmatter(fields) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(fields)) {
    lines.push(`${k}: "${v.replace(/"/g, '\\"')}"`);
  }
  lines.push('---');
  return lines.join('\n');
}

function countLanguages(langSection) {
  return (langSection.match(/^\|(?!\s*[-|])/gm) || []).length - 1;
}

// ---------------------------------------------------------------------------
// 4. Page generators
// ---------------------------------------------------------------------------

function writeIndex(s) {
  const langCount = countLanguages(s['Supported Languages'] || '');
  const langLabel = langCount > 0 ? `**${langCount} languages**` : 'multiple languages';

  write(
    'index.mdx',
    `${frontmatter({
      title: 'What is vfs?',
      description:
        'Virtual Function Signatures — extract exported signatures from source code with bodies stripped.',
    })}

**vfs** (Virtual Function Signatures) extracts exported function, class, interface, and type signatures from source code with bodies stripped.

${(s['Why vfs?'] || '').trim()}

## How it works

${(s['How It Works'] || '').replace(/^This works across \d+ languages:/m, `This works across ${langLabel}:`).trim()}

## Token savings at a glance

${(s['Benchmark'] || '').replace(/Run it yourself:[\s\S]*$/, '').trim()}

See the full [Benchmark](/reference/benchmark/) page for details and how to run your own.

## Next steps

import { LinkCard, CardGrid } from '@astrojs/starlight/components';

<CardGrid>
  <LinkCard title="Installation" href="/getting-started/installation/" description="Install vfs via pre-built binary, source, or Docker." />
  <LinkCard title="Quick Start" href="/getting-started/quick-start/" description="Your first vfs commands in 60 seconds." />
  <LinkCard title="AI Tools Setup" href="/guides/ai-tools-setup/" description="Connect vfs to Cursor, Claude Code, Windsurf, and more." />
  <LinkCard title="CLI Reference" href="/reference/cli/" description="All commands, flags, and usage patterns." />
</CardGrid>
`
  );
}

function writeInstallation(s) {
  const installSection = s['Install'] || '';
  const subs = parseSubs(installSection);

  write(
    'getting-started/installation.md',
    `${frontmatter({
      title: 'Installation',
      description:
        'Install vfs on Linux, macOS, or Windows via pre-built binary, source build, or Docker.',
    })}

| Your situation | Method | What you need |
|---|---|---|
| **Linux** | [Pre-built binary](#pre-built-binary) | Nothing |
| **macOS / Linux** | [Build from source](#build-from-source) | Go 1.24+, C compiler |
| **Windows** | [Windows step-by-step](#windows-step-by-step) | Go 1.24+, TDM-GCC |
| **Any OS** | [Docker](#docker) | Docker |

## Pre-built binary

${(subs['Pre-built binary'] || '').trim()}

## Build from source

${(subs['Build from source'] || '').trim()}

:::tip[vfs: command not found?]
Add Go's bin to your PATH:

- **macOS / Linux**: \`export PATH="$PATH:$(go env GOPATH)/bin"\`
- **Windows**: add \`%USERPROFILE%\\go\\bin\` to your system PATH
:::

${WINDOWS_SECTION}

## Docker

${(subs['Docker'] || '').trim()}

On Windows PowerShell, replace \`$(pwd)\` with \`\${PWD}\`:

\`\`\`powershell
docker run --rm -v \${PWD}:/workspace -p 8080:8080 -p 3000:3000 vfs-mcp
\`\`\`

## Verify installation

\`\`\`bash
vfs --help
\`\`\`

You should see the vfs help text listing available commands and flags.
`
  );
}

function writeQuickStart(s) {
  write(
    'getting-started/quick-start.md',
    `${frontmatter({
      title: 'Quick Start',
      description: 'Your first vfs commands in 60 seconds.',
    })}

Once [installed](/getting-started/installation/), you can start scanning code immediately.

## Find a function by name

\`\`\`bash
vfs . -f HandleLogin
\`\`\`

Output:

\`\`\`
internal/handlers/auth.go:23: func HandleLogin(w http.ResponseWriter, r *http.Request)
\`\`\`

The \`-f\` flag is **case-insensitive** — searching for \`handlelogin\`, \`HANDLELOGIN\`, or \`HandleLogin\` all return the same results.

## Scan specific directories

\`\`\`bash
vfs ./internal ./pkg
\`\`\`

## List all signatures in a single file

\`\`\`bash
vfs server.go
\`\`\`

## Show token savings stats

\`\`\`bash
vfs . -f auth --stats
\`\`\`

Appends a stats summary to stderr showing how many tokens vfs saved compared to reading the raw files.

## Start the MCP server and dashboard

\`\`\`bash
vfs up          # start MCP + dashboard in background
vfs status      # check if running, show endpoints
vfs down        # stop the background server
\`\`\`

Open the dashboard at \`http://localhost:3000\` to see usage statistics and token savings over time.

## Get help

\`\`\`bash
vfs --help
\`\`\`

## What's next?

- **[AI Tools Setup](/guides/ai-tools-setup/)** — connect vfs to Cursor, Claude Code, Windsurf, and other AI editors
- **[CLI Reference](/reference/cli/)** — full command documentation
- **[Agent Rules](/guides/agent-rules/)** — tell your AI agent to prefer vfs over grep
`
  );
}

function writeCLI(s) {
  const raw = s['CLI Reference'] || '';
  const formatted = raw
    .replace(/^### /gm, '## ')
    .replace(/\n\*\*Flags:\*\*\n/g, '\n### Flags\n')
    .replace(/^(## .+)$/gm, '---\n\n$1');

  const body = formatted.replace(/^---\n\n/, '').trim();

  write(
    'reference/cli.md',
    `${frontmatter({
      title: 'CLI Commands',
      description: 'Complete reference for all vfs commands and flags.',
    })}

${body}

See [AI Tools Setup](/guides/ai-tools-setup/) for MCP server configuration details.
`
  );
}

function writeLanguages(s) {
  const raw = s['Supported Languages'] || '';
  const langCount = countLanguages(raw);

  const treeSitterLangs = [];
  for (const m of raw.matchAll(/^\| (\S[^|]+?)\s*\|[^|]+\|\s*tree-sitter\s*\|$/gm)) {
    treeSitterLangs.push(m[1].trim());
  }
  const tsListText =
    treeSitterLangs.length > 2
      ? treeSitterLangs.slice(0, -1).join(', ') +
        ', and ' +
        treeSitterLangs[treeSitterLangs.length - 1]
      : treeSitterLangs.join(' and ');

  write(
    'reference/languages.md',
    `${frontmatter({
      title: 'Supported Languages',
      description: 'Languages and file extensions supported by vfs.',
    })}

vfs supports **${langCount} languages** using a combination of Go's native AST parser, tree-sitter grammars, and line-based heuristics.

## Language table

${raw.trim()}

## Parser types

### Go AST (\`go/ast\`)

Go files are parsed using Go's built-in \`go/ast\` package. This provides the most accurate extraction since it uses the same parser as the Go compiler.

### Tree-sitter

${tsListText} are parsed using [tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammars. Tree-sitter produces concrete syntax trees that vfs traverses to extract exported declarations.

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

For languages not in the table above, use \`grep\` or \`rg\` directly. You can check at any time with:

\`\`\`bash
vfs mcp
# Then call the list_languages MCP tool
\`\`\`
`
  );
}

function writeBenchmark(s) {
  const raw = s['Benchmark'] || '';

  write(
    'reference/benchmark.md',
    `${frontmatter({
      title: 'Benchmark',
      description: 'Token savings data — vfs vs grep vs reading entire files.',
    })}

## Self-benchmark results

${raw.replace(/^Run it yourself:\n*/m, '## Run your own benchmark\n\n').trim()}

The benchmark command compares three approaches on your codebase and prints a side-by-side table of output size, line count, and estimated token count.

## Why the difference?

**Reading all files** returns everything — imports, comments, function bodies, blank lines. An AI agent processing this pays for every token, even though most of it is irrelevant.

**Grep** narrows it down to matching lines, but still includes partial function bodies, duplicate matches, and surrounding context that isn't useful for discovering function locations.

**vfs** parses source via AST and returns only the exported signature — one line per function with the exact file and line number. No bodies, no noise.

## Real-world impact

For an AI coding agent making 10 code searches per session, the difference compounds:

| Method | Tokens per search | 10 searches | Cost impact |
|--------|------------------|-------------|-------------|
| Read files | ~26,000 | ~260,000 | High |
| grep | ~3,500 | ~35,000 | Medium |
| vfs | ~370 | ~3,700 | Low |

Over a typical development session, vfs can save hundreds of thousands of tokens — which translates directly to faster responses, lower costs, and longer context windows for the AI.
`
  );
}

function writeSecurity(s) {
  const raw = s['Security & Privacy'] || '';
  const bullets = raw.replace(/^>.*\n?/gm, '').trim();

  write(
    'reference/security.md',
    `${frontmatter({
      title: 'Security & Privacy',
      description:
        'vfs is local-first by design. Your source code never leaves your machine.',
    })}

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

Source files are parsed in memory and discarded immediately after extracting signatures. The only file vfs writes is \`~/.vfs/history.jsonl\`, which contains **scan statistics** (invocation count, token savings) — never source code.

### Fully offline

Install once, use forever. vfs requires no internet connection after installation. Pre-built binaries have zero runtime dependencies.

## What gets stored

The only persistent data is \`~/.vfs/history.jsonl\`, which logs:

- Timestamp of each invocation
- Number of files scanned
- Raw vs. vfs output sizes (for token savings calculation)
- Filter pattern used

This file contains **no source code** — only aggregate statistics. You can view it with \`vfs stats\` and clear it with \`vfs stats --reset\`.
`
  );
}

function writeAIToolsSetup(s) {
  const raw = s['Setup for AI Tools'] || '';
  const step1End = raw.indexOf('### Step 2:');
  const step1Content =
    step1End > 0 ? raw.slice(0, step1End).trim() : raw.trim();

  const subs = parseSubs(step1Content);

  write(
    'guides/ai-tools-setup.md',
    `${frontmatter({
      title: 'AI Tools Setup',
      description: 'Connect vfs to your AI coding tool via MCP or CLI.',
    })}

Setting up vfs requires **two steps**:

1. **Connect vfs** — configure MCP or make the CLI available so the agent *can* call vfs.
2. **[Add an agent rule](/guides/agent-rules/)** — tell the agent it *should* call vfs before grep.

:::caution[Step 2 is critical]
AI agents don't automatically know vfs exists. Without an explicit rule, the agent will still default to grep and reading entire files — wasting the tokens vfs is designed to save.
:::

This page covers **Step 1**. See [Agent Rules](/guides/agent-rules/) for Step 2.

---

## Choosing a method

${(subs['Step 1: Connect vfs'] || subs['_intro'] || '').replace(/^>.*\n?/gm, '').replace(/vfs works with any AI.*?shell\.\n?/s, '').trim()}

---

## Method 1: MCP integration (recommended)

${(subs['Method 1: MCP Integration (recommended)'] || '').trim()}

#### MCP tools

${(subs['MCP Tools'] || '').trim()}

### Config file locations

Most tools use the same stdio JSON config. The only difference is where the file lives:

${extractTable(raw, 'MCP config location')}

### Stdio config (most tools)

Works for Cursor, Claude Code, Claude Desktop, Antigravity, Windsurf, and Cline:

\`\`\`json
{
  "mcpServers": {
    "vfs": {
      "command": "vfs",
      "args": ["mcp"]
    }
  }
}
\`\`\`

### Continue config

Continue uses a different structure:

\`\`\`json
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
\`\`\`

### Zed config

\`\`\`json
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
\`\`\`

### HTTP config (Docker / remote)

For Docker, remote setups, or any tool that supports HTTP-based MCP:

\`\`\`bash
vfs up    # starts MCP on :8080 and dashboard on :3000
\`\`\`

\`\`\`json
{
  "mcpServers": {
    "vfs": {
      "url": "http://localhost:8080/mcp"
    }
  }
}
\`\`\`

---

## Method 2: CLI integration

${(subs['Method 2: CLI Integration'] || '').trim()}

The CLI works in any environment with shell access — terminal-based tools like Aider, Claude Code, Antigravity, or custom scripts.

---

## Next: add an agent rule

Connecting vfs is only half the setup. You must also **tell the agent to use it**. See [Agent Rules](/guides/agent-rules/) for the required rule file.
`
  );
}

function writeAgentRules(s) {
  const raw = s['Setup for AI Tools'] || '';
  const step2Start = raw.indexOf('### Step 2:');
  if (step2Start < 0) {
    console.warn('[sync] Could not find "Step 2" in Setup for AI Tools');
    return;
  }
  const step2Content = raw.slice(step2Start).trim();
  const subs = parseSubs(step2Content);

  const ruleLocTable = extractTable(raw, 'Rule file location');
  const ruleContent =
    extractCodeBlock(step2Content, 'markdown') || '';

  write(
    'guides/agent-rules.md',
    `${frontmatter({
      title: 'Agent Rules',
      description:
        'Tell your AI agent to use vfs before grep — required for token savings.',
    })}

:::caution[This step is required]
Installing vfs is not enough. AI agents don't automatically know vfs exists. Without an explicit rule, the agent will still default to grep and reading entire files — wasting the tokens vfs is designed to save.
:::

You must create a **rule file** in your project that instructs the agent: "use vfs before grep for code discovery."

## Rule file locations

Each AI tool has its own rule system:

${ruleLocTable}

## Rule content

The core instruction is the same regardless of tool. Create the rule file for your tool (see table above) and add this content:

\`\`\`markdown
${ruleContent.trim()}
\`\`\`

## Setup examples

### Cursor

\`\`\`bash
mkdir -p .cursor/rules
\`\`\`

Create \`.cursor/rules/vfs.mdc\` with the rule content above. The vfs repository includes a production-ready Cursor rule at \`.cursor/rules/vfs-agent-search.mdc\` that you can copy directly:

\`\`\`bash
cp /path/to/vfs/.cursor/rules/vfs-agent-search.mdc .cursor/rules/
\`\`\`

### Claude Code

Create or append to \`CLAUDE.md\` in your project root with the rule content above. Claude Code reads this file at the start of every session.

### Antigravity

Create \`GEMINI.md\` in your project root with the rule content above. Antigravity reads \`GEMINI.md\` as its native config. It also reads \`AGENTS.md\` for general agent instructions.

### Windsurf

\`\`\`bash
mkdir -p .windsurf/rules
\`\`\`

Create \`.windsurf/rules/vfs.md\` with the rule content above.

## The difference it makes

Without the rule file:

\`\`\`
You: "Where is the login handler?"

Without rule:  Agent runs grep -r "HandleLogin" . → reads 200 lines → 3,500 tokens
With rule:     Agent calls vfs search("HandleLogin") → reads 23 lines → 370 tokens
\`\`\`

The rule file is what turns vfs from "installed but ignored" into "actively saving tokens on every search."
`
  );
}

// ---------------------------------------------------------------------------
// 5. Extraction helpers
// ---------------------------------------------------------------------------

function extractTable(text, headerKeyword) {
  const lines = text.split('\n');
  let inTable = false;
  const tableLines = [];

  for (const line of lines) {
    if (line.includes(headerKeyword) && line.startsWith('|')) {
      inTable = true;
    }
    if (inTable) {
      if (line.startsWith('|')) {
        tableLines.push(line);
      } else if (tableLines.length > 0) {
        break;
      }
    }
  }
  return tableLines.join('\n');
}

function extractCodeBlock(text, lang) {
  const re = new RegExp('```' + lang + '\\n([\\s\\S]*?)```', 'm');
  const m = text.match(re);
  return m ? m[1] : '';
}

// ---------------------------------------------------------------------------
// 6. Doc-site-only content (not in README)
// ---------------------------------------------------------------------------

const WINDOWS_SECTION = `## Windows step-by-step

Windows requires a few extra steps because vfs uses CGO (tree-sitter bindings need a C compiler). This guide walks through everything from scratch.

### 1. Install Go

Download the installer from [go.dev/dl](https://go.dev/dl/) and run it. The installer adds Go to your PATH automatically.

Open a **new** PowerShell window and verify:

\`\`\`powershell
go version
# Expected: go version go1.24.x windows/amd64
\`\`\`

### 2. Install a C compiler

The easiest option is [TDM-GCC](https://jmeubank.github.io/tdm-gcc/):

1. Download the **TDM-GCC installer** from [jmeubank.github.io/tdm-gcc](https://jmeubank.github.io/tdm-gcc/)
2. Run the installer -- choose **"Create"** (not "Manage")
3. Select **MinGW-w64/TDM64** (64-bit)
4. Keep all defaults and finish

Open a **new** PowerShell window and verify:

\`\`\`powershell
gcc --version
# Expected: gcc (tdm64-1) 10.x.x or similar
\`\`\`

:::caution[Must open a new terminal]
After installing Go or TDM-GCC, you **must** open a new PowerShell window for the PATH changes to take effect. This is the most common mistake.
:::

### 3. Install Git (if you don't have it)

Download from [git-scm.com](https://git-scm.com/download/win) and install with defaults.

### 4. Build vfs

\`\`\`powershell
git clone https://github.com/TrNgTien/vfs.git
cd vfs
go install ./cmd/vfs
\`\`\`

### 5. Add Go bin to PATH

The \`go install\` command places the binary in \`%USERPROFILE%\\go\\bin\`. You need to add this to your system PATH:

**Option A -- via PowerShell (current user, permanent):**

\`\`\`powershell
$gobin = [System.IO.Path]::Combine($env:USERPROFILE, "go", "bin")
[Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";" + $gobin, "User")
\`\`\`

**Option B -- via System Settings:**

1. Press \`Win + R\`, type \`sysdm.cpl\`, press Enter
2. Go to **Advanced** tab, click **Environment Variables**
3. Under "User variables", select **Path**, click **Edit**
4. Click **New**, add \`%USERPROFILE%\\go\\bin\`
5. Click **OK** on all dialogs

Open a **new** PowerShell window, then verify:

\`\`\`powershell
vfs --help
\`\`\`

### Troubleshooting Windows

**\\\`gcc: command not found\\\` or \\\`exec: "gcc": executable file not found\\\`**

The C compiler isn't in your PATH. Reinstall TDM-GCC and make sure you selected MinGW-w64/TDM64. Open a new terminal after installing.

**\\\`vfs: command not found\\\` after \\\`go install\\\`**

Go's bin directory isn't in your PATH. Run this to check where Go installed the binary:

\`\`\`powershell
go env GOPATH
# Then look inside that path's \\bin folder
\`\`\`

Add that \`bin\` folder to your PATH as shown in step 5.

**\\\`CGO_ENABLED\\\` errors**

Ensure CGO is enabled (it should be by default when a C compiler is found):

\`\`\`powershell
go env CGO_ENABLED
# Should print: 1
\`\`\`

If it prints \`0\`, set it explicitly:

\`\`\`powershell
$env:CGO_ENABLED = "1"
go install ./cmd/vfs
\`\`\`

**Using WSL instead**

If you have Windows Subsystem for Linux, you can skip all the above and follow the Linux instructions inside your WSL terminal. This is often the easiest path for developers already using WSL:

\`\`\`bash
# Inside WSL (Ubuntu)
sudo apt install build-essential
curl -L https://github.com/TrNgTien/vfs/releases/latest/download/vfs-linux-amd64.tar.gz | tar xz
sudo mv vfs /usr/local/bin/
vfs --help
\`\`\``;

// ---------------------------------------------------------------------------
// 7. Main
// ---------------------------------------------------------------------------

async function main() {
  const readme = await getReadme();
  const sections = parseReadme(readme);

  console.log(
    `[sync] Parsed sections: ${Object.keys(sections).filter((k) => k !== '_preamble').join(', ')}`
  );

  writeIndex(sections);
  writeInstallation(sections);
  writeQuickStart(sections);
  writeCLI(sections);
  writeLanguages(sections);
  writeBenchmark(sections);
  writeSecurity(sections);
  writeAIToolsSetup(sections);
  writeAgentRules(sections);

  console.log('[sync] Done — all doc pages generated.');
}

main().catch((err) => {
  console.error('[sync] FATAL:', err);
  process.exit(1);
});
