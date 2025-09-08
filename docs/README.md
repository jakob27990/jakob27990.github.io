# Site Docs (v22)

This folder documents how the site is structured and how to edit it.

## Quick start

1. **Edit one file**: `assets/resume.json`. All content + the right-side Resume navigation labels come from this JSON.
2. **Deploy** the site to your host (GitHub Pages). The pages are:
   - `/` – Home
   - `/pages/resume.html` – Resume (loads JSON + builds right nav from it)
   - `/pages/film.html` – Film (under construction)
   - `/pages/printing.html` – 3D Printing (under construction)

3. **Local preview (no server required)**
   - Simply double‑click `index.html` (file://).
   - Click the **Local Preview** bar at the top, upload your `resume.json`, then click **Open Resume**.
   - The JSON is stored in your browser’s localStorage so you can navigate the full site.
   - Click **Clear** to remove the local JSON.

See `docs/json-schema.md` for the full JSON schema.
