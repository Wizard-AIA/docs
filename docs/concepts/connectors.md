# Connectors

Databases, document stores, and object storage are an ingest source
**parallel to file upload** — not a different code path with different
guarantees.

## Snapshot, not live pushdown

A connection is read once, in the backend process, and the result is
materialized into your session exactly like an uploaded file would be.
**Generated code never holds a connector and never opens a socket of its
own** — it only ever sees the resulting table. That matters for two reasons:
the network-deny sandbox policy keeps meaning what it says even when a
database is involved, and a write-back gate (below) is a real, enforceable
decision rather than something advisory that generated code could route
around.

## Adding support for a database

Whether a given database is reachable is a question of which driver is
installed, not a question of whether Wizard supports it — the interface is
the deliverable. Drivers are **probed**, never eagerly imported, so the
connectors page renders instantly regardless of what's installed. A missing
driver is listed along with the `pip install` command for it, rather than
hidden — hiding it would let you conclude Wizard can't reach a database that
one install away would fix.

## Reading is bounded automatically

A connector's read is capped by row count, the same way an upload is capped
by file size — a table isn't allowed to unboundedly balloon a session's
memory just because it came from a query instead of a file. Truncation, when
it happens, is reported rather than silent.

## Consent

Opening a saved connection is gated the same way any other consequential
action is — see [Permissions & Consent](permissions-and-consent.md). Saving
a connection is **not** gated, because saving reaches nothing on its own;
only opening it does.

## Write-back has three independent locks

Writing a session table back to its source needs all three, every time:

1. The connection isn't marked read-only.
2. Write-back generally isn't denied for that category.
3. A grant recorded specifically for *that table*, in *that* connection —
   approving a write to a staging table is not approving one to a
   production table in the same database.

Database writes always ask, on every session, regardless of your consent
profile — there's no setting that skips this one.

## A connection is configuration; its data isn't

The non-secret half of a connection (host, database name, which tables)
persists so it survives past any one session — an exported analysis script
can look a connection up **by name** at run time. The credential half is
kept separately, and a connection spec only ever carries a *reference* to a
credential, never the credential itself. There's no field to remember to
strip when sharing a script, because there was never a field to strip.
