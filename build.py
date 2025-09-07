#!/usr/bin/env python3
"""
Build script: bundles the site into ./dist with content inlined (no fetch).
- Reads ./assets/resume.json
- Copies ./assets and script.js
- Writes ./dist/index.html with <script id="resumeData">... and a small boot script
Usage: python build.py
"""
from pathlib import Path
import json, shutil

root = Path(__file__).parent
assets = root / 'assets'
dist = root / 'dist'

# Clean dist
if dist.exists():
    shutil.rmtree(dist)

dist.mkdir()

# Copy assets and script.js
shutil.copytree(assets, dist / 'assets')
shutil.copy2(root / 'script.js', dist / 'script.js')

# Read source index and resume
index_src = (root / 'index.html').read_text(encoding='utf-8')
resume = json.loads((assets / 'resume.json').read_text(encoding='utf-8'))
resume_json = json.dumps(resume, ensure_ascii=False)

# Inject inline JSON + boot script (render immediately, no fetch)
boot = f"""
  <script id=\"resumeData\" type=\"application/json\">{resume_json}</script>
  <script>
    window.SKIP_AUTO_LOAD = true; // prevent fetch in script.js
  </script>
"""

# Insert before script.js include
idx = index_src.rfind('<script src="script.js"></script>')
if idx == -1:
    raise SystemExit('script.js include not found in index.html')

index_inline = index_src[:idx] + boot + index_src[idx:] + """
  <script>
    (function(){
      try{
        var tag = document.getElementById('resumeData');
        if(tag){ var data = JSON.parse(tag.textContent||'{}'); if(window.renderResume){ renderResume(data); if(window.buildNavFromSections) buildNavFromSections(); }}
      }catch(e){ console.error('Inline resume failed', e); }
    })();
  </script>
"""

# Write dist index
(dist / 'index.html').write_text(index_inline, encoding='utf-8')
print('Built dist/index.html with inline resume (no fetch).')
