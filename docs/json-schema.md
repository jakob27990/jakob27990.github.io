# JSON schema (v23)

```jsonc
{
  "nav": {
    "sections": [
      { "id": "summary",    "label": "Summary" },
      { "id": "experience",  "label": "Experience" },
      { "id": "skills",      "label": "Skills" },
      { "id": "education",   "label": "Education" },
      { "id": "hobbies",     "label": "Hobbies" }
      // add more like {"id":"projects","label":"Projects"}
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
