/**
 * Shared site script — v24
 * - JSON-driven right nav (nav.sections)
 * - Local preview flows (local-preview.html + optional Home bar)
 * - assetUrl() regex-free & robust on file:// and https
 * - Render order: sections first, then build right nav from DOM
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

// URL helper (no regex) -------------------------------------------------
function assetUrl(rel){
  if(!rel) return '';
  if (rel.charAt(0) === '/') rel = rel.slice(1);
  if (location.protocol === 'file:'){
    const inPages = location.pathname.indexOf('/pages/') !== -1;
    return (inPages ? '../' : '') + rel; // e.g., ../assets/resume.json
  }
  return '/' + rel; // e.g., /assets/resume.json
}

// Optional Local preview bar on Home -----------------------------------
function initLocalPreviewBar(){
  const bar = document.getElementById('localPreviewBar');
  if(!bar) return;
  const shouldShow = location.protocol==='file:' || new URLSearchParams(location.search).has('local');
  bar.style.display = shouldShow ? 'block' : 'none';
  if(!shouldShow) return;
  const fileInput = document.getElementById('jsonInput');
  const clearBtn  = document.getElementById('clearLocalJson');
  const toResume  = document.getElementById('goToResume');
  fileInput?.addEventListener('change', async (e)=>{
    const f = e.target.files && e.target.files[0];
    if(!f) return;
    try{ const text = await f.text(); JSON.parse(text); localStorage.setItem('resumeJSON', text); bar.querySelector('.status').textContent = 'Loaded ✓ (stored)'; }
    catch(err){ alert('Invalid JSON: ' + err.message); }
  });
  clearBtn?.addEventListener('click', ()=>{ localStorage.removeItem('resumeJSON'); bar.querySelector('.status').textContent='Cleared'; });
  toResume?.addEventListener('click', ()=>{ location.href = assetUrl('pages/resume.html'); });
}

// DOM helpers -----------------------------------------------------------
function el(tag, attrs={}, children=[]){
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{ if(k==='class') node.className=v; else if(k==='html') node.innerHTML=v; else node.setAttribute(k,v); });
  (Array.isArray(children)?children:[children]).filter(Boolean).forEach(ch=>{ if(typeof ch==='string') node.appendChild(document.createTextNode(ch)); else node.appendChild(ch); });
  return node;
}

// Section renderers -----------------------------------------------------
function renderSummary(d){ const s=el('section',{id:'summary'}); s.appendChild(el('h2',{},'Summary')); s.appendChild(el('p',{}, d.summary||'')); return s; }
function renderExperience(d){ const s=el('section',{id:'experience'}); s.appendChild(el('h2',{},'Experience')); (d.experience||[]).forEach(j=>{ s.appendChild(el('h3',{}, `${j.role||''} — ${j.company||''}`.trim())); s.appendChild(el('p',{}, `${j.start||''} — ${j.end||''}${j.location?' · '+j.location:''}`)); const ul=el('ul'); (j.bullets||[]).forEach(b=> ul.appendChild(el('li',{}, b))); s.appendChild(ul); }); return s; }
function renderSkills(d){ const s=el('section',{id:'skills'}); s.appendChild(el('h2',{},'Skills & Strengths')); const c=el('div',{class:'pill-container'}); (d.skills||[]).forEach(t=> c.appendChild(el('span',{class:'pill'}, t))); s.appendChild(c); return s; }
function renderEducation(d){ const s=el('section',{id:'education'}); s.appendChild(el('h2',{},'Education & Certifications')); (d.education||[]).forEach(e=>{ s.appendChild(el('p',{class:'edu-title'}, e.title||'')); if(e.bullets&&e.bullets.length){ const ul=el('ul'); e.bullets.forEach(b=> ul.appendChild(el('li',{}, b))); s.appendChild(ul); } }); return s; }
function renderHobbies(d){ const s=el('section',{id:'hobbies'}); s.appendChild(el('h2',{},'Hobbies & Interests')); const c=el('div',{class:'pill-container'}); (d.hobbies||[]).forEach(t=> c.appendChild(el('span',{class:'pill'}, t))); s.appendChild(c); return s; }
function renderCustom(id,label,d){ const s=el('section',{id}); s.appendChild(el('h2',{}, label||id)); const html = d?.sectionsContent?.[id]?.html; if(html) s.appendChild(el('div',{html})); else s.appendChild(el('p',{}, 'Coming soon.')); return s; }
const R = { summary:renderSummary, experience:renderExperience, skills:renderSkills, education:renderEducation, hobbies:renderHobbies };

// Build right nav from DOM ---------------------------------------------
function buildRightNavFromDom(){
  const navRight = document.getElementById('navRight'); if(!navRight) return;
  const themeBtn = navRight.querySelector('#themeToggle');
  navRight.querySelectorAll('a').forEach(a=>a.remove());
  document.querySelectorAll('main section').forEach(sec=>{
    const label = (sec.querySelector('h2')?.textContent||sec.id||'').trim();
    const a = el('a',{class:'nav-link', href:'#'+sec.id}, label);
    navRight.insertBefore(a, themeBtn||null);
  });
}

// Main render -----------------------------------------------------------
function renderResume(data){
  const root = document.getElementById('contentRoot'); if(!root) return;
  root.innerHTML='';

  // Render sections in JSON-defined order (fallback to defaults)
  const order = (data.nav && Array.isArray(data.nav.sections) && data.nav.sections.length)
    ? data.nav.sections : [
      {id:'summary',label:'Summary'},{id:'experience',label:'Experience'},{id:'skills',label:'Skills'},{id:'education',label:'Education'},{id:'hobbies',label:'Hobbies'}
    ];
  order.forEach(({id,label})=>{ const fn = R[id]; const sec = fn ? fn(data) : renderCustom(id,label,data); root.appendChild(sec); });

  // Contact & links
  const c = data.contact||{}; const email=(c.email||'').trim(); const phone=(c.phone||'').trim(); const digits=phone.replace(/[^\d]/g,'');
  const ln=c.linkedin||'#';
  const resumeFile=c.resumeFile||'/assets/JakobDeGazio - Resume.pdf';
  const rr = resumeFile.charAt(0)==='/' ? resumeFile.slice(1) : resumeFile; // root-relative to rel
  const resumeURL = encodeURI(assetUrl(rr));
  [document.getElementById('contactInfoMobile'), document.getElementById('contactInfoDesktop')].forEach(node=>{
    if(!node) return; node.innerHTML=(email||phone)?`${phone?`<p><strong>Phone:</strong> <a rel="nofollow" href="tel:${digits}">${phone}</a></p>`:''}${email?`<p><strong>Email:</strong> <a rel="nofollow" href="mailto:${email}">${email}</a></p>`:''}`:'';
  });
  const dlD=document.getElementById('dlDesktop'); const dlM=document.getElementById('dlMobile'); if(dlD) dlD.href=resumeURL; if(dlM) dlM.href=resumeURL;
  const lnD=document.getElementById('lnDesktop'); const lnM=document.getElementById('lnMobile'); if(lnD) lnD.href=ln; if(lnM) lnM.href=ln;

  // Build right nav from DOM now that sections exist
  buildRightNavFromDom();
  setupReveal(); setupScrollSpy(); enhanceContactBlocks(); wireProfileClicks();
}

// Contact reveal --------------------------------------------------------
function enhanceContactBlocks(){ document.querySelectorAll('.contact-block').forEach(block=>{ const btn=block.querySelector('.contact-toggle'); const info=block.querySelector('.contact-info'); if(!btn||!info) return; btn.addEventListener('click', ()=>{ info.classList.remove('is-hidden'); info.classList.add('revealed'); btn.setAttribute('aria-expanded','true'); btn.style.display='none'; }, {once:true}); }); }

// Reveal ---------------------------------------------------------------
function setupReveal(){ const sections=document.querySelectorAll('main section'); if(!sections.length) return; const io=new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('show'); }); },{threshold:0.1}); sections.forEach(s=> io.observe(s)); }

// Scrollspy -------------------------------------------------------------
function setupScrollSpy(){ const navLinks=Array.from(document.querySelectorAll('.nav-right a')); const sections=Array.from(document.querySelectorAll('main section')); if(!navLinks.length||!sections.length) return; const idFor=a=>(a.getAttribute('href')||'').replace('#',''); const byId=new Map(navLinks.map(a=>[idFor(a),a])); const setActive=id=>{ if(!id) return; navLinks.forEach(l=>l.classList.remove('active')); const link=byId.get(id); if(link) link.classList.add('active'); }; function update(){ const first=sections[0]; if(window.scrollY<=first.offsetTop+5){ setActive(first.id); return; } const bottom=window.innerHeight+window.scrollY; const docH=Math.max(document.body.scrollHeight, document.documentElement.scrollHeight); if(bottom>=docH-2){ setActive(sections[sections.length-1].id); return; } const center=window.scrollY + window.innerHeight/2; let cur=first.id; for(const sec of sections){ const top=sec.offsetTop, bot=top+sec.offsetHeight; if(center>=top&&center<bot){ cur=sec.id; break; } } setActive(cur); } window.addEventListener('scroll',update,{passive:true}); window.addEventListener('resize',update); document.addEventListener('DOMContentLoaded',update); update(); navLinks.forEach(link=> link.addEventListener('click',()=>{ setActive(idFor(link)); setTimeout(update,900); })); }

// Print ---------------------------------------------------------------
const printBtn = document.getElementById('printBtn'); if(printBtn) printBtn.addEventListener('click', ()=> window.print());

// Image modal ----------------------------------------------------------
const imageModal=document.getElementById('imageModal'); const modalImage=document.getElementById('modalImage'); const modalClose=document.getElementById('modalClose'); function openModal(src){ if(!imageModal||!modalImage) return; modalImage.src=src; imageModal.classList.remove('hidden'); document.body.style.overflow='hidden'; } function closeModal(){ if(!imageModal) return; imageModal.classList.add('hidden'); document.body.style.overflow=''; } function wireProfileClicks(){ document.querySelectorAll('.profile-photo').forEach(photo=>{ photo.addEventListener('click', ()=>{ const desktop=window.matchMedia('(min-width: 901px)').matches; if(desktop) openModal(photo.getAttribute('src')); }); }); } if(imageModal) imageModal.addEventListener('click', e=>{ if(e.target.dataset.close==='true') closeModal(); }); if(modalClose) modalClose.addEventListener('click', closeModal); document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });

// Fetch JSON (localStorage first) --------------------------------------
async function fetchResume(){
  try{
    const local = localStorage.getItem('resumeJSON');
    if(local){ const data = JSON.parse(local); renderResume(data); return; }
    const url = assetUrl('assets/resume.json') + '?v=' + Date.now();
    const res = await fetch(url,{cache:'no-store'});
    if(!res.ok) throw new Error('HTTP '+res.status);
    renderResume(await res.json());
  }catch(e){
    console.error('Failed to load resume JSON', e);
    const root=document.getElementById('contentRoot');
    if(root){ root.innerHTML = '<section class="show"><h2>Error</h2><p>Could not load <code>assets/resume.json</code>. Open <strong>local-preview.html</strong> to upload it locally, or ensure it exists at that path.</p></section>'; }
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  initLocalPreviewBar();
  if (document.getElementById('contentRoot') && !window.SKIP_AUTO_LOAD) fetchResume();
});
