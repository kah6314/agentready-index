const PFX='/agentready-index';
const LABELS={bot_access:['Bot access',20],agent_checkout:['Agent checkout',20],structured_paths:['Structured/API/MCP',20],email:['Email',10],sms:['Text/SMS',10],live_chat:['Live chat',10],book_online:['Book online/text',10]};
let data=[],key='total',dir=-1,cat='';
const $=s=>document.querySelector(s),tb=$('#t tbody');
const val=(s,k)=>k==='bot'?s.subscores.bot_access:k==='agent'?s.subscores.bot_access+s.subscores.agent_checkout+s.subscores.structured_paths:k==='chan'?s.subscores.email+s.subscores.sms+s.subscores.live_chat+s.subscores.book_online:s[k];
function el(t,p={},...c){const e=document.createElement(t);Object.assign(e,p);e.append(...c);return e}
function render(){
  const rows=data.filter(s=>!cat||s.category===cat).sort((a,b)=>{const x=val(a,key),y=val(b,key);return (x>y?1:x<y?-1:0)*dir||a.name.localeCompare(b.name)});
  tb.textContent='';$('#count').textContent=rows.length+' platforms';
  rows.forEach((s,i)=>{
    const tr=el('tr',{className:'row',tabIndex:0});tr.setAttribute('aria-expanded','false');
    tr.append(el('td',{className:'num'},String(i+1)),el('td',{},el('span',{className:'chev'},'▸ '),el('a',{href:PFX+'/stores/'+s.id+'.html',onclick:ev=>ev.stopPropagation()},s.name)),
      el('td',{className:'hide-sm'},s.category),el('td',{className:'num hide-sm'},String(val(s,'bot'))),
      el('td',{className:'num hide-sm'},String(val(s,'agent'))),el('td',{className:'num hide-sm'},String(val(s,'chan'))));
    const bar=el('div',{className:'bar'},el('i'));bar.firstChild.style.width=s.total+'%';
    tr.append(el('td',{className:'num total'},String(s.total),bar));
    const dt=el('tr',{className:'detail'});dt.hidden=true;
    const ul=el('ul',{className:'sub'});
    for(const k in LABELS)ul.append(el('li',{},LABELS[k][0],el('b',{},s.subscores[k]+'/'+LABELS[k][1])));
    const ev=el('ul',{className:'ev'});
    s.evidence.forEach(e=>ev.append(el('li',{},el('a',{href:e.url,target:'_blank',rel:'noopener'},e.label))));
    dt.append(el('td',{colSpan:7},el('p',{},s.notes),ul,el('strong',{},'Evidence'),ev,el('p',{className:'mut'},'Status: '+s.status+' · '+s.date)));
    const tog=()=>{dt.hidden=!dt.hidden;tr.classList.toggle('open',!dt.hidden);tr.setAttribute('aria-expanded',String(!dt.hidden))};
    tr.onclick=tog;tr.onkeydown=e=>{if(e.target!==tr)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();tog()}};
    tb.append(tr,dt);
  });
}
fetch(PFX+'/data/sites.json').then(r=>r.json()).then(d=>{
  data=d;const sel=$('#cat');[...new Set(d.map(s=>s.category))].sort().forEach(c=>sel.append(el('option',{value:c},c)));
  sel.onchange=()=>{cat=sel.value;render()};
  document.querySelectorAll('th button').forEach(b=>b.onclick=()=>{const k=b.dataset.k;dir=key===k?-dir:(k==='name'||k==='category'?1:-1);key=k;render()});
  render();
}).catch(()=>{tb.textContent='Could not load data (serve over http, not file://).'});
