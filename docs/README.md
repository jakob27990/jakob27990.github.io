# Site Docs (v24)

## Edit one file
All Resume content **and** right-hand section navigation come from `assets/resume.json`.
- Change labels and order under `nav.sections`.
- Add custom sections by appending to `nav.sections` and providing optional HTML under `sectionsContent` (see schema).

## Local preview (no server)
- Open `local-preview.html` and upload your `assets/resume.json`. It is stored in your browser (localStorage).
- Click **Open Resume** to render. You can also open `index.html` and add `?local=1` to show a small upload bar.

## Deploy
- Upload the whole site (GitHub Pages or any static host).
- Ensure `/assets/JakobDeGazio - Resume.pdf` exists.

## Accessibility & UX
- Theme toggle has a visible focus outline.
- Right-hand section nav is built from the actual sections, ensuring scrollspy and labels stay in sync.
