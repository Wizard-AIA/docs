# Changelog

All notable changes and milestones across Wizard releases.

---

## 🚀 [v1.0.1](https://github.com/Wizard-AIA/Wizard-w2/releases/tag/v1.0.1) — Analytics, Task Routing, Arrow Streaming & Hardening

*Release Date: August 25, 2026*

### Highlights
- **Polars Engine Integration:** Added Polars support alongside DuckDB and Pandas for fast, multi-threaded DataFrame processing on large datasets.
- **Smart Tiered Task Router:** Deterministic classifier for `LIGHTWEIGHT`, `STANDARD`, and `REASONING_HEAVY` turns with safe dynamic downscaling to smaller installed models.
- **Zero-Copy Apache Arrow Streaming:** High-throughput binary Arrow IPC streaming endpoint (`/api/workspace/stream-arrow`) and frontend decoder for instant large dataset previews.
- **Security & Fuzzing:** Continuous property-based fuzz testing for AST code guards and file ingest headers, plus OpenSSF Scorecard token permissions.
- **Dynamic Skill RAG & Caching:** Full integration of Semantic Result Cache and Dynamic Skill RAG retrieval.

---

## 📦 [v1.0.0](https://github.com/Wizard-AIA/Wizard-w2/releases/tag/v1.0.0) — First Consumer Release

*Release Date: August 25, 2026*

### Highlights
- **Standalone Prebuilt Binaries:** Shipped pre-compiled standalone zip packages for macOS (arm64/amd64), Linux (amd64/arm64), and Windows (amd64).
- **One-Command CLI:** Introduced `./cli/wizard init` and `./cli/wizard start` supervisor daemon.
- **Evidence-Backed Control Plane:** Multi-hypothesis tracking, adversarial verification, result grounding checks, and transparent assumption extraction.
- **OS-Native Sandboxing:** Secure subprocess execution with Landlock/seccomp on Linux, `sandbox-exec` on macOS, and Windows Job Objects.
- **Autonomous Feedback Loop:** Manager/Worker ReAct agent cycle with automatic Python traceback recovery.

---

For full commit logs, see [Releases on GitHub](https://github.com/Wizard-AIA/Wizard-w2/releases).
