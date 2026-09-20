'use strict';
/* Mock the Worker provider and the public portfolio. Never call Gemini during CI. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const workerCode=fs.readFileSync('workers/raphael-ai.js','utf8');
const corpus=fs.readFileSync('raphael-corpus.js','utf8');
assert(workerCode.includes('env.GEMINI_API_KEY'),'Worker must use a server-side secret');
assert(!workerCode.includes('window.GEMINI_API_KEY'),'Worker must not expose the key');
const seen={calls:0,providerBody:null};
async function fetchMock(url,options){
  if(String(url).endsWith('/raphael-corpus.js'))return new Response(corpus,{status:200});
  if(String(url).startsWith('https://generativelanguage.googleapis.com/')){
    seen.calls++;
    seen.providerBody=JSON.parse(options.body);
    assert.equal(options.headers['x-goog-api-key'],'private-test-key');
    return new Response(JSON.stringify({candidates:[{content:{parts:[{text:"Jahid's published certificate page has the details. I can explain any of them."}]}}]}),{status:200});
  }
  throw Error('Unrecognized endpoint');
}
const scope={fetch:fetchMock,Response,URL,AbortController,setTimeout,clearTimeout,Date,Map,Set,JSON,Number,String,Array,RegExp,Error};
scope.globalThis=scope;
vm.createContext(scope);
vm.runInContext(workerCode.replace('export default {','globalThis.raphaelWorker = {'),scope,{timeout:2500});
const handler=scope.raphaelWorker.fetch;
const origin='https://jahidhrk.github.io',base='https://example.workers.dev';
const req=(url,body,overrideOrigin=origin)=>new Request(base+url,{method:'POST',headers:{Origin:overrideOrigin,'Content-Type':'application/json'},body:JSON.stringify(body)});
(async()=>{
 let res=await handler(req('/chat',{message:'hi'},'https://bad.example'),{GEMINI_API_KEY:'private-test-key'});
 assert.equal(res.status,403,'Unknown origin must be blocked');
 res=await handler(req('/chat',{message:'hello'}),{});
 assert.equal(res.status,503,'Worker must not pretend to have AI without a secret');
 res=await handler(new Request(base+'/health',{headers:{Origin:origin}}),{GEMINI_API_KEY:'private-test-key'});
 assert.equal((await res.json()).ready,true,'Worker health should reflect private secret');
 const data={message:'Where can I see his certificates?',context:{project:null,section:'about'},history:[],language:'en-US'};
 res=await handler(req('/chat',data),{GEMINI_API_KEY:'private-test-key'});
 assert.equal(res.status,200);
 const out=await res.json();
 assert.equal(out.mode,'generative');
 assert.equal(out.grounded,true);
 assert(seen.calls===1);
 assert(JSON.stringify(seen.providerBody.systemInstruction).includes('Google Ads Search Certification'),'Only grounded public facts must reach the model');
 assert(!JSON.stringify(out).includes('private-test-key'),'The secret must never be returned');
 assert(JSON.stringify(out).includes('published certificate'));
 console.log('Raphael Worker: CORS, missing-key fallback, health, verified corpus retrieval, mocked Gemini response and key isolation passed.');
})().catch(error=>{console.error(error);process.exitCode=1;});
