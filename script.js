// Theme Toggle (Desktop & Mobile)
const themeToggle = document.getElementById('themeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');
const storedTheme = localStorage.getItem('theme');
if(storedTheme) document.documentElement.setAttribute('data-theme', storedTheme);

function setTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle && (themeToggle.textContent = theme==='dark'?'☀️':'🌙');
  mobileThemeToggle && (mobileThemeToggle.textContent = theme==='dark'?'☀️':'🌙');
}

themeToggle && themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme')==='dark'?'dark':'light';
  setTheme(current==='dark'?'light':'dark');
});
mobileThemeToggle && mobileThemeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme')==='dark'?'dark':'light';
  setTheme(current==='dark'?'light':'dark');
});

// Scroll Reveal
const sections = document.querySelectorAll('main section');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('show'); });
}, {threshold:0.1});
sections.forEach(sec => observer.observe(sec));

// Scrollspy (Desktop Only)
const navLinks = document.querySelectorAll('.nav-right a');
window.addEventListener('scroll', () => {
  if(window.innerWidth > 900){
    const fromTop = window.scrollY + 65;
    sections.forEach(sec => {
      if(sec.offsetTop <= fromTop && sec.offsetTop + sec.offsetHeight > fromTop){
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-right a[href="#${sec.id}"]`);
        activeLink && activeLink.classList.add('active');
      }
    });
  }
});

// Mobile Expand/Collapse
const mobileProfile = document.getElementById('mobileProfile');
const expandBtn = document.getElementById('expandBtn');
expandBtn && expandBtn.addEventListener('click', () => {
  if(mobileProfile.classList.contains('collapsed')){
    mobileProfile.classList.remove('collapsed');
    mobileProfile.classList.add('expanded');
    expandBtn.textContent = 'Collapse ▲';
  } else {
    mobileProfile.classList.remove('expanded');
    mobileProfile.classList.add('collapsed');
    expandBtn.textContent = 'Expand ▼';
  }
});

// Back-to-top (Mobile Only)
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if(window.innerWidth <= 900){
    if(window.scrollY > 150){
      backToTop.style.display = 'block';
    } else { backToTop.style.display = 'none'; }
  } else { backToTop.style.display = 'none'; }
});
backToTop && backToTop.addEventListener('click', () => {
  window.scrollTo({top:0, behavior:'smooth'});
});

// Print Button
const printBtn = document.getElementById('printBtn');
printBtn && printBtn.addEventListener('click', () => window.print());

// Desktop Photo Zoom Modal
const desktopPhoto = document.getElementById('desktopPhoto');
const modal = document.getElementById('photoModal');
const modalImg = document.getElementById('modalImg');
const modalClose = document.querySelector('.modal .close');

desktopPhoto && desktopPhoto.addEventListener('click', () => {
  modal.style.display = 'block';
  modalImg.src = desktopPhoto.src;
});
modalClose && modalClose.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => { if(e.target === modal) modal.style.display = 'none'; });
