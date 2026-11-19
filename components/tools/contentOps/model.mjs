export function initialValues(spec,example=false){
  const entries=spec.steps.flatMap(s=>s.fields).map(f=>[f.id,f.columns?f.initial:f.options?.[0]??'']);
  return JSON.parse(JSON.stringify({...Object.fromEntries(entries),...(example?spec.sample:{})}));
}
export function buildDocument(spec,v){
  const sections=[];
  for(const group of spec.steps){
    const lines=[];
    for(const f of group.fields){
      if(f.columns){
        for(const [i,row] of v[f.id].entries()){
          const details=f.columns.filter(c=>String(row[c.id]??'').trim()).map(c=>c.label+': '+row[c.id]);
          if(details.length)lines.push(f.item+' '+(i+1)+'\n'+details.join('\n'));
        }
      }else if(v[f.id]?.trim())lines.push(f.label+'\n'+v[f.id].trim());
    }
    if(lines.length)sections.push([group.title,lines.join('\n\n')]);
  }
  if(spec.extra)sections.push(...spec.extra(v));
  const problem=spec.require?.(v) || (!v.project?.trim()?'Enter a project or company name to export.':'');
  return {sections,problem};
}
