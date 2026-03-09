---
title: Installation
description: Install vfs on Linux, macOS, or Windows via pre-built binary, source build, or Docker.
---

| Your situation | Method | What you need |
|---|---|---|
| **Linux** | [Pre-built binary](#pre-built-binary) | Nothing |
| **macOS / Linux / Windows** | [Build from source](#build-from-source) | Go 1.24+, C compiler |
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

Requires **Go 1.24+** and a **C compiler**.

### C compiler per OS

- **macOS**: `xcode-select --install`
- **Linux (Debian/Ubuntu)**: `sudo apt install build-essential`
- **Linux (Fedora/RHEL)**: `sudo yum groupinstall "Development Tools"`
- **Windows**: install [TDM-GCC](https://jmeubank.github.io/tdm-gcc/) (easiest) or [MSYS2](https://www.msys2.org/) + MinGW-w64

### Clone and install

```bash
git clone https://github.com/TrNgTien/vfs.git && cd vfs
go install ./cmd/vfs
```

:::tip[vfs: command not found?]
Add Go's bin to your PATH:

- **macOS / Linux**: `export PATH="$PATH:$(go env GOPATH)/bin"`
- **Windows**: add `%USERPROFILE%\go\bin` to your system PATH
:::

## Docker

```bash
docker build -t vfs-mcp .
docker run --rm -v $(pwd):/workspace -p 8080:8080 -p 3000:3000 vfs-mcp
```

## Verify installation

```bash
vfs --help
```

You should see the vfs help text listing available commands and flags.
