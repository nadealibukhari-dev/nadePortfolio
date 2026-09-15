/* ===== mobile menu ===== */
const menuBtn=document.getElementById('menuBtn');
const navLinks=document.getElementById('navLinks');
menuBtn.addEventListener('click',()=>navLinks.classList.toggle('show'));
document.querySelectorAll('.nav-links a').forEach(l=>l.addEventListener('click',()=>navLinks.classList.remove('show')));

/* ===== active nav on scroll ===== */
const sections=document.querySelectorAll('section[id]');
const navA=document.querySelectorAll('.nav-links a');
window.addEventListener('scroll',()=>{
  let current='';
  sections.forEach(s=>{ if(scrollY>=s.offsetTop-160) current=s.id; });
  navA.forEach(a=>{
    a.classList.toggle('active', a.getAttribute('href')==='#'+current);
  });

  const h=document.documentElement;
  const scrolled=(h.scrollTop||document.body.scrollTop);
  const height=h.scrollHeight-h.clientHeight;
  document.getElementById('progressBar').style.width=(scrolled/height*100)+'%';
});

/* ===== cursor glow (desktop only) ===== */
if(matchMedia('(hover:hover)').matches){
  const glow=document.getElementById('cursorGlow');
  document.addEventListener('mousemove',e=>{
    glow.style.opacity='1';
    glow.style.left=e.clientX+'px';
    glow.style.top=e.clientY+'px';
  });
  document.addEventListener('mouseleave',()=>glow.style.opacity='0');
}

/* ===== typed role effect ===== */
const roles=['Frontend Developer','BSCS Student','Problem Solver'];
const typedEl=document.getElementById('typedText');
let ri=0, ci=0, deleting=false;
function typeLoop(){
  const word=roles[ri];
  if(!deleting){
    typedEl.textContent=word.slice(0,ci+1); ci++;
    if(ci===word.length){ deleting=true; setTimeout(typeLoop,1400); return; }
  } else {
    typedEl.textContent=word.slice(0,ci-1); ci--;
    if(ci===0){ deleting=false; ri=(ri+1)%roles.length; }
  }
  setTimeout(typeLoop, deleting?45:90);
}
typeLoop();

/* ===== scroll reveal ===== */
const revealEls=document.querySelectorAll('.reveal');
const io=new IntersectionObserver((entries)=>{
  entries.forEach(en=>{ if(en.isIntersecting) en.target.classList.add('in'); });
},{threshold:0.15});
revealEls.forEach(el=>io.observe(el));

/* ===== skill bars fill on view ===== */
const bars=document.querySelectorAll('.bar-fill');
const barIo=new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      en.target.style.width=en.target.dataset.width+'%';
      barIo.unobserve(en.target);
    }
  });
},{threshold:0.4});
bars.forEach(b=>barIo.observe(b));

/* ===== tilt on project cards ===== */
document.querySelectorAll('.project-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-0.5;
    const y=(e.clientY-r.top)/r.height-0.5;
    card.style.transform=`translateY(-8px) rotateX(${-y*4}deg) rotateY(${x*4}deg)`;
  });
  card.addEventListener('mouseleave',()=>{ card.style.transform=''; });
});

/* ===== year ===== */
document.getElementById('year').textContent=new Date().getFullYear();