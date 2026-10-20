'use strict';
const $=id=>document.getElementById(id), KEY='yearwheel.plan.v1';
const defaults={activity:{name:'Activities',color:'#d7eeed',highlight:'#54b8b4'},funding:{name:'Funding',color:'#fef9ee',highlight:'#fcefcd'},conference:{name:'Conferences',color:'#d7e5f0',highlight:'#5893c1',subcategories:[{id:'blue',name:'Blue',color:'#98bcd9'},{id:'purple',name:'Purple',color:'#bfa3ec'}]}};
const cssColors={"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff","beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887","cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff","darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkgrey":"#a9a9a9","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f","darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkslategrey":"#2f4f4f","darkturquoise":"#00ced1","darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dimgrey":"#696969","dodgerblue":"#1e90ff","firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff","gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f","grey":"#808080","honeydew":"#f0fff0","hotpink":"#ff69b4","indianred":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c","lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2","lightgray":"#d3d3d3","lightgreen":"#90ee90","lightgrey":"#d3d3d3","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightslategrey":"#778899","lightsteelblue":"#b0c4de","lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6","magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370db","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee","mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5","navajowhite":"#ffdead","navy":"#000080","oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6","palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#db7093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080","rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1","saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","slategrey":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4","tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0","violet":"#ee82ee","wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5","yellow":"#ffff00","yellowgreen":"#9acd32"};
function defaultCategories(){return Object.entries(defaults).map(([id,c])=>({id,...c,subcategories:(c.subcategories||[]).map(sub=>({...sub})),enabled:true}))}
function categoryMap(config=plan.categories){return Object.fromEntries(config.map(c=>[c.id,c]))}
function eventPalette(e,config=plan.categories){const c=config.find(c=>c.id===e.category);return c.subcategories?.find(sub=>sub.id===e.subcategory)||{color:c.highlight}}
function eventColor(e,config=plan.categories){const palette=eventPalette(e,config);return e.color&&e.color!=='highlight'?e.color:palette.color}
function eventCategoryName(e){const c=categoryMap()[e.category],sub=c.subcategories?.find(s=>s.id===e.subcategory);return c.name+(sub?' / '+sub.name:'')}
function labelColor(color){const rgb=color.slice(1).match(/../g).map(x=>parseInt(x,16));return (rgb[0]*.299+rgb[1]*.587+rgb[2]*.114)<145?'#ffffff':'#203e37'}
function activeCategories(){return plan.categories.filter(c=>c.enabled!==false)}

const legacy={darkgreen:'#54b8b4',lightgreen:'#d7eeed',darkblue:'#5893c1',midblue:'#98bcd9',lightblue:'#d7e5f0',darkpurple:'#9879ce',midpurple:'#bfa3ec',darkyellow:'#fcefcd',lightyellow:'#fef9ee',darkred:'#c36d72',lightred:'#f0dcdd',brightred:'#dc3545',red:'#dc3545',blue:'#5893c1',green:'#54b8b4',yellow:'#d7ad52',orange:'#dc974f',purple:'#9879ce',black:'#33423b',white:'#ffffff'};
const wheelPaletteNames=new Set(['lightgreen','darkgreen','lightblue','midblue','darkblue','darkpurple','midpurple','lightyellow','darkyellow','lightred','darkred','brightred']);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function monday(y,w){const d=new Date(Date.UTC(y,0,4));d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7)+(w-1)*7);return d}
function weeksIn(y){return Math.round((monday(y+1,1)-monday(y,1))/604800000)}
const fmt=d=>d.toLocaleDateString('en-GB',{day:'numeric',month:'short',timeZone:'UTC'});
function dateRange(a,b,y=plan.year){const d=monday(y,b);d.setUTCDate(d.getUTCDate()+6);return `${fmt(monday(y,a))} – ${fmt(d)}`}
function defaultPlan(){const y=new Date().getFullYear();return {version:3,ringSelectionExplicit:true,title:'Annual plan',year:y,center:String(y),start:1,end:weeksIn(y),categories:defaultCategories(),highlightGroups:[],labelSize:11,events:[]}}
let plan=defaultPlan(),editId=null,scene=[];
try{const p=JSON.parse(localStorage.getItem(KEY));if(p)plan=validatePlan(p)}catch{}
function validColor(value){const c=String(value||'').trim().toLowerCase();if(wheelPaletteNames.has(c))return legacy[c];if(/^#[0-9a-f]{6}$/.test(c))return c;if(/^#[0-9a-f]{3}$/.test(c))return '#'+c.slice(1).split('').map(x=>x+x).join('');if(cssColors[c])return cssColors[c];if(legacy[c])return legacy[c];throw Error(`Unsupported colour “${value}”. Use a standard colour name or hex colour.`)}
function eventColorInput(value){const c=String(value||'').trim().toLowerCase();return !c||c==='highlight'?c:validColor(c)}
function validateCategories(input){const cfg=input??defaultCategories();if(!Array.isArray(cfg)||cfg.length<2||cfg.length>3)throw Error('Use two or three categories.');const ids=new Set(),names=new Set();const out=cfg.map((c,i)=>{const id=String(c.id||'category'+i),name=String(c.name||'').trim().slice(0,60);if(!name||ids.has(id)||names.has(name.toLowerCase()))throw Error('Category names must be non-empty and unique.');ids.add(id);names.add(name.toLowerCase());const subs=c.subcategories??defaults[id]?.subcategories??[];if(!Array.isArray(subs)||subs.length>8)throw Error('Use at most eight subcategories per ring.');const subIds=new Set(),subNames=new Set();const subcategories=subs.map(sub=>{const id=String(sub.id||''),name=String(sub.name||'').trim().slice(0,40);if(!id||!name||subIds.has(id)||subNames.has(name.toLowerCase()))throw Error('Subcategory names must be non-empty and unique within a ring.');subIds.add(id);subNames.add(name.toLowerCase());return {id,name,color:validColor(sub.color)}});return {id,name,subcategories,color:validColor(c.color||Object.values(defaults)[i].color),highlight:validColor(c.highlight||Object.values(defaults)[i].highlight),enabled:c.enabled!==false}});if(out.filter(c=>c.enabled).length<2)throw Error('Keep at least two categories enabled.');return out}
function parseHighlights(weeks){const out=[];if(!String(weeks).trim())return out;for(const bit of String(weeks).split(',')){const m=bit.trim().match(/^(\d+)(?:\s*[-–]\s*(\d+))?$/);if(!m)throw Error('Use week numbers and ranges, e.g. 12, 24–28.');const start=Number(m[1]),end=Number(m[2]||m[1]);if(start<1||end>53||end<start)throw Error('Highlighted weeks must be from 1 to 53.');for(let w=start;w<=end;w++)out.push(w)}return out}
function validateGroups(groups){if(!Array.isArray(groups)||groups.length>30)throw Error('Use at most 30 highlight groups.');return groups.map(g=>{parseHighlights(g.weeks);return {weeks:String(g.weeks||''),color:validColor(g.color||'red')}})}

function parseWeek(value,year){
if(value==null||String(value).trim()==='')return null;
const str=String(value).trim();if(/^\d{1,2}$/.test(str))return Number(str);
let match=str.match(/^(\d{4})-(\d{2})-(\d{2})$/),y,m,d;
if(match)[,y,m,d]=match.map(Number);else{match=str.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);if(match)[,d,m,y]=match.map(Number);else throw Error(`Invalid date “${str}”. Use a week number, YYYY-MM-DD or DD-MM-YYYY.`)}
const date=new Date(Date.UTC(y,m-1,d));if(date.getUTCFullYear()!==y||date.getUTCMonth()!==m-1||date.getUTCDate()!==d)throw Error(`Invalid calendar date “${str}”.`);
const thursday=new Date(date);thursday.setUTCDate(thursday.getUTCDate()+3-((thursday.getUTCDay()+6)%7));const isoYear=thursday.getUTCFullYear();if(isoYear!==year)throw Error(`Date ${str} belongs to ISO year ${isoYear}. Set the wheel year to ${isoYear} before importing.`);
return Math.floor((date-monday(year,1))/604800000)+1;
}
function validateEvent(e,max,year=plan.year,config=plan.categories){const raw=String(e.category||'').trim().toLowerCase(),cat=config.find(c=>c.id.toLowerCase()===raw||c.name.toLowerCase()===raw)||(!raw?config.find(c=>c.enabled):null);if(!cat)throw Error('Unknown category.');const category=cat.id,subRaw=String(e.subcategory||'').trim().toLowerCase(),sub=cat.subcategories?.find(s=>s.id.toLowerCase()===subRaw||s.name.toLowerCase()===subRaw);if(subRaw&&!sub)throw Error('Unknown subcategory for this category.');const start=parseWeek(e.start??e.date,year);let end=parseWeek(e.end??e.end_date,year);const duration=e.duration_weeks==null?'':String(e.duration_weeks).trim();if(start===null){if(end!==null||duration)throw Error('A start week or date is required when end or duration is supplied.');end=null}else{if(end===null){if(duration&&(!/^\d+$/.test(duration)||Number(duration)<1))throw Error('Duration must be a positive whole number of weeks.');end=duration?start+Number(duration)-1:start}if(!Number.isInteger(start)||!Number.isInteger(end)||start<1||end<start||end>max)throw Error(`Weeks must be integers from 1 to ${max}, with end ≥ start.`)}if(!String(e.name||'').trim())throw Error('An event name is required.');return {id:crypto.randomUUID(),name:String(e.name).trim().slice(0,160),category,...(sub?{subcategory:sub.id}:{}),start,end,color:eventColorInput(e.color),notes:String(e.notes||'').slice(0,2000)}}
function validatePlan(p){const year=Number(p.year),max=weeksIn(year);if(!Number.isInteger(year)||year<1900||year>2100)throw Error('Year must be 1900–2100.');const start=Number(p.start),end=Number(p.end);if(!Number.isInteger(start)||!Number.isInteger(end)||start<1||end<start||end>max)throw Error('Invalid displayed week range.');if(!Array.isArray(p.events)||p.events.length>2000)throw Error('Invalid event list (maximum 2,000).');const categories=validateCategories(p.categories),highlightGroups=validateGroups(p.highlightGroups??(p.highlights?[{weeks:p.highlights,color:'red'}]:[]));const events=p.events.map(e=>{let value=e;if((p.version??2)<3&&e.subcategory&&e.color==='highlight'){const old=p.categories?.find(c=>c.id===e.category)?.subcategories?.find(sub=>sub.id===e.subcategory);if(old?.highlight&&validColor(old.highlight)!==categories.find(c=>c.id===e.category)?.subcategories.find(sub=>sub.id===e.subcategory)?.color)value={...e,color:old.highlight}}return validateEvent(value,max,year,categories)});if(!p.ringSelectionExplicit){const used=new Set(events.filter(e=>categories.find(c=>c.id===e.category)?.enabled).map(e=>e.category));if(used.size===2)for(const c of categories)c.enabled=used.has(c.id)}return {version:3,ringSelectionExplicit:true,title:String(p.title||'Annual plan').slice(0,80),year,center:String(p.center??year).slice(0,30),start,end,categories,highlightGroups,labelSize:Math.max(7,Math.min(16,Number(p.labelSize)||11)),events}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(plan));$('saved').textContent='Saved on this device'}catch{$('saved').textContent='Storage unavailable · export a backup'}}
function toast(msg){$('toast').textContent=msg;$('toast').hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').hidden=true,4500)}
function sync(){for(const k of ['title','year','center','start','end','labelSize'])$(k).value=plan[k];$('end').max=$('start').max=weeksIn(plan.year);renderSettings();render()}
function highlights(){const out=new Map();for(const g of plan.highlightGroups)for(const w of parseHighlights(g.weeks))out.set(w,g.color);return out}
function categoryDisplayOrder(){return [...plan.categories].reverse()}
function renderSettings(){const opts=categoryDisplayOrder().map(c=>`<option value="${esc(c.id)}">${esc(c.name)}${c.enabled?'':' (disabled)'}</option>`).join(''),oldFilter=$('filter').value;$('filter').innerHTML='<option value="">All categories</option>'+opts;$('filter').value=oldFilter;$('event-category').innerHTML=opts;
$('categories').innerHTML=categoryDisplayOrder().map(c=>`<div class="category-settings ${c.enabled?'':'is-disabled'}" data-category="${esc(c.id)}"><button type="button" class="category-drag" draggable="true" aria-label="Reorder ${esc(c.name)}" title="Drag to reorder; use arrow keys to move">⠿</button><input class="category-enabled" type="checkbox" data-category-field="enabled" aria-label="Show ${esc(c.name)}" ${c.enabled?'checked':''} ${c.enabled&&plan.categories.filter(x=>x.enabled).length===2?'disabled title="Keep at least two categories enabled"':''}><input class="category-name" data-category-field="name" value="${esc(c.name)}" maxlength="60" aria-label="Category name"><label class="category-colour"><button type="button" class="category-swatch color-trigger" data-pick-color data-category-field="color" value="${c.color}" aria-label="Background colour for ${esc(c.name)}" title="Ring background colour" style="background:${c.color}"></button><span>Background</span></label><label class="category-colour"><button type="button" class="category-swatch color-trigger" data-pick-color data-category-field="highlight" value="${c.highlight}" aria-label="Event colour for ${esc(c.name)}" title="Default event colour" style="background:${c.highlight}"></button><span>Event</span></label>${c.enabled?'':'<small class="category-disabled-status">Disabled</small>'}${`<div class="subcategory-settings">${c.subcategories.map(sub=>`<div class="subcategory-row" data-subcategory="${esc(sub.id)}"><input class="category-name" data-subcategory-field="name" value="${esc(sub.name)}" maxlength="40" aria-label="${esc(c.name)} subcategory name"><label class="category-colour"><button type="button" class="category-swatch color-trigger" data-pick-color data-subcategory-field="color" value="${sub.color}" aria-label="Event colour for ${esc(sub.name)}" title="Subcategory event colour" style="background:${sub.color}"></button><span>Event</span></label><button type="button" class="subcategory-remove" data-remove-subcategory="${esc(sub.id)}" aria-label="Remove ${esc(sub.name)} subcategory from ${esc(c.name)}" title="Remove subcategory; keep its events in the parent category">×</button></div>`).join('')}<button type="button" class="subcategory-add" data-add-subcategory ${c.subcategories.length>=8?'disabled':''} aria-label="Add subcategory to ${esc(c.name)}">+ Add subcategory</button></div>`}</div>`).join('');
$('highlight-groups').innerHTML=plan.highlightGroups.map((g,i)=>`<div class="highlight-group" data-group="${i}"><input data-group-field="weeks" value="${esc(g.weeks)}" placeholder="12, 24–28" aria-label="Weeks for highlighted week group ${i+1}"><button type="button" class="color-trigger week-color-trigger" data-pick-color data-group-field="color" value="${g.color}" style="background:${g.color}" aria-label="Colour for highlighted week group ${i+1}"></button><button type="button" data-remove-group="${i}" aria-label="Remove highlight group ${i+1}">×</button></div>`).join('')}
$('categories').onchange=e=>{if(e.target.dataset.subcategoryField){const field=e.target.dataset.subcategoryField,parent=e.target.closest('[data-category]')?.dataset.category,subId=e.target.closest('[data-subcategory]')?.dataset.subcategory;try{plan.categories=validateCategories(plan.categories.map(c=>c.id===parent?{...c,subcategories:c.subcategories.map(sub=>sub.id===subId?{...sub,[field]:e.target.value}:sub)}:c));save();sync()}catch(err){toast(err.message);renderSettings()}return}const field=e.target.dataset.categoryField,id=e.target.closest('[data-category]')?.dataset.category;if(!field||!id)return;const next=plan.categories.map(c=>c.id===id?{...c,[field]:field==='enabled'?e.target.checked:e.target.value}:c);try{const checked=validateCategories(next);plan.categories=checked;save();sync()}catch(err){toast(err.message);renderSettings()}};
function addSubcategory(categoryId){
  const parent=categoryMap()[categoryId];if(!parent)throw Error('Unknown category.');
  if(parent.subcategories.length>=8)throw Error('Use at most eight subcategories per ring.');
  let n=1;while(parent.subcategories.some(sub=>sub.name.toLowerCase()===('Subcategory '+n).toLowerCase()))n++;
  const sub={id:crypto.randomUUID(),name:'Subcategory '+n,color:parent.highlight};
  plan.categories=validateCategories(plan.categories.map(c=>c.id===categoryId?{...c,subcategories:[...c.subcategories,sub]}:c));save();sync();return sub.id;
}
function removeSubcategory(categoryId,subId){
  const parent=categoryMap()[categoryId];if(!parent?.subcategories.some(sub=>sub.id===subId))return false;
  plan.categories=validateCategories(plan.categories.map(c=>c.id===categoryId?{...c,subcategories:c.subcategories.filter(sub=>sub.id!==subId)}:c));
  plan.events=plan.events.map(e=>{if(e.category!==categoryId||e.subcategory!==subId)return e;const {subcategory,...rest}=e;return rest});
  save();sync();return true;
}
$('categories').onclick=e=>{
  const add=e.target.closest('[data-add-subcategory]'),remove=e.target.closest('[data-remove-subcategory]');if(!add&&!remove)return;
  const categoryId=(add||remove).closest('[data-category]').dataset.category;
  try{if(add){const id=addSubcategory(categoryId);const input=[...$('categories').querySelectorAll('[data-subcategory]')].find(row=>row.dataset.subcategory===id)?.querySelector('input');input?.focus();input?.select()}else{removeSubcategory(categoryId,remove.dataset.removeSubcategory);const button=[...$('categories').querySelectorAll('[data-category]')].find(row=>row.dataset.category===categoryId)?.querySelector('[data-add-subcategory]');button?.focus();toast('Subcategory removed. Its events remain in the parent category.')}}catch(err){toast(err.message)}
};
// Saved categories remain inner-to-outer for compatibility; the editor reads outer-to-inner.
function reorderCategory(id,targetId,after=false){const ordered=categoryDisplayOrder(),from=ordered.findIndex(c=>c.id===id),target=ordered.findIndex(c=>c.id===targetId);if(from<0||target<0||from===target)return false;const [moved]=ordered.splice(from,1),to=ordered.findIndex(c=>c.id===targetId)+(after?1:0);ordered.splice(to,0,moved);plan.categories=ordered.reverse();save();sync();$('category-order-status').textContent='Category order: '+categoryDisplayOrder().map(c=>c.name).join(', ')+'. Outside to inside.';return true}
let draggedCategory=null,touchDrag=null;
function clearCategoryDrop(){for(const row of $('categories').querySelectorAll('.category-settings'))row.classList.remove('drop-before','drop-after','dragging')}
function categoryDropAt(row,y){return {id:row.dataset.category,after:y>row.getBoundingClientRect().top+row.getBoundingClientRect().height/2}}
function markCategoryDrop(row,after){clearCategoryDrop();row.classList.add(after?'drop-after':'drop-before')}
$('categories').ondragstart=e=>{const handle=e.target.closest('.category-drag');if(!handle){e.preventDefault();return}draggedCategory=handle.closest('[data-category]').dataset.category;e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',draggedCategory);handle.closest('[data-category]').classList.add('dragging')};
$('categories').ondragover=e=>{const row=e.target.closest('[data-category]');if(!draggedCategory||!row)return;e.preventDefault();e.dataTransfer.dropEffect='move';const target=categoryDropAt(row,e.clientY);markCategoryDrop(row,target.after)};
$('categories').ondrop=e=>{const row=e.target.closest('[data-category]');if(!draggedCategory||!row)return;e.preventDefault();const target=categoryDropAt(row,e.clientY),source=draggedCategory;clearCategoryDrop();draggedCategory=null;reorderCategory(source,target.id,target.after)};
$('categories').ondragend=()=>{draggedCategory=null;clearCategoryDrop()};
$('categories').onpointerdown=e=>{const handle=e.target.closest('.category-drag');if(!handle||e.pointerType==='mouse')return;e.preventDefault();touchDrag={id:handle.closest('[data-category]').dataset.category,pointerId:e.pointerId,handle,target:null,startY:e.clientY};handle.setPointerCapture(e.pointerId);handle.closest('[data-category]').classList.add('dragging')};
$('categories').onpointermove=e=>{if(!touchDrag||e.pointerId!==touchDrag.pointerId)return;e.preventDefault();const row=document.elementFromPoint(e.clientX,e.clientY)?.closest('#categories [data-category]');if(row){touchDrag.target=categoryDropAt(row,e.clientY);markCategoryDrop(row,touchDrag.target.after)}else{touchDrag.target=null;clearCategoryDrop()}};
function finishCategoryTouch(e,cancel=false){if(!touchDrag||e.pointerId!==touchDrag.pointerId)return;const drag=touchDrag;touchDrag=null;if(drag.handle.hasPointerCapture(e.pointerId))drag.handle.releasePointerCapture(e.pointerId);clearCategoryDrop();if(!cancel&&drag.target&&Math.abs(e.clientY-drag.startY)>6)reorderCategory(drag.id,drag.target.id,drag.target.after)}
$('categories').onpointerup=e=>finishCategoryTouch(e);$('categories').onpointercancel=e=>finishCategoryTouch(e,true);
$('categories').onkeydown=e=>{const handle=e.target.closest('.category-drag');if(!handle||!['ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const id=handle.closest('[data-category]').dataset.category,order=categoryDisplayOrder(),from=order.findIndex(c=>c.id===id),to=from+(e.key==='ArrowUp'?-1:1);if(to<0||to>=order.length)return;reorderCategory(id,order[to].id,e.key==='ArrowDown');for(const row of $('categories').querySelectorAll('[data-category]'))if(row.dataset.category===id)row.querySelector('.category-drag').focus()};
$('add-highlight-group').onclick=()=>{if(plan.highlightGroups.length>=30){toast('Use at most 30 highlight groups.');return}plan.highlightGroups.push({weeks:'',color:'#ff0000'});save();renderSettings()};
$('highlight-groups').onchange=e=>{const field=e.target.dataset.groupField,i=Number(e.target.closest('[data-group]')?.dataset.group);if(!field||!Number.isInteger(i))return;try{const next=plan.highlightGroups.map((g,j)=>j===i?{...g,[field]:e.target.value}:g);plan.highlightGroups=validateGroups(next);save();render()}catch(err){toast(err.message);renderSettings()}};
$('highlight-groups').onclick=e=>{const b=e.target.closest('[data-remove-group]');if(!b)return;plan.highlightGroups.splice(Number(b.dataset.removeGroup),1);save();renderSettings();render()};

const monthColors=['#006699','#008fa6','#00997a','#669933','#cc9900','#cc6600','#993333','#cc3366','#aa4488','#8a4db3','#6254b3','#426eaa'];
function point(r,a){return [500+r*Math.sin(a*Math.PI/180),500-r*Math.cos(a*Math.PI/180)]}
function sector(ri,ro,a,b){const n=Math.max(2,Math.ceil((b-a)/2)),v=[];for(let i=0;i<=n;i++)v.push(point(ro,a+(b-a)*i/n));for(let i=n;i>=0;i--)v.push(point(ri,a+(b-a)*i/n));return v}

function tangentRotation(angle){return ((angle+90)%180+180)%180-90}
// Subdivide only where the active set changes; compact lanes locally so a
// collision in one week cannot shrink unrelated events elsewhere in the ring.
function svgEventSegments(events,start,end){
  const cuts=[...new Set(events.flatMap(e=>[Math.max(start,e.start),Math.min(end,e.end)+1]))].sort((a,b)=>a-b),result=new Map(events.map(e=>[e.id,[]]));
  for(let i=0;i<cuts.length-1;i++){
    const a=cuts[i],b=cuts[i+1],active=events.filter(e=>e.start<b&&e.end>=a);
    active.forEach((e,lane)=>{const segments=result.get(e.id),last=segments.at(-1);if(last&&last.end===a&&last.lane===lane&&last.count===active.length)last.end=b;else segments.push({start:a,end:b,lane,count:active.length})});
  }
  return result;
}

function makeScene(){const s=[],n=plan.end-plan.start+1,angle=x=>1+358*(x-plan.start)/n;
const poly=(pts,fill,stroke='#ffffff',width=.7,id=null)=>s.push({type:'poly',pts,fill,stroke,width,id});
const text=(x,y,value,size=10,fill='#52675c',rotate=0,weight=false,id=null)=>s.push({type:'text',x,y,value,size,fill,rotate,weight,id});
const radial=(r,a,value,size,fill,rot=0,weight=false,id=null)=>{const [x,y]=point(r,a);text(x,y,value,size,fill,rot,weight,id)};
const h=highlights();
const active=activeCategories();for(const [index,config] of active.entries()){const key=config.id,c={...config,r:(3-active.length+index)*108+108};
for(let w=plan.start;w<=plan.end;w++)poly(sector(c.r,c.r+98,angle(w),angle(w+1)),c.color,'#ffffff',.7);

const events=plan.events.filter(e=>e.category===key&&e.start!==null&&e.start<=plan.end&&e.end>=plan.start).sort((a,b)=>a.start-b.start||b.end-a.end),segments=svgEventSegments(events,plan.start,plan.end);
for(const e of events){
  let labelSegment=null;
  for(const segment of segments.get(e.id)){
    const thick=98/segment.count,a=angle(segment.start)+.22,b=angle(segment.end)-.22,ri=c.r+segment.lane*thick+1,ro=ri+thick-2;
    poly(sector(ri,ro,a,b),eventColor(e),'#ffffff',1,e.id);
    const area=(b-a)*thick;if(!labelSegment||area>labelSegment.area)labelSegment={a,b,ri,ro,thick,area};
  }
  if(!labelSegment)continue;
  const {a,b,ri,ro,thick}=labelSegment,mid=(a+b)/2,tangential=e.end>e.start;
  const rotation=tangential?tangentRotation(mid):(mid>180?mid-270:mid-90);
  const arcRoom=((ri+ro)/2)*(b-a)*Math.PI/180-6;
  const width=tangential?arcRoom:thick-9,height=tangential?thick-8:arcRoom;
  const limit=Math.max(2,Math.floor(width/(plan.labelSize*.55))),maxLines=Math.max(1,Math.min(4,Math.floor(height/(plan.labelSize*1.15))));
  let lines=[];const explicit=e.name.split(/\\\\|\r?\n/);
  for(let part=0;part<explicit.length;part++){
    let remaining=explicit[part];
    do{
      if(lines.length>=maxLines){if(lines.length)lines[lines.length-1]=lines.at(-1).slice(0,Math.max(1,limit-1))+'…';break}
      if(remaining.length<=limit){lines.push(remaining);remaining=''}else{let cut=remaining.lastIndexOf(' ',limit);if(cut<limit*.4)cut=limit;lines.push(remaining.slice(0,cut));remaining=remaining.slice(cut).trim()}
    }while(remaining);
    if(lines.length>=maxLines&&(remaining||part<explicit.length-1)){lines[lines.length-1]=lines.at(-1).slice(0,Math.max(1,limit-1))+'…';break}
  }
  if(thick<25||width<15)lines=[];
  const [cx,cy]=point((ri+ro)/2,mid),rr=rotation*Math.PI/180;
  lines.forEach((line,i)=>{const dy=(i-(lines.length-1)/2)*plan.labelSize*1.15;text(cx-Math.sin(rr)*dy,cy+Math.cos(rr)*dy,line,plan.labelSize,labelColor(eventColor(e)),rotation,false,e.id)});
}
radial(c.r+103.5,180,c.name,8,'#6e8176');}
for(let w=plan.start;w<=plan.end;w++){const mid=angle(w+.5),p1=point(427,angle(w)),p2=point(448,angle(w));s.push({type:'line',pts:[p1,p2],stroke:'#cbd5cd',width:.6});radial(439,mid,String(w),9,h.get(w)||'#5f7467',tangentRotation(mid),h.has(w));}
const begin=monday(plan.year,plan.start),finish=monday(plan.year,plan.end+1),ms=604800000;
for(let y=begin.getUTCFullYear();y<=finish.getUTCFullYear();y++)for(let m=0;m<12;m++){const a=Math.max(+begin,Date.UTC(y,m,1)),b=Math.min(+finish,Date.UTC(y,m+1,1));if(a>=b)continue;const aa=angle(plan.start+(a-begin)/ms),bb=angle(plan.start+(b-begin)/ms);poly(sector(455,481,aa,bb),monthColors[m],'#d7dfd3',.6);if(bb-aa>7)radial(469,(aa+bb)/2,new Date(Date.UTC(y,m,1)).toLocaleDateString('en',{month:bb-aa<18?'short':'long',timeZone:'UTC'}),10,'#ffffff',tangentRotation((aa+bb)/2));}
text(500,493,plan.center,40,'#294e3e',0,true);text(500,523,'YEAR PLAN',9,'#8b9c8e');return s}
function svgString(){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" role="img" aria-label="${esc(plan.title)}"><title>${esc(plan.title)}</title><rect width="1000" height="1000" fill="white"/>`+scene.map(o=>{const attrs=o.id?` class="event" data-id="${o.id}" tabindex="0" role="button" aria-label="${esc(plan.events.find(e=>e.id===o.id)?.name||'Edit event')}"`:'';const tip=o.id?`<title>${esc((()=>{const e=plan.events.find(e=>e.id===o.id);return `${e.name} · W${e.start}–${e.end} · ${dateRange(e.start,e.end)}`})())}</title>`:'';if(o.type==='poly')return `<polygon points="${o.pts.map(p=>p.join(',')).join(' ')}" fill="${o.fill}" stroke="${o.stroke}" stroke-width="${o.width}"${attrs}>${tip}</polygon>`;if(o.type==='line')return `<line x1="${o.pts[0][0]}" y1="${o.pts[0][1]}" x2="${o.pts[1][0]}" y2="${o.pts[1][1]}" stroke="${o.stroke}" stroke-width="${o.width}"/>`;return `<text x="${o.x}" y="${o.y}" text-anchor="middle" dominant-baseline="central" font-family="Arial,sans-serif" font-size="${o.size}" font-weight="${o.weight?600:400}" fill="${o.fill}" transform="rotate(${o.rotate},${o.x},${o.y})"${attrs}>${tip}${esc(o.value)}</text>`}).join('')+'</svg>'}
function render(){scene=makeScene();$('wheel').innerHTML=svgString();$('preview-title').textContent=plan.title;$('range').textContent=`${plan.year} · Weeks ${plan.start}–${plan.end} · ${dateRange(plan.start,plan.end)}`;$('total').textContent=plan.events.length;const disabled=plan.events.filter(e=>!categoryMap()[e.category].enabled).length,visible=plan.events.filter(e=>categoryMap()[e.category].enabled&&e.start<=plan.end&&e.end>=plan.start).length;$('count').innerHTML=`${visible} of ${plan.events.length} events in view${disabled?' · '+disabled+' disabled':''}${plan.events.some(e=>e.start===null)?' · <a href="#events" data-show-unscheduled>'+plan.events.filter(e=>e.start===null).length+' unscheduled</a>':''}`;renderRows()}
let inlineEdit=null;
function renderRows(){$('inline-popup').hidePopover?.();inlineEdit=null;const q=$('search').value.toLowerCase(),f=$('filter').value,schedule=$('schedule-filter').value;const list=plan.events.map((e,i)=>({...e,num:i+1})).filter(e=>(!f||e.category===f)&&(!schedule||(schedule==='unscheduled'?e.start===null:e.start!==null))&&`${e.name} ${e.notes} ${eventCategoryName(e)}`.toLowerCase().includes(q)).sort((a,b)=>(a.start??Infinity)-(b.start??Infinity)||a.num-b.num);$('rows').innerHTML=list.map(e=>`<tr data-event="${e.id}" class="${categoryMap()[e.category].enabled?'':'disabled-event'}"><td data-inline="name" title="Double-click to edit name"><button class="edit-name" data-edit="${e.id}">${esc(e.name)}</button>${e.notes?`<small data-inline="notes" title="Double-click to edit notes">${esc(e.notes)}</small>`:''}</td><td data-inline="category" title="Double-click to edit category"><span class="badge" style="background:${categoryMap()[e.category].color}"><i class="dot" style="background:${eventColor(e)}"></i>${esc(eventCategoryName(e))}${categoryMap()[e.category].enabled?'':' · Disabled'}</span></td><td data-inline="weeks" title="Double-click to edit weeks">${e.start===null?'Unscheduled':`W${e.start}${e.end!==e.start?'–'+e.end:''}${e.end<plan.start||e.start>plan.end?' <small>Outside view</small>':''}`}</td><td data-inline="dates" title="Double-click to edit dates">${e.start===null?'—':dateRange(e.start,e.end)}</td><td class="row-actions"><button data-modal-edit="${e.id}" aria-label="Edit ${esc(e.name)}">Edit</button><button data-copy="${e.id}" aria-label="Duplicate ${esc(e.name)}">Duplicate</button></td></tr>`).join('');$('empty').hidden=list.length>0;$('empty').textContent=plan.events.length?'No events match your filters.':'No events yet. Add an event or import your existing CSV.'}
for(const k of ['title','year','center','start','end','labelSize'])$(k).addEventListener(k==='labelSize'?'input':'change',()=>{let v=$(k).value;if(['year','start','end','labelSize'].includes(k))v=Number(v);const candidate={...plan,[k]:v};if(k==='year'){if(!Number.isInteger(v)||v<1900||v>2100){sync();return}if(plan.events.some(e=>e.end>weeksIn(v))){toast(`Some events use week 53, which does not exist in ${v}. Edit those events first.`);sync();return}candidate.end=Math.min(candidate.end,weeksIn(v));candidate.start=Math.min(candidate.start,candidate.end);if(plan.center===String(plan.year))candidate.center=String(v)}try{const validated=validatePlan(candidate);validated.events=plan.events;plan=validated;save();sync()}catch(e){toast(e.message);sync()}});
function openEditor(id=null){editId=id;const e=plan.events.find(x=>x.id===id);$('dialog-title').textContent=e?'Edit event':'Add event';$('event-name').value=e?.name||'';$('event-category').value=e?.category||plan.categories.find(c=>c.enabled).id;updateSubcategories(e?.subcategory||'');$('event-start').value=e?.start||plan.start;$('event-end').value=e?.end||plan.start;$('event-start').max=$('event-end').max=weeksIn(plan.year);$('event-color-mode').value=!e?.color||e.color==='highlight'?'normal':'custom';$('event-color').value=e?.color&&e.color!=='highlight'?e.color:eventPalette({category:$('event-category').value,subcategory:$('event-subcategory').value}).color;updateColorMode();$('event-notes').value=e?.notes||'';$('unscheduled').checked=!!e&&e.start===null;updateSchedule();$('delete').hidden=!e;updateDates();$('editor').showModal();$('event-name').focus()}
function updateSchedule(){for(const id of ['event-start','event-end']){$(id).disabled=$('unscheduled').checked;$(id).required=!$('unscheduled').checked}updateDates()}
$('unscheduled').onchange=updateSchedule;
function updateDates(){if($('unscheduled').checked){$('event-dates').textContent='Unscheduled events stay in the list until you assign a week.';return}const a=Number($('event-start').value),b=Number($('event-end').value);$('event-end').min=a;$('event-dates').textContent=a>=1&&b>=a&&b<=weeksIn(plan.year)?dateRange(a,b):'Choose a valid week range.'}
$('event-start').oninput=()=>{if(Number($('event-end').value)<Number($('event-start').value))$('event-end').value=$('event-start').value;updateDates()};$('event-end').oninput=updateDates;$('event-category').onchange=()=>{updateSubcategories();updateColorMode()};$('event-subcategory').onchange=updateColorMode;
function updateSubcategories(value=''){const c=categoryMap()[$('event-category').value],subs=c?.subcategories||[];$('event-subcategory-row').hidden=!subs.length;$('event-subcategory').innerHTML='<option value="">None</option>'+subs.map(sub=>`<option value="${esc(sub.id)}">${esc(sub.name)}</option>`).join('');$('event-subcategory').value=value}
function updateColorMode(){const mode=$('event-color-mode').value;$('custom-color').hidden=mode!=='custom'}
$('event-color-mode').onchange=updateColorMode;

$('add').onclick=()=>openEditor();for(const k of ['close','cancel'])$(k).onclick=()=>$('editor').close();$('event-form').onsubmit=e=>{e.preventDefault();try{const ev=validateEvent({name:$('event-name').value,category:$('event-category').value,subcategory:$('event-subcategory').value,start:$('unscheduled').checked?null:$('event-start').value,end:$('unscheduled').checked?null:$('event-end').value,color:$('event-color-mode').value==='normal'?'':$('event-color').value,notes:$('event-notes').value},weeksIn(plan.year));if(editId){ev.id=editId;plan.events=plan.events.map(x=>x.id===editId?ev:x)}else plan.events.push(ev);save();render();$('editor').close()}catch(err){toast(err.message)}};
$('delete').onclick=()=>{plan.events=plan.events.filter(e=>e.id!==editId);save();render();$('editor').close();toast('Event deleted')};$('wheel').onclick=e=>{const x=e.target.closest('[data-id]');if(x)openEditor(x.dataset.id)};$('wheel').onkeydown=e=>{if(['Enter',' '].includes(e.key)&&e.target.dataset.id){e.preventDefault();openEditor(e.target.dataset.id)}};

function applyInlinePatch(id,patch){
  const current=plan.events.find(e=>e.id===id);if(!current)throw Error('Event no longer exists.');
  const candidate={...current,...patch};if(patch.category&&patch.category!==current.category&&!Object.hasOwn(patch,'subcategory'))candidate.subcategory='';
  const updated={...validateEvent(candidate,weeksIn(plan.year)),id:current.id};
  plan.events=plan.events.map(e=>e.id===id?updated:e);save();render();return updated;
}
function cancelInlineEdit(){const anchor=inlineEdit?.anchor;inlineEdit=null;$('inline-popup').hidePopover?.();anchor?.querySelector('button')?.focus()}
function positionInlinePopup(){
  if(!inlineEdit?.anchor?.isConnected)return;
  const popup=$('inline-popup'),rect=inlineEdit.anchor.getBoundingClientRect(),width=popup.offsetWidth,height=popup.offsetHeight;
  popup.style.left=Math.max(8,Math.min(rect.left,window.innerWidth-width-8))+'px';
  popup.style.top=Math.max(8,rect.bottom+6+height<=window.innerHeight-8?rect.bottom+6:rect.top-height-6)+'px';
}
window.addEventListener('resize',positionInlinePopup);document.addEventListener('scroll',positionInlinePopup,true);
$('inline-popup').addEventListener('toggle',e=>{if(e.newState==='closed'&&!$('inline-popup').matches(':popover-open'))inlineEdit=null});
function saveInlineEdit(){
  if(!inlineEdit)return true;
  const {id,field}=inlineEdit;let patch;
  if(field==='name'||field==='notes')patch={[field]:$('inline-value').value};
  else if(field==='category'){const [category,subcategory='']=$('inline-category').value.split('::');patch={category,subcategory}}
  else patch={start:$('inline-start').value||null,end:$('inline-end').value||null};
  try{applyInlinePatch(id,patch);return true}catch(err){$('inline-error').textContent=err.message;positionInlinePopup();return false}
}
function beginInlineEdit(element){
  const row=element.closest('[data-event]'),id=row?.dataset.event,field=element.dataset.inline;
  if(!id||!field)return;if(inlineEdit?.id===id&&inlineEdit.field===field)return;
  if(inlineEdit&&!saveInlineEdit())return;
  const event=plan.events.find(e=>e.id===id);if(!event)return;
  const cell=Array.from($('rows').querySelectorAll('[data-inline]')).find(el=>el.dataset.inline===field&&el.closest('[data-event]').dataset.event===id);if(!cell)return;
  inlineEdit={id,field,anchor:cell};let controls;
  if(field==='name'||field==='notes')controls=`<textarea id="inline-value" rows="${field==='notes'?3:2}" maxlength="${field==='notes'?2000:160}" aria-label="${field==='notes'?'Event notes':'Event name'}">${esc(event[field]||'')}</textarea>`;
  else if(field==='category')controls=`<select id="inline-category" aria-label="Event category">${categoryDisplayOrder().flatMap(c=>[{value:c.id,name:c.name},...c.subcategories.map(sub=>({value:c.id+'::'+sub.id,name:c.name+' / '+sub.name}))].map(option=>`<option value="${esc(option.value)}" ${option.value===event.category+(event.subcategory?'::'+event.subcategory:'')?'selected':''}>${esc(option.name)}${c.enabled?'':' (disabled)'}</option>`)).join('')}</select>`;
  else{
    const dates=field==='dates',iso=(week,last=false)=>{if(week===null)return '';const d=monday(plan.year,week);if(last)d.setUTCDate(d.getUTCDate()+6);return d.toISOString().slice(0,10)};
    const start=dates?iso(event.start):event.start??'',end=dates?iso(event.end,true):event.end??'';
    controls=`<div class="inline-range"><label>Start ${dates?'date':'week'}<input id="inline-start" type="${dates?'date':'number'}" ${dates?'':`min="1" max="${weeksIn(plan.year)}"`} value="${start}" aria-label="Start ${dates?'date':'week'}"></label><label>End ${dates?'date':'week'}<input id="inline-end" type="${dates?'date':'number'}" ${dates?'':`min="1" max="${weeksIn(plan.year)}"`} value="${end}" aria-label="End ${dates?'date':'week'}"></label></div>`;
  }
  $('inline-popup').innerHTML=`<form id="inline-form"><strong class="inline-title">Edit ${field==='dates'?'dates':field==='weeks'?'weeks':field}</strong>${controls}<div class="inline-actions"><button type="submit" class="primary">Save</button><button type="button" id="inline-cancel">Cancel</button></div><small id="inline-error" role="status"></small></form>`;
  $('inline-form').onsubmit=e=>{e.preventDefault();saveInlineEdit()};$('inline-cancel').onclick=cancelInlineEdit;
  $('inline-form').onkeydown=e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();cancelInlineEdit()}else if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();saveInlineEdit()}};
  $('inline-popup').showPopover();positionInlinePopup();
  const input=$(field==='category'?'inline-category':field==='name'||field==='notes'?'inline-value':'inline-start');input.focus();if(input.tagName==='TEXTAREA')input.select();
}
$('rows').ondblclick=e=>{if(e.target.closest('input,textarea,select,form,[data-copy],[data-modal-edit]'))return;const cell=e.target.closest('[data-inline]');if(cell){e.preventDefault();beginInlineEdit(cell)}};
$('rows').onkeydown=e=>{if(e.key==='F2'&&!e.target.closest('input,textarea,select')){const cell=e.target.closest('[data-inline]');if(cell){e.preventDefault();beginInlineEdit(cell)}}};
$('rows').onclick=e=>{
  if(e.target.closest('#inline-form'))return;
  const modal=e.target.closest('[data-modal-edit]');if(modal){if(inlineEdit&&!saveInlineEdit())return;openEditor(modal.dataset.modalEdit);return}
  const copyButton=e.target.closest('[data-copy]');if(copyButton){if(inlineEdit&&!saveInlineEdit())return;const v=plan.events.find(x=>x.id===copyButton.dataset.copy),copy={...v,id:crypto.randomUUID(),name:v.name+' (copy)'};plan.events.push(copy);save();render();openEditor(copy.id);return}
  const name=e.target.closest('[data-edit]');if(name&&e.detail===0)openEditor(name.dataset.edit);
};
$('search').oninput=renderRows;$('filter').onchange=renderRows;$('schedule-filter').onchange=renderRows;
function showUnscheduled(){cancelInlineEdit();$('search').value='';$('filter').value='';$('schedule-filter').value='unscheduled';renderRows();selectTab('events',true)}
$('count').onclick=e=>{if(e.target.closest('[data-show-unscheduled]')){e.preventDefault();showUnscheduled()}};

function resetDefaults(){
  const fresh=defaultCategories(),custom=plan.categories.filter(c=>!fresh.some(d=>d.id===c.id));
  plan.categories=fresh.map(d=>{
    const old=plan.categories.find(c=>c.id===d.id)||custom.shift();
    const extra=(old?.subcategories||[]).filter(sub=>!d.subcategories.some(x=>x.id===sub.id));
    return {...d,id:old?.id||d.id,subcategories:[...d.subcategories,...extra]};
  });
  plan.labelSize=11;plan.ringSelectionExplicit=true;save();sync();toast('Default category names, order, colours and label size restored.');
}
$('reset-defaults').onclick=resetDefaults;

$('clear').onclick=()=>{if(plan.events.length&&confirm('Remove all events from this plan? Export a backup first if needed.')){plan.events=[];save();render()}};
function exampleCSV(){
  const date=week=>monday(plan.year,week).toISOString().slice(0,10);
  return serializeCSV([
    ['Project planning','Activities','',2,4,'','A three-week span; end week is included.'],
    ['Team workshop','Activities','',6,'','highlight','Single-week event with inherited event colour.'],
    ['Project delivery','Activities','',18,25,'','Overlaps with the review during weeks 22–23.'],
    ['Mid-project\nreview','Activities','',22,23,'#54b8b4','An explicit line break and a custom hex colour.'],
    ['Evaluation','Activities','',38,41,'','Default category event colour.'],
    ['Budget review','Activities','','','','','Date not yet decided.'],
    ['Funding call','Funding','',8,12,'','Default funding event colour.'],
    ['Research grant','Funding','',10,14,'highlight','Overlapping funding span.'],
    ['Application deadline','Funding','',date(16),'','darkyellow','ISO date input with an original palette colour name.'],
    ['Summer conference','Conferences','Blue',24,25,'','Blue subcategory event colour.'],
    ['Registration deadline','Conferences','Blue',18,'','highlight','Blue subcategory event colour.'],
    ['Annual meeting','Conferences','Purple',40,41,'highlight','Purple subcategory event colour.'],
    ['Abstract\nsubmission','Conferences','Purple',34,'','','Purple subcategory event colour and multiline label.'],
    ['Conference to be confirmed','Conferences','Blue','','','','Unscheduled event remains in the list.']
  ]);
}
function loadExample(){
  if(plan.events.length&&!confirm('Replace your events and settings with the example plan?'))return;
  const categories=defaultCategories(),events=parseCSV(exampleCSV()).map(e=>validateEvent(e,weeksIn(plan.year),plan.year,categories));
  plan=validatePlan({...plan,title:'Example annual plan',center:String(plan.year),start:1,end:weeksIn(plan.year),labelSize:11,ringSelectionExplicit:true,categories,highlightGroups:[{weeks:'12,24–26',color:'#ff0000'},{weeks:'40–41',color:'#5893c1'}],events});save();sync();
}
$('demo').onclick=loadExample;
function download(content,name,type){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
const csvHeaders=['name','category','subcategory','start','end','color','notes'];
function serializeCSV(rows){const quote=x=>'"'+String(x??'').replace(/"/g,'""')+'"';return '\ufeff'+csvHeaders.join(',')+'\r\n'+rows.map(row=>row.map(quote).join(',')).join('\r\n')}
function csv(events){return serializeCSV(events.map(e=>[e.name,categoryMap()[e.category]?.name||e.category,categoryMap()[e.category]?.subcategories?.find(sub=>sub.id===e.subcategory)?.name||'',e.start,e.end===e.start?'':e.end,e.color,e.notes]))}
function parseCSV(str){str=str.replace(/^\ufeff/,'');const first=str.split(/\r?\n/)[0],sep=first.split(';').length>first.split(',').length?';':',';let rows=[],row=[],v='',quoted=false;for(let i=0;i<str.length;i++){const c=str[i];if(c==='"'){if(quoted&&str[i+1]==='"'){v+='"';i++}else if(quoted||!v)quoted=!quoted;else throw Error('Malformed CSV quote.')}else if(c===sep&&!quoted){row.push(v);v=''}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&str[i+1]==='\n')i++;row.push(v);if(row.some(x=>x.trim()))rows.push(row);row=[];v=''}else v+=c}if(quoted)throw Error('Unclosed quote in CSV.');row.push(v);if(row.some(x=>x.trim()))rows.push(row);const heads=(rows.shift()||[]).map(x=>x.trim().toLowerCase());for(const h of ['name'])if(!heads.includes(h))throw Error(`Missing CSV column: ${h}`);if(new Set(heads).size!==heads.length)throw Error('Duplicate CSV column.');return rows.map((r,i)=>{if(r.length!==heads.length)throw Error(`CSV row ${i+2}: unexpected number of columns.`);return Object.fromEntries(heads.map((h,j)=>[h,r[j].trim()]))})}
$('import').onclick=()=>{$('file').value='';$('replace').checked=true;$('import-status').textContent='';$('import-dialog').showModal()};$('close-import').onclick=()=>$('import-dialog').close();$('template').onclick=()=>download(exampleCSV(),'yearwheel-template.csv','text/csv;charset=utf-8');
function prepareCSV(str,replace=true){const rows=parseCSV(str);if(rows.length>2000)throw Error('Import at most 2,000 events.');let config=plan.categories.map(c=>({...c}));const labels=[...new Set(rows.map(r=>String(r.category||'').trim()).filter(Boolean).map(x=>x.toLowerCase()))];const used=new Set();const mappings=new Map();for(const label of labels){const c=config.find(c=>c.id.toLowerCase()===label||c.name.toLowerCase()===label);if(c){mappings.set(label,c.id);used.add(c.id)}}for(const label of labels){if(mappings.has(label))continue;const c=config.find(c=>!used.has(c.id)&&(replace||!plan.events.some(e=>e.category===c.id)));if(!c)throw Error('The wheel supports at most three categories.');used.add(c.id);mappings.set(label,c.id);c.name=String(rows.find(r=>String(r.category||'').trim().toLowerCase()===label).category).trim().slice(0,60)}config=validateCategories(config);const added=rows.map((r,i)=>{try{const category=mappings.get(String(r.category||'').trim().toLowerCase())||config.find(c=>c.enabled).id,c=config.find(c=>c.id===category),oldColour=String(r.color||'').trim().toLowerCase(),family={midblue:['blue',''],darkblue:['blue','highlight'],midpurple:['purple',''],darkpurple:['purple','highlight']}[oldColour];const inferred=!r.subcategory&&family&&c.subcategories.some(sub=>sub.id===family[0]);return validateEvent({...r,category,...(inferred?{subcategory:family[0],color:family[1]?validColor(oldColour):''}:{})},weeksIn(plan.year),plan.year,config)}catch(e){throw Error(`CSV row ${i+2}: ${e.message}`)}});if(replace){const used=new Set(added.map(e=>e.category));if(used.size===2)config=config.map(c=>({...c,enabled:used.has(c.id)}))}if(!replace&&added.length+plan.events.length>2000)throw Error('A plan supports at most 2,000 events.');return {categories:config,events:replace?added:[...plan.events,...added]}}
$('file').onchange=async()=>{const file=$('file').files[0];if(!file)return;try{if(file.size>3000000)throw Error('Choose a file smaller than 3 MB.');const str=await file.text();if(file.name.toLowerCase().endsWith('.json')){const next=validatePlan(JSON.parse(str));if(plan.events.length&&!confirm('Replace the complete current plan with this backup?'))return;plan=next}else{const replace=$('replace').checked,next=prepareCSV(str,replace);if(replace&&plan.events.length&&!confirm(`Replace all ${plan.events.length} existing events with ${next.events.length} imported events?`))return;plan={...plan,...next}}save();sync();$('import-dialog').close();toast(`Imported ${plan.events.length} events · ${plan.events.filter(e=>e.start===null).length} unscheduled`)}catch(e){$('import-status').textContent=e.message}};

const texEscape=s=>String(s).replace(/[\\{}%&#_$~^\n\r]/g,c=>({'\\':'\\textbackslash{}','{':'\\{','}':'\\}','%':'\\%','&':'\\&','#':'\\#','_':'\\_','$':'\\$','~':'\\textasciitilde{}','^':'\\textasciicircum{}','\n':' ','\r':' '}[c])).replace(/…/g,'\\ldots{}').replace(/–/g,'--').replace(/—/g,'---');
const wheelchartHeader=String.raw`\documentclass[border=6pt]{standalone}
\usepackage[utf8]{inputenc}
\usepackage{wheelchart}
\usepackage{anyfontsize}
\usepackage{xfp}
\usetikzlibrary{decorations.text}

% Wrap with TeX's font metrics and reduce only labels that exceed their week.
\newsavebox{\ywlabelbox}
\newcommand{\ywfitlabel}[3]{%
  \begingroup
  \def\ywlabelsize{10}%
  \def\ywlabeltry{%
    \sbox{\ywlabelbox}{\parbox{#1}{\centering
      \fontsize{\ywlabelsize}{\fpeval{1.2*\ywlabelsize}}\selectfont #3}}%
    \ifdim\dimexpr\ht\ywlabelbox+\dp\ywlabelbox\relax>#2\relax
      \ifdim\ywlabelsize pt>7pt
        \edef\ywlabelsize{\fpeval{\ywlabelsize-0.5}}%
        \ywlabeltry
      \else
        \resizebox*{!}{#2}{\usebox{\ywlabelbox}}%
      \fi
    \else
      \usebox{\ywlabelbox}%
    \fi}%
  \ywlabeltry
  \endgroup}


\begin{document}
\begin{tikzpicture}
\sffamily

% colors
\definecolor{lightgreen}{RGB}{215 238 237}
\definecolor{darkgreen}{RGB}{84 184 180}
\definecolor{lightblue}{RGB}{215 229 240}
\definecolor{midblue}{RGB}{152 188 217}
\definecolor{darkblue}{RGB}{88 147 193}
\definecolor{darkpurple}{RGB}{152 121 206}
\definecolor{midpurple}{RGB}{191 163 236}
\definecolor{lightyellow}{RGB}{254 249 238}
\definecolor{darkyellow}{RGB}{252 239 205}
\definecolor{lightred}{RGB}{240 220 221}
\definecolor{darkred}{RGB}{195 109 114}
\definecolor{brightred}{RGB}{220,53,69}
\definecolor{white}{RGB}{255 255 255}
\definecolor{labelgray}{RGB}{102,102,102}

\definecolor{mJan}{HTML}{${monthColors[0].slice(1)}}
\definecolor{mFeb}{HTML}{${monthColors[1].slice(1)}}
\definecolor{mMar}{HTML}{${monthColors[2].slice(1)}}
\definecolor{mApr}{HTML}{${monthColors[3].slice(1)}}
\definecolor{mMay}{HTML}{${monthColors[4].slice(1)}}
\definecolor{mJun}{HTML}{${monthColors[5].slice(1)}}
\definecolor{mJul}{HTML}{${monthColors[6].slice(1)}}
\definecolor{mAug}{HTML}{${monthColors[7].slice(1)}}
\definecolor{mSep}{HTML}{${monthColors[8].slice(1)}}
\definecolor{mOct}{HTML}{${monthColors[9].slice(1)}}
\definecolor{mNov}{HTML}{${monthColors[10].slice(1)}}
\definecolor{mDec}{HTML}{${monthColors[11].slice(1)}}

\def\MonthGap{2}
\pgfmathsetmacro{\TotalDeg}{360 - \MonthGap}
\pgfmathsetmacro{\StartAng}{450 - \MonthGap/2}
\pgfmathsetmacro{\EndAng}{90  + \MonthGap/2}

\newcommand{\wcang}[1]{\fpeval{\StartAng - \TotalDeg*(#1)}}
\newcommand{\wcdomain}[2]{\wcang{#1}:\wcang{#2}}

\pgfkeys{
  /wheelchart,
  arc data dir={\WCmidangle>180?-1:1},
  arc data expand=f,
  arc data pos=0.5,
  arc data sep=0,
  data=,
  domain=\StartAng:\EndAng,
  plot={{#1}:{#2+0*(450-#1)}},
  value=1,
  wheel data pos=0.5,
  wheel data style={align=center,rotate=\WCmidangle+(\WCmidangle<90?0:(\WCmidangle<270?180:0))}
}`;

// Preserve explicit TeX line breaks, but treat all other user input as text.
function wheelText(value){return String(value).split(/\\\\|\r?\n/).map(part=>texEscape(part).replace(/[æÆøØåÅ]/g,c=>({'æ':'{\\ae}','Æ':'{\\AE}','ø':'{\\o}','Ø':'{\\O}','å':'{\\aa}','Å':'{\\AA}'}[c]))).join('\\\\')}
// TikZ text decorations read a braced command as one glyph.
function arcText(value){return wheelText(value).replace(/\\(?:textbackslash|textasciitilde|textasciicircum)\{\}|\\[{}%&#_$]/g,command=>'{'+command+'}')}
function latex(){
  const cats=activeCategories(),count=plan.end-plan.start+1;
  const slots=[{rin:2.5,rout:4.3,tin:4.4,tout:4.8},{rin:4.9,rout:6.7,tin:6.8,tout:7.1},{rin:7.2,rout:9,tin:9.1,tout:9.5}].slice(3-cats.length);
  const out=[wheelchartHeader],colors=new Map();
  const monthNames=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const colorName=value=>{const hex=validColor(value);if(!colors.has(hex))colors.set(hex,'ywColor'+colors.size);return colors.get(hex)};
  const chart=(options,data=' ')=>String.raw`\wheelchart[`+'\n  '+options.join(',\n  ')+'\n]{'+data+'}\n';
  const circle=r=>String.raw`\draw[lightgray, line width=0.6pt, line cap=round]`+'\n'+String.raw`  (0,0) ++(\StartAng:`+r+')\n'+String.raw`  arc[start angle=\StartAng, end angle=\EndAng, radius=`+r+'];\n';
  const index=week=>week-plan.start+1;
  const fmt=n=>Number(n.toFixed(4));
  const wrap=(values,per)=>values.map((v,i)=>String(v)+(i===values.length-1?'':','+((i+1)%per===0?'\n':''))).join('');
  out.push('% INNER CIRCLE',circle(cats.length===2?4.8:2.4));
  cats.forEach((cat,c)=>{
    const s=slots[c],events=plan.events.filter(e=>e.category===cat.id&&e.start!==null&&e.start<=plan.end&&e.end>=plan.start).sort((a,b)=>a.start-b.start||b.end-a.end);
    const segments=svgEventSegments(events,plan.start,plan.end);
    const points=events.filter(e=>e.start===e.end&&segments.get(e.id).every(segment=>segment.count===1));
    const layered=events.filter(e=>!points.includes(e));
    // A week's last event supplies its fill; all unique names remain visible.
    const labels=new Map(),fills=new Map();
    points.forEach(e=>{const i=index(e.start);if(!labels.has(i))labels.set(i,new Set());labels.get(i).add(wheelText(e.name).replace(/\//g,String.raw`/\allowbreak{}`));fills.set(i,colorName(eventColor(e)))});
    const groups=new Map();[...fills].sort((a,b)=>a[0]-b[0]).forEach(([i,color])=>{if(!groups.has(color))groups.set(color,[]);groups.get(color).push(i)});
    const opts=[`radius={${s.rin}}{${s.rout}}`,`slices style={${colorName(cat.color)},draw=lightgray}`];
    const labelWidth=fmt(s.rout-s.rin-0.2);
    const labelHeight=fmt((s.rin+s.rout)*Math.sin(Math.PI*(358/360)/count)*28.45274);
    for(const [color,weeks] of groups)opts.push(`slices style{${weeks.join(',')}}={${color},draw=lightgray}`);
    for(const [i,names] of [...labels].sort((a,b)=>a[0]-b[0]))opts.push(`wheel data{${i}}={\\ywfitlabel{${labelWidth}cm}{${labelHeight}pt}{${[...names].join('\\\\')}}}`);
    opts.push('total count='+count);out.push('% CATEGORY '+(c+1),chart(opts));
    // Share the SVG's local radial allocation. Paint all fills before labels
    // so a neighbouring segment cannot cover part of a curved label.
    const spanLabels=[];
    for(const e of layered){
      const parts=segments.get(e.id),labelPart=parts.reduce((best,part)=>!best||part.count>best.count?part:best,null);
      for(const part of parts){
        const thickness=(s.rout-s.rin)/part.count,rin=s.rin+part.lane*thickness,rout=rin+thickness;
        const options=[String.raw`domain/.expanded=\wcdomain{`+(part.start-plan.start)+'/'+count+'}{'+(part.end-plan.start)+'/'+count+'}',`radius={${fmt(rin)}}{${fmt(rout)}}`,'slices style={'+colorName(eventColor(e))+',draw=lightgray}','total count=1'];
        out.push('% EVENT SEGMENT '+JSON.stringify({name:e.name,start:part.start,end:part.end-1,lane:part.lane,count:part.count}));
        if(e.start===e.end){
          const width=fmt(Math.max(.1,thickness-.2)),height=fmt((rin+rout)*Math.sin(Math.PI*(358/360)/count)*28.45274);
          options.push('wheel data{1}={\\ywfitlabel{'+width+'cm}{'+height+'pt}{'+wheelText(e.name).replace(/\//g,String.raw`/\allowbreak{}`)+'}}','total count=1');
          out.push(chart(options));
        }else out.push(chart(options));
      }
      if(e.start!==e.end){
        const thickness=(s.rout-s.rin)/labelPart.count,rin=s.rin+labelPart.lane*thickness;
        spanLabels.push(chart([String.raw`arc data=\WCvarA`,String.raw`domain/.expanded=\wcdomain{`+(Math.max(plan.start,e.start)-plan.start)+'/'+count+'}{'+(Math.min(plan.end,e.end)+1-plan.start)+'/'+count+'}',`radius={${fmt(rin)}}{${fmt(rin+thickness)}}`,'slices style={fill=none,draw=none}'],'{'+arcText(e.name)+'}'));
      }
    }
    out.push(...spanLabels);
    out.push(chart(['arc data={'+arcText(cat.name)+'}','arc data style={text color=gray}',`radius={${s.tin}}{${s.tout}}`,'slices style={fill=none}','total count=6']));
  });
  out.push(circle(9.6));
  const weeks=Array.from({length:count},(_,i)=>plan.start+i);
  const dates=weeks.map(w=>{const d=monday(plan.year,w),last=new Date(+d+6*86400000);return d.getUTCDate()+'/'+last.getUTCDate()});
  out.push(chart([String.raw`arc data=\WCvarA{--}\WCvarB`,'radius={9.7}{10.1}','slices style={fill=none}'],wrap(dates,14)));
  const weekOpts=[String.raw`arc data=\WCvarA`,'radius={10.1}{10.5}','slices style={fill=none}'],highlightGroups=new Map();
  for(const [week,color] of highlights()){if(week<plan.start||week>plan.end)continue;const name=colorName(color);if(!highlightGroups.has(name))highlightGroups.set(name,[]);highlightGroups.get(name).push(index(week))}
  for(const [color,indices] of highlightGroups)weekOpts.push(`arc data style{${indices.sort((a,b)=>a-b).join(',')}}={text color=${color}}`);
  out.push(chart(weekOpts,wrap(weeks,20)));
  const months=monthNames;
  out.push(chart([String.raw`arc data=\WCvarA`,'arc data style={text color=white}','radius={10.6}{11.1}','gap polar=-4','gap radius=0.02',String.raw`middle={\fontsize{48}{60}\selectfont`+wheelText(plan.center)+'}', 'slices arrow={1}{0}','slices style={draw=lightgray}',...months.map((m,i)=>`slices style{${i+1}}={fill=m${m.slice(0,3)}}`)],months.join(',')));
  // Define custom colours before any chart uses them. The original named
  // palette stays available; month fills use the shared pastel palette.
  out.splice(1,0,...[...colors].map(([hex,name])=>`\\definecolor{${name}}{HTML}{${hex.slice(1)}}`));
  out.push(String.raw`\end{tikzpicture}`,String.raw`\end{document}`);return out.join('\n')+'\n';
}
function selectTab(name,focus=false){for(const tab of ['wheel','events']){const selected=tab===name;$(tab+'-tab').setAttribute('aria-selected',String(selected));$(tab+'-tab').tabIndex=selected?0:-1;$(tab+'-panel').hidden=!selected}if(focus)$(name+'-tab').focus()}
for(const name of ['wheel','events']){$(name+'-tab').onclick=()=>selectTab(name);$(name+'-tab').onkeydown=e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();selectTab(e.key==='Home'?'wheel':e.key==='End'?'events':name==='wheel'?'events':'wheel',true)}}}
function openInOverleaf(){$('overleaf-source').value=encodeURIComponent(latex());$('overleaf-form').submit()}

// Self-contained HSV picker. Draft changes are applied only when requested.
function hexToHsv(hex){const [r,g,b]=hex.slice(1).match(/../g).map(x=>parseInt(x,16)/255),max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;let h=0;if(d)h=max===r?((g-b)/d)%6:max===g?(b-r)/d+2:(r-g)/d+4;return {h:(h*60+360)%360,s:max?d/max:0,v:max}}
function hsvToHex({h,s,v}){const c=v*s,x=c*(1-Math.abs(((h%360)/60)%2-1)),m=v-c;const rgb=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];return '#'+rgb.map(n=>Math.round((n+m)*255).toString(16).padStart(2,'0')).join('')}
let pickerTarget=null,pickerHsv={h:0,s:1,v:1};
function refreshColorPicker(){const hex=hsvToHex(pickerHsv),r=pickerHsv.h*Math.PI/180;
  $('picker-hex').value=hex;$('picker-preview').style.background=hex;
  $('picker-wheel-fill').style.filter=`brightness(${pickerHsv.v})`;
  $('picker-cursor').style.left=(50+49*pickerHsv.s*Math.cos(r))+'%';$('picker-cursor').style.top=(50+49*pickerHsv.s*Math.sin(r))+'%';
  $('picker-value').value=Math.round(pickerHsv.v*100);$('picker-brightness').textContent=Math.round(pickerHsv.v*100)+'%';
  $('picker-value').style.background=`linear-gradient(to right,#000,${hsvToHex({...pickerHsv,v:1})})`;
  $('picker-wheel').setAttribute('aria-valuenow',String(Math.round(pickerHsv.h)));$('picker-wheel').setAttribute('aria-valuetext',`${hex}; saturation ${Math.round(pickerHsv.s*100)} percent`);
  $('picker-error').textContent='';$('picker-hex').removeAttribute('aria-invalid');
}
function openColorPicker(target){pickerTarget=target;pickerHsv=hexToHsv(validColor(target.value||'#54b8b4'));
  $('picker-title').textContent=target.getAttribute('aria-label')||'Choose colour';
  const colours=[...new Set([...Object.values(defaults).flatMap(c=>[c.color,c.highlight,...(c.subcategories||[]).map(sub=>sub.color)]),'#dc3545','#f0dcdd','#f5e7df','#f0dfe9','#eadff0','#dfe5f2','#dff0e8','#ffffff','#666666','#253e37'])];
  $('picker-presets').innerHTML=colours.map(hex=>`<button type="button" class="picker-preset" data-preset="${hex}" style="background:${hex}" aria-label="Use ${hex}" title="${hex}"></button>`).join('');
  refreshColorPicker();$('color-picker').showModal();$('picker-wheel').focus();
}
document.addEventListener('click',e=>{const target=e.target.closest('[data-pick-color]');if(target){e.preventDefault();openColorPicker(target)}});
$('pick-event-color').onclick=()=>{const input=$('event-color');try{input.value=validColor(input.value);openColorPicker(input)}catch(err){toast(err.message)}};
function closeColorPicker(){$('color-picker').close();pickerTarget?.focus();pickerTarget=null}
for(const id of ['picker-cancel','picker-close'])$(id).onclick=closeColorPicker;
$('color-picker').oncancel=()=>{pickerTarget=null};
$('picker-presets').onclick=e=>{const hex=e.target.closest('[data-preset]')?.dataset.preset;if(hex){pickerHsv=hexToHsv(hex);refreshColorPicker()}};
function readPickerHex(){try{const hex=validColor($('picker-hex').value);pickerHsv=hexToHsv(hex);refreshColorPicker();return true}catch(err){$('picker-error').textContent='Enter a hex colour or a recognised colour name.';$('picker-hex').setAttribute('aria-invalid','true');return false}}
$('picker-hex').onchange=readPickerHex;
$('picker-value').oninput=()=>{pickerHsv.v=Number($('picker-value').value)/100;refreshColorPicker()};
function selectWheelColour(e){const rect=$('picker-wheel').getBoundingClientRect(),x=(e.clientX-rect.left-rect.width/2)/(rect.width/2),y=(e.clientY-rect.top-rect.height/2)/(rect.height/2);pickerHsv.h=(Math.atan2(y,x)*180/Math.PI+360)%360;pickerHsv.s=Math.min(1,Math.hypot(x,y));refreshColorPicker()}
$('picker-wheel').onpointerdown=e=>{e.preventDefault();$('picker-wheel').focus();$('picker-wheel').setPointerCapture(e.pointerId);selectWheelColour(e)};
$('picker-wheel').onpointermove=e=>{if($('picker-wheel').hasPointerCapture(e.pointerId))selectWheelColour(e)};
$('picker-wheel').onpointerup=e=>{if($('picker-wheel').hasPointerCapture(e.pointerId))$('picker-wheel').releasePointerCapture(e.pointerId)};
$('picker-wheel').onkeydown=e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const step=e.shiftKey?10:2;if(e.key==='ArrowLeft'||e.key==='ArrowRight')pickerHsv.h=(pickerHsv.h+(e.key==='ArrowRight'?step:-step)+360)%360;else pickerHsv.s=Math.max(0,Math.min(1,pickerHsv.s+(e.key==='ArrowUp'?step:-step)/100));refreshColorPicker()};
$('color-picker-form').onsubmit=e=>{e.preventDefault();if(!readPickerHex()){$('picker-hex').focus();return}const target=pickerTarget,hex=hsvToHex(pickerHsv),category=target.closest('[data-category]')?.dataset.category,subcategory=target.closest('[data-subcategory]')?.dataset.subcategory,field=target.dataset.categoryField||target.dataset.subcategoryField,group=target.closest('[data-group]')?.dataset.group;
  $('color-picker').close();pickerTarget=null;target.value=hex;target.style.background=hex;target.dispatchEvent(new Event('change',{bubbles:true}));
  const restored=Array.from(document.querySelectorAll('[data-pick-color]')).find(button=>category?button.closest('[data-category]')?.dataset.category===category&&button.closest('[data-subcategory]')?.dataset.subcategory===subcategory&&(button.dataset.categoryField||button.dataset.subcategoryField)===field:group!==undefined&&button.closest('[data-group]')?.dataset.group===group);
  (target.isConnected?target:restored)?.focus();
};

$('export').onclick=()=>{$('exports').hidden=!$('exports').hidden};document.addEventListener('click',e=>{if(!e.target.closest('#exports')&&!e.target.closest('#export'))$('exports').hidden=true});$('exports').onclick=e=>{const type=e.target.dataset.export;if(!type)return;$('exports').hidden=true;const name=`yearwheel-${plan.year}`;if(type==='tex')download(latex(),name+'.tex','application/x-tex');if(type==='overleaf')openInOverleaf();if(type==='svg')download(svgString(),name+'.svg','image/svg+xml');if(type==='csv')download(csv(plan.events),name+'.csv','text/csv;charset=utf-8');if(type==='json')download(JSON.stringify(plan,null,2),name+'.json','application/json');if(type==='print')window.print()};$('print').onclick=()=>window.print();sync();
// Panel width is a device preference, separate from exported calendar settings.
function settingsSizing(width,available){
  const max=Math.max(280,Math.min(640,available-374));
  const value=Math.round(Math.max(280,Math.min(max,Number.isFinite(width)?width:340)));
  return {width:value,max,scale:1+Math.max(0,value-340)/600};
}
function initSettingsResize(){
  const panel=$('wheel-panel'),handle=$('settings-resizer');
  if(!panel.style||!panel.getBoundingClientRect)return;
  let preferred=340,drag=null;
  try{const saved=localStorage.getItem('yearwheel.settingsWidth');if(saved!==null&&Number.isFinite(Number(saved)))preferred=Number(saved)}catch{}
  function apply(){
    const size=settingsSizing(preferred,panel.getBoundingClientRect().width);
    panel.style.setProperty('--settings-width',size.width+'px');
    panel.style.setProperty('--settings-scale',size.scale);
    handle.setAttribute('aria-valuemin',280);handle.setAttribute('aria-valuemax',size.max);
    handle.setAttribute('aria-valuenow',size.width);handle.setAttribute('aria-valuetext',size.width+' pixels');
    return size;
  }
  function persist(){try{localStorage.setItem('yearwheel.settingsWidth',String(preferred))}catch{}}
  handle.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;e.preventDefault();
    drag={id:e.pointerId,x:e.clientX,width:apply().width};handle.setPointerCapture(e.pointerId);
    panel.classList.add('settings-resizing');
  });
  handle.addEventListener('pointermove',e=>{
    if(!drag||e.pointerId!==drag.id)return;
    preferred=settingsSizing(drag.width+e.clientX-drag.x,panel.getBoundingClientRect().width).width;apply();
  });
  function finish(e){if(!drag||e.pointerId!==drag.id)return;drag=null;panel.classList.remove('settings-resizing');persist()}
  handle.addEventListener('pointerup',finish);handle.addEventListener('pointercancel',finish);handle.addEventListener('lostpointercapture',finish);
  handle.addEventListener('keydown',e=>{
    const size=apply(),step=e.shiftKey?50:10;
    const next={ArrowLeft:size.width-step,ArrowRight:size.width+step,Home:280,End:size.max}[e.key];
    if(next===undefined)return;e.preventDefault();preferred=settingsSizing(next,panel.getBoundingClientRect().width).width;apply();persist();
  });
  handle.addEventListener('dblclick',()=>{preferred=340;apply();persist()});
  window.addEventListener('resize',apply);apply();
}
initSettingsResize();
let printFilters;window.addEventListener('beforeprint',()=>{printFilters=[$('search').value,$('filter').value];$('search').value='';$('filter').value='';renderRows()});window.addEventListener('afterprint',()=>{if(printFilters){[$('search').value,$('filter').value]=printFilters;renderRows()}});
if(typeof module!=='undefined')module.exports={settingsSizing,showUnscheduled,addSubcategory,removeSubcategory,exampleCSV,loadExample,applyInlinePatch,hexToHsv,hsvToHex,resetDefaults,svgEventSegments,tangentRotation,categoryDisplayOrder,reorderCategory,openInOverleaf,monthColors,validColor,eventColor,prepareCSV,highlights,activeCategories,defaultCategories,openEditor,selectTab,parseWeek,monday,weeksIn,validateEvent,validatePlan,parseCSV,csv,texEscape,latex,makeScene,setPlan:p=>{plan=p;scene=makeScene()},getPlan:()=>plan};
