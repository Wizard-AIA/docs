# API & Event Protocol

Full interactive API documentation is served live by your own instance at
**`http://localhost:8000/docs`** — that's the authoritative, always-current
reference for request/response shapes. This page covers the one thing that
doesn't show up well in an OpenAPI viewer: the WebSocket event protocol.

## One request path, two transports

`POST /api/chat` and `WS /ws/chat` both call the same underlying
orchestrator — the transport only translates internal events into frames.
Anything true of one is true of the other; the WebSocket just makes each
step visible as it happens instead of returning once at the end.

## Event frames

| Frame | What it carries |
|---|---|
| `session` | Session identity, sent once at connection start. |
| `status` | High-level state changes. |
| `step_start` / `step_end` | Bounds around one sub-task. |
| `reasoning_delta` | Streamed manager "thinking," if the model exposes it. |
| `plan_delta` | Streamed plan content — split from reasoning by tracking the reasoning-tag boundary as it streams in, so the UI can switch from a thinking panel to a plan view at the right moment. |
| `content_delta` | Streamed final-answer text. |
| `code` | Generated code for the current step. |
| `stdout` | Real execution output. |
| `artifact` | A file produced by execution (a chart, an export). |
| `approval_required` | The turn is **paused**, not ended — carries an `id` you reply to. This is the one frame that distinguishes "waiting for you" from "done." |
| `warning` / `error` | Non-fatal and fatal problems respectively. |
| `final` | The synthesized answer, plus any trust-layer annotations. |

### Investigation frames (the agentic loop made visible)

| Frame | What it carries |
|---|---|
| `iteration_start` | A new loop iteration has begun. |
| `action` | Which action the manager chose (`code`/`consult`/`reflect`/`parallel`/`inspect`/`answer`). |
| `observation` | The result of the most recently opened `action` — closes the most recent one without an observation yet, rather than being matched by an id. |
| `finding` | Something the agent learned worth surfacing directly. |
| `plan_revised` | The plan changed mid-run in response to real output. |
| `assumption` | A silent decision in the generated code (dropped nulls, an inner join, etc.), surfaced alongside the answer. |
| `verification` | The result of re-deriving the headline number by a different route. |
| `skill` | Names which installed skill informed this turn, if any. |
| `skill_candidate` | An offer to save a recurring analysis as a skill — nothing is written unless you confirm. |
| `usage` | What the turn cost, emitted **only** when a cloud model actually ran. Under `local-only` this frame never appears — there's nothing to meter. |

## A client that ignores the newer frames still works

Every frame listed above is additive. A client built against an earlier
version of the protocol that only understands `content_delta`/`stdout`/
`final` degrades gracefully rather than breaking — it just doesn't render
the richer investigation view.

## Subagent branches

When a step fans out into parallel sub-investigations, each branch's own
activity reuses the *same* frame types (`action`, `observation`, `code`,
`stdout`, …), just additionally tagged with a `branch` identifier. There's
no separate frame vocabulary for subagent activity to learn.
