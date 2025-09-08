/**
 * Shared site script — v22
 * - Dynamic right nav from JSON nav.sections
 * - Local preview: upload JSON on Home to render full site without a server (file://)
 * - Robust asset URL helper for file:// and https
 */

// Theme toggle ----------------------------------------------------------
const themeToggle = document.getElementById('themeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');
const storedTheme = localStorage.getItem('theme');
if (storedTheme) document.documentElement.setAttribute('data-theme', storedTheme);
function setTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  if (themeToggle) themeToggle.textContent = (t==='dark') ? '☀️' : '🌙';
  if (mobileThemeToggle) mobileThemeToggle.textContent = (t==='dark') ? '☀️' : '🌙';
}
(function initTheme(){
  const current = document.documentElement.getAttribute('data-theme')==='dark' ? 'dark' : 'light';
  if (themeToggle) themeToggle.textContent = (current==='dark') ? '☀️' : '🌙';
  if (mobileThemeToggle) mobileThemeToggle.textContent = (current==='dark') ? '☀️' : '🌙';
  if (themeToggle) themeToggle.addEventListener('click', ()=> setTheme(document.documentElement.getAttribute('data-theme')==='dark' ? 'light':'dark'));
  if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', ()=> setTheme(document.documentElement.getAttribute('data-theme')==='dark' ? 'light':'dark'));
})();

// URL helper (supports https and file://) ------------------------------
function assetUrl(rel){
  if(!rel) return '';
  rel = rel.replace(/^\//,'');
  if(location.protocol==='file:'){
    const inPages = /\/pages\//.test(location.pathname) || /\pages\/.test(location.pathname);
    return (inPages? '../' : '') + rel; // e.g., ../assets/resume.json
  }
  return '/' + rel; // e.g., /assets/resume.json
}

// Local preview bar (Home) ---------------------------------------------
function initLocalPreviewBar(){
  const bar = document.getElementById('localPreviewBar');
  if(!bar) return;
  const shouldShow = location.protocol==='file:' || new URLSearchParams(location.search).has('local');
  bar.style.display = shouldShow ? 'block' : 'none';
  if(!shouldShow) return;

  const fileInput = document.getElementById('jsonInput');
  const clearBtn  = document.getElementById('clearLocalJson');
  const toResume  = document.getElementById('goToResume');

  fileInput.addEventListener('change', async (e)=>{
    const f = e.target.files && e.target.files[0];
    if(!f) return;
    const text = await f.text();
    try{
      JSON.parse(text); // validate
      localStorage.setItem('resumeJSON', text);
      bar.querySelector('.status').textContent = 'Loaded ✓ (stored in this browser)';
    }catch(err){ alert('Invalid JSON: ' + err.message); }
  });
  clearBtn.addEventListener('click', ()=>{ localStorage.removeItem('resumeJSON'); bar.querySelector('.status').textContent='Cleared'; });
  toResume.addEventListener('click', ()=>{ const href = assetUrl('pages/resume.html'); location.href = href; });
}

// DOM helpers -----------------------------------------------------------
function el(tag, attrs={}, children=[]){
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{ if(k==='class') node.className=v; else if(k==='html') node.innerHTML=v; else node.setAttribute(k,v); });
  (Array.isArray(children)?children:[children]).filter(Boolean).forEach(ch=>{ if(typeof ch==='string') node.appendChild(document.createTextNode(ch)); else node.appendChild(ch); });
  return node;
}

// Renderers -------------------------------------------------------------
function renderSummary(data){ const s=el('section',{id:'summary'}); s.appendChild(el('h2',{},'Summary')); s.appendChild(el('p',{}, data.summary||'')); return s; }
function renderExperience(data){ const s=el('section',{id:'experience'}); s.appendChild(el('h2',{},'Experience')); (data.experience||[]).forEach(job=>{ s.appendChild(el('h3',{}, `${job.role||''} — ${job.company||''}`.trim())); s.appendChild(el('p',{}, `${job.start||''} — ${job.end||''}${job.location? ' · '+job.location:''}`)); const ul=el('ul'); (job.bullets||[]).forEach(b=> ul.appendChild(el('li',{}, b))); s.appendChild(ul); }); return s; }
function renderSkills(data){ const s=el('section',{id:'skills'}); s.appendChild(el('h2',{},'Skills & Strengths')); const c=el('div',{class:'pill-container'}); (data.skills||[]).forEach(t=> c.appendChild(el('span',{class:'pill'}, t))); s.appendChild(c); return s; }
function renderEducation(data){ const s=el('section',{id:'education'}); s.appendChild(el('h2',{},'Education & Certifications')); (data.education||[]).forEach(e=>{ s.appendChild(el('p',{class:'edu-title'}, e.title||'')); if(e.bullets&&e.bullets.length){ const ul=el('ul'); e.bullets.forEach(b=> ul.appendChild(el('li',{}, b))); s.appendChild(ul); } }); return s; }
function renderHobbies(data){ const s=el('section',{id:'hobbies'}); s.appendChild(el('h2',{},'Hobbies & Interests')); const c=el('div',{class:'pill-container'}); (data.hobbies||[]).forEach(t=> c.appendChild(el('span',{class:'pill'}, t))); s.appendChild(c); return s; }
function renderCustom(id,label,data){ const s=el('section',{id}); s.appendChild(el('h2',{}, label||id)); const html = data?.sectionsContent?.[id]?.html; if(html) s.appendChild(el('div',{html})); else s.appendChild(el('p',{}, 'Coming soon.')); return s; }

const RENDERERS = { summary:renderSummary, experience:renderExperience, skills:renderSkills, education:renderEducation, hobbies:renderHobbies };

// Build right-side nav from JSON order ---------------------------------
function buildRightNavFromJson(nav, root){
  const navRight = document.getElementById('navRight'); if(!navRight) return;
  const themeBtn = navRight.querySelector('#themeToggle');
  navRight.querySelectorAll('a').forEach(a=>a.remove());
  const items = (nav?.sections || []).map(s=> ({ id:s.id, label:s.label||s.id }));
  items.forEach(it=>{
    // Only add link if the section exists in DOM (rendered below).
    const a = el('a',{class:'nav-link', href:'#'+it.id}, it.label);
    navRight.insertBefore(a, themeBtn||null);
  });
}

// Main render from JSON -------------------------------------------------
function renderResume(data){
  const root = document.getElementById('contentRoot'); if(!root) return;
  root.innerHTML='';

  // Build right nav first (from JSON labels); links will point to IDs we render below
  buildRightNavFromJson(data.nav, root);

  // Render sections in JSON-defined order
  const order = (data.nav && Array.isArray(data.nav.sections)) ? data.nav.sections : [
    {id:'summary',label:'Summary'},{id:'experience',label:'Experience'},{id:'skills',label:'Skills'},{id:'education',label:'Education'},{id:'hobbies',label:'Hobbies'}
  ];
  order.forEach(({id,label})=>{
    const fn = RENDERERS[id];
    const sec = fn ? fn(data) : renderCustom(id,label,data);
    root.appendChild(sec);
  });

  // Contact & links
  const c = data.contact||{}; const email=(c.email||'').trim(); const phone=(c.phone||'').trim(); const digits=phone.replace(/[^\d]/g,'');
  const ln=c.linkedin||'#';
  const resumeFile=c.resumeFile||'/assets/JakobDeGazio - Resume.pdf';
  const resumeURL=(function(){ const rr = resumeFile.startsWith('/')? resumeFile.slice(1): resumeFile.replace(/^\//,''); return encodeURI(assetUrl(rr)); })();
  [document.getElementById('contactInfoMobile'), document.getElementById('contactInfoDesktop')].forEach(node=>{
    if(!node) return; node.innerHTML = (email||phone)?`${phone?`<p><strong>Phone:</strong> <a rel="nofollow" href="tel:${digits}">${phone}</a></p>`:''}${email?`<p><strong>Email:</strong> <a rel="nofollow" href="mailto:${email}">${email}</a></p>`:''}`:'';
  });
  const dlD=document.getElementById('dlDesktop'); const dlM=document.getElementById('dlMobile'); if(dlD) dlD.href=resumeURL; if(dlM) dlM.href=resumeURL; const lnD=document.getElementById('lnDesktop'); const lnM=document.getElementById('lnMobile'); if(lnD) lnD.href=ln; if(lnM) lnM.href=ln;

  // Finish UI hooks
  setupReveal(); setupScrollSpy(); enhanceContactBlocks(); wireProfileClicks();
}

// Contact reveal --------------------------------------------------------
function enhanceContactBlocks(){ document.querySelectorAll('.contact-block').forEach(block=>{ const btn=block.querySelector('.contact-toggle'); const info=block.querySelector('.contact-info'); if(!btn||!info) return; btn.addEventListener('click', ()=>{ info.classList.remove('is-hidden'); info.classList.add('revealed'); btn.setAttribute('aria-expanded','true'); btn.style.display='none'; }, {once:true}); }); }

// Reveal ---------------------------------------------------------------
function setupReveal(){ const sections=document.querySelectorAll('main section'); if(!sections.length) return; const io=new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('show'); }); },{threshold:0.1}); sections.forEach(s=> io.observe(s)); }

// Scrollspy -------------------------------------------------------------
function setupScrollSpy(){ const navLinks=Array.from(document.querySelectorAll('.nav-right a')); const sections=Array.from(document.querySelectorAll('main section')); if(!navLinks.length||!sections.length) return; const idFor=a=>(a.getAttribute('href')||'').replace('#',''); const byId=new Map(navLinks.map(a=>[idFor(a),a])); const setActive=id=>{ if(!id) return; navLinks.forEach(l=>l.classList.remove('active')); const link=byId.get(id); if(link) link.classList.add('active'); }; function update(){ const first=sections[0]; if(window.scrollY<=first.offsetTop+5){ setActive(first.id); return; } const bottom=window.innerHeight+window.scrollY; const docH=Math.max(document.body.scrollHeight, document.documentElement.scrollHeight); if(bottom>=docH-2){ setActive(sections[sections.length-1].id); return; } const center=window.scrollY+window.innerHeight/2; let cur=first.id; for(const sec of sections){ const top=sec.offsetTop, bot=top+sec.offsetHeight; if(center>=top && center<bot){ cur=sec.id; break; } } setActive(cur); } window.addEventListener('scroll', update, {passive:true}); window.addEventListener('resize', update); document.addEventListener('DOMContentLoaded', update); update(); navLinks.forEach(link=> link.addEventListener('click', ()=>{ setActive(idFor(link)); setTimeout(update, 900); })); }

// Print ---------------------------------------------------------------
const printBtn = document.getElementById('printBtn'); if(printBtn) printBtn.addEventListener('click', ()=> window.print());

// Image modal ----------------------------------------------------------
const imageModal=document.getElementById('imageModal'); const modalImage=document.getElementById('modalImage'); const modalClose=document.getElementById('modalClose'); function openModal(src){ if(!imageModal||!modalImage) return; modalImage.src=src; imageModal.classList.remove('hidden'); document.body.style.overflow='hidden'; } function closeModal(){ if(!imageModal) return; imageModal.classList.add('hidden'); document.body.style.overflow=''; } function wireProfileClicks(){ document.querySelectorAll('.profile-photo').forEach(photo=>{ photo.addEventListener('click', ()=>{ const desktop=window.matchMedia('(min-width: 901px)').matches; if(desktop) openModal(photo.getAttribute('src')); }); }); } if(imageModal) imageModal.addEventListener('click', e=>{ if(e.target.dataset.close==='true') closeModal(); }); if(modalClose) modalClose.addEventListener('click', closeModal); document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });

// Fetch JSON (prefers localStorage for local preview) ------------------
async function fetchResume(){
  try{
    const local = localStorage.getItem('resumeJSON');
    if(local){ const data = JSON.parse(local); renderResume(data); return; }
    const url = assetUrl('assets/resume.json') + '?v=' + Date.now();
    const res = await fetch(url,{cache:'no-store'});
    if(!res.ok) throw new Error('HTTP '+res.status);
    const data = await res.json();
    renderResume(data);
  }catch(e){
    console.error('Failed to load resume JSON', e);
    const root=document.getElementById('contentRoot');
    if(root){ root.innerHTML = '<section class="show"><h2>Error</h2><p>Could not load <code>assets/resume.json</code>. Open <strong>Home</strong> locally and upload your JSON, or check that the file exists at that path.</p></section>'; }
  }
}

// Init -----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', ()=>{
  initLocalPreviewBar();
  const needsResume = !!document.getElementById('contentRoot');
  if(needsResume && !window.SKIP_AUTO_LOAD) fetchResume();
});
