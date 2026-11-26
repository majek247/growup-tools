import test from 'node:test';
import assert from 'node:assert/strict';
import { costReport, outputReport } from '../components/tools/contentOps/calculations.mjs';
import { tools,topics } from '../lib/catalog.mjs';
test('Content Operations routes are unique',()=>{
 const selected=tools.filter(t=>t.topic==='Content Operations');
 assert.ok(selected.length>0);assert.equal(new Set(selected.map(t=>t.slug)).size,selected.length);assert.ok(topics.includes('Content Operations'));
});
test('Cost uses review and published count',()=>{
 const data={currency:'GBP',rate:'40',models:[{name:'Agency',published:'4',base:'1600',hours:'5',extra:'40'}]};
 assert.equal(costReport(data).stat[0],'£460.00');
 data.models[0].published='0';assert.ok(costReport(data).problem);
});
test('Planner fits whole batches within both limits',()=>{
 const data={currency:'GBP',budget:'2000',fixed:'200',hours:'5',mix:[{name:'Guide',qty:'2',price:'200',time:'1'}]};
 assert.equal(outputReport(data).stat[0],'4');data.hours='100';assert.equal(outputReport(data).stat[0],'8');
 data.budget='100';assert.equal(outputReport(data).stat[0],'0');data.mix[0].qty='0';assert.ok(outputReport(data).problem);
});
