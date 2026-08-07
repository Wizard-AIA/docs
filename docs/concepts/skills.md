# Skills

A skill is reusable analytical know-how the agent can **cite**. Everything
else Wizard remembers — the semantic cache, working memory, past
trajectories — is private and opaque: it changes what the agent does, but
nothing anyone can read, edit, or point to. A skill is different: it's a
`SKILL.md` file, frontmatter plus instructions, that shows up in the UI as a
named thing informing a specific decision.

## Three layers

Skills resolve from three places, ascending precedence:

1. **Built-in** — ships with Wizard, read-only. An edit here would be lost
   on the next update.
2. **User** — lives beside your other Wizard config (`credentials.json`,
   `connections.json`), applies across every project.
3. **Project** — lives in `.wizard/skills` under your current working
   directory, applies to that project only.

A name defined at more than one layer resolves to the more specific one —
but the shadowed copy is still listed, so editing a built-in skill that's
shadowed by a project-level one of the same name doesn't silently appear to
do nothing.

## Skills carry no executable code

This is a hard trust boundary, not a convention. A skill directory
containing a `.py`, `.sh`, `.ps1`, `.bat`, `.exe`, `.dll`, `.so`, or similar
file is **refused outright**, naming the offending file — refused rather
than silently ignored, so the author finds out at load time instead of
discovering later that half their skill never actually ran. Any Python shown
inside a skill's instructions is illustrative text; the only way anything
derived from it executes is the worker model writing fresh code that then
passes the same static guard and sandbox as anything else.

This matters most once skills become installable from someone else's GitHub
repository (below) — a skill is untrusted text that goes into the manager's
prompt, and if a skill could carry code, a malicious one could try to make
itself self-propagating.

## How a skill gets used

Retrieval happens in the planning prompt and through the `consult` action —
never in the worker's per-iteration prompt, which is rebuilt on every
iteration and every correction retry, so anything riding along there gets
paid for repeatedly. Matching is a local ranking over installed skills, not
a model call — a compact analysis is still just three round-trips with
skills installed.

When a skill informs a plan, that's emitted as a distinct signal in the
event stream, and recorded so `/skills` can show which analyses used which
skill — recorded whether or not the analysis that followed succeeded,
because a skill that's reached for and keeps failing is exactly the one
worth finding.

## Promotion — Wizard can offer to save one

If you ask a structurally similar question enough times, Wizard may offer to
save it as a reusable skill. Two different signals are tracked separately: a
**recurring** question you keep asking (the strongest evidence something
should become a skill), and a **recovery** pattern — a failure that got
fixed, and then recurred (a trap worth documenting, not a routine). The
offer appears once, at the threshold — not every time after, which would
turn a useful prompt into one you learn to dismiss.

**A draft is never written by asking a model to write it.** If a candidate
question has a recorded plan and code that actually ran, the draft is built
from that. If it doesn't, the draft is built from the question alone — there
being nothing else true to say about it yet. Nothing here fabricates a
skill's content; it's the same "report, don't invent" rule the
[trust layer](architecture.md) applies to answers, applied to skill
authorship.

You can also save any answer as a skill directly from the results view,
without waiting for the threshold — "save *this* one" is a different, more
immediate action than the recurring-question offer.

## Installing a skill from someone else's repository

See [Installing a Skill from GitHub](../guides/installing-a-skill.md) for
the walkthrough. The short version: **parse → resolve to a commit → stage →
you read it → you approve.** Nothing reaches the agent between staging and
your explicit approval, and installing is always something *you* do — never
an action the agent can take on its own, since a fetched skill that could
also fetch more skills would be wormable.
