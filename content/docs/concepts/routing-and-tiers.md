# Smart Task Routing & Execution Tiers

Not every turn needs the same amount of model. Wizard classifies each one
and dispatches it to a model sized for that specific task, rather than
routing everything through the same heavyweight pair — see
[Architecture](architecture.md) for what the manager, worker, and optional
vision roles (`MODEL_NAME`, `WORKER_MODEL_NAME`, `VISION_MODEL_NAME`) each do.

---

## Task Complexity Classifier

Rather than routing every single turn through heavy reasoning models, the **Task Router** inspects the user query and dataset context to classify the task into three complexity tiers:

| Tier | Characteristics | Example Operations | Target Model |
|---|---|---|---|
| **`LIGHTWEIGHT`** | Direct schema queries, metadata extraction, column definitions, simple formatting. | "What columns are in this table?", "Show table summary" | Small fast model (`1.5B`–`3B`) or fast local model. |
| **`STANDARD`** | Single-pass transformations, basic statistics, standard filtering and aggregations. | "What is the average tip by day?", "Filter orders where status = shipped" | Balanced instruct model (`7B`–`8B`). |
| **`REASONING_HEAVY`** | Multi-table joins, hypothesis validation, anomaly investigation, complex ML modeling. | "Which user cohorts drive churn and why?", "Train a forecast model on sales" | Frontier / Deep Reasoning model (`7B+` coder + reasoning manager). |

---

## Dynamic Turn Downscaling

When a user has multiple local models installed (e.g., both `qwen2.5:3b` and a larger `qwen2.5:14b`), Wizard automatically routes `LIGHTWEIGHT` sub-tasks to the faster model while preserving the primary model for `REASONING_HEAVY` investigation.

This produces:
- **Instant Response Times:** Simple questions answer in under 2 seconds.
- **Lower Resource Consumption:** Minimizes token burn and CPU/GPU memory swapping.
- **Uncompromised Quality:** Complex analytical depth remains available whenever required.
