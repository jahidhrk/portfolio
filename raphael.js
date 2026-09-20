/* RAPHAEL BODY — original vector robot, contextual movement and accessible conversation. */
(function(){
'use strict';
if(!window.RaphaelBrain||!window.RAPHAEL_KNOWLEDGE||document.getElementById('raphael-root'))return;
const K=window.RAPHAEL_KNOWLEDGE,brain=new window.RaphaelBrain();
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width: 850px)');
const bn=brain.lang.startsWith('bn'),say=(en,ba)=>bn?ba:en;
const root=document.createElement('div');root.id='raphael-root';
root.innerHTML='<div class="raphael-stage" id="raphael-stage" data-mood="idle"><button type="button" class="raphael-avatar" id="raphael-avatar" aria-label="Talk to Raphael" aria-controls="raphael-panel" aria-expanded="false"><svg class="raphael-svg" width="110" height="140" viewBox="0 0 110 140" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"> <defs><linearGradient id="rap-shell" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#F4F7FF"/><stop offset=".58" stop-color="#B8C9DC"/><stop offset="1" stop-color="#647C99"/></linearGradient><linearGradient id="rap-armor" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#263C59"/><stop offset="1" stop-color="#0B182E"/></linearGradient><linearGradient id="rap-visor" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#1A3554"/><stop offset=".6" stop-color="#07192C"/><stop offset="1" stop-color="#17324D"/></linearGradient><linearGradient id="rap-neon" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#5DEDEB"/><stop offset="1" stop-color="#A9A7FF"/></linearGradient></defs> <ellipse class="raphael-ground" cx="55" cy="134" rx="26" ry="3" fill="#17263E" opacity=".19"/> <g class="raphael-halo"><ellipse cx="55" cy="133" rx="32" ry="5" stroke="#63DBEA" stroke-width="1.8" opacity=".72"/><path d="M28 133H41M69 133H82" stroke="#FFBC81" stroke-width="2.4" stroke-linecap="round"/></g> <path d="M53 24V13" stroke="#223752" stroke-width="4" stroke-linecap="round"/><path d="M53 12L53 9" stroke="#71E9E9" stroke-width="5" stroke-linecap="round"/><circle cx="53" cy="6" r="4" fill="#FFBB83" stroke="#20344D" stroke-width="1.5"/> <g class="raphael-wave-arm"><path d="M26 83L13 88L7 65" stroke="#1B304B" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 84L9 71" stroke="#73E1E9" stroke-width="2.6" stroke-linecap="round"/><rect x="1" y="52" width="13" height="17" rx="6" fill="url(#rap-shell)" stroke="#17304C" stroke-width="2"/><path d="M6 54V61" stroke="#F6B77E" stroke-width="2.5" stroke-linecap="round"/></g> <g class="raphael-point-arm"><path d="M84 83L97 88L103 65" stroke="#1B304B" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><path d="M96 84L102 71" stroke="#73E1E9" stroke-width="2.6" stroke-linecap="round"/><rect x="96" y="52" width="13" height="17" rx="6" fill="url(#rap-shell)" stroke="#17304C" stroke-width="2"/><path d="M103 54V61" stroke="#F6B77E" stroke-width="2.5" stroke-linecap="round"/></g> <g class="raphael-leg-left"><path d="M44 115L42 125" stroke="#1D3451" stroke-width="9" stroke-linecap="round"/><path d="M42 125L32 129" stroke="#90AAC0" stroke-width="8" stroke-linecap="round"/><path d="M33 129H42" stroke="#71D9E5" stroke-width="2.4" stroke-linecap="round"/></g> <g class="raphael-leg-right"><path d="M66 115L68 125" stroke="#1D3451" stroke-width="9" stroke-linecap="round"/><path d="M68 125L77 129" stroke="#90AAC0" stroke-width="8" stroke-linecap="round"/><path d="M69 129H78" stroke="#71D9E5" stroke-width="2.4" stroke-linecap="round"/></g> <path d="M31 82Q32 75 39 75H71Q78 75 79 82L83 109Q83 119 73 120H37Q27 119 27 109L31 82Z" fill="url(#rap-armor)" stroke="#57718D" stroke-width="2.5"/> <path d="M38 82H72L77 110H33Z" fill="url(#rap-shell)" stroke="#9CB2C9" stroke-width="1.5"/><path d="M39 91H71" stroke="#7D97B3" stroke-width="1.6"/> <rect x="42" y="96" width="26" height="15" rx="6" fill="#14283F" stroke="#41627A" stroke-width="1.5"/><path class="raphael-core" d="M49 102L55 98L61 102L55 108Z" fill="url(#rap-neon)"/><path d="M45 114H65" stroke="#6EDCE7" stroke-width="2" stroke-linecap="round"/> <path d="M12 50L18 35L29 42L23 66L13 62Z" fill="#20354D" stroke="#8CA6BD" stroke-width="2"/><path d="M98 50L92 35L81 42L87 66L97 62Z" fill="#20354D" stroke="#8CA6BD" stroke-width="2"/> <path d="M19 44L22 31Q31 18 51 19H60Q79 18 88 31L91 44L90 66Q87 82 71 83H39Q23 82 20 66L19 44Z" fill="url(#rap-shell)" stroke="#1F3854" stroke-width="3.3" stroke-linejoin="round"/> <path d="M27 39Q28 29 41 27H69Q82 29 83 39L82 65Q80 74 70 74H40Q30 74 28 65Z" fill="url(#rap-visor)" stroke="#274766" stroke-width="2.6"/> <path d="M32 39Q39 32 55 33" stroke="#9FBDD4" stroke-width="2.2" stroke-linecap="round" opacity=".8"/><path d="M65 33L75 36" stroke="#7394AC" stroke-width="1.7" stroke-linecap="round" opacity=".6"/> <g class="raphael-eye"><path d="M39 48Q43 43 48 48L47 55Q43 58 40 54Z" fill="url(#rap-neon)"/></g><g class="raphael-eye"><path d="M62 48Q67 43 72 48L71 55Q67 58 63 54Z" fill="url(#rap-neon)"/></g> <path class="raphael-mouth" d="M48 63Q55 68 63 63" stroke="#F8B17E" stroke-width="2.2" stroke-linecap="round"/> <path d="M22 49V60M88 49V60" stroke="#E1A274" stroke-width="3" stroke-linecap="round"/> <path d="M41 24H69" stroke="#FCFFFF" stroke-width="2" stroke-linecap="round" opacity=".75"/> </svg></button><button type="button" class="raphael-bubble" id="raphael-bubble" aria-label="Open Raphael conversation"><strong>RAPHAEL</strong><span id="raphael-bubble-text"></span></button></div><button type="button" id="raphael-beacon" class="raphael-beacon" aria-controls="raphael-panel" aria-expanded="false">Talk to Raphael</button><button type="button" id="raphael-minidock" class="raphael-minidock" aria-label="Restore Raphael">Raphael ↗</button><section class="raphael-panel" id="raphael-panel" role="dialog" aria-label="Talk to Raphael, Jahid portfolio assistant" aria-modal="false" aria-hidden="true"><header class="raphael-panel-header"><div class="raphael-panel-heading"><small>JAHID DIGITAL COMPANION</small><h2>Talk to Raphael ✦</h2><p>Portfolio guide · Here for the curious</p></div><div class="raphael-panel-actions"><button type="button" class="raphael-icon-button" id="raphael-voice" aria-label="Enable spoken replies" aria-pressed="false" title="Voice off by default">🔇</button><button type="button" class="raphael-icon-button" id="raphael-minimize" aria-label="Minimize Raphael" title="Minimize">−</button><button type="button" class="raphael-icon-button" id="raphael-close" aria-label="Close conversation" title="Close">×</button></div></header><div class="raphael-log" id="raphael-log" role="log" aria-label="Conversation with Raphael" aria-live="polite" aria-relevant="additions"></div><form class="raphael-form" id="raphael-form"><input class="raphael-input" id="raphael-input" name="message" type="text" autocomplete="off" maxlength="500" aria-label="Ask Raphael about Jahid portfolio" placeholder="Ask Raphael something..." required><button type="submit" class="raphael-send" aria-label="Send to Raphael">Send ↗</button></form><div class="raphael-panel-footer"><details class="raphael-voice-settings"><summary>Voice &amp; tone settings</summary><div class="raphael-voice-config"><label>Voice<select id="raphael-voice-select" aria-label="Choose Raphael voice"><option value="">Loading browser voices…</option></select></label><label>Speaking pace<input id="raphael-voice-rate" type="range" min="0.8" max="1.1" step="0.05" value="0.95" aria-label="Raphael speaking pace"></label><button type="button" id="raphael-preview-voice">▶ Preview voice</button><p id="raphael-voice-status" role="status">Browser speech quality depends on your installed voices.</p></div></details><span>Answers grounded in Jahid public portfolio · No visitor messages sent to an AI service</span></div></section>';
document.body.appendChild(root);
const $=selector=>root.querySelector(selector);
const stage=$('#raphael-stage'),avatar=$('#raphael-avatar'),bubble=$('#raphael-bubble'),bubbleText=$('#raphael-bubble-text'),beacon=$('#raphael-beacon'),minidock=$('#raphael-minidock'),panel=$('#raphael-panel'),log=$('#raphael-log'),form=$('#raphael-form'),input=$('#raphael-input'),voiceBtn=$('#raphael-voice');
const speech=window.speechSynthesis;
const voiceSelect=$('#raphael-voice-select'),voiceRate=$('#raphael-voice-rate'),voicePreview=$('#raphael-preview-voice'),voiceStatus=$('#raphael-voice-status');
let browserVoices=[],selectedVoiceURI='';
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
function voiceRank(v){
 const label=(v.name+' '+v.voiceURI).toLowerCase();
 return (/\b(natural|neural|premium|enhanced|online)\b/.test(label)?30:0)
      +(/\b(google|microsoft|samantha|aria|jenny|guy|sonia)\b/.test(label)?16:0)
      +(v.localService?2:4);
}
function refreshVoices(){
 if(!speech){voiceSelect.innerHTML='<option value="">Speech unavailable</option>';voiceSelect.disabled=true;voicePreview.disabled=true;voiceStatus.textContent='This browser does not provide spoken replies.';return;}
 browserVoices=speech.getVoices()||[];
 const primary=brain.lang.split('-')[0];
 const matching=browserVoices.filter(v=>v.lang.toLowerCase().split('-')[0]===primary).sort((a,b)=>voiceRank(b)-voiceRank(a));
 voiceSelect.replaceChildren();
 if(!matching.length){
   const o=new Option('No '+(primary==='bn'?'Bangla':'matching')+' voice installed','');voiceSelect.add(o);
   voiceSelect.disabled=true;voicePreview.disabled=true;voiceStatus.textContent=primary==='bn'?'No Bangla speech voice found. Install a Bangla voice on your device to enable accurate pronunciation.':'No matching speech voice is available on this device.';
   voice=false;voiceBtn.textContent='🔇';voiceBtn.setAttribute('aria-pressed','false');return;
 }
 voiceSelect.disabled=false;voicePreview.disabled=false;
 for(const v of matching){const o=new Option(v.name+' · '+v.lang,v.voiceURI);voiceSelect.add(o);}
 if(selectedVoiceURI&&matching.some(v=>v.voiceURI===selectedVoiceURI))voiceSelect.value=selectedVoiceURI;
 else{selectedVoiceURI=matching[0].voiceURI;voiceSelect.value=selectedVoiceURI;}
 voiceStatus.textContent='Preview and choose the voice you prefer. Speech stays off until enabled.';
}
function speak(text,preview=false){
 if((!voice&&!preview)||!speech||document.hidden)return;
 speech.cancel();
 try{
   const u=new SpeechSynthesisUtterance(String(text).slice(0,720));
   const chosen=browserVoices.find(v=>v.voiceURI===voiceSelect.value);
   if(chosen)u.voice=chosen;
   u.lang=chosen?.lang||brain.lang;u.rate=Number(voiceRate.value)||.95;u.pitch=.96;u.volume=.78;
   speech.speak(u);
 }catch(_){}
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
refreshVoices();
if(speech){
 if(typeof speech.addEventListener==='function')speech.addEventListener('voiceschanged',refreshVoices);
 else speech.onvoiceschanged=refreshVoices;
}
voiceSelect.addEventListener('change',()=>{
 selectedVoiceURI=voiceSelect.value;
 if(speech)speech.cancel();
 voiceStatus.textContent='Voice selected. Preview it before turning spoken replies on.';
});
voicePreview.addEventListener('click',()=>{
 speak(say("Hey there, I'm Raphael. Welcome to Jahid's portfolio. I'll show you around.",
           "হ্যালো! আমি রাফায়েল। জাহিদের পোর্টফোলিওতে স্বাগতম। চলো, ঘুরে দেখি।"),true);
});
voiceBtn.addEventListener('click',()=>{
 if(!speech||voiceSelect.disabled){refreshVoices();return;}
 voice=!voice;voiceBtn.textContent=voice?'🔊':'🔇';
 voiceBtn.setAttribute('aria-label',voice?'Mute spoken replies':'Enable spoken replies');
 voiceBtn.setAttribute('aria-pressed',String(voice));
 voiceStatus.textContent=voice?'Spoken replies enabled. You can switch voices or adjust the pace below.':'Spoken replies are off.';
 if(!voice&&speech)speech.cancel();
 if(voice)speak(say("Ah, that's better. I'm here when you need me.","ভালো। দরকার হলে ডাকবে।"));
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