# Wizard Docs

Source for [wizard-aia.github.io/docs](https://wizard-aia.github.io/docs/),
the documentation site for [Wizard](https://github.com/Wizard-AIA/Wizard-w2)
— a local-first autonomous data analysis agent.

## Local preview

```bash
pip install -r requirements.txt
mkdocs serve
```

Open **http://localhost:8000**.

## Structure

- `docs/getting-started/` — installation, quickstart, the CLI
- `docs/concepts/` — architecture, data modes, sandboxing, permissions,
  skills, connectors
- `docs/guides/` — task-oriented walkthroughs
- `docs/reference/` — configuration and the API/event protocol
- `docs/troubleshooting/` — the edge-cases and gotchas page

Internal/dev-facing documentation (the milestone evolution spec, migration
notes) intentionally stays in the core repo next to the code it describes —
see [CONTRIBUTING.md](CONTRIBUTING.md) for why.

Deployed automatically on every push to `main` via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## License

BSD 3-Clause, matching the core repo — see [LICENSE](LICENSE).
