// Site interactions, GSAP ScrollTriggers, and responsiveness
document.addEventListener('DOMContentLoaded', function(){
  // Menu toggle for mobile
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  menuBtn.addEventListener('click', ()=>{
    nav.classList.toggle('open');
  });

  // Progress bar
  const progress = document.getElementById('progress-bar');
  function updateProgress(){
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (scrollTop / docHeight) * 100;
    progress.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress);
  updateProgress();

  // GSAP animations
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // don't animate
  } else {
    gsap.registerPlugin(ScrollTrigger);

    // Line separators expand when section enters
    gsap.utils.toArray('.line-sep').forEach((el, i)=>{
      const bar = el.querySelector('span');
      gsap.fromTo(bar, {width:0}, {
        width: '80%',
        scrollTrigger: {trigger: el, start: 'top 80%', toggleActions: 'play none none none'},
        duration: 0.8,
        delay: 0.15 * i
      });
    });

    // Hero right text
    gsap.from('.hero-right .name', {y:30, opacity:0, duration:0.8, ease:'power2.out'});
    gsap.from('.contact-block a', {y:20, opacity:0, duration:0.6, stagger:0.12, delay:0.2});

    // Skills fade-up
    gsap.from('.skill-card', {y:40, opacity:0, duration:0.7, stagger:0.12, scrollTrigger:{trigger:'.skills', start:'top 80%'}});

    // Education slide-in
    gsap.from('.edu-item', {x:-60, opacity:0, duration:0.7, stagger:0.12, scrollTrigger:{trigger:'.education', start:'top 80%'}});

    // Projects left->right reveal
    gsap.utils.toArray('.project-card').forEach((card,i)=>{
      gsap.to(card, {x:0, opacity:1, duration:0.8, ease:'power2.out', scrollTrigger:{trigger:card, start:'top 85%'}});
    });

    // Certifications reveal
    gsap.from('.cert', {y:30, opacity:0, duration:0.7, stagger:0.1, scrollTrigger:{trigger:'.certs', start:'top 85%'}});
  }

  // Close nav on link click (mobile)
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=> nav.classList.remove('open')));

});