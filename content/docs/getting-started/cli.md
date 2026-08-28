# Enterprise CLI Reference (`wizard`)

The `wizard` command-line utility is a compiled, zero-dependency Go binary engineered to supervise, configure, and orchestrate the Wizard control plane, Python execution daemons, and Next.js analytics workbenches as background services across macOS, Linux, and Windows.

---

## 1. CLI Architecture & Process Supervision

Instead of requiring manual multi-terminal script invocations (`uvicorn` + `next dev`), `wizard` operates an idempotent, detached supervisor daemon:

```diagram
                  ┌─────────────────────────────────────┐
                  │          wizard CLI Binary          │
                  │   (CLI entrypoint & CLI manager)    │
                  └──────────────────┬──────────────────┘
                                     │ spawns detached
                                     ▼
                  ┌─────────────────────────────────────┐
                  │    Process Supervisor (__supervise) │
                  │  - Health probing & auto-restart    │
                  │  - Signal forwarding (SIGTERM)      │
                  │  - Size-capped log rotation (10MB)  │
                  └──────────┬──────────────────┬───────┘
                             │                  │
                ┌────────────┴────────┐   ┌─────┴──────────────┐
                │   FastAPI Backend   │   │  Next.js Frontend  │
                │ (Control Plane:8000)│   │ (UI Engine: 3000)  │
                └─────────────────────┘   └────────────────────┘
```

### Key Supervisory Guarantees:
- **Zero Orphaned Subprocesses**: When `wizard stop` or a termination signal is received, the supervisor sends `SIGTERM` to the entire process group, guaranteeing that background Python runtimes or host worker sockets do not leak.
- **Port Conflict Resolution**: Probes availability for ports 8000 (backend) and 3000 (frontend) before launching, reporting the blocking PID if occupied.
- **Automatic Log Rotation**: Rotates `backend.log`, `frontend.log`, and `daemon.log` at 10MB bounds, preserving previous logs as `.1.log` to prevent disk saturation.
- **Global Path Resolution**: Automatically detects project roots from both current working directories and Homebrew Cellar installations (`/opt/homebrew/Cellar/wizard/...`).

---

## 2. Command Index & Syntax

### `wizard init`
Initializes local runtime environments, validates system dependencies, generates `backend/.env`, sets up managed virtual environments, installs requirements, and compiles frontend bundles.

```bash
wizard init [flags]
```

#### Flags & Options:
| Flag | Type | Description | Default |
|---|---|---|---|
| `--provider` | `string` | Configures the primary LLM provider: `ollama`, `lmstudio`, `gemini`, `anthropic`, `openai`, or `custom_gateway`. | `ollama` |
| `--data-mode` | `string` | Configures privacy policy: `local-only` (zero cloud egress), `hybrid` (redacted cloud queries), or `cloud-only`. | `local-only` |
| `--gemini-key` | `string` | Injects Google Gemini API Key into `backend/.env`. | `""` |
| `--anthropic-key` | `string` | Injects Anthropic Claude API Key into `backend/.env`. | `""` |
| `--openai-key` | `string` | Injects OpenAI API Key into `backend/.env`. | `""` |
| `--gateway-url` | `string` | Sets OpenAI-compatible gateway endpoint URL (Groq, Together, vLLM, OpenRouter). | `""` |
| `--gateway-key` | `string` | Injects authentication bearer token for custom gateway. | `""` |
| `--model` | `string` | Pins the Manager reasoning model (e.g. `gemini-2.5-flash`, `claude-3-5-sonnet-20241022`). | `""` |
| `--worker-model` | `string` | Pins the Worker Python coding model. | `""` |
| `--pull-models` | `bool` | Automatically triggers `ollama pull` for default manager (`qwen2.5:3b`) and worker (`qwen2.5-coder:7b`). | `false` |
| `--skip-frontend` | `bool` | Skips frontend bundle installation and compilation. | `false` |
| `--skip-backend` | `bool` | Skips Python virtualenv creation and package installation. | `false` |

---

### `wizard start`
Launches the backend control plane and Next.js frontend as a detached background supervisor, polls health endpoints until ready, validates API compatibility markers, and opens the default web browser.

```bash
wizard start [flags]
```

#### Flags & Options:
| Flag | Type | Description | Default |
|---|---|---|---|
| `--backend-port` | `int` | Overrides the backend HTTP port. | `8000` |
| `--frontend-port` | `int` | Overrides the frontend HTTP port. | `3000` |
| `--no-browser` | `bool` | Suppresses automatic browser launch upon service startup. | `false` |
| `--provider` | `string` | Overrides the active LLM provider for this execution run. | `""` |
| `--data-mode` | `string` | Overrides data privacy mode for this execution run. | `""` |

---

### `wizard stop`
Gracefully halts running backend, frontend, and supervisor processes. Idempotent — safe to execute multiple times.

```bash
wizard stop
```

---

### `wizard doctor` / `wizard status`
Performs an in-depth operational audit of the Wizard deployment, verifying process table health, PID state, log disk usage, OS sandbox capabilities (Landlock/seccomp/seatbelt), and active provider configuration.

```bash
wizard doctor
# Alias:
wizard status
```

---

### `wizard attach`
Multiplexes and streams live stdout/stderr from `backend.log` and `frontend.log` directly to your terminal session with source color prefixes until `Ctrl+C` is pressed.

```bash
wizard attach
```

---

### `wizard logs`
Inspects and outputs log file locations and recent log records.

```bash
# Print all log file paths
wizard logs

# Output the last 50 lines across backend and frontend
wizard logs --tail 50
```

---

### `wizard update`
Performs a fast-forward Git synchronization, updates backend and frontend dependencies according to lockfiles, and automatically restarts background daemons if previously active.

```bash
wizard update
```

---

### `wizard skills`
Manages the modular corporate skill ecosystem. Allows installing, updating, inspecting, and removing analytical skills with security scanning.

```bash
# List all installed skills, source repositories, and pinned commit hashes
wizard skills list

# Install a skill from a GitHub repository with AST safety preview
wizard skills add https://github.com/Wizard-AIA/wizard-skills-financial

# Update an installed skill to the latest remote revision
wizard skills update financial-modeling

# Discard local modifications to an installed skill
wizard skills discard financial-modeling

# Remove an installed skill safely
wizard skills remove financial-modeling

# Configure GitHub Personal Access Token (PAT) for private enterprise skill repos
wizard skills token ghp_yourPersonalAccessToken
```

---

### `wizard env`
Validates and displays the effective environment configuration derived from `backend/.env`, system environment variables, and auto-detected hardware profiles.

```bash
wizard env
```

---

### `wizard version`
Outputs the compiled binary version, build timestamp, and backend API compatibility target.

```bash
wizard version
# Output: wizard CLI, backend API compat v4.0.0
```

---

## 3. Configuration & State Paths

Wizard adheres to standard OS configuration hierarchy standards:

| Operating System | Configuration Directory (`WIZARD_CONFIG_DIR`) | Logs Directory (`WIZARD_LOG_DIR`) |
|---|---|---|
| **macOS** | `~/Library/Application Support/Wizard` | `~/Library/Application Support/Wizard/logs` |
| **Linux / BSD** | `~/.config/wizard` (or `$XDG_CONFIG_HOME/wizard`) | `~/.local/state/wizard/logs` (or `$XDG_STATE_HOME/wizard/logs`) |
| **Windows** | `%APPDATA%\Wizard` | `%LOCALAPPDATA%\Wizard\logs` |

---

## 4. Exit Codes & Automation Recipes

The `wizard` binary returns standard POSIX exit codes suitable for CI/CD pipelines and deployment scripts:

| Exit Code | Meaning | Remediation |
|:---:|---|---|
| `0` | Success / Operation Completed | None required. |
| `1` | General Operational Error | Run `wizard doctor` to view failure diagnostics. |
| `2` | Port Conflict Detected | Port 8000 or 3000 is occupied; terminate conflicting process or pass `--backend-port`. |
| `3` | Environment Prerequisite Missing | Install required runtime (Python 3.12, Node.js 20, or uv). |

