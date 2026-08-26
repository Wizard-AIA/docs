# Data Modes & Privacy

This is the mechanism behind Wizard's local-first promise. Without it,
"your data stays local" would just be a property of how you happened to
configure a `.env` file — assign a cloud provider to a role, and the
prompt, sample rows and all, goes to it. Wizard makes that an explicit,
enforced, session-wide setting instead.

## The three modes

| Mode | Behavior |
|---|---|
| `local-only` | Cloud providers are **refused**, not skipped — a hard boundary, not a preference. Attempting to resolve a cloud provider raises rather than silently falling back. |
| `cloud-only` | Only cloud providers may be used. |
| `hybrid` | Local and cloud providers can both be assigned, per role — plan on a local model, generate code on a cloud one, or any other split. |

Mode is set session-wide and seeded from your configured default. Switching
mode **clears any role assignment the new mode forbids** — the alternative
would be the next question simply failing, which would make a setting you
chose to be *safer* read as having broken the app.

## Three separate axes

Data mode is deliberately not one setting:

- **Mode** — which providers a role may resolve to (above).
- **Policy** — how much of your data a cloud-bound prompt actually carries.
  Redaction (below) is decided **per prompt**, based on which provider that
  specific prompt is going to. Under `hybrid` with a cloud manager and a
  local worker, the planning prompt is redacted and the code-generation
  prompt isn't.
- **Tools** — web search is *unavailable* under `local-only`, not merely
  unchosen. If the agent's plan would search the web, that step is dropped
  with a warning rather than turned into an approval prompt — there's no
  consent that would make it allowed, so asking would be theatre.

## What redaction actually withholds

When a prompt is redacted, it keeps shape, column names, dtypes, null rates
and semantic types — but drops every real value: example rows, the
data-glimpse preview, summary statistics, and categorical distinct values
(replaced by a count). The model is told explicitly that values were
withheld and must be computed, not guessed.

**Execution output is never redacted.** The final answer is synthesised from
real stdout — withholding that would leave the answering model nothing to
answer from. This is stated plainly in the UI rather than implied.

Redaction is settable **per source**, not just per session — a published
reference table and a payroll export don't deserve the same policy. An
explicit override survives independently of the session default, and is
dropped when its dataset is removed, so re-uploading a file of the same name
doesn't silently inherit a policy meant for something else.

## Embeddings are data too

Text sent to be embedded is still data. A forbidden encoder **degrades to
the built-in hashing fallback** instead of raising — retrieval quality
getting worse is something you can live with; a failed question isn't.

## Credentials

API keys live in a local `credentials.json` under your platform's config
directory — this is **not encryption at rest**, the guarantee is the same
OS-level access control `~/.aws/credentials` relies on, stated plainly
rather than dressed up as something stronger. Keys are never logged and
never returned by any API route — only whether one is configured, and a
masked hint (`…abcd`).

## Cost, when a cloud model runs

Token usage is reported per turn — three shapes of data depending on what
the provider actually returns, falling back to an estimate flagged as
inexact rather than silently reporting nothing. An unpriced model reports
tokens with no cost figure and is named as unpriced, rather than guessing at
a dollar amount. **Under `local-only`, there is no cost meter at all** — not
`$0.00`, which would read as a computed number, but an explicit statement
that there's nothing to meter.
