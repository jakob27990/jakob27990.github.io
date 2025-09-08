# JSON schema (v22)

```jsonc
{
  "nav": {
    "sections": [
      { "id": "summary",    "label": "Summary" },
      { "id": "experience",  "label": "Experience" },
      { "id": "skills",      "label": "Skills" },
      { "id": "education",   "label": "Education" },
      { "id": "hobbies",     "label": "Hobbies" },
      // You can add more, e.g. {"id":"projects","label":"Projects"}
    ]
  },

  // Standard sections (optional but recommended)
  "summary": "...",
  "experience": [{ "company": "...", "role": "...", "location": "...", "start":"...", "end":"...", "bullets": ["..."] }],
  "skills": ["..."],
  "education": [{ "title": "...", "bullets": ["..."] }],
  "hobbies": ["..."],

  "contact": {
    "phone": "...",
    "email": "...",
    "linkedin": "https://...",
    "resumeFile": "/assets/JakobDeGazio - Resume.pdf"
  },

  // Optional custom sections (rendered when listed in nav.sections)
  "sectionsContent": {
    "projects": { "html": "<p>Coming soon.</p>" }
  }
}
```

## Notes
- The **right-hand nav** on the Resume page is built from `nav.sections` **in order**. Labels are taken from `label`.
- If you include a section id that isn’t one of the standard sections, it is rendered using `sectionsContent["yourId"].html`. If omitted, a “Coming soon” placeholder is shown.
- The PDF path can include spaces. It should be **root‑relative** like `/assets/JakobDeGazio - Resume.pdf`.
