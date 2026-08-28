# Enterprise Configuration Specification

Wizard derives its runtime behavior from environment variables, `backend/.env`, and local credential stores. This reference specifies all available configuration keys, data types, defaults, and architectural implications.

---

## 1. Configuration Resolution Precedence

Settings resolve with deterministic precedence (highest to lowest):

```diagram
┌────────────────────────────────────────────────────────┐
│ 1. Process Environment Variables (export KEY=value)    │  (Highest)
├────────────────────────────────────────────────────────┤
│ 2. Environment File (`backend/.env`)                   │
├────────────────────────────────────────────────────────┤
│ 3. Local Secure Credential Store (`credentials.json`)  │
├────────────────────────────────────────────────────────┤
│ 4. Hardware Auto-Sizing Defaults                       │  (Base)
└────────────────────────────────────────────────────────┘
```

---

## 2. LLM Inference & Provider Configuration

| Variable | Type | Default | Description |
|---|---|---|---|
| `API_PROVIDER` | `string` | `ollama` | Default inference provider: `ollama`, `lmstudio`, `gemini`, `anthropic`, `openai`, or `custom_gateway`. |
| `DATA_MODE` | `string` | `local-only` | Session privacy mode: `local-only` (100% air-gapped), `hybrid` (redacted), or `cloud-only`. |
| `MODEL_NAME` | `string` | `""` | Pins the Manager reasoning model (e.g. `gemini-2.5-flash`, `qwen2.5:3b`). Empty = use provider default. |
| `WORKER_MODEL_NAME` | `string` | `""` | Pins the Worker coding model (e.g. `gemini-2.5-flash`, `qwen2.5-coder:7b`). |
| `VISION_MODEL_NAME` | `string` | `""` | Model used for visual chart inspection and aesthetic critique (e.g. `llama3.2-vision`). |
| `TEMPERATURE` | `float` | `0.0` | Sampling temperature for analytical determinism. |
| `MAX_TOKENS` | `int` | `4096` | Upper token generation limit per completion turn. |
| `LLM_KEEP_ALIVE` | `string` | `30m` | How long local inference engines (Ollama) keep weights loaded in VRAM between manager/worker turns. |
| `LLM_NUM_THREAD` | `int` | `0 (auto)` | CPU inference threads. Auto-derived from physical core count to eliminate memory bus contention. |
| `LLM_NUM_CTX` | `int` | `0 (auto)` | KV cache context window requested from Ollama (e.g. `8192` or `16384`). |
| `LLM_REQUEST_TIMEOUT`| `int` | `300` | HTTP client timeout in seconds for long-context inferences. |

---

## 3. Cloud Provider & Gateway Authentication

| Variable | Type | Default | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | `string` | `""` | Google Gemini API key. Enables Gemini 2.5 Flash / Pro and Google Embeddings. |
| `ANTHROPIC_API_KEY` | `string` | `""` | Anthropic Claude API key for Claude 3.5 Sonnet / Haiku. |
| `OPENAI_API_KEY` | `string` | `""` | OpenAI platform API key for GPT-4o and OpenAI text embeddings. |
| `GATEWAY_API_URL` | `string` | `""` | Base URL for custom OpenAI-compatible gateways (Groq, Together AI, OpenRouter, vLLM). |
| `GATEWAY_API_KEY` | `string` | `""` | Bearer authorization token for the custom gateway endpoint. |
| `OLLAMA_BASE_URL` | `string` | `http://127.0.0.1:11434` | Local Ollama daemon REST endpoint. |
| `LMSTUDIO_BASE_URL` | `string` | `http://127.0.0.1:1234/v1` | Local LM Studio OpenAI-compatible endpoint. |

---

## 4. Sandboxing & Runtime Execution Controls

| Variable | Type | Default | Description |
|---|---|---|---|
| `EXECUTION_BACKEND` | `string` | `host` | Where Python code executes: `host` (subprocess), `docker` (container), or `inprocess` (CI only). |
| `HOST_SANDBOX` | `string` | `best-effort` | OS kernel containment policy: `off`, `best-effort`, or `require` (refuses to start uncontained). |
| `HOST_SANDBOX_NETWORK`| `string` | `deny` | Outbound network egress for generated code: `deny` or `allow`. Loopback always permitted. |
| `SANDBOX_TIER` | `string` | `standard` | Pre-installed data science image toolkit: `core` (pandas/duckdb), `standard` (+scikit-learn/scipy), `full` (+geopandas/lifelines). |
| `SANDBOX_MEM_LIMIT` | `string` | `2g` | Cgroup memory ceiling for sandbox containers. |
| `SANDBOX_CPU_QUOTA` | `int` | `0` | CPU quota in microseconds (`100000` = 1 core, `0` = unrestricted). |
| `SANDBOX_PIDS_LIMIT` | `int` | `256` | Maximum simultaneous child processes per sandbox. |
| `SANDBOX_EXEC_TIMEOUT`| `int` | `180` | Wall-clock execution timeout in seconds before code is forcefully interrupted. |

---

## 5. Agentic Loop & Orchestration Parameters

| Variable | Type | Default | Description |
|---|---|---|---|
| `AGENT_TIER` | `string` | `auto` | Reasoning budget depth: `auto` (derived from model size), `compact` (4 steps), `balanced` (12 steps), `full` (24 steps). |
| `AGENT_MAX_ITERATIONS`| `int` | `24` | Hard ceiling for agent turn iterations to prevent runaway gateway billing. |
| `AGENT_REQUIRE_APPROVAL`| `bool` | `false` | When true, pauses execution after the planning stage for explicit user plan sign-off. |
| `AGENT_PERMISSION_PROFILE`| `string`| `ask-always`| Policy for external actions: `auto-approve`, `ask-always`, or `custom`. |
| `AGENT_VERIFY` | `bool` | `true` | When true, independently recomputes the headline analytical figure via an alternate route. |
| `AGENT_GROUNDING_CHECK`| `bool` | `true` | Pins final textual numbers against raw execution stdout to eliminate hallucinations. |
| `AGENT_TURN_TIMEOUT` | `float` | `300.0` | Total turn wall-clock deadline in seconds. |

---

## 6. System Profiling & Network Security

| Variable | Type | Default | Description |
|---|---|---|---|
| `SYSTEM_PROFILE` | `string` | `server` | Hardware sizing profile: `server`, `workstation`, or `laptop`. |
| `CORS_ALLOW_ORIGINS` | `string` | `http://localhost:3000` | Comma-separated allowlist for browser cross-origin requests. |
| `API_KEY` | `string` | `""` | When set, all mutating control plane routes require the `X-API-Key` HTTP header. |
| `SESSION_MAX_ACTIVE` | `int` | `8` | Maximum concurrent analytical sessions before queueing. |
| `QUEUE_BACKEND` | `string` | `inprocess` | Job queue engine: `inprocess` or `redis`. |
| `CACHE_BACKEND` | `string` | `inprocess` | Semantic trajectory cache engine: `inprocess` or `redis`. |
| `PLOT_FORMAT` | `string` | `html` | Chart output format: `html` (interactive Plotly DOM) or `png` (static matplotlib). |

