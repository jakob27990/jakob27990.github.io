# Local preview (file://) — v22

Open `index.html` directly (double‑click). You’ll see a **Local Preview** bar under the navbar.

- **Upload JSON**: Select your `assets/resume.json` from disk. The file is stored in `localStorage` so navigation to `/pages/resume.html` can render without a web server.
- **Open Resume**: Jumps to the Resume page once JSON is loaded.
- **Clear**: Removes the locally stored JSON and falls back to fetching from `/assets/resume.json` if you are running on a server.

> Tip: You can also append `?local=1` to your URL to force-show the Local Preview bar even when served over HTTP.
