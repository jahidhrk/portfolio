/* RAPHAEL BRAIN — grounded conversational portfolio guide, no client-side AI API keys. */
(function () {
  'use strict';
  const K = window.RAPHAEL_KNOWLEDGE;
  if (!K) return;
  const bn = String(navigator.language || '').toLowerCase().startsWith('bn');
  const t = (en, bangla) => bn ? bangla : en;
  const norm = value => String(value || '').toLowerCase().normalize('NFKC').replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();
  const has = (s, terms) => terms.some(term => {
    term = norm(term);
    if (!term) return false;
    return term.length < 4 && /^[a-z]+$/.test(term)
      ? new RegExp('(^|[^a-z])' + term + '([^a-z]|$)').test(s)
      : s.includes(term);
  });
  const routeFor = key => K.routes[key] || (K.work.some(w => w.key === key) ? 'work.html?category=' + key : null);
  const workByKey = key => K.work.find(w => w.key === key);
  const jobLine = item => item.period + ' · ' + item.company + ' — ' + item.role + '.';
  const sections = {
    work: ['work', 'projects', 'portfolio', 'কাজ', 'প্রজেক্ট'],
    now: ['now building', 'current project', 'working on now', 'building now', 'বর্তমানে', 'এখন কি', 'এখন কী', 'নতুন প্রজেক্ট'],
    experience: ['experience', 'career', 'jobs', 'worked before', 'previous jobs', 'previous employers', 'কোথায় কাজ', 'কোথায় কাজ', 'অভিজ্ঞতা', 'চাকরি'],
    about: ['about', 'background', 'who is jahid', 'who is your master', 'who is he', 'পরিচয়', 'কে'],
    contact: ['contact', 'email', 'reach', 'hire', 'linkedin', 'যোগাযোগ', 'ইমেইল', 'মেইল'],
    certifications: ['certifications', 'certificates', 'credentials', 'training', 'সার্টিফিকেট', 'প্রশিক্ষণ'],
    cv: ['cv', 'resume', 'résumé', 'সিভি'],
    gallery: ['life and learning', 'life & learning', 'gallery', 'photos', 'গ্যালারি']
  };
  const navWords = ['show','view','take me','go to','open','navigate','bring me','let me see','visit','jump to','দেখাও','নিয়ে যাও','নিয়ে যাও','দেখতে চাই','খুলে দাও','যাও'];
  const shortList = t('You can ask about his work, current project, career, skills, education or how to contact him.',
                      'তাঁর কাজ, বর্তমান প্রজেক্ট, ক্যারিয়ার, দক্ষতা, শিক্ষা বা যোগাযোগের উপায় জানতে পারো।');

  const make = (text, topic, route, mood, suggestions) => ({
    text, topic:topic||'general', route:route||null, mood:mood||'talking', suggestions:suggestions||[]
  });

  // Public site corpus is generated from the actual Work/CV/Certifications pages at build time.
  const corpus = Array.isArray(window.RAPHAEL_CORPUS?.entries) ? window.RAPHAEL_CORPUS.entries : [];
  const stop = new Set(['a','an','and','are','at','be','by','can','could','did','do','does','for','from','has','have','he','her','him','his','how','i','in','is','it','jahid','me','more','my','of','on','or','please','raphael','she','show','tell','than','that','the','their','there','these','they','this','to','us','was','what','when','where','which','who','why','with','would','you','your','about','some','his','portfolio','আমাকে','তার','তিনি','জাহিদ','কোথায়','কোথায়','কোন','কি','কী','এর','ওই','এটা','এইটা','বলো','দেখাও','সম্পর্কে','আরও']);
  const words = input => (norm(input).match(/[\p{L}\p{N}]+/gu)||[]).filter(w => w.length>1 && !stop.has(w));
  const unique = terms => [...new Set(terms)];
  function relevantEntries(query, context) {
    const terms=unique(words(query));
    if(!terms.length)return [];
    const phrase=norm(query).replace(/[?!.,]/g,'').trim();
    const scored=[];
    for(const entry of corpus) {
      const title=norm(entry.title), body=norm(entry.text), tags=norm((entry.tags||[]).join(' '));
      let score=0, matched=0;
      for(const word of terms) {
        if(title.includes(word)){score+=7;matched++;}
        else if(tags.includes(word)){score+=4;matched++;}
        else if(body.includes(word)){score+=1.7;matched++;}
      }
      if(phrase.length>5&&title.includes(phrase)){score+=18;matched++;}
      if(context?.project&&entry.key===context.project)score+=.5;
      if(score>=4&&matched>=1)scored.push({entry,score,matched});
    }
    return scored.sort((a,b)=>b.score-a.score).slice(0,5);
  }
  function shorten(value,max=650) {
    const str=String(value||'').trim();
    if(str.length<=max)return str;
    const cut=str.slice(0,max);
    const last=Math.max(cut.lastIndexOf('. '),cut.lastIndexOf('। '),cut.lastIndexOf('; '));
    return cut.slice(0,last>max*.55?last+1:max).trim()+(last>max*.55?'':'…');
  }


  function Brain() {
    this.lang = bn ? 'bn-BD' : 'en-US';
    this.topic = null;
    this.lastRoute = null;
    this.history = []; // RAM only; user text is never persisted.
    this.lastEntry = null;
    this.section = 'hero';
    this.project = null;
    try {
      const saved = sessionStorage.getItem('raphael-topic');
      if (saved && (K.routes[saved] || workByKey(saved))) this.topic = saved;
    } catch (_) {}
  }
  Brain.prototype.remember = function (input, response) {
    this.history.push({text:input,topic:response.topic});
    if (this.history.length > 8) this.history.shift();
    this.topic = response.topic;
    if (response.route) this.lastRoute = response.route;
    // Only a public topic identifier is remembered across portfolio page loads.
    try {
      if (K.routes[this.topic] || workByKey(this.topic)) sessionStorage.setItem('raphael-topic',this.topic);
    } catch (_) {}
    return response;
  };
  Brain.prototype.context = function (ctx) {
    if (ctx && ctx.section) this.section = ctx.section;
    if (ctx && ctx.project) this.project = ctx.project;
    return {section:this.section,project:this.project,title:ctx?.title||'',excerpt:ctx?.excerpt||''};
  };
  Brain.prototype.reply = function (raw, ctx) {
    const input = String(raw||'').slice(0,500).trim();
    const q = norm(input);
    const context = this.context(ctx);
    const candidates = relevantEntries(q,context);
    const nav = has(q,navWords);
    const lookingAt = workByKey(context.project);
    const last = workByKey(this.topic);
    const current = last || lookingAt;
    let response;
    if (!q) return make(shortList, 'general');

    // Credentials are a real, public destination, not an unknown keyword or a generic education answer.
    if (has(q,['certificate','certificates','certification','certifications','credential','credentials','where is his certificate','সার্টিফিকেট','সনদ','প্রমাণপত্র','প্রশিক্ষণের সনদ'])) {
      return this.remember(input,this.credentialsAnswer(q));
    }

    const clarify = text => make(text,'general',null,'thinking',['Show his work','What is he building?']);
    const workMatch = (() => {
      const scores = K.work.map(work => {
        let score = 0;
        if (q.includes(norm(work.title))) score += 16;
        for (const key of work.keywords) if (has(q,[key])) score += key.length > 6 ? 4 : 2;
        if (context.project === work.key && has(q,['this','it','that','এইটা','এটা','এটার','এই প্রজেক্ট','এই কাজ'])) score += 6;
        return {work,score};
      }).sort((a,b)=>b.score-a.score);
      return scores[0]?.score >= 2 ? scores[0].work : null;
    })();
    if (has(q,['hello','hi','hey','good morning','good evening','আসসালামু','হ্যালো','হাই','সালাম'])) {
      response=make(t("Ah, welcome. I'm Raphael — Jahid Hassan Rakib's portfolio assistant. I know my way around his work. What caught your eye?",
                        "আহা, স্বাগতম! আমি রাফায়েল — জাহিদ হাসান রাকিবের পোর্টফোলিও সহকারী। তাঁর কাজের অনেক কিছুই জানি। কী দেখতে চাও?"),'general',null,'happy',['Who is Jahid?','Show his work','What is he building?']);
    } else if (has(q,['who are you','your name','are you ai','are you chatgpt','what can you do','তুমি কে','তোমার নাম','কি পারো','কী পারো'])) {
      response=make(t("I'm Raphael, the little guide who lives in Jahid's portfolio. I answer from his published work and public profile, help you find sections, and tell you when I don't know. I don't have a live generative-AI service connected here.",
                        "আমি রাফায়েল, জাহিদের পোর্টফোলিওর ছোট্ট গাইড। প্রকাশিত কাজ ও তথ্য থেকে উত্তর দিই, পেজ খুঁজে দিই, আর না জানলে সেটাও বলি। এখানে কোনো লাইভ জেনারেটিভ AI সেবা সংযুক্ত নেই।"),'general',null,'happy',['Who is Jahid?','Show his work']);
    } else if (has(q,['privacy','data about me','my information','remember me','track me','গোপনীয়তা','তথ্য রাখো'])) {
      response=make(t("I only use the information you type to follow this conversation in the current page session. I don't send your messages to an AI service or store a visitor profile.",
                        "এই পেজে আলাপের প্রসঙ্গ ধরে রাখতে তোমার লেখা ব্যবহার করি। কোনো AI সার্ভিসে বার্তা পাঠাই না বা ভিজিটর প্রোফাইল জমাই না।"),'general',null,'helping');
    } else if (has(q,['where does he live','where is he based','location','where are you based','কোথায় থাকেন','কোথায় থাকেন','লোকেশন'])) {
      response=make(t("Jahid is based in Dhaka, Bangladesh.", "জাহিদ ঢাকা, বাংলাদেশে কর্মরত।"),'about',null,'talking');
    } else if (has(q,['what is this','what am i looking at','tell me about this','about this','এইটা কি','এটা কী','এই কাজ','এই প্রজেক্ট','এটার ব্যাপারে'])) {
      if (lookingAt) response = this.workAnswer(lookingAt,true,context);
      else if (context.section==='now') response=this.nowAnswer(false);
      else if (current) response=this.workAnswer(current,true,context);
      else response=make(t("You're in the " + (context.section||'portfolio') + " area. "+shortList,
                            "তুমি এখন পোর্টফোলিওর "+(context.section||'এই')+" অংশে আছো। "+shortList),'general',null,'observing');
    } else if (has(q,['tell me more','more about it','go on','explain it','elaborate','আরো বলো','আরও বলো','বিস্তারিত','আরো জানতে চাই'])) {
      if (this.lastEntry && this.topic===this.lastEntry.key) response=this.entryAnswer(this.lastEntry,true);
      else if (this.topic==='now'||context.section==='now'&&!this.topic) response=this.nowAnswer(true);
      else if (current)response=this.workAnswer(current,true,context);
      else if (this.topic==='experience')response=this.careerAnswer(true);
      else if (this.topic==='education'||this.topic==='certifications')response=this.educationAnswer();
      else response=clarify(t("Of course. Which project or part of his background should I unpack?",
                              "অবশ্যই। কোন প্রজেক্ট বা অভিজ্ঞতার বিষয়ে বিস্তারিত জানতে চাও?"));
    } else if (has(q,['show me','take me there','go there','open it','open this case study','show it','view it','navigate there','দেখাও','নিয়ে যাও','নিয়ে যাও']) && !workMatch && this.topic && !has(q,['now','experience','work','কাজ','project','প্রজেক্ট','contact','cv','certification','about','current'])) {
      const destination=has(q,['this case study','this project','this page'])?(lookingAt?.key||this.topic):this.topic;
      const route=routeFor(destination)||this.lastRoute;
      response=route?make(t("Come, I'll show you.", "চলো, দেখাই।"),destination,route,'pointing'):
        clarify(t("Where should I take you?", "কোথায় নিয়ে যাব?"));
    } else if (has(q,['what is jahid building','what is he building','now building','current project','paperless','manufacturing','batch traceability','factory','production','warehouse','qc/qa','এখন কী করছেন','কি বানাচ্ছে','কী বানাচ্ছে','বর্তমান প্রজেক্ট'])) {
      response=this.nowAnswer(false,nav);
    } else if (has(q,['his previous jobs','previous employers','career','experience','where did he work','work before','worked before','past job','companies','ক্যারিয়ার','চাকরি','কোথায় কাজ','কোথায় কাজ','অভিজ্ঞতা'])) {
      response=this.careerAnswer(has(q,['before','previous','past','আগে']),nav);
    } else if (has(q,['education','degree','university','diploma','what did he study','studies','studied','training','certifications','certificates','qualification','শিক্ষা','বিশ্ববিদ্যালয়','ডিপ্লোমা','সার্টিফিকেট','প্রশিক্ষণ'])) {
      response=this.educationAnswer(nav,has(q,['training','certifications','certificates','সার্টিফিকেট','প্রশিক্ষণ']));
    } else if (has(q,['skills','strengths','capabilities','what does he do','what does jahid do','what does rakib do','what do you do','expertise','দক্ষতা','কী পারেন','কি পারেন'])) {
      response=make(t("He works across marketing intelligence, research and data analysis; social media and campaigns; graphic design and packaging; creative direction, events and SketchUp layouts; and digital systems. His focus is Data × Digital × Design.",
                        "তাঁর কাজে আছে মার্কেটিং ইন্টেলিজেন্স, গবেষণা ও ডেটা অ্যানালাইসিস; সোশ্যাল মিডিয়া ও ক্যাম্পেইন; গ্রাফিক ও প্যাকেজিং ডিজাইন; ক্রিয়েটিভ ডিরেকশন, ইভেন্ট ও SketchUp লেআউট; এবং ডিজিটাল সিস্টেম। মূল ফোকাস Data × Digital × Design।"),'work',nav?routeFor('work'):null,'helping',['Show his work','What is he building?']);
    } else if (has(q,['contact','email','linkedin','hire','reach him','message him','github','cv','resume','সিভি','যোগাযোগ','ইমেইল','মেইল','লিংকডইন'])) {
      response=this.contactAnswer(q,nav);
    } else if (candidates[0] && candidates[0].score>=12 && ['case','project'].includes(candidates[0].entry.type)) {
      response=this.entryAnswer(candidates[0].entry,false);
    } else if (workMatch) {
      response=this.workAnswer(workMatch,has(q,['explain','details','more','what did','how','result','purpose','বিস্তারিত','কিভাবে','কী করেছেন'])||lookingAt?.key===workMatch.key,context,nav);
    } else if (has(q,['who is jahid','who is your master','who is he','tell me about jahid','current role','job title','which company','who is rakib','জাহিদ কে','রাকিব কে','বস কে','কোথায় কাজ করেন','কোথায় কাজ করেন'])) {
      response=make(t("Jahid Hassan Rakib is a multidisciplinary professional based in Dhaka. His portfolio lists him as Section Manager — Marketing Intelligence (Digital & Graphics) at C.P. Bangladesh Co., Ltd. He connects data, digital marketing, design and technology to practical business work.",
                        "জাহিদ হাসান রাকিব ঢাকাভিত্তিক একজন মাল্টিডিসিপ্লিনারি প্রফেশনাল। পোর্টফোলিও অনুযায়ী তিনি C.P. Bangladesh Co., Ltd.-এ Section Manager — Marketing Intelligence (Digital & Graphics)। ডেটা, ডিজিটাল মার্কেটিং, ডিজাইন ও প্রযুক্তিকে বাস্তব ব্যবসার কাজে যুক্ত করেন।"),'about',nav?routeFor('about'):null,'happy',['His career','Show his work','Contact Jahid']);
    } else {
      const destination=Object.keys(sections).find(key=>has(q,sections[key]));
      if(destination&&nav) {
        response=make(t("On our way. Here's the "+destination+" section.", "চলো, "+destination+" অংশে যাই।"),destination,routeFor(destination),'pointing');
      } else if (destination==='now') response=this.nowAnswer(false);
      else if (destination==='experience') response=this.careerAnswer(false);
      else if (destination==='work') response=make(t("His Work section has ten categories, from SketchUp layouts and design to digital marketing, analytics, technology and events. Pick one and I'll unpack it.", "Work অংশে SketchUp, ডিজাইন, ডিজিটাল মার্কেটিং, অ্যানালাইসিস, টেকনোলজি, ইভেন্টসহ দশটি ক্যাটাগরি আছে। যেটা পছন্দ, বলো।"),'work',nav?routeFor('work'):null,'observing',['Show his work','Show his AI work']);
      else if (candidates[0] && candidates[0].score>=6) response=this.entryAnswer(candidates[0].entry,false);
      else response=clarify(t("Hmm, I don't have a verified answer for that in Jahid's public portfolio. Ask about one of his projects, career, skills or current build — I can take you there.", "হুম, জাহিদের প্রকাশিত পোর্টফোলিওতে এর যাচাইকৃত উত্তর নেই। তাঁর প্রজেক্ট, ক্যারিয়ার, দক্ষতা বা বর্তমান কাজের বিষয়ে জানতে পারো।"));
    }
    return this.remember(input,response);
  };
  Brain.prototype.credentialsAnswer=function(q) {
    const items=corpus.filter(e=>e.type==='certificate');
    const listing=items.length?items.map(e=>e.title+' — '+(e.text.split(' · ')[1]||'see credential')).join('; '):
      K.education.concat(K.training).join('; ');
    const answer=t("Absolutely — his certificates have their own page. You'll find "+items.length+" published entries: "+listing+". Open the Certificates & Training section for the full details.",
                   "অবশ্যই — তাঁর সার্টিফিকেটের জন্য আলাদা পেজ আছে। প্রকাশিত "+items.length+"টি এন্ট্রি: "+listing+"। বিস্তারিত দেখতে সার্টিফিকেশন পেজ খুলে দেখো।");
    return make(answer,'certifications',routeFor('certifications'),'pointing',
      ['Open certifications','Which certificates?','View his CV']);
  };
  Brain.prototype.entryAnswer=function(entry,more){
    if(!entry)return make(shortList,'general');
    this.lastEntry=entry;
    const intro=t('I found this in Jahid’s published portfolio: ','জাহিদের প্রকাশিত পোর্টফোলিওতে পেয়েছি: ');
    const prefix=entry.title+'. ';
    const detail=shorten(entry.text,more?1050:620);
    return make(intro+prefix+detail,entry.key,entry.href,'helping',
      ['Open this case study','Tell me more','What is he building?']);
  };
  Brain.prototype.findInPortfolio=function(question,ctx) {
    return relevantEntries(question,ctx||{}).map(x=>({title:x.entry.title,href:x.entry.href,excerpt:shorten(x.entry.text,240),score:x.score}));
  };
  Brain.prototype.workAnswer = function (work, detail, ctx, nav) {
    let content = work.summary + (detail?' '+work.details:'');
    // If the visitor is on the case-study page, its visible published heading and content take precedence.
    if (ctx?.project===work.key && ctx?.title && detail) {
      const caseExcerpt=String(ctx.excerpt||'').replace(/\s+/g,' ').slice(0,460).trim();
      if (caseExcerpt) content += ' On this page: '+caseExcerpt;
    }
    const text = t((detail?'I know this one. ':'Ah, that one. ')+work.title+'. '+content,
                   'এই কাজটি চিনি। '+work.title+' — '+content);
    return make(text,work.key,nav?routeFor(work.key):null,'observing',['Open this case study','Tell me more','Show his current project']);
  };
  Brain.prototype.nowAnswer = function (detail, nav) {
    const n=K.now;
    const text=t("He's currently building "+n.title+". "+n.detail+" The planned flow is "+n.flow+". "+(detail?n.objectives+' '+n.disclaimer:n.disclaimer),
                 "জাহিদ এখন "+n.title+" প্রকল্পে কাজ করছেন। খাদ্য উৎপাদনের বিচ্ছিন্ন কাগজের রেকর্ডকে কাঠামোবদ্ধ ডিজিটাল ওয়ার্কফ্লোতে আনার কাজ চলছে। ধাপগুলো: "+n.flow+"। "+(detail?"লক্ষ্য: পেপারলেস অপারেশন, ব্যাচ ট্রেসেবিলিটি, ডেটা দৃশ্যমানতা ও প্রক্রিয়া পর্যবেক্ষণ। ":"")+"প্রকল্পটি এখনো নির্মাণাধীন; পরিকল্পিত সুবিধাগুলোকে অর্জিত ফল বলা হচ্ছে না।");
    return make(text,'now',nav?routeFor('now'):null,'excited',['Show me','Tell me more']);
  };
  Brain.prototype.careerAnswer = function (detailed, nav) {
    let items=detailed?K.career.slice(1):K.career;
    const text=t("His portfolio traces a career from computer operations and technical support to e-commerce, digital marketing, design and marketing intelligence. "+items.map(jobLine).join(' '),
                 "পোর্টফোলিওতে কম্পিউটার অপারেশন ও টেকনিক্যাল সাপোর্ট থেকে ই-কমার্স, ডিজিটাল মার্কেটিং, ডিজাইন ও মার্কেটিং ইন্টেলিজেন্স পর্যন্ত তাঁর অভিজ্ঞতা আছে। "+items.map(jobLine).join(' '));
    return make(text,'experience',nav?routeFor('experience'):null,'helping',['Show me his career','What is he building?']);
  };
  Brain.prototype.educationAnswer = function (nav, trainingOnly) {
    const list=trainingOnly?K.training:K.education.concat(K.training);
    return make(t("His published credentials include: ","পোর্টফোলিওতে উল্লেখ আছে: ")+list.join(' '),
      'certifications',nav?routeFor('certifications'):null,'helping',['Open certifications','View his CV']);
  };
  Brain.prototype.contactAnswer = function (q, nav) {
    const route=has(q,['cv','resume','সিভি'])?'cv':'contact';
    let answer=t('You can reach Jahid at '+K.owner.email+'. LinkedIn: '+K.owner.linkedin+'. Public GitHub: '+K.owner.github+'. His CV is also on the site.',
                 'জাহিদের ইমেইল '+K.owner.email+'। LinkedIn: '+K.owner.linkedin+'। GitHub: '+K.owner.github+'। সাইটে CV-ও আছে।');
    return make(answer,route,routeFor(route),'helping',['Open contact','View his CV']);
  };
  window.RaphaelBrain = Brain;
})();
