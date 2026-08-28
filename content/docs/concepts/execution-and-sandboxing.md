# Execution Sandboxing & CodeGuard Security Architecture

Running AI-generated code against proprietary enterprise data requires absolute containment. Wizard enforces a multi-layered **Defense-in-Depth** model combining compile-time AST security filtering, kernel-level OS containment, strict network isolation, and ephemeral container sandboxing.

---

## 1. Multi-Tier Security Hierarchy

Every line of Python code authored by Wizard passes through two independent security boundaries before reaching a CPU:

```
┌──────────────────────────────────────────────────────────────┐
│  Layer 1: CodeGuard AST Static Analyzer (Pre-Execution)      │
│  - Parses Python AST to block 31 modules, 11 builtins, & dunders│
│  - Rejects path traversals outside the session workspace     │
└──────────────────────────────┬───────────────────────────────┘
                               │ Code passes static policy
                               ▼
┌──────────────────────────────────────────────────────────────┐
│  Layer 2: OS Kernel / Container Sandboxing (Runtime)         │
│  - macOS: Apple Seatbelt (SBPL) deny-all profile             │
│  - Linux: Landlock LSM + Seccomp-BPF socket denial           │
│  - Windows: Job Object limits + Low-Integrity token          │
│  - Docker: Ephemeral container with read-only rootfs         │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│  Layer 3: Ephemeral Workspace Isolation                      │
│  - Isolated socket communication on 127.0.0.1 loopback       │
│  - Ephemeral disk mounts cleared on session deletion         │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Layer 1: CodeGuard AST Security Specification

Before code reaches an interpreter, CodeGuard constructs the Abstract Syntax Tree (AST) using Python's `ast` parser. CodeGuard does not rely on fragile regular expressions; it inspects syntactic nodes:

### Prohibited Language Constructs:

| Category | Count | Blocked Identifiers |
|---|:---:|---|
| **Banned Modules** | 31 | `os`, `sys`, `subprocess`, `shutil`, `signal`, `socket`, `http`, `urllib`, `requests`, `httpx`, `aiohttp`, `ftplib`, `smtplib`, `telnetlib`, `xmlrpc`, `ctypes`, `importlib`, `runpy`, `code`, `codeop`, `compileall`, `py_compile`, `ensurepip`, `venv`, `pip`, `setuptools`, `distutils`, `site`, `sysconfig`, `gc`, `inspect` |
| **Banned Builtin Calls** | 11 | `eval`, `exec`, `compile`, `__import__`, `globals`, `locals`, `vars`, `breakpoint`, `memoryview`, `exit`, `quit` |
| **Banned Dunder Attributes** | 22 | `__subclasses__`, `__bases__`, `__base__`, `__mro__`, `__globals__`, `__code__`, `__closure__`, `__builtins__`, `__loader__`, `__reduce__`, `__reduce_ex__`, `__self__`, `__dict__`, `__func__`, `__wrapped__`, `__getattribute__`, `__init_subclass__`, `system`, `popen`, `spawn`, `fork`, `kill` |
| **Filesystem Path Escapes** | — | Absolute paths outside session directory, `../` directory traversals, `/etc/passwd`, `/proc/self`, Windows drive root escapes. |

### Syntax Error Self-Correction Loop
If generated code contains a syntax anomaly (e.g. unclosed parenthesis), CodeGuard marks the verdict as `retryable_error: true`. The orchestrator feeds the parser error back to the Worker LLM to regenerate valid code without treating syntax errors as malicious security violations.

---

## 3. Layer 2: Runtime Execution Backends

Selected via `EXECUTION_BACKEND` in `backend/.env`:

### 1. Host Execution Backend (`EXECUTION_BACKEND=host`) — *Default*
Spawns an isolated Python subprocess daemon per session over a loopback socket. Operating system containment is governed by `HOST_SANDBOX`:
- `off`: Spawns standard subprocess with no OS policy applied (development only).
- `best-effort` *(Default)*: Applies all kernel security capabilities supported by the host.
- `require`: Refuses to launch unless the kernel enforces hardware/OS isolation.

#### Platform-Specific Isolation Mechanisms:
- **macOS (Apple Seatbelt)**: Applies an SBPL sandbox profile denying unauthorized file writes, network sockets, and Mach service lookups.
- **Linux (Landlock & Seccomp-BPF)**: Landlock seals the filesystem to the workspace directory only; Seccomp-BPF intercepts `socket()` syscalls, immediately denying `AF_INET`, `AF_INET6`, and `AF_PACKET` socket creation.
- **Windows (Job Objects & Integrity Levels)**: Encloses the process in a Windows Job Object with strict RAM and process count quotas, setting the child process to Low Integrity Level.

---

### 2. Containerized Docker Backend (`EXECUTION_BACKEND=docker`)
Spawns a dedicated Docker micro-container per session with full cgroups isolation:
- **Read-Only Root Filesystem**: Prevents modification of base image libraries.
- **Memory Ceiling (`SANDBOX_MEM_LIMIT=2g`)**: Prevents out-of-memory exhaustion of the host machine.
- **PIDs Limit (`SANDBOX_PIDS_LIMIT=256`)**: Prevents fork bombs or runaway multithreading.
- **Network Disablement (`SANDBOX_NETWORK_DISABLED=true`)**: Drops the `eth0` container interface, preventing any network egress.

> **Graceful Degradation Guarantee**: If `EXECUTION_BACKEND=docker` is configured but the Docker daemon is unreachable, Wizard logs a degradation warning and automatically activates the Host OS sandbox rather than failing the user's turn.

---

### 3. In-Process Mode (`EXECUTION_BACKEND=inprocess`)
Executes code in the API thread with stripped builtins. Strictly reserved for CI unit tests with mock execution. Production sessions will never default to in-process mode.

---

## 4. Live Sandbox Self-Testing (`/api/sandbox/selftest`)

Wizard provides automated verification endpoints to test kernel sandbox enforcement on demand:

```bash
curl -s http://127.0.0.1:8000/api/sandbox/selftest | jq
```

**Diagnostic Response Schema:**
```json
{
  "backend": "host",
  "filesystem_isolation": {
    "status": "blocked",
    "details": "Access to /etc/shadow rejected by Landlock LSM"
  },
  "network_isolation": {
    "status": "blocked",
    "details": "Socket creation rejected by Seccomp-BPF filter"
  },
  "memory_limit_enforced": true,
  "hardware_concurrency_ceiling": 4
}
```

---

## 5. User Consent & Dynamic Workspace Widening

When an analytical task requires reading or writing files in an external directory (e.g. `/Users/data/export.parquet`), Wizard triggers an interactive **Consent Gate** in the web UI.

When approved, Wizard dynamically widens `allowed_roots` in the CodeGuard scanner and reinitializes the OS sandbox profile to include the designated path without granting broad filesystem access.
