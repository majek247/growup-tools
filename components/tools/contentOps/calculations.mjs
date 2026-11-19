function read(v,label,integer=false){
  if(v==null || String(v).trim()==='' || !Number.isFinite(Number(v)) || Number(v)<0 || (integer&&!Number.isSafeInteger(Number(v))))throw new Error('Enter a valid '+(integer?'whole number':'amount')+' for '+label+'.');
  return Number(v);
}
const money=(v,c)=>new Intl.NumberFormat('en-GB',{style:'currency',currency:c}).format(v);
export function costReport(v){
 try{
  const rate=read(v.rate,'internal review cost per hour');
  const sections=v.models.map(r=>{
    const published=read(r.published,'published pieces',true);
    if(!published)throw new Error('Published pieces must be at least one for each option.');
    const base=read(r.base,'production spend'),hours=read(r.hours,'review hours'),extra=read(r.extra,'other costs');
    const total=base+hours*rate+extra;
    return [r.name,total/published,'Production '+money(base,v.currency)+'\nInternal review '+hours+' hours × '+money(rate,v.currency)+'\nOther costs '+money(extra,v.currency)+'\nMonthly total '+money(total,v.currency)+' ÷ '+published+' published pieces'];
  });
  const low=Math.min(...sections.map(r=>r[1]));
  return {chart:sections.map(([label,value])=>({label,value,display:money(value,v.currency)})),stat:[money(low,v.currency),'Lowest estimated cost per published piece'],sections:sections.map(([name,unit,body])=>[name,money(unit,v.currency)+' per published piece\n'+body])};
 }catch(e){return {sections:[],problem:e.message};}
}
export function outputReport(v){
 try{
  const total=read(v.budget,'monthly budget'),fixed=read(v.fixed,'fixed costs'),capacity=read(v.hours,'available review hours');
  const rows=v.mix.map(r=>({...r,q:read(r.qty,'pieces per batch',true),price:read(r.price,'unit cost'),time:read(r.time,'review hours per piece')}));
  if(rows.some(r=>r.q && !r.name.trim()))throw new Error('Name each selected format.');
  if(!rows.some(r=>r.q))throw new Error('Choose at least one piece in the format mix.');
  if(rows.some(r=>r.q && r.price<=0))throw new Error('Enter a positive unit cost for each selected format.');
  const batchCost=rows.reduce((n,r)=>n+r.q*r.price,0),batchHours=rows.reduce((n,r)=>n+r.q*r.time,0);
  const byCost=Math.max(0,Math.floor((total-fixed+1e-8)/batchCost)),byTime=batchHours?Math.floor((capacity+1e-8)/batchHours):Infinity;
  const batches=Math.min(byCost,byTime),pieces=rows.reduce((n,r)=>n+batches*r.q,0);
  return {chart:rows.filter(r=>r.q).map(r=>({label:r.name,value:r.q*batches,display:String(r.q*batches)+' pcs'})),stat:[String(pieces),'pieces in complete batches this month'],sections:[
    ['Monthly production order',rows.filter(r=>r.q).map(r=>(r.q*batches)+' × '+r.name+' · '+money(r.q*batches*r.price,v.currency)).join('\n')],
    ['Budget and capacity','Fixed costs '+money(fixed,v.currency)+'\nProduction '+money(batchCost*batches,v.currency)+'\nBudget balance '+money(total-fixed-batches*batchCost,v.currency)+'\nReview hours used '+Number((batchHours*batches).toFixed(2))+' of '+capacity],
    ['Planning assumption','Repeat the selected mix as whole batches. One batch costs '+money(batchCost,v.currency)+' and needs '+Number(batchHours.toFixed(2))+' review hours. '+(fixed>total?'Fixed costs exceed the available budget.':byCost===byTime?'Both budget and reviewer capacity limit the next batch.':byCost<byTime?'Budget limits the next batch.':'Reviewer capacity limits the next batch.')]]};
 }catch(e){return {sections:[],problem:e.message};}
}
