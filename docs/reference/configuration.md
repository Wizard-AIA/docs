# Configuration Reference

Wizard is configured through `backend/.env` (see `backend/.env.example` in
the core repo for the full, current list with defaults). This page covers
the settings you're most likely to actually need to touch — for the
complete, byte-accurate list, the `.env.example` file itself is the source
of truth; this page can drift, that file can't.

## Providers and models

| Variable | What it does |
|---|---|
| `API_PROVIDER` | The **default** provider — not a global switch. You can still assign a different provider per role (manager/worker/vision). |
| `MODEL_NAME` / `WORKER_MODEL_NAME` / `VISION_MODEL_NAME` | Empty by default, meaning "use whatever this provider has installed." Setting one pins it. |
| `DATA_MODE` | `local-only` / `cloud-only` / `hybrid`. Empty means "derive it": `local-only` on a fresh install, `cloud-only` if `API_PROVIDER` is already a cloud backend. |
| `DATA_SCHEMA_ONLY` | Defaults **on** — the conservative redaction option needs no explicit decision. |
| `OLLAMA_BASE_URL` / `LMSTUDIO_BASE_URL` / `OPENAI_BASE_URL` / `ANTHROPIC_BASE_URL` / `GATEWAY_API_URL` | Provider endpoints. Rewritten from `host.docker.internal` to `127.0.0.1` automatically when the backend isn't containerized, unless you've set them yourself. |

## Execution and sandboxing

| Variable | What it does |
|---|---|
| `EXECUTION_BACKEND` | `host` (default, subprocess per session) / `docker` (container per session) / `inprocess` (dev/test only). `auto` and `local` are older spellings, folded to `host`. |
| `HOST_SANDBOX` | `off` / `best-effort` (default) / `require`. See [Execution & Sandboxing](../concepts/execution-and-sandboxing.md). |
| `HOST_SANDBOX_NETWORK` | `deny` (default) / `allow` — outbound only; loopback always works. |
| `SANDBOX_TIER` | `core` / `standard` (default) / `full` — how much of the analysis toolkit the Docker image ships. |
| `SANDBOX_ENABLED` | `false` disables container creation entirely. |

## Agent behavior

| Variable | What it does |
|---|---|
| `AGENT_TIER` | `auto` (default, inferred from the manager model's parameter count) / `compact` / `balanced` / `full`. |
| `AGENT_MAX_ITERATIONS` | A hard ceiling above whatever the tier allows — deliberately not auto-derived, since a runaway loop against a paid gateway is a billing incident. |
| `AGENT_REQUIRE_APPROVAL` | Turn plan-approval on. Off by default. |
| `AGENT_TURN_TIMEOUT` | Wall-clock deadline per turn. |
| `MAX_TOKENS` | The ceiling every per-purpose output budget is clamped to — lower this if you're tight on context, not the other way around. |

## Host sizing

| Variable | What it does |
|---|---|
| `SYSTEM_PROFILE` | `auto` (default) measures your machine at boot and derives thread counts, worker counts, and memory limits from it. |
| `LLM_NUM_THREAD` / `LLM_NUM_CTX` | Left unset in the shipped example on purpose — setting either in a copied `.env` defeats the auto-derivation on every machine that copies it. |

## Skills

| Variable | What it does |
|---|---|
| `SKILLS_BUILTIN_DIR` / `SKILLS_PROJECT_DIR` | Empty by default, meaning "derive it" (the checkout's `backend/skills/` and `.wizard/skills`). The user layer is never configurable — always your platform config directory, so one machine's layout can't leak into `.env.example` and confuse another. |
| `SKILLS_REGISTRY_API` | Left commented by default (`api.github.com` is correct for most installs) — set it for GitHub Enterprise. |

## What's deliberately *not* here

Repo/API secrets (model provider API keys, connector credentials) are
resolved from the environment first, then a local credential store — never
logged, never returned by any route. See
[Data Modes & Privacy](../concepts/data-modes-and-privacy.md#credentials).
