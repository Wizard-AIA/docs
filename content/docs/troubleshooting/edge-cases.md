# Edge Cases & Gotchas

Wizard is built around a rule: when something can't be done fully, it
degrades and says so, rather than failing outright or silently pretending
everything's fine. That means there are a lot of specific, intentional
"if X, then Y" behaviors — this page collects the ones people actually run
into, organized by area, so you don't have to discover them one at a time.

## Execution & sandboxing

- **Docker configured but unreachable.** Naming `EXECUTION_BACKEND=docker`
  on a machine with no reachable Docker daemon degrades to `host` with a
  logged warning — it does **not** fall back further to `inprocess`, which
  offers no real isolation at all. `/settings` shows the configured setting
  and the resolved runtime separately, so the substitution is visible.
- **Network isolation isn't enforced on Windows.** Windows Filtering
  Platform requires administrator privileges; `/settings` states this
  directly with the reason rather than silently under-delivering.
- **`RLIMIT_AS` doesn't exist on Windows.** The host runtime's memory cap is
  documented as unenforced there rather than claimed — a Windows job object
  handles process/memory limits differently, and that's what actually
  applies.
- **A sandbox self-test can come back `inconclusive`, not just
  pass/fail.** The network probe dials an address guaranteed not to route
  (RFC 5737); a timeout there proves nothing, so it's reported honestly as
  inconclusive rather than counted as a pass.
- **A permission grant made mid-turn restarts the execution child.** Some
  sandbox mechanisms (a sealed Landlock ruleset, an applied macOS profile, a
  lowered Windows token) can't be widened after the fact once applied. What
  you lose is intermediate Python variables from that turn — your uploaded
  data and tables are reloaded automatically.
- **A literal `/workspace` path only means something inside a container.**
  On the host backend, generated code needs the workspace path Wizard gives
  it, not a hardcoded one — this is handled for you, but if you're reading
  generated code and see a literal `/workspace`, that's a sign something
  unusual is happening.

## Models & providers

- **Don't put a reasoning model in the manager role.** It's called 3–5
  times per question; a model that "thinks out loud" (`deepseek-r1`, `qwq`)
  spends real time deliberating before every one of those calls, and on a
  small distill that can mean minutes per call. Its thinking is stripped
  correctly and never reaches you — you still pay the time cost. A
  reasoning model is fine as the **worker**, which is called once per step.
- **LM Studio has no delete verb for models** — only Ollama does. This is a
  reported limitation, not a broken button.
- **An embedding model that loads but can't actually encode is dropped**,
  not retried indefinitely.
- **A missing or unreachable embedding server is remembered and backed
  off** — retrying every single question on a machine with no encoder
  running would make it feel broken. The backoff doubles on repeated
  failure up to a cap.
- **Cold-starting an embedding model is treated differently from steady
  state.** Loading a model off disk gets a much longer timeout than using
  an already-loaded one — judging both by the same short number rejects a
  perfectly working encoder and permanently drops retrieval to word-overlap
  matching for no good reason.
- **An unpriced cloud model reports token counts with no dollar figure**,
  and is named explicitly as unpriced — never a guessed cost.
- **Under `local-only`, there's no cost meter at all.** Not `$0.00`
  (which would imply a real computed value) — an explicit statement that
  nothing is being metered.

## Data modes & privacy

- **`local-only` refuses a cloud provider outright**, rather than silently
  skipping it and falling back to a local one you didn't choose.
- **Web search is unavailable under `local-only`**, not merely an option
  you didn't pick. A plan step that would search the web is dropped with a
  warning instead of turned into a consent prompt — there's no consent that
  would make it allowed.
- **Switching data mode clears role assignments the new mode forbids.**
  The alternative would be your very next question simply failing, which
  would make a safer setting read as a broken app.
- **Redaction is decided per prompt, not once per turn.** Under a mixed
  setup (cloud planner, local code generator), the same turn can send a
  redacted prompt to one model and an unredacted one to the other.

## Permissions & consent

- **Declining a consent prompt doesn't end your turn.** The specific
  sub-task that needed it is recorded as failed, and the loop routes around
  it — just like any other failed step.
- **Database writes always ask**, every session, regardless of your
  consent profile. There's no setting that skips this specific one.
- **Saving a database connection isn't gated; opening it is.** Saving
  reaches nothing on its own.
- **A permission-suspended turn that hangs resolves to a denial**, not an
  indefinite wait — a timeout, a cancel, and a disconnect all resolve the
  same way.

## Skills

- **A skill can't contain executable code**, enforced by refusing the whole
  install and naming the offending file — not by silently stripping it.
- **Installing a skill from GitHub is something only you can do.** The
  agent can never install one mid-analysis on its own — a fetched skill
  instructing the agent to fetch more skills would otherwise be a real
  self-propagation risk.
- **A shadowed built-in skill still appears in listings.** If a
  user-installed skill has the same name as a built-in one, editing the
  built-in copy would otherwise appear to silently do nothing.

## Connectors

- **A table from a database connection is never embedded in an exported
  script or notebook** — the export looks the connection up by name at run
  time instead, so no credential and no raw data snapshot ends up baked
  into a file you might hand to someone else.
- **Generated code never opens a connector or a socket of its own** — a
  connection is read once by the backend and the result is handed over as a
  normal table, which is what keeps `HOST_SANDBOX_NETWORK=deny` meaning
  what it says even when a database is involved.

## Trust & answers

- **A number close to an execution output isn't flagged as invented.**
  Reporting `3.14` from a raw output of `3.14159159` is recognized as
  rounding, based on the *answer's own* precision — not a false positive.
- **Verification re-derives the result by a genuinely different route.**
  A model reviewing its own answer tends to confirm its own mistakes; a
  second independent computation doesn't share that blind spot.
- **The final answer is synthesized from real execution output — nothing
  client-side ever "cleans up" the response.** An older version of the UI
  used to regex-strip tracebacks, code blocks, and numeric rows out of
  answers, which occasionally deleted legitimate results along with the
  noise.

## Installing models

- **LM Studio reports download progress as a percentage, not bytes** —
  Ollama's native pull API reports bytes; the two are shown differently on
  purpose rather than forced into one shape that's wrong for one of them.
- **A gateway provider hosts its own models.** Asking to install one says
  so plainly rather than offering a button that would just fail.
