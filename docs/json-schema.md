# JSON schema (v24)

```jsonc
{
  "nav": {
    "sections": [
      { "id": "summary",    "label": "Summary" },
      { "id": "experience",  "label": "Experience" },
      { "id": "skills",      "label": "Skills" },
      { "id": "education",   "label": "Education" },
      { "id": "hobbies",     "label": "Hobbies" }
      // Add more: {"id":"projects","label":"Projects"}
    ]
  },
  "summary": "...",
  "experience": [ { "company": "...", "role": "...", "location": "...", "start": "...", "end": "...", "bullets": ["..."] } ],
  "skills": ["..."],
  "education": [ { "title": "...", "bullets": ["..."] } ],
  "hobbies": ["..."],
  "contact": {
    "phone": "...",
    "email": "...",
    "linkedin": "https://...",
    "resumeFile": "/assets/JakobDeGazio - Resume.pdf"
  },
  "sectionsContent": {
    "projects": { "html": "<p>Coming soon.</p>" }
  }
}
```

**Notes**
- Right-hand nav is built from the rendered sections, keeping labels aligned with the section content.
- Custom section ids not in the standard set use `sectionsContent[id].html` (falls back to a placeholder if missing).
- PDF path should be root-relative (`/assets/...`).
