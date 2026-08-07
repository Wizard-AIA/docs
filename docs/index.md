# Wizard

A local-first autonomous data analysis agent. Ask a real question about your
data; it investigates — looking, computing, revising its approach when the
data disagrees with it — then verifies the result and explains it, streaming
its reasoning as it goes.

[Get started :material-arrow-right:](getting-started/installation.md){ .md-button .md-button--primary }
[View on GitHub :fontawesome-brands-github:](https://github.com/Wizard-AIA/Wizard-w2){ .md-button }

## What it is

Wizard runs entirely on your machine. Your data never leaves it, and no API
key is required by default — cloud providers are supported too, gated behind
an explicit [data mode](concepts/data-modes-and-privacy.md).

You upload a file (or connect a database) and ask a question in plain
language. A **manager** model works out what to do; a **worker** model writes
the Python. The code is statically screened, then executed in its own
subprocess under OS-native sandboxing by default — or in a Docker container
scoped to your session if you opt into that instead. See
[Execution & Sandboxing](concepts/execution-and-sandboxing.md).

The important part is what happens next. Rather than following a plan fixed
before anything ran, the manager sees the **real output** and decides what to
do next — examine a column, compute something else, consult an attached
document, revise the plan outright, or stop and answer. It repeats until it
has an answer or runs out of budget. Real analytical questions are rarely one
step; you find out the join key is dirty, or that "active customer" means
three different things in three tables, only once you have looked. See
[Architecture](concepts/architecture.md) for how the loop works.

## Why you might want it

- **Local first.** Two small Ollama models are enough to be useful. Nothing
  is sent anywhere unless you explicitly choose a cloud provider.
- **You choose the models.** Nothing is hardcoded — the app uses whatever
  your provider actually has, and you can assign a different model, on a
  different backend, to each role.
- **It sizes itself to your hardware.** A 1.5B model gets a short leash and
  deterministic fallbacks; a large model gets a long investigation. Same app,
  one setting, and `auto` works it out from the model itself.
- **It runs the code, it doesn't just suggest it.** Results come from
  execution, not from a model claiming an answer.
- **It checks its own work.** The headline result is recomputed by a
  different route, and any figure in the answer that appears in no execution
  output is flagged rather than quietly presented.
- **It tells you what it assumed.** Dropped nulls, inner joins, top-N cuts —
  read back out of the code that actually ran, not out of the model's
  description of it.
- **It corrects itself.** Failures are fed back with the traceback, and
  successful repairs are remembered as negative examples for next time.
- **Docker is optional, not a fallback.** Without it, code runs in a
  subprocess per session — its own memory ceiling, a per-step timeout, a
  working Stop button, and variables that persist between steps.
- **It is honest about degradation.** No embedding model? Retrieval falls
  back to word overlap. Model unreachable? You get a clear message, not a
  hang. Nothing silently pretends — see
  [Edge Cases & Gotchas](troubleshooting/edge-cases.md) for the full list.

## Where to go next

<div class="grid cards" markdown>

- :material-download: **[Installation](getting-started/installation.md)**
  — Docker or bare-metal, prerequisites, disk-space tiers
- :material-rocket-launch: **[Quickstart](getting-started/quickstart.md)**
  — from a blank install to your first answered question
- :material-sitemap: **[Architecture](concepts/architecture.md)**
  — the manager/worker loop, the trust layer, the event protocol
- :material-alert-decagram: **[Edge Cases & Gotchas](troubleshooting/edge-cases.md)**
  — the degraded-mode behaviors worth knowing about before you hit them

</div>
