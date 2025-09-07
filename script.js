// Theme toggle
const themeToggle=document.getElementById('themeToggle');
const mobileThemeToggle=document.getElementById('mobileThemeToggle');
const storedTheme=localStorage.getItem('theme');
if(storedTheme) document.documentElement.setAttribute('data-theme',storedTheme);
function setTheme(theme){
  document.documentElement.setAttribute('data-theme',theme);
  localStorage.setItem('theme',theme);
  themeToggle.textContent=(theme==='dark')?'☀️':'🌙';
  mobileThemeToggle.textContent=(theme==='dark')?'☀️':'🌙';
}
themeToggle.textContent=(document.documentElement.getAttribute('data-theme')==='dark')?'☀️':'🌙';
themeToggle.addEventListener('click',()=>{
  const current=document.documentElement.getAttribute('data-theme')==='dark'?'dark':'light';
  setTheme(current==='dark'?'light':'dark');
});
mobileThemeToggle.addEventListener('click',()=>{
  const current=document.documentElement.getAttribute('data-theme')==='dark'?'dark':'light';
  setTheme(current==='dark'?'light':'dark');
});

// Scroll reveal
const sections=document.querySelectorAll('main section');
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting) e.target.classList.add('show');});
},{threshold:0.1});
sections.forEach(s=>io.observe(s));

// Scrollspy
const navLinks=document.querySelectorAll('.nav-right a');
window.addEventListener('scroll',()=>{
  let fromTop=window.scrollY+65;
  sections.forEach(sec=>{
    if(sec.offsetTop<=fromTop && sec.offsetTop+sec.offsetHeight>fromTop){
      navLinks.forEach(link=>{
        link.classList.remove('active');
        if(link.getAttribute('href').substring(1)===sec.id){link.classList.add('active');}
      });
    }
  });
});

// Back to top
const backToTop=document.getElementById('backToTop');
backToTop.addEventListener('click',()=>{window.scrollTo({top:0,behavior:'smooth'});});
window.addEventListener('scroll',()=>{
  backToTop.style.display=(window.scrollY>200)?'block':'none';
});

// Print
const printBtn=document.getElementById('printBtn');
printBtn.addEventListener('click',()=>{window.print();});

// Mobile expand/collapse
const expandBtn=document.getElementById('expandBtn');
const mobileProfile=document.getElementById('mobileProfile');
expandBtn.addEventListener('click',()=>{
  if(mobileProfile.classList.contains('expanded')){
    mobileProfile.classList.remove('expanded');
    expandBtn.textContent='Expand ▼';
  } else {
    mobileProfile.classList.add('expanded');
    expandBtn.textContent='Collapse ▲';
  }
});

// Smooth scrolling for nav links
document.querySelectorAll('nav a[href^="#"]').forEach(link=>{
  link.addEventListener('click',e=>{
    e.preventDefault();
    const target=document.querySelector(link.getAttribute('href'));
    if(target){
      target.scrollIntoView({behavior:"smooth",block:"start"});
    }
  });
});
