# Execution & Sandboxing

Generated code has to run somewhere, and that "somewhere" is the one part of
a local-first agent that can actually hurt your machine if it's wrong.
Wizard treats containment as something to report honestly, not assume.

## Three backends, one real last resort

Selected by `EXECUTION_BACKEND`:

| Backend | What runs the code | Isolation |
|---|---|---|
| `host` (default) | one subprocess per session | separate process, OS-native sandboxing — see below |
| `docker` | one container per session | process, filesystem, network, memory, PID, and capability isolation |
| `inprocess` | guarded `exec` in the API process | none — development/test only, never used for a real session |

**Docker is opt-in**, not a silent upgrade or downgrade: it's reached only
when explicitly named, and naming it on a machine with no reachable Docker
daemon degrades to `host` with a logged warning — it does not fall back to
`inprocess`, which is the least contained runtime there is. The `/settings`
page shows both the configured setting and the runtime that actually
resolved, so a substitution is visible rather than silent.

## What the host backend actually enforces

With Docker opt-in, the OS-native sandbox is what stands between generated
code and your machine on a default install. It's controlled by
`HOST_SANDBOX`: `off` / `best-effort` (default) / `require`. Three states
rather than a boolean, because a silent downgrade and an outright refusal
are both wrong as a universal answer — an older Linux kernel without
Landlock still needs to be able to run something, while someone who
explicitly asked for `require` shouldn't be quietly handed a subprocess that
only looks sandboxed.

Per platform:

- **Linux** — Landlock restricts filesystem access; a seccomp-bpf filter
  refuses new outbound socket creation for `AF_INET`/`AF_INET6`/
  `AF_PACKET`/`AF_NETLINK`.
- **macOS** — a deny-by-default `sandbox-exec` (SBPL) profile.
- **Windows** — a job object capping memory and process count, plus a Low
  integrity level the child applies to itself, which blocks writes outside
  directories explicitly labelled for it.

`HOST_SANDBOX_NETWORK` (default `deny`) governs *outbound* traffic only —
loopback always stays open, because the local execution protocol itself is
a loopback socket.

**Network enforcement is not available on Windows** — Windows Filtering
Platform needs administrator privileges, and the alternative (AppContainer)
would mean re-ACLing your entire Python installation. This is stated
directly rather than implied: `/settings` lists what your machine can
actually enforce, with a reason for every gap.

## Verification is a probe, not a claim

`GET /api/sandbox/selftest` spawns a real child process through the same
machinery a session would use, and has it attempt each forbidden operation.
Outcomes are `blocked`, `allowed`, or **`inconclusive`** — the network probe
dials an address guaranteed not to route (RFC 5737 TEST-NET), so a timeout
proves nothing either way, and treating a timeout as a pass would be exactly
the kind of invented claim the trust layer exists to prevent elsewhere. A
feature your platform doesn't support at all is reported as unsupported, not
counted as a failure — the point is to keep a red result meaningful on the
machines that have a real one to report.

## The static guard, underneath all of it

Before any code reaches an interpreter, it's parsed as an AST and checked
against policy — banned modules, banned builtins, interpreter-internals
attribute access, reflection with a computed or dunder attribute name, and
file paths outside the writable roots. This isn't regex matching against
source text; it's a structural check. On the `host` backend this guard is
the *only* static check there is before the OS-level sandbox — on `docker`,
the container itself is the real boundary and the guard is defense in
depth.

## A grant that widens access widens both

When you grant `workspace_write` for a specific directory (see
[Permissions & Consent](permissions-and-consent.md)), that grant has to
widen **both** the code guard's allowed paths and the sandbox's actual
filesystem policy — or consent you gave would read as broken. Some sandbox
implementations (a sealed Landlock ruleset, an applied SBPL profile, a
lowered Windows token) can't be widened after the fact, so a grant made
mid-turn triggers a restart of the execution child with the new policy
baked in from the start. What that restart costs is intermediate Python
variables — the underlying session data and tables are reloaded
automatically, so nothing you've uploaded is lost.
