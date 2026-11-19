import { useEffect, useState } from 'react';
import { ArrowRight, Copy, FileDown, FileText } from 'lucide-react';
import s from './Operations.module.css';
import { buildDocument, initialValues } from './model.mjs';

function Input({field,value,onChange}) {
  const options=field.options;
  if(field.readOnly)return <p className={s.fixedName}>{value}</p>;
  return <label className={s.field}><span>{field.label}</span>
    {options ? <select value={value} onChange={e=>onChange(e.target.value)}>{options.map(v=><option key={v}>{v}</option>)}</select> :
    field.long ? <textarea rows={3} value={value} placeholder={field.hint} onChange={e=>onChange(e.target.value)}/> :
    <input type={field.number?'number':'text'} min={field.number?0:undefined} step={field.number?'any':undefined} value={value} placeholder={field.hint} onChange={e=>onChange(e.target.value)}/>}
  </label>;
}
function RecordList({field,rows,change}) {
  function update(index,key,value){change(rows.map((row,i)=>i===index?{...row,[key]:value}:row));}
  return <div className={s.records}><h4>{field.label}</h4>{rows.map((row,i)=><details key={i} className={s.entry} open={i===0 || (!field.fixed && !Object.values(row).some(Boolean)) || undefined}>
    <summary>{row.name || row.before || row.claim || field.item+" "+(i+1)}{row.status && <small>{row.status}</small>}</summary>
    {field.columns.map(col=><Input key={col.id} field={col} value={row[col.id]??''} onChange={v=>update(i,col.id,v)}/>)}
    {!field.fixed && <button type="button" onClick={()=>change(rows.filter((_,n)=>n!==i))}>Remove {field.item.toLowerCase()} {i+1}</button>}
  </details>)}{!field.fixed && <button type="button" onClick={()=>change([...rows,Object.fromEntries(field.columns.map(c=>[c.id,c.options?.[0]??'']))])}>+ Add {field.item.toLowerCase()}</button>}</div>;
}
export default function Workspace({spec}){
  const key='growup:content-ops:v1:'+spec.slug;
  const [values,setValues]=useState(()=>initialValues(spec)),[step,setStep]=useState(0),[ready,setReady]=useState(false),[status,setStatus]=useState(''),[busy,setBusy]=useState(false);
  useEffect(()=>{
    try{const existing=JSON.parse(sessionStorage.getItem(key));if(existing?.values){
      const restored=initialValues(spec);
      for(const f of spec.steps.flatMap(x=>x.fields)){
        const v=existing.values[f.id];
        if(f.columns && Array.isArray(v) && (!f.fixed || v.length===restored[f.id].length) && v.every(r=>r && typeof r==='object')) restored[f.id]=v;
        if(!f.columns && typeof v==='string' && (!f.options || f.options.includes(v))) restored[f.id]=v;
      }
      setValues(restored);setStep(Math.min(spec.steps.length,Math.max(0,Number.parseInt(existing.step)||0)));
    }}catch{}setReady(true);
  },[key,spec]);
  useEffect(()=>{if(ready){try{sessionStorage.setItem(key,JSON.stringify({values,step}));}catch{}}},[values,step,key,ready]);
  const report=spec.compute?spec.compute(values):buildDocument(spec,values);
  const review=step===spec.steps.length;
  function update(id,v){setValues(old=>({...old,[id]:v}));setStatus('');}
  function go(n){setStep(n);setStatus('');}
  function reset(example){
    if(JSON.stringify(values)!==JSON.stringify(initialValues(spec)) && !window.confirm('Replace this draft?'))return;
    setValues(initialValues(spec,example));go(0);
  }
  async function output(pdf){
    setBusy(true);
    try{if(pdf){const {saveBrief}=await import('./savePdf');await saveBrief(spec.title,values.project?.trim()||'Content Operations',report.sections);}
      else{await navigator.clipboard.writeText([spec.title,...report.sections.map(([a,b])=>a+'\n'+b)].join('\n\n'));}
      setStatus(pdf?'PDF downloaded.':'Copied to clipboard.');
    }catch{setStatus(pdf?'Could not download the PDF. Try again.':'Clipboard unavailable. Select the output to copy it.');}finally{setBusy(false);}
  }
  const chart=report.chart || [];
  const preview=report.sections.filter(([,body])=>body.trim()).slice(0,2);
  return <div className={s.workspace}><nav className={s.nav} aria-label="Workflow steps">{[...spec.steps,{title:'Review & export'}].map((x,i)=><button key={x.title} type="button" onClick={()=>go(i)} aria-current={step===i?'step':undefined}><b>{i+1}</b>{x.title}</button>)}</nav>
    <div className={s.grid}><section className={s.panel}>
    <div className={s.top}><span className={s.tag}>{review?'Final review':'Step '+(step+1)+' of '+spec.steps.length}</span><div><button onClick={()=>reset(true)}>Use example</button><button onClick={()=>reset(false)}>Start fresh</button></div></div>
    <h2>{review?spec.output:spec.steps[step].prompt}</h2>
    {!review?<>{spec.steps[step].fields.map(f=>f.columns?<RecordList key={f.id} field={f} rows={values[f.id]} change={v=>update(f.id,v)}/>:<Input key={f.id} field={f} value={values[f.id]} onChange={v=>update(f.id,v)}/>)}<div className={s.actions}>{step>0&&<button onClick={()=>go(step-1)}>Back</button>}<button className={s.primary} onClick={()=>go(step+1)}>{step===spec.steps.length-1?'Review output':'Continue'} <ArrowRight size={15}/></button></div></>:
    <>{report.sections.map(([title,body])=><article className={s.section} key={title}><h3>{title}</h3><p>{body}</p></article>)}{report.problem&&<p role="alert">{report.problem}</p>}
    <div className={s.actions}><button disabled={!!report.problem||busy} onClick={()=>output(false)}><Copy size={15}/>Copy</button><button disabled={!!report.problem||busy} className={s.primary} onClick={()=>output(true)}><FileDown size={16}/>Download PDF</button></div></>}
    <div role="status">{status}</div></section>
    <aside className={s.preview}><div className={s.cover}><FileText size={18}/><div className={s.tag}>Live preview</div><h3>{values.project?.trim()||spec.output}</h3></div>
    {report.stat&&<div className={s.stat}><strong>{report.stat[0]}</strong><span>{report.stat[1]}</span></div>}
    {chart.length>0 && <div className={s.chart}>{chart.map(({label,value,display},i)=><div key={i}><div className={s.chartLabel}><span>{label}</span><strong>{display}</strong></div><div className={s.track}><i style={{width:(100*value/Math.max(1,...chart.map(r=>r.value)))+"%"}}/></div></div>)}</div>}
    {preview.length===0 && !report.problem && <p className={s.notice}>Your answers will appear here as you work.</p>}
    {report.problem && <p className={s.notice}>{report.problem}</p>}
    {preview.map(([title,body])=><div className={s.slice} key={title}><h4>{title}</h4><p>{body}</p></div>)}{!review&&<button className={s.open} onClick={()=>go(spec.steps.length)}>See full output <ArrowRight size={14}/></button>}</aside></div></div>;
}
