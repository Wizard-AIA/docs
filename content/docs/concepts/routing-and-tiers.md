# Smart Task Routing & Execution Tiers

Not every turn needs the same amount of model compute. Wizard classifies each incoming turn and dispatches it across a **Tri-Model Architecture** (**Manager**, **Worker**, and **Embeddings**) sized specifically for that task, rather than routing everything through the same heavyweight pair — see [Architecture](architecture.md).

---

## 1. In-Process SLM Intent Router

Before an analytical loop is scheduled, an in-process **SLM Router** (`SLMRouter`) performs intent classification in sub-10ms:

| Intent Class | Description | Routing Decision | Typical Latency |
|---|---|---|:---:|
| **`METADATA`** | Column lists, table schemas, dataset shapes, row counts. | Synthesizes response immediately from catalog memory without spinning up agent turn. | `< 10ms` |
| **`CHITCHAT`** | Greetings, operational inquiries, help commands. | Handled directly via lightweight templates or fast SLM. | `< 50ms` |
| **`LIGHTWEIGHT`** | Simple scalar filtering, distinct value inspection, single-pass counts. | Dispatched to compact Worker model (`1.5B`–`3B`) with single-step plan. | `< 1.5s` |
| **`DEEP`** | Multi-table joins, causal modeling, hypothesis testing, ML training. | Enters full `ExecutionDAG` multi-agent loop with adversarial verification. | Streaming |

---

## 2. The Tri-Model Routing Matrix

Wizard independently routes three model roles:

```diagram
User Query ──► SLM Intent Router ──► [Manager Role]    (Planning & Synthesis)
                                 ──► [Embedding Role]  (Vector RAG & Search)
                                 ──► [Worker Role]     (Code & Sandbox)
```

1. **Manager Role (`MODEL_NAME`):**
   - Directs investigation strategy and formulates hypotheses.
   - Sized to model tier: `compact` (4 steps), `balanced` (12 steps), or `full` (24 steps).
2. **Worker Role (`WORKER_MODEL_NAME`):**
   - Authors Python (Pandas, Polars, DuckDB) or SQL queries.
   - Receives execution feedback and self-corrects tracebacks.
3. **Embedding Role (`EMBEDDING_PROVIDER`, `EMBEDDING_REMOTE_MODEL`):**
   - Vectors document chunks and schemas for hybrid RAG search.
   - Routes automatically: Local Ollama $\to$ In-Process Sentence-Transformers $\to$ Deterministic Blake2b Hashing.

---

## 3. Dynamic Turn Downscaling & VRAM Management

When multiple models are available locally, Wizard dynamically manages hardware allocations:
- **Zero VRAM Contention:** Manager and Worker roles unload sequentially during memory-constrained operations (`llm_keep_alive`), avoiding memory paging.
- **Fast-Path Metadata:** Schema and column queries never invoke the coding worker.
- **Continuous Quality:** Complex analytical depth remains available whenever required.
