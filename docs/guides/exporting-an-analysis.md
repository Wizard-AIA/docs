# Guide: Exporting an Analysis

Every turn's *real executed steps* — never a reconstruction from the model's
own description of what it did — can be turned into a runnable script or
notebook you can run again later, against fresh data.

## Where it comes from

Two things build on the same underlying export logic, so there's exactly
one definition of "what actually ran" rather than two implementations that
could quietly drift apart:

- **The always-on artifact.** Every turn writes its own analysis script into
  the session workspace automatically — no action needed. It reads the
  session's tables directly from where they already sit.
- **On-demand export**, from the results view beside *Copy* and *Save as
  skill*. This one leaves the session workspace entirely, so it ships its
  own copies of any file-based tables it needs — you might download it and
  open it somewhere with no Wizard session running at all.

## What a connector-sourced table looks like in the export

A table that came from a database connection is never embedded into the
exported script, either as data or as a credential. Instead, the script
looks the connection up **by name** at run time — the same lookup path used
elsewhere for saved connections. This extends the "reference, never the
secret" rule from how connections are stored to what ends up in code you
might hand to someone else.

## When you get a zip instead of a single file

If the export needs to bundle file-based tables alongside the script (a
connector-sourced table never needs this, since it's re-fetched by name
instead), you'll get a zip rather than a bare script file. This is decided
automatically per export, based on whether there's actually anything to
bundle.

## Re-running it later

Because the exported script is built from what genuinely executed — not a
tidied-up retelling — running it again against a fresh copy of the same
data should reproduce the same analysis. If the underlying data has
changed shape (a renamed column, a table that no longer has the same
key), the script will fail the same way regenerated code would, rather
than silently producing a different answer.

## Exporting an older turn

Because each chat turn's executed steps are persisted (not just the
always-on artifact, which reflects only the *latest* turn), you can export
the analysis from a question you asked several turns ago — even after a
later question has overwritten the session's default script.
