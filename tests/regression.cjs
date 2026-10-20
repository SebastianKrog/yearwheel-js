const assert=require('node:assert/strict'),fs=require('node:fs');
global.crypto=require('node:crypto').webcrypto;
const elements=new Map();global.document={getElementById(id){if(!elements.has(id))elements.set(id,{value:'',checked:false,dataset:{},addEventListener(){},setAttribute(k,v){this[k]=v},focus(){},showModal(){this.open=true},close(){this.open=false}});return elements.get(id)},addEventListener(){}};global.window={addEventListener(){}};global.localStorage={getItem(){return null},setItem(){}};global.setTimeout=()=>0;global.confirm=()=>true;
const a=require('../dist/app.js'),$=id=>document.getElementById(id);
function base(extra={}){return a.validatePlan({year:2026,start:1,end:53,title:'Research & teaching',center:'2026',events:[],...extra})}
assert.equal(a.weeksIn(2026),53);assert.equal(a.weeksIn(2025),52);assert.equal(a.parseWeek('2026-02-02',2026),6);assert.equal(a.parseWeek('30-04-2026',2026),18);assert.throws(()=>a.parseWeek('31-02-2026',2026));
assert.equal(a.monthColors[8],'#f0dfe9');assert.equal(a.monthColors[2],'#dff0e8');assert.equal(new Set(a.monthColors).size,12);a.setPlan(base());assert.equal(a.validColor('red'),'#ff0000');assert.equal(a.validColor('SteelBlue'),'#4682b4');assert.equal(a.validColor('rebeccapurple'),'#663399');assert.equal(a.validColor('#abc'),'#aabbcc');assert.equal(a.validColor('midpurple'),'#bfa3ec');assert.throws(()=>a.validColor('var(--red)'));
let p=base({highlights:'12, 24–26'});assert.equal(p.highlightGroups[0].color,'#ff0000');a.setPlan(p);assert(a.highlights().has(26));
let imported=a.prepareCSV('category;date;end_date;name;color\nactivity;2;5;First;highlight\nconference;8;;Second;\n;;;;\nconference;;;Undated;steelblue');assert.equal(imported.events.length,3);assert.equal(imported.events[2].start,null);assert.equal(imported.events[0].color,'highlight');assert.equal(imported.events[1].color,'');p={...p,...imported};a.setPlan(p);assert.equal(a.activeCategories().length,2);assert.equal(a.eventColor(p.events[0]),p.categories[0].highlight);assert.equal(a.eventColor(p.events[1]),p.categories[2].color);
let scene=a.makeScene();assert(!scene.filter(o=>o.type==='poly').some(o=>o.pts.some(([x,y])=>Math.hypot(x-500,y-500)<215.9)),'Inner ring must be absent');
p.categories[0].name='Research & grants';p.categories[0].highlight='#ff00ff';assert.equal(a.eventColor(p.events[0]),'#ff00ff');assert(a.csv(p.events).includes('Research & grants'));assert(a.latex().includes(String.raw`Research {\&} grants`));
p.highlightGroups=[{weeks:'2-4',color:'#ff0000'},{weeks:'4, 8',color:'#0000ff'}];a.setPlan(p);assert.equal(a.highlights().get(2),'#ff0000');assert.equal(a.highlights().get(4),'#0000ff');assert(a.makeScene().some(o=>o.type==='text'&&o.value==='8'&&o.fill==='#0000ff'));
const restored=base(JSON.parse(JSON.stringify(p)));assert.deepEqual(restored.categories,p.categories);assert.deepEqual(restored.highlightGroups,p.highlightGroups);assert.equal(restored.events[0].color,'highlight');
const before=p.events.map(e=>[e.name,e.start,e.end,e.color]);const round=a.prepareCSV(a.csv(p.events));assert.deepEqual(round.events.map(e=>[e.name,e.start,e.end,e.color]),before);
a.setPlan(base());const custom=a.prepareCSV('category,date,name,color\nClinical,5,A,highlight\nTeaching,6,B,');assert.equal(custom.categories[0].name,'Clinical');assert.equal(custom.categories[1].name,'Teaching');assert.equal(custom.events[0].category,'activity');assert.equal(a.prepareCSV('date,name\n4,No category').events[0].category,'activity');assert.throws(()=>a.prepareCSV('category,date,name\na,1,A\nb,2,B\nc,3,C\nd,4,D'));
a.setPlan(base({...custom}));const id=a.getPlan().events[0].id;$('rows').onclick({target:{closest(selector){return selector==='[data-event]'?{dataset:{event:id}}:null}}});assert.equal($('editor').open,true);assert.equal($('event-name').value,'A');assert.equal($('event-color-mode').value,'highlight');
// Editor lists are outer-to-inner while saved category arrays preserve old inner-to-outer order.
const ordered=base({events:[{category:'activity',date:5,name:'Activity ring',color:'highlight'},{category:'funding',date:6,name:'Funding ring'},{category:'conference',date:7,name:'Conference ring'}]});a.setPlan(ordered);
assert.deepEqual(a.categoryDisplayOrder().map(c=>c.id),['conference','funding','activity']);
function radiusFor(id){const event=a.getPlan().events.find(e=>e.category===id),shape=a.makeScene().find(o=>o.type==='poly'&&o.id===event.id);return Math.max(...shape.pts.map(([x,y])=>Math.hypot(x-500,y-500)))}
assert(radiusFor('conference')>radiusFor('activity'));
assert(a.reorderCategory('activity','conference'));assert.deepEqual(a.categoryDisplayOrder().map(c=>c.id),['activity','conference','funding']);assert(radiusFor('activity')>radiusFor('conference'));assert(radiusFor('conference')>radiusFor('funding'));assert.equal(a.getPlan().events.length,3);assert.equal(a.getPlan().events[0].color,'highlight');
assert($('event-category').innerHTML.indexOf('value="activity"')<$('event-category').innerHTML.indexOf('value="conference"'));assert($('categories').innerHTML.indexOf('data-category="activity"')<$('categories').innerHTML.indexOf('data-category="conference"'));
assert.deepEqual(base(JSON.parse(JSON.stringify(a.getPlan()))).categories,a.getPlan().categories);assert(!a.reorderCategory('activity','activity'));assert(!a.reorderCategory('missing','activity'));
// Exercise the desktop drag/drop, keyboard, and touch handlers through their event paths.
const classes={add(){},remove(){}},rows=()=>a.categoryDisplayOrder().map((c,i)=>({dataset:{category:c.id},classList:classes,getBoundingClientRect(){return {top:i*60,height:50}},querySelector(){return {focus(){}}}}));$('categories').querySelectorAll=()=>rows();
function handleFor(id){return {closest(){return rows().find(r=>r.dataset.category===id)},setPointerCapture(){},hasPointerCapture(){return true},releasePointerCapture(){}}}
let dragData='';const handle=handleFor('funding');$('categories').ondragstart({target:{closest(){return handle}},dataTransfer:{setData(k,v){dragData=v}}});assert.equal(dragData,'funding');const target=rows()[0];$('categories').ondrop({target:{closest(){return target}},clientY:1,preventDefault(){}});assert.equal(a.categoryDisplayOrder()[0].id,'funding');
$('categories').onkeydown({target:{closest(){return handleFor('funding')}},key:'ArrowDown',preventDefault(){}});assert.equal(a.categoryDisplayOrder()[1].id,'funding');
const touchHandle=handleFor('funding');$('categories').onpointerdown({target:{closest(){return touchHandle}},pointerType:'touch',pointerId:1,clientY:70,preventDefault(){}});document.elementFromPoint=()=>({closest(){return rows()[2]}});$('categories').onpointermove({pointerId:1,clientX:10,clientY:169,preventDefault(){}});$('categories').onpointerup({pointerId:1,clientY:169});assert.equal(a.categoryDisplayOrder()[2].id,'funding');
const previous=a.categoryDisplayOrder().map(c=>c.id);$('categories').onpointerdown({target:{closest(){return handleFor('funding')}},pointerType:'touch',pointerId:2,clientY:130,preventDefault(){}});$('categories').onpointermove({pointerId:2,clientX:10,clientY:10,preventDefault(){}});$('categories').onpointercancel({pointerId:2,clientY:10});assert.deepEqual(a.categoryDisplayOrder().map(c=>c.id),previous);
// Categories with events may be disabled, restored and round-tripped without deletion.
const three=base({events:[{category:'activity',date:5,name:'Keep research'},{category:'funding',date:6,name:'Keep funding'},{category:'conference',date:7,name:'Keep meeting'}]});a.setPlan(three);const fundingId=three.events[1].id;
$('categories').onchange({target:{dataset:{categoryField:'enabled'},checked:false,closest(){return {dataset:{category:'funding'}}}}});assert.equal(a.getPlan().events.length,3);assert.equal(a.getPlan().categories[1].enabled,false);assert.equal(a.activeCategories().length,2);assert(!a.makeScene().some(o=>o.id===fundingId));assert($('rows').innerHTML.includes('Disabled'));assert($('count').textContent.includes('2 of 3 events'));assert($('event-category').innerHTML.includes('Funding (disabled)'));assert.equal(base(JSON.parse(JSON.stringify(a.getPlan()))).events.length,3);
$('categories').onchange({target:{dataset:{categoryField:'enabled'},checked:true,closest(){return {dataset:{category:'funding'}}}}});assert(a.makeScene().some(o=>o.id===fundingId));assert.equal(a.getPlan().events.length,3);
let submitted=0;$('overleaf-form').submit=()=>submitted++;a.openInOverleaf();assert.equal(submitted,1);assert.equal(decodeURIComponent($('overleaf-source').value),a.latex());assert(decodeURIComponent($('overleaf-source').value).includes('Research & teaching')===false);assert(decodeURIComponent($('overleaf-source').value).includes('\\usepackage{wheelchart}'));

// The export uses the original standalone wheelchart template, not SVG paths.
const templatePlan=base({events:[
  {category:'activity',date:5,name:'Interne\\\\Midler',color:'highlight'},
  {category:'activity',date:5,name:'Second, A/B & 50%_{x}',color:'red'},
  {category:'funding',date:2,end_date:5,name:'Grant, A/B',color:'highlight'},
  {category:'funding',date:2,end_date:5,name:'Grant two',color:'highlight'},
  {category:'funding',date:2,end_date:5,name:'Grant three',color:'highlight'},
  {category:'conference',date:8,name:'ØW',color:'steelblue'},
  {category:'conference',name:'Unscheduled sentinel'}
],highlightGroups:[{weeks:'5,8',color:'red'},{weeks:'8',color:'blue'}]});
a.setPlan(templatePlan);let tex=a.latex();
for(const token of [String.raw`\documentclass[border=6pt]{standalone}`,String.raw`\usepackage{wheelchart}`,String.raw`arc data expand=f`,String.raw`plot={{#1}:{#2+0*(450-#1)}}`,String.raw`wheel data style={align=center,rotate=\WCmidangle+(\WCmidangle<90?0:(\WCmidangle<270?180:0))}`, 'radius={2.5}{4.3}','radius={4.4}{4.8}','radius={4.9}{6.7}','radius={6.8}{7.1}','radius={7.2}{9}','radius={9.1}{9.5}','radius={9.7}{10.1}','radius={10.1}{10.5}','radius={10.6}{11.1}','total count=53','slices arrow={1}{0}','gap polar=-4','gap radius=0.02',String.raw`middle={\fontsize{48}{60}\selectfont2026}`])assert(tex.includes(token),token);
assert(!/longtable|newpage|resizebox|Unscheduled sentinel/.test(tex));
assert(tex.includes(String.raw`wheel data{5}={Interne\\Midler\\Second, A/B \& 50\%\_\{x\}}`));
assert(tex.includes(String.raw`domain/.expanded=\wcdomain{2/53}{5/53}`));
for(const r of ['radius={4.9}{5.5}','radius={5.5}{6.1}','radius={6.1}{6.7}'])assert(tex.includes(r));
assert(tex.includes(']{{Grant, A/B}}'));
assert(tex.includes('29/4,5/11,12/18'));assert(tex.includes('28/3}'));assert(tex.includes('51,52,53}'));
assert.match(tex,/arc data style\{5\}=\{text color=ywColor\d+\}/);assert.match(tex,/arc data style\{8\}=\{text color=ywColor\d+\}/);
// Range-local slice indices must also be used for event and highlight keys.
const partial=base({...templatePlan,start:5,end:8});a.setPlan(partial);tex=a.latex();
assert(tex.includes('wheel data{1}='));assert(tex.includes(String.raw`wheel data{4}={{\O}W}`));assert(tex.includes('total count=4'));assert.match(tex,/arc data style\{1\}=\{text color=ywColor\d+\}/);assert.match(tex,/arc data style\{4\}=\{text color=ywColor\d+\}/);assert(!tex.includes('domain/.expanded=\\wcdomain{2/53}'));assert(tex.includes('domain/.expanded=\\wcdomain{0/4}{1/4}'));
// Disabled categories and their events are excluded, including from TeX.
partial.categories[1].enabled=false;a.setPlan(partial);tex=a.latex();assert(!tex.includes('Grant, A/B'));assert(!tex.includes('radius={2.5}{4.3}'));assert(tex.includes('radius=4.8]'));assert(!tex.includes('arc data={Funding}'));
const reversed=base({...templatePlan,categories:[...templatePlan.categories].reverse()});a.setPlan(reversed);tex=a.latex();assert(tex.indexOf('arc data={Conferences}')<tex.indexOf('arc data={Activities}'));
const year52=base({year:2025,center:'2025',end:52});a.setPlan(year52);tex=a.latex();assert(tex.includes('total count=52'));assert(tex.includes('30/5,6/12'));assert(!tex.includes('51,52,53}'));

a.setPlan(base({...custom}));
(async()=>{let confirmations=0;global.confirm=()=>{confirmations++;return false};$('replace').checked=true;$('file').files=[{name:'test.csv',size:100,text:async()=>'category,date,name,color\nClinical,5,Replacement,red'}];await $('file').onchange();assert.equal(confirmations,1);assert.equal(a.getPlan().events[0].name,'A');global.confirm=()=>true;await $('file').onchange();assert.equal(a.getPlan().events.length,1);assert.equal(a.getPlan().events[0].name,'Replacement');$('replace').checked=false;await $('file').onchange();assert.equal(a.getPlan().events.length,2);
// Produce a representative two-ring export for compilation and visual QA.
const cfg=a.defaultCategories();cfg[0].name='Research & grants';cfg[0].color='#d7eeed';cfg[0].highlight='#54b8b4';cfg[1].enabled=false;
const final=base({categories:cfg,highlightGroups:[{weeks:'12,24-26',color:'red'},{weeks:'32-35',color:'steelblue'}],events:[{category:'activity',date:5,end_date:12,name:'Research project',color:'highlight'},{category:'conference',date:24,name:'Annual meeting',color:'steelblue'},{category:'conference',date:40,name:'Workshop',color:''}]});a.setPlan(final);if(process.env.YEARWHEEL_QA_TEX)fs.writeFileSync(process.env.YEARWHEEL_QA_TEX,a.latex());console.log('Passed editor/calendar regressions and original wheelchart export, multiline labels, three-band spans, partial ranges, category ordering/exclusion, and identical Overleaf source checks.');})().catch(e=>{console.error(e);process.exitCode=1});
