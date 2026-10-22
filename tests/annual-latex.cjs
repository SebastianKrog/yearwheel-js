'use strict';
const assert=require('node:assert/strict');
const {currentYear,shouldRender,exampleSource}=require('../scripts/export-latex-example.cjs');
assert.equal(currentYear(new Date('2026-12-31T22:59:59Z')),2026);
assert.equal(currentYear(new Date('2026-12-31T23:00:00Z')),2027);
assert(shouldRender('schedule',new Date('2027-01-01T02:00:00Z')));
assert(!shouldRender('schedule',new Date('2026-12-01T02:00:00Z')));
assert(!shouldRender('schedule',new Date('2027-02-01T02:00:00Z')));
assert(shouldRender('push',new Date('2027-02-01T02:00:00Z')));
assert(shouldRender('workflow_dispatch',new Date('2027-02-01T02:00:00Z')));
for(const [year,weeks] of [[2026,53],[2027,52]]){
  const result=exampleSource(year);assert.equal(result.weeks,weeks);assert.equal(result.events,14);assert(result.tex.includes(String(year)));assert(result.tex.includes('Application'));assert(result.tex.includes('Project'));
}
assert.throws(()=>exampleSource(0));
console.log('Passed Copenhagen year rollover and 52/53-week annual LaTeX example checks.');
