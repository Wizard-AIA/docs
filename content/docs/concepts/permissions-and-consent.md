# Permissions & Consent

## Two independent dials

**Depth** (`fast`/`auto`/`deep`) is how hard the agent works on a question.
**Profile** (`auto-approve`/`ask-always`/`custom`) is how often it stops to
ask you along the way. The same analysis run `deep` + `auto-approve` and
`fast` + `ask-always` reaches the same quality of answer — they differ only
in how many consent prompts you see getting there.

**Data mode always outranks the profile.** Mode decides what's possible at
all; the profile decides what's asked about among what's already allowed.
`local-only` still refuses web search outright regardless of profile — no
setting can consent past that boundary.

## What's gated

| Category | Trigger |
|---|---|
| **Library install** | A generated import that isn't already available, checked *before* execution runs — not silently installed after a failure. |
| **Network** | The plan's web-search step; installing a skill from GitHub. |
| **Workspace write** | A literal file path the code guard would otherwise reject, outside the session's normal writable roots. |
| **Database connect** | Opening a saved connection to read its schema or data. Saving a connection itself is not gated — nothing is reached by saving. |
| **Database write** | Writing a session table back to its source. Always asks, every session, regardless of profile. |

The default profile is **ask-always**, not auto-approve — every category
starts at least as consultative as if the permission system didn't exist at
all. Defaulting to auto-approve would have silently stopped asking about web
search for anyone who'd been running an earlier version, which is a trust
regression dressed up as a feature.

## Grants are temporary

Permission grants are scoped to the current session and are **not
persisted** — consent for this analysis is not consent forever, and a grant
that outlived its session would be a permission you could no longer see to
revoke. Tightening the profile mid-session clears any grants already made.

## A denial doesn't end your turn

If you decline a consent prompt mid-analysis, that specific sub-task is
recorded as failed and the loop routes around it — exactly like any other
failed step. Declining once doesn't cost you the whole question; the agent
tries a different angle or reports what it couldn't do.

## Plan approval is a different kind of gate

Separate from the permission categories above: if plan approval is turned
on, the agent's plan is shown to you before anything runs, and the turn
pauses until you approve it. This is *turn-terminating* — you get a fresh
response you explicitly approve, rather than a mid-run interruption. An
approved plan is not silently downgraded to a cheaper depth afterward;
approving work is not the same as asking for less of it.

A plan containing a web search halts for consent **regardless of whether
plan approval is turned on** — that step reaches outside your machine, which
is a different category of decision than everything else in the plan.
