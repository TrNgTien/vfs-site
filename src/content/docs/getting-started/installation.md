---
title: "Installation"
description: "Install vfs on Linux, macOS, or Windows via pre-built binary, source build, or Docker."
---

| Your situation | Method | What you need |
|---|---|---|
| **Linux** | [Pre-built binary](#pre-built-binary) | Nothing |
| **macOS / Linux** | [Build from source](#build-from-source) | Go 1.24+, C compiler |
| **Windows** | [Windows step-by-step](#windows-step-by-step) | Go 1.24+, TDM-GCC |
| **Any OS** | [Docker](#docker) | Docker |

## Pre-built binary

Download from [GitHub Releases](https://github.com/TrNgTien/vfs/releases). No Go, no C compiler needed. Each release includes SHA-256 checksums.

```bash
# Linux x86_64
curl -L https://github.com/TrNgTien/vfs/releases/latest/download/vfs-linux-amd64.tar.gz | tar xz
sudo mv vfs /usr/local/bin/

# Linux ARM64
curl -L https://github.com/TrNgTien/vfs/releases/latest/download/vfs-linux-arm64.tar.gz | tar xz
sudo mv vfs /usr/local/bin/
```

## Build from source

Requires **Go 1.24+** and a **C compiler**:

- **macOS**: `xcode-select --install`
- **Linux**: `sudo apt install build-essential` (Debian/Ubuntu) or `sudo yum groupinstall "Development Tools"` (Fedora/RHEL)
- **Windows**: install [TDM-GCC](https://jmeubank.github.io/tdm-gcc/) (easiest) or [MSYS2](https://www.msys2.org/) + MinGW-w64

```bash
git clone https://github.com/TrNgTien/vfs.git && cd vfs
go install ./cmd/vfs
```

> **`vfs: command not found`?** Add Go's bin to your PATH: `export PATH="$PATH:$(go env GOPATH)/bin"` (macOS/Linux) or add `%USERPROFILE%\go\bin` to PATH (Windows).

:::tip[vfs: command not found?]
Add Go's bin to your PATH:

- **macOS / Linux**: `export PATH="$PATH:$(go env GOPATH)/bin"`
- **Windows**: add `%USERPROFILE%\go\bin` to your system PATH
:::

## Windows step-by-step

Windows requires a few extra steps because vfs uses CGO (tree-sitter bindings need a C compiler). This guide walks through everything from scratch.

### 1. Install Go

Download the installer from [go.dev/dl](https://go.dev/dl/) and run it. The installer adds Go to your PATH automatically.

Open a **new** PowerShell window and verify:

```powershell
go version
# Expected: go version go1.24.x windows/amd64
```

### 2. Install a C compiler

The easiest option is [TDM-GCC](https://jmeubank.github.io/tdm-gcc/):

1. Download the **TDM-GCC installer** from [jmeubank.github.io/tdm-gcc](https://jmeubank.github.io/tdm-gcc/)
2. Run the installer -- choose **"Create"** (not "Manage")
3. Select **MinGW-w64/TDM64** (64-bit)
4. Keep all defaults and finish

Open a **new** PowerShell window and verify:

```powershell
gcc --version
# Expected: gcc (tdm64-1) 10.x.x or similar
```

:::caution[Must open a new terminal]
After installing Go or TDM-GCC, you **must** open a new PowerShell window for the PATH changes to take effect. This is the most common mistake.
:::

### 3. Install Git (if you don't have it)

Download from [git-scm.com](https://git-scm.com/download/win) and install with defaults.

### 4. Build vfs

```powershell
git clone https://github.com/TrNgTien/vfs.git
cd vfs
go install ./cmd/vfs
```

### 5. Add Go bin to PATH

The `go install` command places the binary in `%USERPROFILE%\go\bin`. You need to add this to your system PATH:

**Option A -- via PowerShell (current user, permanent):**

```powershell
$gobin = [System.IO.Path]::Combine($env:USERPROFILE, "go", "bin")
[Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";" + $gobin, "User")
```

**Option B -- via System Settings:**

1. Press `Win + R`, type `sysdm.cpl`, press Enter
2. Go to **Advanced** tab, click **Environment Variables**
3. Under "User variables", select **Path**, click **Edit**
4. Click **New**, add `%USERPROFILE%\go\bin`
5. Click **OK** on all dialogs

Open a **new** PowerShell window, then verify:

```powershell
vfs --help
```

### Troubleshooting Windows

**\`gcc: command not found\` or \`exec: "gcc": executable file not found\`**

The C compiler isn't in your PATH. Reinstall TDM-GCC and make sure you selected MinGW-w64/TDM64. Open a new terminal after installing.

**\`vfs: command not found\` after \`go install\`**

Go's bin directory isn't in your PATH. Run this to check where Go installed the binary:

```powershell
go env GOPATH
# Then look inside that path's \bin folder
```

Add that `bin` folder to your PATH as shown in step 5.

**\`CGO_ENABLED\` errors**

Ensure CGO is enabled (it should be by default when a C compiler is found):

```powershell
go env CGO_ENABLED
# Should print: 1
```

If it prints `0`, set it explicitly:

```powershell
$env:CGO_ENABLED = "1"
go install ./cmd/vfs
```

**Using WSL instead**

If you have Windows Subsystem for Linux, you can skip all the above and follow the Linux instructions inside your WSL terminal. This is often the easiest path for developers already using WSL:

```bash
# Inside WSL (Ubuntu)
sudo apt install build-essential
curl -L https://github.com/TrNgTien/vfs/releases/latest/download/vfs-linux-amd64.tar.gz | tar xz
sudo mv vfs /usr/local/bin/
vfs --help
```

## Docker

```bash
docker build -t vfs-mcp .
docker run --rm -v $(pwd):/workspace -p 8080:8080 -p 3000:3000 vfs-mcp
```

On Windows PowerShell, replace `$(pwd)` with `${PWD}`:

```powershell
docker run --rm -v ${PWD}:/workspace -p 8080:8080 -p 3000:3000 vfs-mcp
```

## Verify installation

```bash
vfs --help
```

You should see the vfs help text listing available commands and flags.
