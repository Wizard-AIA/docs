# Data Modes, Privacy & Air-Gap Governance

In enterprise analytics, data residency and confidentiality are non-negotiable. Wizard replaces implicit network trust with an explicit, cryptographically verifiable **Data Mode Governance Engine**.

---

## 1. The Three Governance Modes

Governed by `DATA_MODE` in `backend/.env` or configured per-session:

| Mode | Air-Gap Guarantee | Cloud Model Call Policy | Data Egress Behavior |
|---|:---:|---|---|
| **`local-only`** *(Default)* | **100% Air-Gapped** | **STRICTLY PROHIBITED**: Calling an external API raises `DataModeViolation`. | Zero outbound traffic. Web search tools are completely disabled. Embeddings run locally. |
| **`hybrid`** | **Selective Redaction** | **PERMITTED BY ROLE**: Cloud Manager (reasoning) + Local Worker (code execution) or vice versa. | Raw row data is dynamically stripped via the Redaction Engine before cloud submission. |
| **`cloud-only`** | **Frontier Cloud** | **ENABLED**: Directly dispatches prompts to Gemini, Claude, OpenAI, or custom gateways. | Full prompt telemetry with token and financial usage tracking. |

---

## 2. Hard Security Boundaries vs "Silent Fallbacks"

In Wizard, privacy boundaries are enforced as deterministic policy checks, never as soft preference hints:

```python
# Code snippet representing runtime enforcement in LLMProvider
if session.data_mode == "local-only" and provider.is_cloud:
    raise DataModeViolation(
        f"{provider.name} is a cloud provider and this session is set to local-only. "
        "It cannot be used for the manager or worker role."
    )
```

If a user switches a live session to `local-only`, any active cloud model assignments are immediately revoked from the session state to prevent accidental leakage on subsequent queries.

---

## 3. Dynamic Semantic Redaction Engine

When operating in `hybrid` mode where a cloud model serves as the **Manager** (planner) and a local model operates as the **Worker** (coder), Wizard activates the **Prompt Redaction Engine**:

```diagram
Raw Ingested Dataset (e.g. payroll.csv)
├── Employee Name: "Jane Doe" ───────────────► REDACTED (Withheld)
├── Base Salary: $185,000 ──────────────────► REDACTED (Withheld)
├── Department: "Engineering" ──────────────► REDACTED (Replaced with distinct count: 6)
├── Column Names & Types ───────────────────► PRESERVED (string, float64, int32)
└── Null Value Ratios ──────────────────────► PRESERVED (0.0% nulls)
```

### What Cloud Prompts Carry Under Redaction:
1. **Schema & Structural Metadata**: Table names, column names, resolved data types, row counts.
2. **Missingness & Distribution Metrics**: Null percentages, column sparsity.
3. **Explicit Masking Invariant**: The cloud model receives an explicit instruction: `"Cell values have been withheld under corporate data protection policy. Author code to compute calculations directly on the execution node."`

### Granular Source-Level Overrides:
Privacy policies can be attached to individual data sources. For example, a public `country_codes.csv` table can be marked `unrestricted` while an adjoining `patient_records.parquet` is pinned to `strict-redaction`.

---

## 4. Vector Embeddings & Tri-Model Privacy Governance

Text chunks indexed for Retrieval-Augmented Generation (RAG), table schema indexing, and skill discovery adhere to the session's active data mode:
- **`local-only` Mode:** Cloud embedding providers (OpenAI, Gemini, Custom Gateways) are strictly forbidden. The system utilizes local Ollama embeddings (`nomic-embed-text`, `bge-m3`), in-process sentence-transformers (`all-MiniLM-L6-v2`), or cascades safely to the deterministic Blake2b hashing encoder.
- **`hybrid` Mode:** Users may choose high-dimensional cloud embeddings (such as OpenAI `text-embedding-3-small` or Gemini `text-embedding-004`). Prompt text is subjected to statistical schema redaction (`should_redact`), guaranteeing raw cell contents are stripped before reaching external embedding APIs.
- **`cloud-only` Mode:** All three roles (Manager, Worker, Embeddings) communicate over encrypted HTTPS endpoints with token budgeting and financial telemetry.
- **Offline Fallback Guarantee:** If network connectivity drops or a model is uninstalled, the embedding role automatically falls back to an instant zero-disk 384-dimensional Blake2b hashing encoder without analytical interruption.

---

## 5. Credential Security & Token Protection

1. **Storage Isolation**: API keys are saved in `credentials.json` within the OS-specific configuration path (`~/Library/Application Support/Wizard` or `~/.config/wizard`) with restricted file permissions (`0600`).
2. **Zero Plaintext API Exposure**: Control plane API endpoints never return plaintext API keys. The frontend displays only masked indicators (e.g. `...e8b4`).
3. **Log Sanitization**: API keys, bearer tokens, and user credentials are scrubbed by the structured logger before records are committed to disk.

---

## 6. Financial & Token Auditing

Every turn in `cloud-only` and `hybrid` mode logs structured usage telemetry:
- Prompt tokens, completion tokens, and cache-hit ratios.
- Real-time cost computation mapped against official provider rate cards.
- In `local-only` mode, the cost ledger displays an explicit `"0 egress / air-gapped"` status.

