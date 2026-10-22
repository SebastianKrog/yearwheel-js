'use strict';
const {chromium}=require('playwright');
const {createServer}=require('node:http');
const fs=require('node:fs/promises');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
async function capture(){
  const root=path.resolve(__dirname,'../dist');
  const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};
  const server=createServer(async(req,res)=>{
    try{
      const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
      if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
      const bytes=await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(bytes);
    }catch{res.writeHead(404).end()}
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  let browser;
  try{
    browser=await chromium.launch();
    const page=await browser.newPage({viewport:{width:1364,height:936},deviceScaleFactor:1,locale:'en-GB',timezoneId:'UTC',colorScheme:'light',reducedMotion:'reduce'});
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    // Fix the example year for reproducible images; allow timers to run normally.
    await page.addInitScript(()=>{const OriginalDate=Date;window.Date=class extends OriginalDate{constructor(...args){super(...(args.length?args:['2026-06-15T12:00:00Z']))}static now(){return OriginalDate.parse('2026-06-15T12:00:00Z')}}});
    await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'networkidle'});
    await page.getByRole('button',{name:'Load example',exact:true}).click();
    await page.getByRole('img',{name:'Example annual plan',exact:true}).waitFor();
    await page.getByText('12 of 14 events in view',{exact:false}).waitFor();
    await page.evaluate(()=>document.fonts.ready);
    await page.mouse.move(1350,925);
    await fs.mkdir(path.resolve(__dirname,'../docs'),{recursive:true});
    const png=path.resolve(__dirname,'../docs/.yearwheel-screenshot.png');
    await page.screenshot({path:png,animations:'disabled',caret:'hide'});
    if(errors.length)throw Error(errors.join('\n'));
    // Keep the existing README asset and leave the final LaTeX image untouched.
    execFileSync('python3',['-c',"from PIL import Image; import sys; Image.open(sys.argv[1]).convert('RGB').save(sys.argv[2], 'WEBP', quality=85, method=6)",png,path.resolve(__dirname,'../docs/yearwheel-screenshot.webp')]);
    await fs.unlink(png);
  }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve))}
}
capture().catch(error=>{console.error(error);process.exitCode=1});
