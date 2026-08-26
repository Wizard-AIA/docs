# Guide: Installing a Skill from GitHub

Skills become shareable the same way a lot of the ecosystem does it: pulled
from a repository or gist someone else published, not hosted by Wizard
itself. Because a skill's instructions go straight into the manager model's
prompt, installing one from a stranger's repository is a real trust
decision — the flow is designed so nothing reaches the agent until you've
actually read what you're installing.

## The order matters

**Parse the source → resolve it to a specific commit → stage it locally →
you read it → you approve it.** Nothing is available to the agent between
staging and your explicit approval.

1. **Parse.** A repository URL or a gist URL/id (e.g. `Wizard-AIA/skills` or full GitHub URL):
   ```bash
   ./cli/wizard skills add Wizard-AIA/skills
   ```
2. **Pin.** The ref is resolved to a single commit SHA once, and every
   later request for that install carries the same SHA — so a moving branch
   can't be read across two requests and assembled into a "pinned" version
   that never actually existed as one commit. Gists pin to a specific
   revision, not just "the current one," for the same reason.
3. **Stage.** The skill is fetched into a local staging area — a sibling of
   your installed skills, not inside that directory — so it can't become
   live through any accidental directory-scanning bug, and so it's visible
   as a normal folder if you want to look at it directly.
4. **Read.** You see the diff/content before anything is installed.
5. **Approve.** Only now does it become an installed skill the agent can
   retrieve and cite.

## What gets refused before you ever see it

Skills can't carry executable code (see
[Skills](../concepts/skills.md#skills-carry-no-executable-code)) — the
refusal is enforced from the file *listing* returned by the source, before
a single byte of file content is even fetched. Nothing arbitrary is ever
written to disk during this process; only skill text.

## Checking for updates

Checking for an update re-resolves the ref you originally installed at —
never a newly chosen branch — and compares commit SHAs. If nothing changed,
nothing is written, and no file content is even fetched, just the current
SHA. If something changed, you get a diff. Applying the update is a
separate, explicit step after that — and the diff shown is against the file
as it exists on your disk right now, not against the version you originally
installed, since those can differ the moment you've made your own edits to
an installed skill.

## What's always true about this flow

- **Only you can install a skill.** It's never an action the agent can
  take on its own mid-analysis — a fetched skill that could also fetch more
  skills on its own would make the whole mechanism wormable.
- **This is gated as network access**, the same category as any other
  outbound request the app makes on your behalf, but it isn't refused under
  `local-only` — no session data, schema, or rows ever leave your machine
  as part of installing a skill; this is a download of instruction text
  only.
