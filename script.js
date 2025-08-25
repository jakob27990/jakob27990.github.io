// Theme toggle for desktop and mobile
const themeToggle = document.getElementById('themeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');
const storedTheme = localStorage.getItem('theme');
if(storedTheme) document.documentElement.setAttribute('data-theme', storedTheme);
function setTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.textContent = (theme==='dark')?'☀️':'🌙';
  mobileThemeToggle.textContent = (theme==='dark')?'☀️':'🌙';
}
themeToggle.textContent=(document.documentElement.getAttribute('data-theme')==='dark')?'☀️':'🌙';
themeToggle.addEventListener('click',()=>{
  const current = document.documentElement.getAttribute('data-theme')==='dark'?'dark':'light';
  setTheme(current==='dark'?'light':'dark');
});
mobileThemeToggle.addEventListener('click',()=>{
  const current = document.documentElement.getAttribute('data-theme')==='dark'?'dark':'light';
  setTheme(current==='dark'?'light':'dark');
});

// Scroll reveal for sections
const sections=document.querySelectorAll('main section');
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting) e.target.classList.add('show');});
},{threshold:0.1});
sections.forEach(s=>io.observe(s));

// Scrollspy for desktop nav
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

// Back to top button
const backToTop = document.getElementById('backToTop');
backToTop.addEventListener('click', ()=>{window.scrollTo({top:0, behavior:'smooth'});});
window.addEventListener('scroll', ()=>{
  if(window.scrollY>200){backToTop.style.display='block';} else {backToTop.style.display='none';}
});

// Print button
const printBtn=document.getElementById('printBtn');
printBtn.addEventListener('click', ()=>{window.print();});

// Mobile expand/collapse
const expandBtn=document.getElementById('expandBtn');
const mobileProfile=document.getElementById('mobileProfile');
expandBtn.addEventListener('click',()=>{
  mobileProfile.classList.toggle('collapsed');
  expandBtn.textContent = mobileProfile.classList.contains('collapsed') ? 'Expand ▼' : 'Collapse ▲';
});

// Desktop image click expansion
const profilePhoto = document.querySelector('.profile-photo');
profilePhoto.addEventListener('click',()=>{
  if(profilePhoto.classList.contains('expanded')){
    profilePhoto.style.transform='scale(1)';
    profilePhoto.classList.remove('expanded');
  } else {
    profilePhoto.style.transform='scale(2)';
    profilePhoto.classList.add('expanded');
  }
});
