/**
 * Shared site script — v20
 * Root-relative fetch + encoded PDF URL, mobile expand only on Resume, scrollspy, modal.
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

// Small DOM helpers -----------------------------------------------------
function el(tag, attrs={}, children=[]){
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{ if(k==='class') node.className=v; else if(k==='html') node.innerHTML=v; else node.setAttribute(k,v); });
  (Array.isArray(children)?children:[children]).filter(Boolean).forEach(ch=>{ if(typeof ch==='string') node.appendChild(document.createTextNode(ch)); else node.appendChild(ch); });
  return node;
}
function renderSection(id, title){ const s = el('section',{id}); s.appendChild(el('h2',{},title)); return s; }

// Resume renderer -------------------------------------------------------
function renderResume(data){
  const root = document.getElementById('contentRoot'); if(!root) return;
  root.innerHTML = '';

  // Summary
  const s = renderSection('summary','Summary');
  s.appendChild(el('p',{}, data.summary||''));
  root.appendChild(s);

  // Experience
  const exp = renderSection('experience','Experience');
  (data.experience||[]).forEach(job=>{
    const h3 = el('h3',{}, `${job.role||''} — ${job.company||''}`.trim());
    const meta = el('p',{}, `${job.start||''} — ${job.end||''}${job.location? ' · '+job.location:''}`);
    const ul = el('ul'); (job.bullets||[]).forEach(b=> ul.appendChild(el('li',{}, b)));
    exp.appendChild(h3); exp.appendChild(meta); exp.appendChild(ul);
  });
  root.appendChild(exp);

  // Skills
  const skills = renderSection('skills','Skills & Strengths');
  const sc = el('div',{class:'pill-container'});
  (data.skills||[]).forEach(t=> sc.appendChild(el('span',{class:'pill'}, t)));
  skills.appendChild(sc); root.appendChild(skills);

  // Education
  const edu = renderSection('education','Education & Certifications');
  (data.education||[]).forEach(e=>{
    edu.appendChild(el('p',{class:'edu-title'}, e.title||''));
    if(e.bullets && e.bullets.length){ const ul = el('ul'); e.bullets.forEach(b=> ul.appendChild(el('li',{}, b))); edu.appendChild(ul); }
  });
  root.appendChild(edu);

  // Hobbies
  const hob = renderSection('hobbies','Hobbies & Interests');
  const hc = el('div',{class:'pill-container'});
  (data.hobbies||[]).forEach(t=> hc.appendChild(el('span',{class:'pill'}, t)));
  hob.appendChild(hc); root.appendChild(hob);

  // Contact & links (root-anchored, encoded)
  const c = data.contact||{};
  const email=(c.email||'').trim();
  const phone=(c.phone||'').trim();
  const digits=phone.replace(/[^\d]/g,'');
  const ln=c.linkedin || '#';
  const resumeFile=c.resumeFile || '/assets/JakobDeGazio - Resume.pdf';
  const resumeURL = encodeURI(resumeFile.startsWith('/') ? resumeFile : ('/' + resumeFile.replace(/^\//,'')));

  [document.getElementById('contactInfoMobile'), document.getElementById('contactInfoDesktop')].forEach(node=>{
    if (!node) return;
    node.innerHTML = (email || phone)
      ? `${phone?`<p><strong>Phone:</strong> <a rel="nofollow" href="tel:${digits}">${phone}</a></p>`:''}`+
        `${email?`<p><strong>Email:</strong> <a rel="nofollow" href="mailto:${email}">${email}</a></p>`:''}`
      : '';
  });
  const dlD=document.getElementById('dlDesktop'); const dlM=document.getElementById('dlMobile'); if(dlD) dlD.href=resumeURL; if(dlM) dlM.href=resumeURL;
  const lnD=document.getElementById('lnDesktop'); const lnM=document.getElementById('lnMobile'); if(lnD) lnD.href=ln; if(lnM) lnM.href=ln;

  // UI glue
  setupReveal(); setupScrollSpy(); enhanceContactBlocks(); wireProfileClicks();
}

// Contact reveal --------------------------------------------------------
function enhanceContactBlocks(){
  document.querySelectorAll('.contact-block').forEach(block=>{
    const btn = block.querySelector('.contact-toggle');
    const info = block.querySelector('.contact-info');
    if (!btn || !info) return;
    btn.addEventListener('click', ()=>{
      info.classList.remove('is-hidden'); info.classList.add('revealed');
      btn.setAttribute('aria-expanded','true');
      btn.style.display='none';
    }, { once:true });
  });
}

// Scroll reveal ---------------------------------------------------------
function setupReveal(){
  const sections = document.querySelectorAll('main section'); if(!sections.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if (e.isIntersecting) e.target.classList.add('show'); });
  }, { threshold:0.1 });
  sections.forEach(s=> io.observe(s));
}

// Scrollspy -------------------------------------------------------------
function setupScrollSpy(){
  const navLinks = Array.from(document.querySelectorAll('.nav-right a'));
  const sections = Array.from(document.querySelectorAll('main section'));
  if (!navLinks.length || !sections.length) return;
  const idFor = a => (a.getAttribute('href')||'').replace('#','');
  const byId = new Map(navLinks.map(a=>[idFor(a), a]));
  const setActive = id => { if(!id) return; navLinks.forEach(l=>l.classList.remove('active')); const link=byId.get(id); if(link) link.classList.add('active'); };
  function update(){
    const first = sections[0];
    if (window.scrollY <= first.offsetTop + 5) { setActive(first.id); return; }
    const bottom = window.innerHeight + window.scrollY;
    const docH = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    if (bottom >= docH - 2) { setActive(sections[sections.length-1].id); return; }
    const center = window.scrollY + window.innerHeight/2; let cur = first.id;
    for (const sec of sections){ const top=sec.offsetTop, bot=top+sec.offsetHeight; if(center>=top && center<bot){ cur=sec.id; break; } }
    setActive(cur);
  }
  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  document.addEventListener('DOMContentLoaded', update);
  update();
  navLinks.forEach(link=> link.addEventListener('click', ()=>{ setActive(idFor(link)); setTimeout(update, 900); }));
}

// Print ---------------------------------------------------------------
const printBtn = document.getElementById('printBtn');
if (printBtn) printBtn.addEventListener('click', ()=> window.print());

// Mobile expand (Resume only) ----------------------------------------
const expandBtn = document.getElementById('expandBtn');
const mobileProfile = document.getElementById('mobileProfile');
let lastY = window.scrollY, fadeTimer = null;
if (expandBtn && mobileProfile){
  expandBtn.addEventListener('click', ()=>{
    const isExpanded = mobileProfile.classList.toggle('expanded');
    expandBtn.setAttribute('aria-expanded', String(isExpanded));
    if (!isExpanded) expandBtn.classList.remove('faded');
  });
  window.addEventListener('scroll', ()=>{
    if (mobileProfile.classList.contains('expanded')) return;
    const y = window.scrollY; const down = y > lastY; lastY = y;
    if (down) expandBtn.classList.add('faded'); else expandBtn.classList.remove('faded');
    clearTimeout(fadeTimer); fadeTimer = setTimeout(()=> expandBtn.classList.remove('faded'), 400);
  }, {passive:true});
  window.addEventListener('touchstart', ()=> expandBtn.classList.remove('faded'), {passive:true});
}

// Desktop image modal -------------------------------------------------
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
function openModal(src){ if(!imageModal||!modalImage) return; modalImage.src = src; imageModal.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
function closeModal(){ if(!imageModal) return; imageModal.classList.add('hidden'); document.body.style.overflow = ''; }
function wireProfileClicks(){
  document.querySelectorAll('.profile-photo').forEach(photo=>{
    photo.addEventListener('click', ()=>{
      const desktop = window.matchMedia('(min-width: 901px)').matches;
      if (desktop) openModal(photo.getAttribute('src'));
    });
  });
}
if (imageModal) imageModal.addEventListener('click', e=>{ if (e.target.dataset.close === 'true') closeModal(); });
if (modalClose) modalClose.addEventListener('click', closeModal);
document.addEventListener('keydown', e=>{ if (e.key === 'Escape') closeModal(); });

// Root-relative JSON fetch --------------------------------------------
async function fetchResume(){
  try{
    const url = '/assets/resume.json?v=' + Date.now();
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP '+res.status);
    const data = await res.json();
    renderResume(data);
  }catch(e){
    console.error('Failed to fetch /assets/resume.json', e);
    const root = document.getElementById('contentRoot');
    if (root) root.innerHTML = '<section class="show"><h2>Error</h2><p>Could not load <code>/assets/resume.json</code>. Ensure it exists at that path.</p></section>';
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  const needsResume = !!document.getElementById('contentRoot');
  if (needsResume && !window.SKIP_AUTO_LOAD) fetchResume();
});
