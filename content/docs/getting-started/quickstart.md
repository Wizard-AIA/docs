# 2-Minute Enterprise Quickstart

This guide walks you through executing your first end-to-end analytical turn, observing sandboxed code execution, validating hallucination-resistant numerical grounding, and exporting production-ready analysis pipelines.

---

## Step 1: Launch the Control Plane

Ensure Wizard is running via your preferred deployment channel:

```bash
# If installed via Homebrew:
wizard start

# If running standalone release:
./cli/wizard start

# If running containerized stack:
docker compose up -d
```

Navigate to **http://localhost:3000** in your browser. The web workspace will automatically connect over WebSockets to the backend control plane (`http://127.0.0.1:8000`).

---

## Step 2: Ingest Datasets & Discover Schemas

Wizard supports streaming ingestion for structured and semi-structured formats without loading entire multi-gigabyte files into web browser memory:

1. **Drag-and-Drop Ingestion**: Drop CSV, Parquet, JSON/NDJSON, Excel (`.xlsx`), Feather, or TSV files directly into the workspace canvas.
2. **Relational Database Connectors**: Alternatively, click **Add Connection** to mount PostgreSQL, MySQL, SQLite, DuckDB, ClickHouse, or Snowflake data warehouses.
3. **Multi-Table Namespace**: Every ingested dataset is automatically indexed into the session catalog and exposed to generated Python scripts as:
   ```python
   # Addressable table dictionary
   df = tables["sales_2026"]
   customers = tables["dim_customers"]
   ```

---

## Step 3: Issue Natural-Language Analytical Inquiries

Unlike basic SQL-generation wrappers, Wizard uses an iterative **Observe ➔ Decide ➔ Act** loop designed for open-ended, multi-step business inquiries:

```text
"Analyze our Q3 enterprise churn. Which customer segments experienced the highest contract downgrades, what are the primary statistical drivers, and how does discounting correlate with churn probability?"
```

### Selecting Execution Tier / Depth
Select your desired analytical depth from the composer toolbar:
- **Fast Tier**: 1 iteration pass, immediate exploratory statistics.
- **Balanced Tier (Default)**: Multi-step investigation with schema probing, dynamic chart generation, and hypothesis validation.
- **Deep Research Tier**: Full multi-turn investigation with automated competitive hypothesis testing, The Council adversarial review, and independent dual-route verification.

---

## Step 4: Inspect the Streaming Execution Cycle

As the agent deliberates, the live UI streams each discrete step in real time:

```log
[PLAN]      Manager forms 3-stage hypothesis on contract discounts vs churn.
[CODE]      Worker writes vectorized pandas & scikit-learn logistic regression.
[GUARD]     CodeGuard AST scan: 0 policy violations detected (safe).
[SANDBOX]   Host Subprocess executed (124ms) — stdout captured.
[SYNTHESIS] Manager synthesizes statistical findings with numerical citations.
```

If generated code triggers an unexpected exception (e.g. key mismatch or timestamp parsing error), Wizard's **Self-Correction Engine** catches the traceback, isolates the failure reason, and generates a corrected AST script without crashing the session.

---

## Step 5: Validate Trust & Numerical Provenance

Enterprise compliance requires verifiable truth. Wizard implements three distinct trust gates on every analytical response:

1. **Strict Provenance Pinning**: Every integer, float, and percentage cited in the final synthesis is traced to raw stdout / DataFrame outputs. Unreferenced numbers trigger a red warning badge.
2. **Dual-Calculation Verification**: The core metric (e.g. `Churn Rate = 14.2%`) is independently recalculated through an alternate mathematical route to eliminate arithmetic artifacts.
3. **Implicit Assumption Auditing**: The side panel surfaces all implicit data transformations (dropped NaN rows, coerced date formats, filtered outliers, or join cardinality choices).

---

## Step 6: Export & Automate

Once satisfied with the findings:
- **Export Reproducible Python Script**: Download a fully self-contained `.py` script that can be scheduled via Airflow, Prefect, or cron.
- **Export Executive PDF / Markdown Report**: Generate a formatted evidence-backed report with embedded interactive charts.
- **Promote to Skill**: Save the analytical pattern as a reusable corporate skill via `wizard skills` for your team.

---

## Next Steps

- Explore the complete [CLI Reference Guide](cli.md) for automated scripting.
- Review [Data Modes & Air-Gap Privacy](../concepts/data-modes-and-privacy.md) before connecting production databases.
- Read [Execution Sandboxing & CodeGuard](../concepts/execution-and-sandboxing.md) to understand kernel isolation boundaries.

