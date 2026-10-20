const assert=require('node:assert/strict'),fs=require('node:fs');
global.crypto=require('node:crypto').webcrypto;
const elements=new Map();global.document={getElementById(id){if(!elements.has(id))elements.set(id,{value:'',checked:false,dataset:{},addEventListener(){},setAttribute(k,v){this[k]=v},focus(){},showModal(){this.open=true},close(){this.open=false}});return elements.get(id)},addEventListener(){}};global.window={addEventListener(){}};global.localStorage={getItem(){return null},setItem(){}};global.setTimeout=()=>0;global.confirm=()=>true;
const a=require('../dist/app.js'),$=id=>document.getElementById(id);
function base(extra={}){return a.validatePlan({year:2026,start:1,end:53,title:'Research & teaching',center:'2026',events:[],...extra})}
assert.equal(a.weeksIn(2026),53);assert.equal(a.weeksIn(2025),52);assert.equal(a.parseWeek('2026-02-02',2026),6);assert.equal(a.parseWeek('30-04-2026',2026),18);assert.throws(()=>a.parseWeek('31-02-2026',2026));
assert.equal(a.monthColors[8],'#aa4488');assert.equal(a.monthColors[2],'#00997a');assert.equal(new Set(a.monthColors).size,12);a.setPlan(base());assert.equal(a.validColor('red'),'#ff0000');assert.equal(a.validColor('SteelBlue'),'#4682b4');assert.equal(a.validColor('rebeccapurple'),'#663399');assert.equal(a.validColor('#abc'),'#aabbcc');assert.equal(a.validColor('midpurple'),'#bfa3ec');assert.throws(()=>a.validColor('var(--red)'));
let p=base({highlights:'12, 24–26'});assert.equal(p.highlightGroups[0].color,'#ff0000');a.setPlan(p);assert(a.highlights().has(26));
let imported=a.prepareCSV('category;date;end_date;name;color\nactivity;2;5;First;highlight\nconference;8;;Second;\n;;;;\nconference;;;Undated;steelblue');assert.equal(imported.events.length,3);assert.equal(imported.events[2].start,null);assert.equal(imported.events[0].color,'highlight');assert.equal(imported.events[1].color,'');p={...p,...imported};a.setPlan(p);assert.equal(a.activeCategories().length,2);assert.equal(a.eventColor(p.events[0]),p.categories[0].highlight);assert.equal(a.eventColor(p.events[1]),p.categories[2].color);
let scene=a.makeScene();assert(!scene.filter(o=>o.type==='poly').some(o=>o.pts.some(([x,y])=>Math.hypot(x-500,y-500)<215.9)),'Inner ring must be absent');
p.categories[0].name='Research & grants';p.categories[0].highlight='#ff00ff';assert.equal(a.eventColor(p.events[0]),'#ff00ff');assert(a.csv(p.events).includes('Research & grants'));assert(a.latex().includes(String.raw`Research {\&} grants`));
p.highlightGroups=[{weeks:'2-4',color:'#ff0000'},{weeks:'4, 8',color:'#0000ff'}];a.setPlan(p);assert.equal(a.highlights().get(2),'#ff0000');assert.equal(a.highlights().get(4),'#0000ff');assert(a.makeScene().some(o=>o.type==='text'&&o.value==='8'&&o.fill==='#0000ff'));
const restored=base(JSON.parse(JSON.stringify(p)));assert.deepEqual(restored.categories,p.categories);assert.deepEqual(restored.highlightGroups,p.highlightGroups);assert.equal(restored.events[0].color,'highlight');
const before=p.events.map(e=>[e.name,e.start,e.end,e.color]);const round=a.prepareCSV(a.csv(p.events));assert.deepEqual(round.events.map(e=>[e.name,e.start,e.end,e.color]),before);
a.setPlan(base());const custom=a.prepareCSV('category,date,name,color\nClinical,5,A,highlight\nTeaching,6,B,');assert.equal(custom.categories[0].name,'Clinical');assert.equal(custom.categories[1].name,'Teaching');assert.equal(custom.events[0].category,'activity');assert.equal(a.prepareCSV('date,name\n4,No category').events[0].category,'activity');assert.throws(()=>a.prepareCSV('category,date,name\na,1,A\nb,2,B\nc,3,C\nd,4,D'));
a.setPlan(base({...custom}));const id=a.getPlan().events[0].id;$('rows').onclick({target:{closest(selector){return selector==='[data-modal-edit]'?{dataset:{modalEdit:id}}:null}}});assert.equal($('editor').open,true);assert.equal($('event-name').value,'A');assert.equal($('event-color-mode').value,'highlight');
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
$('categories').onchange({target:{dataset:{categoryField:'enabled'},checked:false,closest(){return {dataset:{category:'funding'}}}}});assert.equal(a.getPlan().events.length,3);assert.equal(a.getPlan().categories[1].enabled,false);assert.equal(a.activeCategories().length,2);assert(!a.makeScene().some(o=>o.id===fundingId));assert($('rows').innerHTML.includes('Disabled'));assert($('count').innerHTML.includes('2 of 3 events'));assert($('event-category').innerHTML.includes('Funding (disabled)'));assert.equal(base(JSON.parse(JSON.stringify(a.getPlan()))).events.length,3);
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
assert(!/longtable|newpage|Unscheduled sentinel/.test(tex));
assert(tex.includes(String.raw`Interne\\Midler\\Second, A/\allowbreak{}B \& 50\%\_\{x\}`));
assert(tex.includes(String.raw`domain/.expanded=\wcdomain{1/53}{5/53}`));
for(const r of ['radius={4.9}{5.5}','radius={5.5}{6.1}','radius={6.1}{6.7}'])assert(tex.includes(r));
assert(tex.includes(']{{Grant, A/B}}'));
assert(tex.includes('29/4,5/11,12/18'));assert(tex.includes('28/3}'));assert(tex.includes('51,52,53}'));
assert.match(tex,/arc data style\{5\}=\{text color=ywColor\d+\}/);assert.match(tex,/arc data style\{8\}=\{text color=ywColor\d+\}/);

// Exports use the same 12-month palette as the SVG, with readable dark labels.
for(const [i,name] of ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].entries())assert(tex.includes(`\\definecolor{m${name}}{HTML}{${a.monthColors[i].slice(1)}}`));
assert(tex.includes('arc data style={text color=white}'));
assert(tex.includes(String.raw`\ywfitlabel{1.6cm}`));assert(tex.includes('\\ifdim\\ywlabelsize pt>7pt'));
assert.equal(a.validColor('darkgreen'),'#54b8b4');assert.equal(a.validColor('darkblue'),'#5893c1');
assert.equal(a.validColor('lightblue'),'#d7e5f0');assert.equal(a.validColor('green'),'#008000');assert.equal(a.validColor('red'),'#ff0000');
const wrapped=a.prepareCSV('category,date,name,color\nactivity,5,"Interne\\\\Midler",darkgreen\nconference,13,"DKFD\nabstract",darkblue');
assert.equal(wrapped.events[0].color,'#54b8b4');assert.equal(wrapped.events[1].color,'highlight');assert.equal(wrapped.events[1].subcategory,'blue');
a.setPlan(base({...wrapped}));assert(a.latex().includes(String.raw`Interne\\Midler`));assert(a.latex().includes(String.raw`DKFD\\abstract`));
const originalNames=a.getPlan().events.map(e=>e.name);a.latex();assert.deepEqual(a.getPlan().events.map(e=>e.name),originalNames);
const wrapRoundtrip=a.prepareCSV(a.csv(a.getPlan().events));assert.deepEqual(wrapRoundtrip.events.map(e=>e.name),originalNames);
a.openEditor(a.getPlan().events[1].id);assert.equal($('event-name').value,'DKFD\nabstract');
a.setPlan(templatePlan);

// Range-local slice indices must also be used for event and highlight keys.
const partial=base({...templatePlan,start:5,end:8});a.setPlan(partial);tex=a.latex();
assert(tex.includes('wheel data{1}='));assert(tex.includes(String.raw`{\O}W`));assert(tex.includes('total count=4'));assert.match(tex,/arc data style\{1\}=\{text color=ywColor\d+\}/);assert.match(tex,/arc data style\{4\}=\{text color=ywColor\d+\}/);assert(!tex.includes('domain/.expanded=\\wcdomain{2/53}'));assert(tex.includes('domain/.expanded=\\wcdomain{0/4}{1/4}'));
// Disabled categories and their events are excluded, including from TeX.
partial.categories[1].enabled=false;a.setPlan(partial);tex=a.latex();assert(!tex.includes('Grant, A/B'));assert(!tex.includes('radius={2.5}{4.3}'));assert(tex.includes('radius=4.8]'));assert(!tex.includes('arc data={Funding}'));
const reversed=base({...templatePlan,categories:[...templatePlan.categories].reverse()});a.setPlan(reversed);tex=a.latex();assert(tex.indexOf('arc data={Conferences}')<tex.indexOf('arc data={Activities}'));
const year52=base({year:2025,center:'2025',end:52});a.setPlan(year52);tex=a.latex();assert(tex.includes('total count=52'));assert(tex.includes('30/5,6/12'));assert(!tex.includes('51,52,53}'));


// Conference child palettes share one parent ring and remain editable/portable.
const subPlan=base({events:[
 {category:'activity',date:1,name:'Activity'}, {category:'funding',date:2,name:'Funding'},
 {category:'conference',subcategory:'blue',date:5,name:'Blue normal'},
 {category:'conference',subcategory:'blue',date:6,name:'Blue highlight',color:'highlight'},
 {category:'conference',subcategory:'purple',date:7,name:'Purple normal'},
 {category:'conference',subcategory:'purple',date:8,name:'Purple highlight',color:'highlight'},
 {category:'conference',subcategory:'purple',date:9,name:'Explicit override',color:'#123456'}
]});a.setPlan(subPlan);const conference=subPlan.categories.find(c=>c.id==='conference');
assert.deepEqual(subPlan.events.slice(2).map(e=>a.eventColor(e)),['#98bcd9','#5893c1','#bfa3ec','#9879ce','#123456']);
assert.equal(a.activeCategories().length,3);assert.equal((a.latex().match(/% CATEGORY /g)||[]).length,3);
assert($('categories').innerHTML.includes('data-subcategory="purple"'));
a.openEditor(subPlan.events[4].id);assert.equal($('event-subcategory').value,'purple');assert.equal($('event-subcategory-row').hidden,false);assert($('event-subcategory').innerHTML.includes('Blue'));
$('event-subcategory').value='blue';$('event-form').onsubmit({preventDefault(){}});assert.equal(a.getPlan().events[4].subcategory,'blue');
// Edits to a child colour affect inheriting events; custom overrides stay exact.
$('categories').onchange({target:{dataset:{subcategoryField:'color'},value:'#aa55cc',closest(selector){return selector==='[data-category]'?{dataset:{category:'conference'}}:{dataset:{subcategory:'blue'}}}}});
assert.equal(a.eventColor(a.getPlan().events[2]),'#aa55cc');assert.equal(a.eventColor(a.getPlan().events[6]),'#123456');
$('categories').onchange({target:{dataset:{subcategoryField:'name'},value:'Purple meetings',closest(selector){return selector==='[data-category]'?{dataset:{category:'conference'}}:{dataset:{subcategory:'purple'}}}}});
const subsRoundtrip=a.prepareCSV(a.csv(a.getPlan().events));assert.deepEqual(subsRoundtrip.events.map(e=>[e.subcategory,e.color]),a.getPlan().events.map(e=>[e.subcategory,e.color]));assert.deepEqual(base(JSON.parse(JSON.stringify(a.getPlan()))).categories,a.getPlan().categories);
const oldColours=a.prepareCSV('category,date,name,color\nconference,1,Blue normal,midblue\nconference,2,Blue strong,darkblue\nconference,3,Purple normal,midpurple\nconference,4,Purple strong,darkpurple');
assert.deepEqual(oldColours.events.map(e=>[e.subcategory,e.color]),[['blue',''],['blue','highlight'],['purple',''],['purple','highlight']]);
assert.throws(()=>a.validateEvent({category:'funding',subcategory:'purple',date:1,name:'Wrong ring'},53));
// Two-ring imports visibly uncheck the unused category; re-enabling is stable.
a.setPlan(base());const twoImport=a.prepareCSV('category,date,name\nactivity,1,A\nconference,2,C');a.setPlan(base({...twoImport}));assert.equal(a.getPlan().categories.find(c=>c.id==='funding').enabled,false);
// Force sync through the normal settings path, then restore the third ring.
$('categories').onchange({target:{dataset:{categoryField:'enabled'},checked:true,closest(){return {dataset:{category:'funding'}}}}});assert.equal(a.activeCategories().length,3);assert.equal(base(JSON.parse(JSON.stringify(a.getPlan()))).categories.filter(c=>c.enabled).length,3);
$('categories').onchange({target:{dataset:{categoryField:'enabled'},checked:false,closest(){return {dataset:{category:'funding'}}}}});assert($('categories').innerHTML.includes('class="category-settings is-disabled"'));assert($('categories').innerHTML.includes('category-disabled-status">Disabled'));assert.equal(($('categories').innerHTML.match(/disabled title="Keep at least two/g)||[]).length,2);



// SVG lanes shrink only the portions where events actually overlap.
const svgPlan=base({ringSelectionExplicit:true,events:[
 {category:'funding',date:1,end_date:6,name:'Long span'},
 {category:'funding',date:3,end_date:4,name:'Overlap'},
 {category:'funding',date:8,name:'Isolated point'},
 {category:'conference',date:15,name:'Conference'}
]});a.setPlan(svgPlan);const originalSvgData=JSON.stringify(a.getPlan()),exportBeforeScene=a.latex();
const fundingEvents=svgPlan.events.filter(e=>e.category==='funding');const local=a.svgEventSegments(fundingEvents,1,53);
assert.deepEqual(local.get(fundingEvents[0].id).map(x=>[x.start,x.end,x.count]),[[1,3,1],[3,5,2],[5,7,1]]);
assert.equal(local.get(fundingEvents[2].id)[0].count,1);
const svgScene=a.makeScene(),shapesFor=e=>svgScene.filter(o=>o.type==='poly'&&o.id===e.id),radialWidth=shape=>{const rs=shape.pts.map(([x,y])=>Math.hypot(x-500,y-500));return Math.max(...rs)-Math.min(...rs)};
assert.deepEqual(shapesFor(fundingEvents[0]).map(radialWidth).map(x=>Math.round(x)),[96,47,96]);assert.equal(Math.round(radialWidth(shapesFor(fundingEvents[2])[0])),96);
const spanLabel=svgScene.find(o=>o.type==='text'&&o.id===fundingEvents[0].id),spanAngle=(Math.atan2(spanLabel.x-500,500-spanLabel.y)*180/Math.PI+360)%360;
assert(Math.abs(spanLabel.rotate-a.tangentRotation(spanAngle))<1e-7);
const pointLabel=svgScene.find(o=>o.type==='text'&&o.id===fundingEvents[2].id);assert(Math.abs(pointLabel.rotate-spanLabel.rotate)>1,'Single-week labels remain radial.');
assert.equal(a.latex(),exportBeforeScene);assert.equal(JSON.stringify(a.getPlan()),originalSvgData,'Rendering must not mutate the saved plan.');
// Reset appearance defaults without clearing or rescheduling any events.
svgPlan.categories.reverse();svgPlan.categories[0].name='Custom name';svgPlan.categories[0].color='#123456';svgPlan.labelSize=16;svgPlan.start=1;svgPlan.end=20;svgPlan.center='Custom centre';svgPlan.highlightGroups=[{weeks:'12',color:'#ff0000'}];a.setPlan(svgPlan);
const retainedEvents=JSON.stringify(a.getPlan().events);$('reset-defaults').onclick();
assert.deepEqual(a.getPlan().categories,a.defaultCategories());assert.equal(a.getPlan().labelSize,11);assert.equal(JSON.stringify(a.getPlan().events),retainedEvents);assert.equal(a.getPlan().end,20);assert.equal(a.getPlan().center,'Custom centre');assert.equal(a.getPlan().highlightGroups[0].weeks,'12');

// Picker colour conversions retain original hex values, including neutral colours.
for(const hex of [...a.monthColors,'#54b8b4','#9879ce','#ffffff','#000000','#808080'])assert.equal(a.hsvToHex(a.hexToHsv(hex)),hex);
for(const hex of a.monthColors)assert(a.hexToHsv(hex).s>.5,'Month fills retain strong saturation.');

// Inline saves validate atomically, keep stable IDs and update every export.
a.setPlan(base({events:[{category:'conference',subcategory:'purple',date:5,name:'Before',color:'highlight',notes:'Keep notes'}]}));
const inlineId=a.getPlan().events[0].id;a.applyInlinePatch(inlineId,{name:'After\nline break'});assert.equal(a.getPlan().events[0].id,inlineId);assert.equal(a.getPlan().events[0].notes,'Keep notes');assert(a.csv(a.getPlan().events).includes('After\nline break'));assert(a.latex().includes(String.raw`After\\line break`));
const inlineBeforeInvalid=JSON.stringify(a.getPlan());assert.throws(()=>a.applyInlinePatch(inlineId,{start:8,end:7}));assert.equal(JSON.stringify(a.getPlan()),inlineBeforeInvalid);
a.applyInlinePatch(inlineId,{start:'2026-02-02',end:'2026-02-15'});assert.equal(a.getPlan().events[0].start,6);assert.equal(a.getPlan().events[0].end,7);
a.applyInlinePatch(inlineId,{category:'funding'});assert.equal(a.getPlan().events[0].category,'funding');assert.equal(a.getPlan().events[0].subcategory,undefined);assert.equal(a.getPlan().events[0].color,'highlight');
a.applyInlinePatch(inlineId,{start:null,end:null});assert.equal(a.getPlan().events[0].start,null);assert.equal(a.getPlan().events[0].end,null);
assert.throws(()=>a.applyInlinePatch(inlineId,{name:' '}));assert.throws(()=>a.applyInlinePatch('missing',{name:'No event'}));

// Subcategory creation/removal preserves events and inheritance; empty lists survive restore.
a.setPlan(base());const createdSub=a.addSubcategory('activity');const newSub=a.getPlan().categories[0].subcategories[0];
assert.equal(newSub.id,createdSub);assert.equal(newSub.color,a.getPlan().categories[0].color);assert.equal(newSub.highlight,a.getPlan().categories[0].highlight);
const nextSub=a.addSubcategory('activity');assert.notEqual(nextSub,createdSub);assert.equal(a.getPlan().categories[0].subcategories[1].name,'Subcategory 2');
a.setPlan(base({categories:a.getPlan().categories,events:[{name:'Keep highlight',category:'activity',subcategory:createdSub,start:2,color:'highlight'},{name:'Keep custom',category:'activity',subcategory:createdSub,start:3,color:'#abc'},{name:'Keep blue',category:'conference',subcategory:'blue',start:4}]}));
const oldSubEvents=a.getPlan().events.map(e=>({...e}));assert(a.removeSubcategory('activity',createdSub));assert.equal(a.getPlan().events.length,3);
assert.equal(a.getPlan().events[0].id,oldSubEvents[0].id);assert.equal(a.getPlan().events[0].subcategory,undefined);assert.equal(a.getPlan().events[0].color,'highlight');assert.equal(a.getPlan().events[1].color,'#aabbcc');assert.equal(a.getPlan().events[2].subcategory,'blue');
a.removeSubcategory('conference','blue');a.removeSubcategory('conference','purple');assert.equal(base(JSON.parse(JSON.stringify(a.getPlan()))).categories[2].subcategories.length,0);
assert.equal(a.removeSubcategory('conference','missing'),false);
for(let i=0;i<8;i++)a.addSubcategory('funding');assert.throws(()=>a.addSubcategory('funding'),/eight/);
assert.deepEqual(a.prepareCSV(a.csv(a.getPlan().events)).events.map(e=>[e.name,e.subcategory,e.color]),a.getPlan().events.map(e=>[e.name,e.subcategory,e.color]));

// Display names have no generated ordinal prefix, including dense SVG labels.
a.setPlan(base({events:[{category:'activity',name:'Plain label',start:3},{category:'funding',name:'Another label',start:6,end:8}]}));
a.openEditor(); // existing edit flow still works with unnumbered names
const unnumberedScene=a.makeScene().filter(o=>o.type==='text'&&o.id);
assert(unnumberedScene.length>0);assert(unnumberedScene.every(o=>!/^\d+\.?$|^\d+\. /.test(o.value)));
$('search').value='';$('filter').value='';$('search').oninput();assert($('rows').innerHTML.includes('>Plain label</button>'));assert(!$('rows').innerHTML.includes('>1. Plain label'));

// The wheel unscheduled link clears unrelated filters and opens the filtered Events tab.
a.setPlan(base({events:[{name:'Scheduled example',category:'activity',start:5},{name:'Undated example',category:'funding'}]}));
$('search').value='unrelated';$('filter').value='activity';a.showUnscheduled();
assert.equal($('schedule-filter').value,'unscheduled');assert.equal($('search').value,'');assert.equal($('filter').value,'');assert.equal($('events-panel').hidden,false);assert($('rows').innerHTML.includes('Undated example'));assert(!$('rows').innerHTML.includes('Scheduled example'));
$('schedule-filter').value='scheduled';$('schedule-filter').onchange();assert($('rows').innerHTML.includes('Scheduled example'));assert(!$('rows').innerHTML.includes('Undated example'));
$('schedule-filter').value='';$('schedule-filter').onchange();assert($('rows').innerHTML.includes('Undated example'));assert($('rows').innerHTML.includes('Scheduled example'));

// Startup must restore an old saved plan before rendering (including migrations).
const bootPrelude=fs.readFileSync(__filename,'utf8').split("const a=require")[0];
const savedOld={year:2026,center:'2026',start:1,end:53,events:[{category:'conference',date:5,name:'Saved sentinel',color:'darkblue'}]};
const bootCheck=bootPrelude+'\nglobal.localStorage.getItem=()=>'+JSON.stringify(JSON.stringify(savedOld))+';\nconst restoredApp=require('+JSON.stringify(require.resolve('../dist/app.js'))+');assert.equal(restoredApp.getPlan().events[0]?.name,"Saved sentinel");assert.equal(restoredApp.getPlan().categories[2].subcategories.length,2);assert.equal(restoredApp.getPlan().events[0].color,"#5893c1");';
require('node:child_process').execFileSync(process.execPath,['-e',bootCheck]);

// Canonical CSV schema, optional columns, inclusive endpoints and migrated fixture.
a.setPlan(base());
assert.deepEqual(a.parseCSV('name\nUndated')[0],{name:'Undated'});
assert.equal(a.prepareCSV('name\nUndated').events[0].start,null);
assert.throws(()=>a.parseCSV('name,name\nA,B'),/Duplicate/);
const newCSV=a.prepareCSV('name,category,subcategory,start,end,color,notes\n"Two\nlines",Conferences,Purple,2,4,highlight,"A, note"');
assert.equal(newCSV.events[0].end,4);assert.equal(newCSV.events[0].name,'Two\nlines');
a.setPlan(base(newCSV));
assert(a.csv(a.getPlan().events).startsWith('\ufeffname,category,subcategory,start,end,color,notes\r\n'));
assert.deepEqual(a.prepareCSV(a.csv(a.getPlan().events)).events.map(({id,...e})=>e),a.getPlan().events.map(({id,...e})=>e));
const fixture=a.prepareCSV(fs.readFileSync(require('node:path').join(__dirname,'../examples/yearwheeltest.csv'),'utf8'));
assert.equal(fixture.events.length,42);
for(const name of ['KB','Knæk Cancer','Novo Nordisk']){const e=fixture.events.find(e=>e.name===name);assert.equal(e.start,2);assert.equal(e.end,4)}
a.setPlan(base());const example=a.prepareCSV(a.exampleCSV());assert.equal(example.events.length,14);
a.loadExample();assert.equal(a.getPlan().highlightGroups.length,2);assert.deepEqual(a.getPlan().categories,a.defaultCategories());
assert(a.getPlan().events.some(e=>e.name.includes('\n')));assert(a.getPlan().events.some(e=>e.start===null));
assert(a.getPlan().events.some(e=>e.subcategory==='purple'));assert(a.getPlan().events.some(e=>e.color==='highlight'));assert(a.getPlan().events.some(e=>e.color.startsWith('#')));
console.log('Passed canonical CSV, inclusive spans, migrated fixture and feature-rich standard-palette example checks.');

a.setPlan(base({...custom}));
(async()=>{let confirmations=0;global.confirm=()=>{confirmations++;return false};$('replace').checked=true;$('file').files=[{name:'test.csv',size:100,text:async()=>'category,date,name,color\nClinical,5,Replacement,red'}];await $('file').onchange();assert.equal(confirmations,1);assert.equal(a.getPlan().events[0].name,'A');global.confirm=()=>true;await $('file').onchange();assert.equal(a.getPlan().events.length,1);assert.equal(a.getPlan().events[0].name,'Replacement');$('replace').checked=false;await $('file').onchange();assert.equal(a.getPlan().events.length,2);
// Produce a representative two-ring export for compilation and visual QA.
const cfg=a.defaultCategories();cfg[0].name='Research & grants';cfg[0].color='#d7eeed';cfg[0].highlight='#54b8b4';cfg[1].enabled=false;
const final=base({categories:cfg,highlightGroups:[{weeks:'12,24-26',color:'red'},{weeks:'32-35',color:'steelblue'}],events:[{category:'activity',date:5,end_date:12,name:'Research project',color:'highlight'},{category:'conference',date:24,name:'Annual meeting',color:'steelblue'},{category:'conference',date:40,name:'Workshop',color:''}]});a.setPlan(final);if(process.env.YEARWHEEL_QA_TEX)fs.writeFileSync(process.env.YEARWHEEL_QA_TEX,a.latex());console.log('Passed editor/calendar regressions and original wheelchart export, multiline labels, three-band spans, partial ranges, category ordering/exclusion, and identical Overleaf source checks.');})().catch(e=>{console.error(e);process.exitCode=1});

