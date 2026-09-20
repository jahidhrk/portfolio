'use strict';
/* Safe deployment checks for Raphael and the existing portfolio pages. */
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
function read(path){return fs.readFileSync(path,'utf8');}
for(const path of ['script.js','raphael-knowledge.js','raphael-brain.js','raphael.js']){
  new vm.Script(read(path),{filename:path});
}
for(const page of ['index.html','work.html','certifications.html','cv.html']){
  const html=read(page);
  for(const file of ['raphael.css','raphael-knowledge.js','raphael-brain.js','raphael.js']){
    assert(html.includes(file),page+' missing Raphael asset: '+file);
  }
}
const work=read('work.html');
const inline=work.match(/<script>([\s\S]*?)<\/script>/);
assert(inline,'Existing Work page inline script not found');
new vm.Script(inline[1],{filename:'work.html:inline'});
assert(work.includes("const order=['modeling','design','creative','packaging','digital','intelligence','tech','apparel','presentation','activation']"),
  'Existing ten Work categories changed unexpectedly');
const context={
  window:{},navigator:{language:'en-US'},
  sessionStorage:{getItem:()=>null,setItem:()=>{}}
};
vm.createContext(context);
vm.runInContext(read('raphael-knowledge.js'),context);
vm.runInContext(read('raphael-brain.js'),context);
const brain=new context.window.RaphaelBrain();
const current={section:'work',project:'modeling',title:'SketchUp 3D Modeling & Layout Design',excerpt:'Event & Exhibition Layout'};
const cases=[
  ['Who is Jahid?','about'],
  ['What does Jahid do?','work'],
  ['What is he building now?','now'],
  ['Tell me more','now'],
  ['Show me','now','index.html#now'],
  ['Where did he work before?','experience'],
  ['Show me his AI work','tech','work.html?category=tech'],
  ['What is this?','modeling'],
  ['Open this case study','modeling','work.html?category=modeling'],
  ['What is his salary?','general'],
  ['View his CV','cv','cv.html'],
  ['What is his email?','contact','index.html#contact']
];
for(const [input,topic,route] of cases){
  const result=brain.reply(input,current);
  assert.equal(result.topic,topic,'Wrong topic for: '+input);
  if(route)assert.equal(result.route,route,'Wrong destination for: '+input);
  assert(result.text&&typeof result.text==='string');
}
assert(!/sk-[A-Za-z0-9]{20,}/.test(
  ['raphael-knowledge.js','raphael-brain.js','raphael.js'].map(read).join('')),
  'Potential API key in client script');
console.log('Raphael: script syntax, page integration, Work archive, 12 conversation scenarios and key check passed.');
