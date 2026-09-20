/* RAPHAEL BODY — original vector robot, contextual movement and accessible conversation. */
(function(){
'use strict';
if(!window.RaphaelBrain||!window.RAPHAEL_KNOWLEDGE||document.getElementById('raphael-root'))return;
const K=window.RAPHAEL_KNOWLEDGE,brain=new window.RaphaelBrain();
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width: 850px)');
const bn=brain.lang.startsWith('bn'),say=(en,ba)=>bn?ba:en;
const root=document.createElement('div');root.id='raphael-root';
root.innerHTML='<div class="raphael-stage" id="raphael-stage" data-mood="idle"><button type="button" class="raphael-avatar" id="raphael-avatar" aria-label="Talk to Raphael" aria-controls="raphael-panel" aria-expanded="false"><svg class="raphael-svg" width="110" height="140" viewBox="0 0 110 140" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"><ellipse cx="55" cy="133" rx="30" ry="5" fill="#17263E" opacity=".12"/><path d="M54 19V9" stroke="#203451" stroke-width="4" stroke-linecap="round"/><circle cx="54" cy="7" r="6" fill="#F45C6D" stroke="#203451" stroke-width="2"/><path d="M22 43L11 49V69L21 73M89 43L100 49V69L89 73" fill="#C4D0DE" stroke="#21354E" stroke-width="3" stroke-linejoin="round"/><g class="raphael-wave-arm"><path d="M24 87L9 79L5 59" stroke="#223951" stroke-width="10" stroke-linecap="round"/><circle cx="5" cy="57" r="7" fill="#F5B96E" stroke="#223951" stroke-width="3"/></g><g class="raphael-point-arm"><path d="M86 87L99 76L104 59" stroke="#223951" stroke-width="10" stroke-linecap="round"/><circle cx="104" cy="56" r="6" fill="#F5B96E" stroke="#223951" stroke-width="3"/></g><g class="raphael-leg-left"><path d="M43 114L40 128" stroke="#233A54" stroke-width="9" stroke-linecap="round"/><path d="M38 128H30" stroke="#E08F65" stroke-width="7" stroke-linecap="round"/></g><g class="raphael-leg-right"><path d="M68 114L72 128" stroke="#233A54" stroke-width="9" stroke-linecap="round"/><path d="M71 128H79" stroke="#E08F65" stroke-width="7" stroke-linecap="round"/></g><path d="M31 81Q31 75 38 75H72Q79 75 79 82L82 111Q83 118 75 118H36Q28 118 29 111L31 81Z" fill="#E9EEF3" stroke="#233A54" stroke-width="3.5"/><path d="M42 90H69" stroke="#9DAFC1" stroke-width="2.5" stroke-linecap="round"/><rect x="42" y="97" width="26" height="15" rx="6" fill="#21364F"/><text x="55" y="107.5" text-anchor="middle" fill="#F9C484" font-size="9" font-weight="800" font-family="Inter,sans-serif">JH</text><path d="M16 41Q16 23 35 20H75Q94 23 94 41V68Q93 82 78 83H31Q16 81 16 68V41Z" fill="#F8FAFC" stroke="#22364F" stroke-width="3.7"/><path d="M25 46Q25 32 38 31H72Q85 32 85 46V63Q85 73 74 74H36Q25 74 25 63V46Z" fill="#20354F"/><path d="M29 42Q32 33 44 33H64" stroke="#647F99" stroke-width="2" stroke-linecap="round" opacity=".5"/><rect class="raphael-eye" x="38" y="46" width="9" height="13" rx="4.5" fill="#F4BF7D"/><rect class="raphael-eye" x="64" y="46" width="9" height="13" rx="4.5" fill="#F4BF7D"/><path class="raphael-mouth" d="M49 65Q55 70 62 65" stroke="#EC8792" stroke-width="2.3" stroke-linecap="round"/><path d="M20 44V61M91 44V61" stroke="#E6A179" stroke-width="3.2" stroke-linecap="round"/></svg></button><button type="button" class="raphael-bubble" id="raphael-bubble" aria-label="Open Raphael conversation"><strong>RAPHAEL</strong><span id="raphael-bubble-text"></span></button></div><button type="button" id="raphael-beacon" class="raphael-beacon" aria-controls="raphael-panel" aria-expanded="false">Talk to Raphael</button><button type="button" id="raphael-minidock" class="raphael-minidock" aria-label="Restore Raphael">Raphael ↗</button><section class="raphael-panel" id="raphael-panel" role="dialog" aria-label="Talk to Raphael, Jahid portfolio assistant" aria-modal="false" aria-hidden="true"><header class="raphael-panel-header"><div class="raphael-panel-heading"><small>JAHID DIGITAL COMPANION</small><h2>Talk to Raphael ✦</h2><p>Portfolio guide · Here for the curious</p></div><div class="raphael-panel-actions"><button type="button" class="raphael-icon-button" id="raphael-voice" aria-label="Enable spoken replies" aria-pressed="false" title="Voice off by default">🔇</button><button type="button" class="raphael-icon-button" id="raphael-minimize" aria-label="Minimize Raphael" title="Minimize">−</button><button type="button" class="raphael-icon-button" id="raphael-close" aria-label="Close conversation" title="Close">×</button></div></header><div class="raphael-log" id="raphael-log" role="log" aria-label="Conversation with Raphael" aria-live="polite" aria-relevant="additions"></div><form class="raphael-form" id="raphael-form"><input class="raphael-input" id="raphael-input" name="message" type="text" autocomplete="off" maxlength="500" aria-label="Ask Raphael about Jahid portfolio" placeholder="Ask Raphael something..." required><button type="submit" class="raphael-send" aria-label="Send to Raphael">Send ↗</button></form><div class="raphael-panel-footer">Based on Jahid public portfolio · No visitor messages sent to an AI service</div></section>';
document.body.appendChild(root);
const $=selector=>root.querySelector(selector);
const stage=$('#raphael-stage'),avatar=$('#raphael-avatar'),bubble=$('#raphael-bubble'),bubbleText=$('#raphael-bubble-text'),beacon=$('#raphael-beacon'),minidock=$('#raphael-minidock'),panel=$('#raphael-panel'),log=$('#raphael-log'),form=$('#raphael-form'),input=$('#raphael-input'),voiceBtn=$('#raphael-voice');
const speech=window.speechSynthesis;
let open=false,minimized=false,voice=false,quiet=false,currentSection='hero',lastSection='hero',hoverProject=null,hoverExpires=0,bubbleTimer=0,moodTimer=0,ambientTimer=0,hoverTimer=0,remarkAt=0,hoverAt=0,lastFocus=null,previousX=null,previousY=null,ticking=false;
const page=location.pathname.split('/').pop()||'index.html',isHome=page==='index.html',isWork=page==='work.html',workKey=isWork?new URLSearchParams(location.search).get('category')||'modeling':null;
const sections=isHome?[['hero',document.querySelector('.hero')],['work',document.getElementById('work')],['now',document.getElementById('now')],['experience',document.getElementById('experience')],['gallery',document.getElementById('gallery')],['about',document.getElementById('about')],['contact',document.getElementById('contact')]].filter(item=>item[1]):[];
function mood(value,duration=4300){
 if(reduced.matches||minimized)value='idle';
 stage.dataset.mood=value;clearTimeout(moodTimer);
 if(value!=='idle'&&duration)moodTimer=setTimeout(()=>stage.dataset.mood='idle',duration);
}
function bubbleSay(text,intro=false,duration=5000){
 if(open||minimized||document.hidden)return;
 bubbleText.textContent=text;bubble.classList.add('is-visible');mood(intro?'waving':'curious',duration);
 clearTimeout(bubbleTimer);bubbleTimer=setTimeout(()=>bubble.classList.remove('is-visible'),duration);
}
function addMessage(who,text){
 const turn=document.createElement('div');turn.className='raphael-turn is-'+who;
 const name=document.createElement('span');name.className='raphael-speaker';name.textContent=who==='raphael'?'RAPHAEL':say('YOU','তুমি');
 const body=document.createElement('div');body.className='raphael-message';body.textContent=text;
 turn.append(name,body);log.append(turn);log.scrollTop=log.scrollHeight;
}
function shortcuts(list){
 if(!list?.length)return;
 const line=document.createElement('div');line.className='raphael-quick';
 list.slice(0,3).forEach(label=>{
  const b=document.createElement('button');b.type='button';b.textContent=label;
  b.addEventListener('click',()=>ask(label));line.append(b);
 });
 log.append(line);log.scrollTop=log.scrollHeight;
}
function navigate(href){
 if(!href||!/^(index\.html(?:#[\w-]+)?|work\.html\?category=[\w-]+|cv\.html|certifications\.html|#[\w-]+)$/.test(href))return;
 const url=new URL(href,location.href);if(url.origin!==location.origin)return;
 if(isHome&&url.pathname===location.pathname&&url.hash){
  const target=document.getElementById(url.hash.slice(1));
  if(target){target.scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'});close();return;}
 }
 location.assign(url.href);
}
function show(){
 if(minimized)restore();
 if(open){input.focus({preventScroll:true});return;}
 open=true;root.classList.add('is-open');panel.classList.add('is-open');panel.setAttribute('aria-hidden','false');
 avatar.setAttribute('aria-expanded','true');beacon.setAttribute('aria-expanded','true');
 bubble.classList.remove('is-visible');clearTimeout(bubbleTimer);
 lastFocus=document.activeElement;setTimeout(()=>input.focus({preventScroll:true}),120);
}
function close(){
 open=false;root.classList.remove('is-open');panel.classList.remove('is-open');panel.setAttribute('aria-hidden','true');
 avatar.setAttribute('aria-expanded','false');beacon.setAttribute('aria-expanded','false');
 if(speech)speech.cancel();mood('idle',0);
 if(lastFocus?.isConnected)lastFocus.focus({preventScroll:true});
}
function minimize(){
 close();minimized=true;quiet=true;root.classList.add('is-minimized');stage.classList.add('is-minimized');minidock.focus();
}
function restore(){
 minimized=false;quiet=false;root.classList.remove('is-minimized');stage.classList.remove('is-minimized');
 reposition();mood('happy',1900);
}
function speak(text){
 if(!voice||!speech||document.hidden)return;
 speech.cancel();
 try{const u=new SpeechSynthesisUtterance(text.slice(0,720));u.lang=brain.lang;u.rate=.98;u.pitch=1.07;u.volume=.75;speech.speak(u);}catch(_){}
}
function context(){
 let project=isWork&&K.work.some(w=>w.key===workKey)?workKey:null;
 if(!project&&currentSection==='work'&&hoverProject&&Date.now()<hoverExpires)project=hoverProject;
 const title=isWork?document.querySelector('#title')?.textContent||'':'';
 const intro=isWork?document.querySelector('#intro')?.textContent||'':'';
 const excerpts=isWork?[...document.querySelectorAll('#caseGrid .case-block')].slice(0,2).map(e=>e.textContent.replace(/\s+/g,' ').trim()).join(' ').slice(0,280):'';
 return{section:currentSection,project,title,excerpt:intro+' '+excerpts};
}
function ask(message){
 const q=String(message||'').trim().slice(0,500);if(!q)return;
 show();addMessage('visitor',q);mood('thinking',900);
 const reply=brain.reply(q,context());addMessage('raphael',reply.text);shortcuts(reply.suggestions);
 if(reply.route){
  const link=document.createElement('button');link.type='button';link.className='raphael-route';
  link.textContent=say('Come, I’ll show you ↗','চলো, দেখাই ↗');
  link.addEventListener('click',()=>navigate(reply.route));log.append(link);
 }
 mood(reply.mood||'talking',4700);speak(reply.text);input.value='';log.scrollTop=log.scrollHeight;
 const direct=/\b(show|take me|go to|open|navigate|bring me|visit|jump to)\b|দেখাও|নিয়ে যাও|নিয়ে যাও|খুলে দাও/i.test(q);
 if(reply.route&&direct)setTimeout(()=>{if(!document.hidden)navigate(reply.route);},1400);
}
avatar.addEventListener('click',show);beacon.addEventListener('click',show);bubble.addEventListener('click',show);
$('#raphael-close').addEventListener('click',close);
$('#raphael-minimize').addEventListener('click',minimize);
minidock.addEventListener('click',()=>{restore();show();});
form.addEventListener('submit',e=>{e.preventDefault();ask(input.value);});
voiceBtn.addEventListener('click',()=>{
 voice=!voice&&!!speech;voiceBtn.textContent=voice?'🔊':'🔇';
 voiceBtn.setAttribute('aria-label',voice?'Mute spoken replies':'Enable spoken replies');voiceBtn.setAttribute('aria-pressed',String(voice));
 if(!voice&&speech)speech.cancel();
 if(voice)speak(say("Voice is on. I'll keep it subtle.","ভয়েস চালু হলো। আস্তে কথা বলব।"));
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&open){e.preventDefault();close();}});
function locate(){
 if(!isHome)return isWork?'work':page==='certifications.html'?'certifications':page==='cv.html'?'cv':'about';
 const focusY=Math.min(innerHeight*.46,420);let best=1e6,choice='hero';
 sections.forEach(([key,el])=>{
  const b=el.getBoundingClientRect();if(b.bottom<60||b.top>innerHeight*.98)return;
  const dist=b.top<=focusY&&b.bottom>=focusY?0:Math.min(Math.abs(b.top-focusY),Math.abs(b.bottom-focusY));
  if(dist<best){best=dist;choice=key;}
 });
 return choice;
}
function reposition(){
 if(minimized)return;
 const width=innerWidth,height=innerHeight;let x,y;
 if(mobile.matches){x=width-74;y=height-175;}
 else if(currentSection==='hero'&&isHome){
  const el=document.querySelector('.portrait-frame'),b=el?.getBoundingClientRect();
  x=b?b.right-79:width-153;y=b?b.bottom-111:height*.53;
 }else{
  const el=sections.find(item=>item[0]===currentSection)?.[1];
  const b=el?.getBoundingClientRect();
  x=width-153;y=b?Math.min(height*.63,Math.max(height*.25,b.top+140)):height*.51;
 }
 x=Math.max(8,Math.min(x,width-(mobile.matches?74:112)));
 y=Math.max(60,Math.min(y,height-(mobile.matches?158:175)));
 if(previousX!==null&&Math.hypot(x-previousX,y-previousY)>44&&!reduced.matches)mood('walking',1040);
 previousX=x;previousY=y;stage.style.transform='translate3d('+Math.round(x)+'px,'+Math.round(y)+'px,0)';
}
const remarks={
 work:say("Ah, you are exploring his work. I know these projects.","তাঁর কাজগুলো দেখছো? এগুলো আমার চেনা।"),
 now:say("That one is still being built. Ask me about it.","এটি এখনো তৈরি হচ্ছে। জানতে চাইলে বলো।"),
 experience:say("A varied career. There is a story in that timeline.","ক্যারিয়ারটা বেশ বৈচিত্র্যময়।"),
 contact:say("Want to reach Jahid? I can point you there.","যোগাযোগ করতে চাও?"),
 about:say("This is where his background comes together.","এখানেই তাঁর পেছনের গল্প।")
};
function onSection(key){
 currentSection=key;
 if(lastSection!==key){
  lastSection=key;reposition();mood('observing',2300);
  if(!open&&!minimized&&!quiet&&!reduced.matches&&remarks[key]&&Date.now()-remarkAt>49000&&Math.random()<.42){
   remarkAt=Date.now();bubbleSay(remarks[key],false,3800);
  }
 }else reposition();
}
function viewport(){
 if(ticking)return;ticking=true;
 requestAnimationFrame(()=>{ticking=false;onSection(locate());});
}
addEventListener('scroll',viewport,{passive:true});addEventListener('resize',viewport,{passive:true});
if(mobile.addEventListener)mobile.addEventListener('change',viewport);
document.addEventListener('visibilitychange',()=>{if(document.hidden){bubble.classList.remove('is-visible');if(speech)speech.cancel();}else reposition();});
document.querySelectorAll('.discipline[href*="work.html?category="], .case-visual').forEach(el=>{
 el.addEventListener('pointerenter',()=>{
  if(mobile.matches||open||minimized||quiet)return;
  clearTimeout(hoverTimer);hoverTimer=setTimeout(()=>{
   const match=(el.getAttribute('href')||'').match(/category=([\w-]+)/);
   hoverProject=match?.[1]||workKey||null;hoverExpires=Date.now()+16000;
   mood('observing',3600);
   if(Date.now()-hoverAt>38000&&Math.random()<.72){
    hoverAt=Date.now();bubbleSay(say("Ah, you're looking at that one. Ask me about it.","এই কাজটা দেখছো? চাইলে বুঝিয়ে বলি।"),false,3600);
   }
  },900);
 });
 el.addEventListener('pointerleave',()=>clearTimeout(hoverTimer));
 el.addEventListener('focusin',()=>{
  const m=(el.getAttribute('href')||'').match(/category=([\w-]+)/);
  hoverProject=m?.[1]||workKey;hoverExpires=Date.now()+16000;
 });
});
function idleCycle(){
 clearTimeout(ambientTimer);
 ambientTimer=setTimeout(()=>{
  if(!document.hidden&&!open&&!minimized&&!reduced.matches){
   const states=['idle','curious','observing','sitting','standing','waving','thinking','sleeping'];
   mood(states[Math.floor(Math.random()*states.length)],2700+Math.random()*1400);
  }
  idleCycle();
 },20000+Math.random()*15000);
}
const intro=say("Ah, welcome. I'm Raphael — Jahid's personal portfolio assistant. Have a look around; I know this place pretty well.",
                "আহা, স্বাগতম! আমি রাফায়েল — জাহিদের পোর্টফোলিও সহকারী। ঘুরে দেখো, এই জায়গাটা আমার বেশ চেনা।");
addMessage('raphael',intro);shortcuts(['Who is Jahid?','Show his work','What is he building?']);
onSection(locate());idleCycle();
let welcomed=false;
try{welcomed=sessionStorage.getItem('raphael-introduced')==='1';sessionStorage.setItem('raphael-introduced','1');}catch(_){}
if(!welcomed)setTimeout(()=>{if(!document.hidden&&!open&&!minimized)bubbleSay(intro,true,7200);},1600);
else setTimeout(()=>mood('observing',2400),1600);
window.Raphael={open:show,close,minimize,restore,ask,go:navigate,getContext:context};
})();