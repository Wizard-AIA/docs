# Installation

## Prerequisites

- [Ollama](https://ollama.com/) or [LM Studio](#using-lm-studio-instead-of-or-alongside-ollama) — any two local models work; nothing in Wizard is tied to a particular pair.
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — recommended, **not required**. See [Running without Docker](#running-without-docker).

## With Docker

```bash
git clone https://github.com/Wizard-AIA/Wizard-w2.git
cd Wizard-w2
docker compose up --build -d
```

Open **http://localhost:3000**. API docs are at **http://localhost:8000/docs**.

You do not need to install a model first — go to **/models** and use
*Install a model*. Starter picks are offered per provider, downloads show
progress in the page, and nothing sends you to a terminal or the LM Studio
window.

If you'd rather use a terminal:

```bash
ollama pull qwen3:8b             # reasoning
ollama pull qwen2.5-coder:7b     # code
```

Optionally `ollama pull embeddinggemma` (or `nomic-embed-text`) for semantic
retrieval — without one, matching falls back to word overlap.

## Disk space

The sandbox image ships in tiers. `standard` is the default; pick a smaller
one if you're tight on space — the agent is simply told about a smaller
toolkit rather than writing code that then fails to import.

```bash
SANDBOX_TIER=core docker compose up --build -d   # pandas, numpy, pyarrow, duckdb, matplotlib, openpyxl
SANDBOX_TIER=full docker compose up --build -d   # adds survival analysis and geospatial
```

## Running without Docker

The `wizard` CLI is a single static binary that automates the steps below —
checks prerequisites, installs dependencies, and manages the backend/frontend
as a background service, the same on Linux, macOS and Windows:

```bash
cd cli && go build -o wizard ./cmd/wizard   # or download a prebuilt binary once one exists
cd .. && ./cli/wizard init                  # checks Python 3.11+/Node 20+, installs dependencies
./cli/wizard start                          # launches both in the background, opens a browser
./cli/wizard status                         # what's running, host sizing, sandbox capability
./cli/wizard stop
```

See [The wizard CLI](cli.md) for the full subcommand reference. Or do it by
hand:

```bash
pip install -r requirements.txt -r requirements-local.txt
cd backend && uvicorn src.api.api:app --port 8000
cd frontend && npm ci && npm run dev
```

`EXECUTION_BACKEND` defaults to `host`: generated code runs in a
**subprocess** of the backend — a separate process with a memory ceiling, a
per-step timeout, an interrupt that works, and a namespace that survives
between steps. Docker is opt-in; set `EXECUTION_BACKEND=docker` to use a
container per session instead. See
[Execution & Sandboxing](../concepts/execution-and-sandboxing.md) for what's
actually enforced on your platform.

## Using LM Studio instead of (or alongside) Ollama

LM Studio works out of the box — no configuration needed if it's on its
default port.

1. In LM Studio, open **Developer** and **Start Server**.
2. Turn on **Serve on Local Network**. LM Studio binds to loopback by
   default, so a Dockerized backend can't reach it otherwise. (Skip this if
   you run the backend outside Docker.)
3. In the model picker, switch the provider to **LM Studio**.

The provider is stored **per role**, so you can leave the reasoning model on
Ollama and put only the code model on LM Studio, or vice versa.

Any other OpenAI-compatible server (vLLM, llama.cpp, a hosted gateway) works
through `API_PROVIDER=custom_gateway` with `GATEWAY_API_URL`.

## A note on model size

The agent decides its own next step each iteration, which is a lot to ask of
a very small model. Under 4B parameters it does not ask: it runs a shorter,
deterministic loop — write the code, correct it if it fails, answer — with no
self-revision and no verification pass. 7B and up is where the investigation
behaviour starts to earn its round-trips. Picking **Deep** in the composer
restores them at any size.

**Do not put a reasoning model in the manager role.** `MODEL_NAME` is called
three to five times per question. A reasoning model (`deepseek-r1`, `qwq`,
anything that thinks out loud) spends hundreds to thousands of tokens
deliberating before each one. Use a plain instruct model here —
`qwen2.5:3b` and `llama3.2:3b` are both good and small. A reasoning model is
fine as the `WORKER_MODEL_NAME`, which is called once per step.
