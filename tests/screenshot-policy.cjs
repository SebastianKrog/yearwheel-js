'use strict';
const assert=require('node:assert/strict');
const {shouldCapture,changedPaths}=require('../scripts/screenshot-policy.cjs');
const {execFileSync}=require('node:child_process');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
assert(shouldCapture(['dist/app.js']));
assert(shouldCapture(['dist/style.css','README.md']));
assert(!shouldCapture(['README.md']));
assert(!shouldCapture(['docs/yearwheel-screenshot.webp']));
assert(!shouldCapture(['dist/app.js','docs/yearwheel-screenshot.webp']));
assert(!shouldCapture(['dist/style.css','docs/yearwheel-screenshot.png']));
assert(!shouldCapture(['docs/yearwheel-latex.webp']));
// Reverting an image within the push does not remove the veto.
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'yearwheel-policy-')),previous=process.cwd();
try{
  process.chdir(temp);const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
  git('init','-q');git('config','user.name','Test');git('config','user.email','test@example.invalid');
  fs.mkdirSync('docs');fs.mkdirSync('dist');fs.writeFileSync('docs/yearwheel-screenshot.webp','original');fs.writeFileSync('dist/app.js','original');git('add','.');git('commit','-qm','Initial');const before=git('rev-parse','HEAD');
  fs.writeFileSync('docs/yearwheel-screenshot.webp','manual');git('add','.');git('commit','-qm','Manual screenshot');
  fs.writeFileSync('docs/yearwheel-screenshot.webp','original');fs.writeFileSync('dist/app.js','updated');git('add','.');git('commit','-qm','Revert image and update app');
  const after=git('rev-parse','HEAD');assert(!shouldCapture(changedPaths(before,after)));
  assert.equal(git('diff',before,after,'--','docs/yearwheel-screenshot.webp'),'');
}finally{process.chdir(previous);fs.rmSync(temp,{recursive:true,force:true})}
console.log('Passed screenshot trigger policy: app changes, documentation, mixed image edits and reverted image edits.');
