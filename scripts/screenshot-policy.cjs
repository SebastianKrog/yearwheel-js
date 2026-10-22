'use strict';
const {execFileSync}=require('node:child_process');
const imagePath=/^docs\/yearwheel-screenshot\.(?:webp|png|jpe?g)$/i;
const captureSource=path=>path.startsWith('dist/')||['scripts/capture-screenshot.cjs','scripts/screenshot-policy.cjs','.github/workflows/screenshot.yml'].includes(path);
function shouldCapture(paths){return paths.some(captureSource)&&!paths.some(path=>imagePath.test(path))}
function changedPaths(before,after){
  if(!/^[0-9a-f]{40}$/.test(before)||/^0+$/.test(before)||!/^[0-9a-f]{40}$/.test(after))return [];
  const git=args=>execFileSync('git',args,{encoding:'utf8'}).trim();
  // Inspect every commit, rather than just the net diff: an image edit followed
  // by a revert in the same push must also suppress automatic screenshots.
  const commits=git(['rev-list',`${before}..${after}`]).split('\n').filter(Boolean);
  return commits.flatMap(sha=>git(['diff-tree','--root','-m','-r','--no-commit-id','--name-only','--no-renames',sha]).split('\n').filter(Boolean));
}
if(require.main===module)process.stdout.write(String(shouldCapture(changedPaths(process.env.PUSH_BEFORE||'',process.env.PUSH_AFTER||''))));
module.exports={shouldCapture,changedPaths};
