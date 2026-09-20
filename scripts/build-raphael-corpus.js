/* Derives Raphael's searchable public knowledge from the actual portfolio during deployment.
   No API keys, private files, certificate images or personal visitor data are included. */
'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8');
function expression(file,start,end){
  const data=read(file),a=data.indexOf(start);
  if(a<0)throw Error('Missing '+start+' in '+file);
  const b=data.indexOf(end,a+start.length);
  if(b<0)throw Error('Missing '+end+' in '+file);
  return vm.runInNewContext('('+data.slice(a+start.length,b)+')',Object.create(null),{timeout:3000});
}
function text(input){
  return String(input||'')
    .replace(/<script[\s\S]*?<\/script>/gi,' ')
    .replace(/<style[\s\S]*?<\/style>/gi,' ')
    .replace(/<[^>]*>/g,' ')
    .replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&lt;/g,'<')
    .replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'")
    .replace(/&#x27;/gi,"'").replace(/\s+/g,' ').trim();
}
const cases=expression('work.html','const cases=',';\nconst order=');
const certificates=expression('certifications.html','const certificates=',';\n\nconst grid');
const entries=[];
function add(key,title,body,url,type,tags){
  const content=text(body);if(content)
    entries.push({key,title,text:content,href:url,type,tags:Array.isArray(tags)?tags:[]});
}
const order=['modeling','design','creative','packaging','digital','intelligence','tech','apparel','presentation','activation'];
for(const key of order){
  const work=cases[key];if(!work)throw Error('Work category missing: '+key);
  const href='work.html?category='+key;
  const terms=[work.title,...(work.tools||[])];
  add(key,work.title,(work.intro||'')+' '+(work.metric||'')+' '+(work.metricNoteHtml||''),href,'work',terms);
  add(key,work.title+' — tools & capabilities',(work.tools||[]).join(' · '),href,'skills',terms);
  for(const block of work.blocks||[])
    add(key,work.title+' — '+(block.title||block.label),block.body||'',href,'case',terms.concat([block.label,block.title]));
  for(const tag of ['problem','did','result'])
    if(work[tag+'Html']||work[tag])
      add(key,work.title+' — '+tag,work[tag+'Html']||work[tag],href,'case',terms.concat([tag]));
  for(const project of work.projects||[])
    add(key,project.title,[
      project.description,project.problem,project.did,project.result,
      ...(project.facts||[]).map(x=>x.label+': '+x.text)
    ].filter(Boolean).join(' '),href,'project',terms.concat([project.title]));
  for(const visual of work.visualDetails||[])
    add(key,visual.title,[visual.subtitle,visual.statement,visual.status,...(visual.highlights||[])].join(' '),href,'project',terms.concat([visual.title,visual.label]));
}
for(const item of certificates){
  add('certifications',item.title,
    [item.title,item.issuer,item.year,item.categoryLabel,item.description,item.achievement].join(' · '),
    'certifications.html','certificate',
    [item.title,item.issuer,item.categoryLabel,item.category,'certification','certificate','credential']);
}
const index=read('index.html');
const sections=[
  ['now','NOW BUILDING','index.html#now'],
  ['experience','My career journey','index.html#experience'],
  ['about','About Jahid Hassan Rakib','index.html#about'],
  ['contact','Contact Jahid Hassan Rakib','index.html#contact'],
  ['gallery','Life & Learning','index.html#gallery']
];
for(const [key,title,href] of sections){
  const pattern=new RegExp('<section\\s+id="'+key+'"[\\s\\S]*?<\\/section>','i');
  const match=index.match(pattern);
  if(match)add(key,title,match[0],href,'section',[title,key]);
}
const cv=read('cv.html');
const cvBody=cv.match(/<main class="cv">([\s\S]*?)<\/main>/);
if(cvBody)add('cv','Jahid Hassan Rakib — full CV',cvBody[1],'cv.html','cv',['cv','resume','education','employers','career','qualifications']);
const body='/* Built from the public portfolio by scripts/build-raphael-corpus.js. Do not include secrets. */\n'+
 '(function(){window.RAPHAEL_CORPUS='+JSON.stringify({entries},null,0)+';})();\n';
fs.writeFileSync('raphael-corpus.js',body,'utf8');
console.log('Raphael corpus: '+entries.length+' entries from '+order.length+' work categories, '+certificates.length+' certificates and the public portfolio.');
