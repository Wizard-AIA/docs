# Contributing to Wizard Docs

This repo holds only the **user-facing** documentation site. Internal,
dev-facing docs (the milestone evolution spec, architecture notes meant for
contributors, migration guides) intentionally stay in the
[core repo](https://github.com/Wizard-AIA/Wizard-w2) next to the code they
describe — moving them here would separate the explanation from the thing
being explained, for readers who most need them side by side.

## Making a change

```bash
git clone https://github.com/Wizard-AIA/docs.git
cd docs
pip install -r requirements.txt
mkdocs serve
```

Open **http://localhost:8000**, edit the relevant file under `docs/`, and
confirm the page renders the way you expect before opening a PR. The
`Deploy docs` workflow builds with `mkdocs build --strict`, so a broken
internal link fails CI rather than shipping a 404.

## Where content should live

| If it's about... | It goes in... |
|---|---|
| Using Wizard as an end user | `docs/getting-started/`, `docs/guides/` |
| How something works internally | `docs/concepts/` |
| A specific setting or API shape | `docs/reference/` |
| A gotcha or degraded-mode behavior | `docs/troubleshooting/edge-cases.md` |
| Code changes, architecture decisions | The core repo's `CLAUDE.md`/`docs/`, not here |

## Reporting a docs bug

Open an issue against the [core repo](https://github.com/Wizard-AIA/Wizard-w2/issues) —
docs bugs are tracked there so they're not split across every repo in the
org.
