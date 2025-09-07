/* ================= THEME TOGGLE ================= */
const themeToggle = document.getElementById('themeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');
const storedTheme = localStorage.getItem('theme');
if (storedTheme) document.documentElement.setAttribute('data-theme', storedTheme);

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (themeToggle) themeToggle.textContent = (theme === 'dark') ? '☀️' : '\ud83c\udf19';
  if (mobileThemeToggle) mobileThemeToggle.textContent = (theme === 'dark') ? '☀️' : '\ud83c\udf19';
}
(function initThemeButtons(){
  const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  if (themeToggle) themeToggle.textContent = (current === 'dark') ? '☀️' : '\ud83c\udf19';
  if (mobileThemeToggle) mobileThemeToggle.textContent = (current === 'dark') ? '☀️' : '\ud83c\udf19';
  if (themeToggle) themeToggle.addEventListener('click', () => setTheme((document.documentElement.getAttribute('data-theme') === 'dark') ? 'light' : 'dark'));
  if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', () => setTheme((document.documentElement.getAttribute('data-theme') === 'dark') ? 'light' : 'dark'));
})();

/* ================= SCROLL REVEAL ================= */
const sections = Array.from(document.querySelectorAll('main section'));
sections.forEach((s)=>s.classList.remove('show'));
if (sections.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('show'); });
  }, { threshold: 0.1 });
  sections.forEach((s) => io.observe(s));
}

/* ================= SCROLLSPY (centerline + bottom/top fixes) ================= */
const navLinks = Array.from(document.querySelectorAll('.nav-right a'));
const idForLink = (a)=> (a.getAttribute('href')||'').replace('#','');
const linkById = new Map(navLinks.map(a=>[idForLink(a), a]));
function setActive(id){
  if (!id) return;
  navLinks.forEach(l=>l.classList.remove('active'));
  const link = linkById.get(id);
  if (link) link.classList.add('active');
}
function updateActiveLink(){
  if (!sections.length) return;
  const first = sections[0];
  // If near the very top, force Summary active
  if (window.scrollY <= first.offsetTop + 5) { setActive(first.id); return; }

  const scrollBottom = window.innerHeight + window.scrollY;
  const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  if (scrollBottom >= docHeight - 2) { setActive(sections[sections.length-1].id); return; }

  const centerLine = window.scrollY + window.innerHeight/2;
  let currentId = first.id;
  for (const sec of sections) {
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    if (centerLine >= top && centerLine < bottom) { currentId = sec.id; break; }
  }
  setActive(currentId);
}
if (navLinks.length && sections.length) {
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  window.addEventListener('resize', updateActiveLink);
  document.addEventListener('DOMContentLoaded', updateActiveLink);
  updateActiveLink();
}
navLinks.forEach((link)=>{
  link.addEventListener('click', () => {
    const id = idForLink(link);
    setActive(id);               // immediate feedback
    setTimeout(updateActiveLink, 900); // then natural scrollspy takes over
  });
});

/* ================= PRINT BUTTON ================= */
const printBtn = document.getElementById('printBtn');
if (printBtn) printBtn.addEventListener('click', () => window.print());

/* ================= MOBILE EXPAND/COLLAPSE ================= */
const expandBtn = document.getElementById('expandBtn');
const mobileProfile = document.getElementById('mobileProfile');
if (expandBtn && mobileProfile) {
  expandBtn.addEventListener('click', () => {
    const isExpanded = mobileProfile.classList.toggle('expanded');
    expandBtn.setAttribute('aria-expanded', String(isExpanded));
  });
}

/* ================= SMOOTH SCROLLING NAV ================= */
document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* ================= CONTACT REVEAL (supports multiple blocks) ================= */
function buildContact(container) {
  const info = container.querySelector('.contact-info');
  if (!info || info.dataset.populated === '1') return;
  const user = info.dataset.emailUser || '';
  const domain = info.dataset.emailDomain || '';
  const phone = (info.dataset.phone || '').trim();
  const email = `${user}@${domain}`;
  const phoneDigits = phone.replace(/[^\d]/g, '');
  info.innerHTML = `
    <p><strong>Phone:</strong> <a rel="nofollow" href="tel:${phoneDigits}">${phone}</a></p>
    <p><strong>Email:</strong> <a rel="nofollow" href="mailto:${email}">${email}</a></p>
  `;
  info.dataset.populated = '1';
}
document.querySelectorAll('.contact-block').forEach((block) => {
  const toggle = block.querySelector('.contact-toggle');
  const info = block.querySelector('.contact-info');
  if (!toggle || !info) return;
  toggle.addEventListener('click', () => {
    buildContact(block);
    info.classList.remove('is-hidden');
    info.classList.add('revealed');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.style.display = 'none';
  });
});
window.addEventListener('beforeprint', () => {
  document.querySelectorAll('.contact-block').forEach(buildContact);
  document.querySelectorAll('.contact-info').forEach((info) => {
    info.classList.remove('is-hidden');
    info.classList.add('revealed');
  });
});

/* ================= DESKTOP IMAGE: SINGLE-CLICK OPEN ================= */
const profilePhotos = document.querySelectorAll('.profile-photo');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
function openModal(src) { if (!imageModal || !modalImage) return; modalImage.src = src; imageModal.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
function closeModal() { if (!imageModal) return; imageModal.classList.add('hidden'); document.body.style.overflow = ''; }
profilePhotos.forEach((photo) => {
  photo.addEventListener('click', () => {
    const desktop = window.matchMedia('(min-width: 901px)').matches;
    if (desktop) { openModal(photo.getAttribute('src')); }
  });
});
if (imageModal) { imageModal.addEventListener('click', (e) => { if (e.target.dataset.close === 'true') closeModal(); }); }
if (modalClose) modalClose.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
