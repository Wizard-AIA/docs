# Data Connectors & Ingestion

Wizard ingests a wide array of tabular, document, and database formats while preserving local-first privacy.

---

## 📊 Tabular Formats & Engines

Wizard natively reads and processes the following formats directly in memory and sandbox environments:

| Format | Extension | Recommended Engine | Description |
|---|---|---|---|
| **CSV / TSV** | `.csv`, `.tsv` | DuckDB / Polars / Pandas | Ingests delimited text with automatic delimiter and header detection. |
| **Apache Parquet** | `.parquet`, `.pq` | PyArrow / DuckDB / Polars | High-efficiency columnar format with snappy/gzip compression. |
| **Apache Feather** | `.feather`, `.ft` | PyArrow / Polars | Ultra-fast zero-copy memory-mapped dataframe serialization. |
| **Microsoft Excel** | `.xlsx`, `.xls`, `.xlsm` | Openpyxl / Pandas | Multi-sheet spreadsheet ingestion. |
| **JSON / NDJSON** | `.json`, `.jsonl`, `.ndjson` | Pandas / Polars | Structured records and newline-delimited JSON. |

---

## ⚡ Zero-Copy Apache Arrow IPC Streaming

For large datasets (100,000+ rows), serializing tabular data into JSON strings creates severe CPU serialization lag and browser memory spikes.

Wizard incorporates **Apache Arrow IPC Streaming** (`/api/workspace/stream-arrow`):

- **Backend:** DataFrames are chunked into PyArrow RecordBatches and streamed in binary Arrow IPC format (`application/vnd.apache.arrow.stream`).
- **Frontend:** Next.js consumes the raw binary stream directly via `@apache-arrow/es2015` and mounts it to virtualized data grid components with **zero intermediate JSON overhead**.

---

## 📑 Reference Documents & Data Dictionaries

You can attach contextual documentation alongside your dataset:

- Supported formats: `.pdf`, `.docx`, `.md`, `.markdown`, `.txt`, `.rst`, `.html`
- **Context Injection:** When an analytical question references business rules, ambiguous acronyms, or column definitions, Wizard performs RAG retrieval on attached documents mid-investigation.

---

## 🗄️ Relational Database Connectors

Wizard supports direct connections to relational databases (PostgreSQL, MySQL, SQLite, DuckDB):

- Queries execute with strict row bounds to prevent unbounded memory consumption.
- Schema metadata is extracted once per session and indexed into the local SQLite store.
