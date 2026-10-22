'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {webcrypto}=require('node:crypto');
function currentYear(now=new Date()){return Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Copenhagen',year:'numeric'}).format(now))}
function exampleSource(year){
  if(!Number.isInteger(year)||year<1900||year>2100)throw Error('Year must be 1900–2100.');
  // The editor's own exporter, run with an empty, isolated DOM. This uses the
  // same fallback text metrics as the existing Node export regression checks.
  const elements=new Map(),document={getElementById(id){if(!elements.has(id))elements.set(id,{value:'',checked:false,dataset:{},addEventListener(){},setAttribute(){},focus(){},showModal(){},close(){}});return elements.get(id)},addEventListener(){}};
  const context={document,window:{addEventListener(){}},localStorage:{getItem(){return null},setItem(){}},crypto:webcrypto,confirm:()=>true,setTimeout:()=>0,clearTimeout(){},module:{exports:{}}};
  vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../dist/app.js'),'utf8'),context,{filename:'app.js'});
  const app=context.module.exports;
  app.setPlan(app.validatePlan({...app.getPlan(),year,center:String(year),start:1,end:app.weeksIn(year)}));app.loadExample();
  return {tex:app.latex(),year,weeks:app.weeksIn(year),events:app.getPlan().events.length};
}
if(require.main===module){
  try{
    const args=process.argv.slice(2);let year=currentYear(),output=path.resolve(__dirname,'../build/annual-latex');
    for(let i=0;i<args.length;i++){if(args[i]==='--year')year=Number(args[++i]);else if(args[i]==='--output')output=path.resolve(args[++i]);else throw Error('Use --year YYYY and/or --output DIRECTORY.')}
    const result=exampleSource(year);fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,'yearwheel.tex'),result.tex);fs.writeFileSync(path.join(output,'example.json'),JSON.stringify({year:result.year,weeks:result.weeks,events:result.events},null,2)+'\n');console.log(`Generated default example for ${year} (${result.weeks} ISO weeks).`);
  }catch(error){console.error(error.message);process.exitCode=1}
}
module.exports={currentYear,exampleSource};
