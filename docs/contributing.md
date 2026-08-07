# Contributing

## To the docs site (this repo)

This site is built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/)
from plain Markdown in `docs/`. To preview locally:

```bash
git clone https://github.com/Wizard-AIA/docs.git
cd docs
pip install -r requirements.txt
mkdocs serve
```

Open **http://localhost:8000**. Every page has an *Edit this page* link that
takes you straight to the source file on GitHub if you spot something wrong
or out of date.

## To the core engine

Code contributions — backend, frontend, or the CLI — go through
[Wizard-AIA/Wizard-w2](https://github.com/Wizard-AIA/Wizard-w2). See that
repo's
[CONTRIBUTING.md](https://github.com/Wizard-AIA/Wizard-w2/blob/master/CONTRIBUTING.md)
for setup, coding conventions, and the PR checklist.

## To the skills registry

Contributing a `SKILL.md` to the community registry, rather than code, goes
through [Wizard-AIA/skills](https://github.com/Wizard-AIA/skills) — see its
own CONTRIBUTING.md for the format and submission process.

## Reporting a documentation bug

If a page here is wrong, out of date, or missing something you needed, open
an issue against the core repo — the docs are the same project, and
tracking bugs in one place beats splitting reports across every repo in the
org.
