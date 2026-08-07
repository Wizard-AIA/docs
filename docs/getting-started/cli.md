# The wizard CLI

`wizard` is a single static binary that manages the backend and frontend as a
background service — the same subcommands, same behavior, on Linux, macOS
and Windows. It replaces the manual `uvicorn` + `npm run dev` dance (and
`docker compose up`, which remains available and opt-in) with
`wizard init && wizard start`.

## Building

Requires Go 1.23+.

```bash
cd cli
go build -o wizard ./cmd/wizard          # wizard.exe on Windows
```

There's no published release pipeline yet — building from source is the
documented way to get the binary for now. See
[cli/README.md](https://github.com/Wizard-AIA/Wizard-w2/blob/master/cli/README.md)
for cross-compilation flags and version-stamping.

## Subcommands

Run from inside a Wizard checkout (or any subdirectory of one) — `wizard`
locates the checkout root by walking up looking for `backend/main.py` +
`frontend/package.json`, the way `git`/`npm` locate their own project root.

| Command | What it does |
|---|---|
| `wizard init` | Checks Python 3.11+/Node 20+ (and optional Ollama) are on PATH; copies `backend/.env.example` → `backend/.env` if missing; creates a venv and installs backend requirements; builds the frontend's production bundle. `--pull-models` also pulls a default manager/worker pair if Ollama is present. It detects and instructs — it never installs Python/Node/Ollama on your behalf. |
| `wizard start` | Launches backend + frontend as a detached background service, waits until the backend answers healthy, checks version compatibility, then opens a browser. `--backend-port`/`--frontend-port` override the 8000/3000 defaults; `--no-browser` skips opening one. |
| `wizard stop` | Idempotent — asks the service to stop and cleans up, falling back to a forced kill if needed. |
| `wizard status` / `wizard doctor` | What's running, log sizes, execution backend, host sizing, sandbox capability. |
| `wizard attach` | Prints status, then follows the backend/frontend logs live until Ctrl+C. Read-only. |
| `wizard logs` | Prints log file paths; `--tail N` also prints the last N lines of each. |
| `wizard update` | Pulls the latest checkout, reinstalls dependencies, re-checks version compatibility. Restarts the service afterward if it was running. Updates the checkout only, not the `wizard` binary itself. |
| `wizard version` | Prints this binary's compiled-in compatibility version. |

## What it deliberately doesn't do

- **Update itself.** `wizard update` updates the backend/frontend checkout
  only — there's no release pipeline yet to fetch and replace the binary.
- **Install Python/Node/Ollama for you.** `wizard init` detects what's
  missing and prints the right install command for your OS.
- **Manage the Docker daemon.** `wizard start`/`doctor` only probe
  reachability — an unreachable Docker under `EXECUTION_BACKEND=docker`
  degrades to `host`, same as everywhere else in Wizard.
- **Expose anything remotely.** The daemon binds `127.0.0.1` only, on both
  the backend and frontend sides.
