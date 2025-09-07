# Editing Guide for `assets/resume.json`

This site renders your resume from **one source of truth**: `assets/resume.json`.

## Preview & Deploy
- **Local (no server):** open `local.html` → click **Load content** → choose `assets/resume.json`.
- **Hosted / local server:** open `index.html` from a server (e.g., `python -m http.server`). `index.html` fetches `assets/resume.json`.
- **Static build (optional):** run `python build.py` to create `dist/` with content inlined (no fetch). Deploy `dist/` as a fully static site.

## JSON Fields (quick reference)
- `summary` — string paragraph
- `experience[]` — jobs with `company`, `role`, `location`, `start`, `end`, `bullets[]`
- `skills[]` — renders as **pills**
- `education[]` — entries with `title` and optional `bullets[]`
- `hobbies[]` — renders as **pills**
- `sections[]` — **custom sections**; `type` ∈ `pills | bullets | paragraph | html`
- `contact` — `phone`, `email`, `linkedin`, `resumeFile`

See `resume.schema.json` for validation and `resume.template.jsonc` for a commented template you can copy.
