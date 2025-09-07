// Theme toggle
const themeToggle=document.getElementById('themeToggle');
const mobileThemeToggle=document.getElementById('mobileThemeToggle');
const storedTheme=localStorage.getItem('theme');
if(storedTheme) document.documentElement.setAttribute('data-theme', storedTheme);
function setTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  if(themeToggle) themeToggle.textContent = (t==='dark') ? '☀️' : '🌙';
  if(mobileThemeToggle) mobileThemeToggle.textContent = (t==='dark') ? '☀️' : '🌙';
}
(function init(){
  const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  if(themeToggle) themeToggle.textContent = (current==='dark') ? '☀️' : '🌙';
  if(mobileThemeToggle) mobileThemeToggle.textContent = (current==='dark') ? '☀️' : '🌙';
  if(themeToggle) themeToggle.addEventListener('click', ()=> setTheme(document.documentElement.getAttribute('data-theme')==='dark' ? 'light':'dark'));
  if(mobileThemeToggle) mobileThemeToggle.addEventListener('click', ()=> setTheme(document.documentElement.getAttribute('data-theme')==='dark' ? 'light':'dark'));
})();

// Helpers
function el(tag, attrs={}, children=[]) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{ if(k==='class') node.className=v; else if(k==='html') node.innerHTML=v; else node.setAttribute(k,v); });
  (Array.isArray(children)?children:[children]).filter(Boolean).forEach(ch=>{ if(typeof ch==='string') node.appendChild(document.createTextNode(ch)); else node.appendChild(ch); });
  return node;
}
function renderSection(id, title){ const s=el('section',{id}); s.appendChild(el('h2',{},title)); return s; }

// Renderer
function renderResume(data){
  const root = document.getElementById('contentRoot');
  if(!root) return;
  root.innerHTML='';
  // Summary
  const s = renderSection('summary','Summary');
  s.appendChild(el('p',{}, data.summary||''));
  root.appendChild(s);
  // Experience
  const exp = renderSection('experience','Experience');
  (data.experience||[]).forEach(job=>{
    const h3 = el('h3',{}, `${job.role||''} — ${job.company||''}`.trim());
    const meta = el('p',{}, `${job.start||''} — ${job.end||''}${job.location? ' · '+job.location:''}`);
    const ul = el('ul');
    (job.bullets||[]).forEach(b=> ul.appendChild(el('li',{}, b)));
    exp.appendChild(h3); exp.appendChild(meta); exp.appendChild(ul);
  });
  root.appendChild(exp);
  // Skills (pills)
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
  // Hobbies (pills)
  const hob = renderSection('hobbies','Hobbies & Interests');
  const hc = el('div',{class:'pill-container'});
  (data.hobbies||[]).forEach(t=> hc.appendChild(el('span',{class:'pill'}, t)));
  hob.appendChild(hc); root.appendChild(hob);
  // Optional sections
  (data.sections||[]).forEach(sec=>{
    const id = sec.id || (sec.title||'').toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9\-]/g,'');
    const s = renderSection(id, sec.title||'');
    switch((sec.type||'').toLowerCase()){
      case 'pills': {
        const c = el('div',{class:'pill-container'});
        (sec.items||[]).forEach(t=> c.appendChild(el('span',{class:'pill'}, t)));
        s.appendChild(c); break; }
      case 'bullets': {
        const ul = el('ul'); (sec.items||[]).forEach(b=> ul.appendChild(el('li',{}, b))); s.appendChild(ul); break; }
      case 'paragraph': s.appendChild(el('p',{}, sec.text||'')); break;
      case 'html': s.appendChild(el('div',{html: sec.html||''})); break;
      default: s.appendChild(el('p',{}, sec.text||''));
    }
    root.appendChild(s);
  });
  // Contact & links
  const contact = data.contact || {};
  const email = (contact.email||'').trim();
  const phone = (contact.phone||'').trim();
  const phoneDigits = phone.replace(/[^\d]/g,'');
  const ln = contact.linkedin || '#';
  const resumeFile = contact.resumeFile || 'assets/JakobDeGazio - Resume.pdf';
  [document.getElementById('contactInfoMobile'), document.getElementById('contactInfoDesktop')].forEach(node=>{
    if(!node) return;
    node.innerHTML = (email || phone) ? `${phone?`<p><strong>Phone:</strong> <a rel="nofollow" href="tel:${phoneDigits}">${phone}</a></p>`:''}${email?`<p><strong>Email:</strong> <a rel="nofollow" href="mailto:${email}">${email}</a></p>`:''}` : '';
  });
  const dlD=document.getElementById('dlDesktop'); const dlM=document.getElementById('dlMobile'); if(dlD) dlD.href=resumeFile; if(dlM) dlM.href=resumeFile;
  const lnD=document.getElementById('lnDesktop'); const lnM=document.getElementById('lnMobile'); if(lnD) lnD.href=ln; if(lnM) lnM.href=ln;
  // UI init
  setupReveal(); setupScrollSpy(); buildNavFromSections();
}

// Dynamic nav
function buildNavFromSections(){
  const navRight = document.getElementById('navRight');
  if(!navRight) return;
  navRight.querySelectorAll('a[data-dynamic="1"]').forEach(a=>a.remove());
  const customs = Array.from(document.querySelectorAll('main section')).filter(sec=>!['summary','experience','skills','education','hobbies'].includes(sec.id));
  customs.forEach(sec=>{
    const a = document.createElement('a'); a.href = `#${sec.id}`; a.textContent = sec.querySelector('h2')?.textContent || sec.id; a.setAttribute('data-dynamic','1');
    navRight.insertBefore(a, navRight.querySelector('.theme-toggle'));
  });
}

// Reveal
function setupReveal(){
  const sections = document.querySelectorAll('main section'); if(!sections.length) return;
  const io = new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('show'); }); }, {threshold:0.1});
  sections.forEach(s=> io.observe(s));
}

// Scrollspy
function setupScrollSpy(){
  const navLinks = Array.from(document.querySelectorAll('.nav-right a'));
  const sections = Array.from(document.querySelectorAll('main section'));
  if(!navLinks.length||!sections.length) return;
  const idFor = a=>(a.getAttribute('href')||'').replace('#','');
  const byId = new Map(navLinks.map(a=>[idFor(a), a]));
  const setActive = id=>{ if(!id) return; navLinks.forEach(l=>l.classList.remove('active')); const link=byId.get(id); if(link) link.classList.add('active'); };
  function update(){
    const first = sections[0];
    if(window.scrollY <= first.offsetTop + 5){ setActive(first.id); return; }
    const bottom = window.innerHeight + window.scrollY;
    const docH = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    if(bottom >= docH - 2){ setActive(sections[sections.length-1].id); return; }
    const center = window.scrollY + window.innerHeight/2; let cur=first.id;
    for(const sec of sections){ const top=sec.offsetTop, bot=top+sec.offsetHeight; if(center>=top && center<bot){ cur=sec.id; break; } }
    setActive(cur);
  }
  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  document.addEventListener('DOMContentLoaded', update);
  update();
  navLinks.forEach(link=> link.addEventListener('click', ()=>{ setActive(idFor(link)); setTimeout(update, 900); }));
}

// Print
const printBtn=document.getElementById('printBtn'); if(printBtn) printBtn.addEventListener('click', ()=> window.print());

// Mobile expand + micro interaction
const expandBtn=document.getElementById('expandBtn');
const mobileProfile=document.getElementById('mobileProfile');
let lastY=window.scrollY, fadeTimer=null;
if(expandBtn && mobileProfile){
  expandBtn.addEventListener('click', ()=>{ const isExpanded = mobileProfile.classList.toggle('expanded'); expandBtn.setAttribute('aria-expanded', String(isExpanded)); if(!isExpanded) expandBtn.classList.remove('faded'); });
  window.addEventListener('scroll', ()=>{ if(mobileProfile.classList.contains('expanded')) return; const y=window.scrollY; const down=y>lastY; lastY=y; if(down) expandBtn.classList.add('faded'); else expandBtn.classList.remove('faded'); clearTimeout(fadeTimer); fadeTimer=setTimeout(()=> expandBtn.classList.remove('faded'), 400); }, {passive:true});
  window.addEventListener('touchstart', ()=> expandBtn.classList.remove('faded'), {passive:true});
}

// Fetch resume.json (index.html)
async function fetchResume(){
  try{ const res = await fetch('assets/resume.json', {cache:'no-store'}); if(!res.ok) throw new Error('HTTP '+res.status); const data = await res.json(); renderResume(data); }
  catch(e){ console.error('Failed to fetch assets/resume.json', e); const root=document.getElementById('contentRoot'); if(root) root.innerHTML='<section class="show"><h2>Error</h2><p>Could not load <code>assets/resume.json</code>. Use <code>local.html</code> for local preview.</p></section>'; }
}

document.addEventListener('DOMContentLoaded', ()=>{ if(!window.SKIP_AUTO_LOAD) fetchResume(); });
