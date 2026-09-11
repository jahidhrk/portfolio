document.addEventListener('DOMContentLoaded',()=>{
  requestAnimationFrame(()=>document.body.classList.add('page-ready'));

  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('show');revealObserver.unobserve(entry.target)}
  }),{threshold:.1,rootMargin:'0px 0px -5% 0px'});
  document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

  const cursor=document.querySelector('.cursor-dot');
  if(cursor){
    window.addEventListener('pointermove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'});
    document.querySelectorAll('a,button,.discipline,.now-card,.testimonial-card,.gallery-card').forEach(el=>{
      el.addEventListener('pointerenter',()=>document.body.classList.add('link-hover'));
      el.addEventListener('pointerleave',()=>document.body.classList.remove('link-hover'));
    });
  }

  document.querySelectorAll('.discipline').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      if(innerWidth<900)return;
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(1100px) rotateX(${-y*2.1}deg) rotateY(${x*2.1}deg) translateY(-7px)`;
    });
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });

  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('pointermove',e=>{
      if(innerWidth<900)return;
      const r=el.getBoundingClientRect();
      const x=(e.clientX-r.left-r.width/2)*.12;
      const y=(e.clientY-r.top-r.height/2)*.16;
      el.style.transform=`translate(${x}px,${y}px)`;
    });
    el.addEventListener('pointerleave',()=>el.style.transform='');
  });

  function updateTimeline(){
    const timeline=document.getElementById('careerTimeline');
    if(!timeline)return;
    const rect=timeline.getBoundingClientRect();
    const start=innerHeight*.72;
    const total=rect.height+innerHeight*.18;
    const progressed=Math.min(Math.max((start-rect.top)/total,0),1);
    timeline.style.setProperty('--timeline-progress',`${progressed*100}%`);
  }

  window.addEventListener('scroll',()=>{
    const portrait=document.querySelector('.portrait-frame');
    if(portrait&&innerWidth>900){const y=Math.min(scrollY*.032,24);portrait.style.transform=`translateY(${y}px)`}
    updateTimeline();
  },{passive:true});
  updateTimeline();

  document.querySelectorAll('.gallery-placeholder').forEach((box,i)=>{
    const src=`assets/training-${String(i+1).padStart(2,'0')}.jpg`;
    const img=new Image();
    img.onload=()=>{
      img.alt='Jahid Hassan Rakib training and career moment';
      Object.assign(img.style,{position:'absolute',inset:'0',width:'100%',height:'100%',objectFit:'cover',zIndex:'0'});
      box.prepend(img);
      box.querySelectorAll('span,b').forEach(x=>x.style.textShadow='0 2px 20px rgba(0,0,0,.55)');
    };
    img.src=src;
  });

  const statsSection=document.getElementById('heroStats');
  let statsAnimated=false;

  function animateCounter(el){
    const target=parseInt(el.dataset.count,10)||0;
    const suffix=el.dataset.suffix||'';
    const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reducedMotion){el.textContent=target+suffix;return}

    const duration=1000;
    const startTime=performance.now();
    el.textContent='0'+suffix;

    function frame(now){
      const progress=Math.min((now-startTime)/duration,1);
      const eased=1-Math.pow(1-progress,3);
      const value=Math.round(target*eased);
      el.textContent=value+suffix;
      if(progress<1)requestAnimationFrame(frame);
      else el.textContent=target+suffix;
    }
    requestAnimationFrame(frame);
  }

  function runStatsCounters(){
    if(statsAnimated||!statsSection)return;
    statsAnimated=true;
    statsSection.querySelectorAll('[data-count]').forEach(animateCounter);
  }

  if(statsSection){
    const statsObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          runStatsCounters();
          statsObserver.disconnect();
        }
      });
    },{threshold:.2,rootMargin:'0px 0px -5% 0px'});
    statsObserver.observe(statsSection);

    requestAnimationFrame(()=>{
      const r=statsSection.getBoundingClientRect();
      if(r.top<innerHeight&&r.bottom>0)runStatsCounters();
    });
  }

  document.querySelectorAll('a[href]').forEach(link=>{
    const href=link.getAttribute('href');
    if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:')||link.target==='_blank')return;
    let url;
    try{url=new URL(link.href,location.href)}catch{return}
    if(url.origin!==location.origin)return;
    link.addEventListener('click',e=>{
      if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      e.preventDefault();
      document.body.classList.add('page-leaving');
      setTimeout(()=>location.href=url.href,210);
    });
  });
});