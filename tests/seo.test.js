'use strict';
// Static SEO regression checks for the public GitHub Pages portfolio.
const fs=require('node:fs'),assert=require('node:assert/strict');
const read=f=>fs.readFileSync(f,'utf8');
const base='https://jahidhrk.github.io/portfolio/';
const paths=['index.html','work.html','cv.html','certifications.html'];
for(const path of paths){
  const text=read(path), expected=base+(path==='index.html'?'':path);
  const head=text.match(/<head>([\s\S]*?)<\/head>/i)?.[1]||'';
  assert(head,'Missing HTML head: '+path);
  for(const marker of [
    '<title>','name="description"','name="robots"','rel="canonical"',
    'property="og:title"','property="og:description"','property="og:image"',
    'name="twitter:card"','application/ld+json'
  ]) assert(head.includes(marker),path+' missing '+marker);
  assert(head.includes('Jahid Hassan Rakib'),path+' missing full name');
  assert(head.includes('href="'+expected+'"'),path+' incorrect canonical');
  assert(!head.includes('noindex'),path+' must be indexable');
  const description=head.match(/<meta name="description" content="([^"]*)"/)?.[1];
  assert(description?.length>=80&&description.length<=190,path+' metadata description too short or too long');
  const script=head.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  const graph=JSON.parse(script);
  assert.equal(graph['@context'],'https://schema.org');
  const nodes=graph['@graph']||[graph];
  assert(nodes.some(n=>n.url===expected),path+' schema page URL wrong');
  assert(nodes.some(n=>n['@type']==='Person'&&n.name==='Jahid Hassan Rakib')||
    nodes.some(n=>n.about?.['@id']===base+'#person'),path+' missing Person connection');
}
const home=read('index.html');
assert(home.includes('JAHID HASSAN RAKIB · DHAKA'), 'Homepage visible identity missing');
assert(!home.includes('id="testimonials"'), 'Removed testimonial placeholders reappeared');
assert(read('admin.html').includes('noindex,nofollow'), 'Private authoring guide must not index');
const sitemap=read('sitemap.xml');
const locations=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.equal(locations.length,paths.length,'Sitemap page count changed');
for(const path of paths)assert(locations.includes(base+(path==='index.html'?'':path)),
  'Sitemap missing '+path);
assert(!sitemap.includes('?category='),'Non-canonical Work query links in sitemap');
const robots=read('robots.txt');
assert(robots.includes(base+'sitemap.xml'),'Sitemap URL missing in project robots.txt');
console.log('SEO: four indexable canonical pages, structured data, social metadata, profile identity, sitemap and admin noindex passed.');
