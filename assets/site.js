// Eyes Bot. A história, os clientes, os projetos, o como funciona e o contato saem da posição da página.
const IC={chat:'M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5z',cal:'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',users:'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20a6 6 0 0 1 12 0M16 11a3 3 0 1 0 0-6M22 20a6 6 0 0 0-5-5.9',mail:'M3 5h18v14H3zM3 7l9 6 9-6',box:'M4 7l8-4 8 4v10l-8 4-8-4zM4 7l8 4 8-4M12 11v10',bank:'M3 10l9-6 9 6M5 10v8M10 10v8M14 10v8M19 10v8M3 20h18',table:'M3 5h18v14H3zM3 10h18M3 15h18M9 5v14',chart:'M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6',bot:'M5 8h14v11H5zM12 4v4M9 13h.01M15 13h.01',gear:'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 3v3M12 18v3M3 12h3M18 12h3',grid:'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',plus:'M12 5v14M5 12h14'};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const NS='http://www.w3.org/2000/svg';
const el=(t,a={},p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;};
const txt=(p,a,s)=>{const t=el('text',a,p);t.textContent=s;return t;};

// WhatsApp do Felipe, com a mensagem já começada
const WA='5511950506530',WA_TXT='Olá! Vim pelo site e quero falar com o time de IA da Eyes Bot.';
const waURL=t=>'https://wa.me/'+WA+'?text='+encodeURIComponent(t);
$$('[data-wa]').forEach(a=>a.href=waURL(WA_TXT));

// no celular os desenhos têm outra arrumação e letra maior; no computador a rolagem é macia
const MQ=matchMedia('(max-width:860px)'),MOB=MQ.matches;
MQ.addEventListener('change',()=>location.reload());
// no celular cada pedido e cada passo pede um deslize mais curto
if(MOB){$('#historia').style.height='485vh';$('#projetos').style.height='415vh';$('#como').style.height='280vh';}
const COARSE=matchMedia('(pointer:coarse)').matches,RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis=null;
if(!COARSE&&!RM&&window.Lenis){lenis=new Lenis({lerp:.14,virtualScroll:e=>wheelGate(e)});const raf=t=>{lenis.raf(t);requestAnimationFrame(raf);};requestAnimationFrame(raf);}
const pageY=e=>e.getBoundingClientRect().top+scrollY;
const veil=$('#veil');
function jump(y){if(lenis)lenis.scrollTo(y,{immediate:true,force:true});else{document.documentElement.style.scrollBehavior='auto';scrollTo(0,y);}}
// perto: desliza; longe (mais de 3 telas): corte rápido, sem passar por todos os pedidos
function go(y){y=Math.max(0,Math.round(y));
  if(Math.abs(y-scrollY)>innerHeight*3&&!RM){veil.classList.add('on');setTimeout(()=>{jump(y);requestAnimationFrame(()=>{onScroll();setTimeout(()=>veil.classList.remove('on'),90);});},210);return;}
  if(lenis)lenis.scrollTo(y,{duration:Math.min(1.8,.8+Math.abs(y-scrollY)/4000),easing:t=>1-Math.pow(1-t,4)});else scrollTo({top:y,behavior:RM?'auto':'smooth'});}
// a posição de cada parada dentro de uma faixa presa (a primeira é o começo da faixa)
const stopY=(sec,k,N)=>pageY(sec)+(k===0?0:(sec.offsetHeight-innerHeight)*(k+.5)/N);
// clique num link da página: desliza até lá, e o menu de cima já mostra o destino durante a viagem
let navHold=null;
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;
  const id=a.getAttribute('href').slice(1),t=document.getElementById(id);if(!t)return;e.preventDefault();closeMenu();
  const sec=t.closest('#historia,#clientes,#projetos,#como,#contato');if(sec){navHold={id:sec.id,until:performance.now()+2600};setCur(sec.id);}
  try{history.replaceState(null,'','#'+id);}catch(_){}
  go(pageY(t));});

// menu do celular: abre em cartões a partir da barra de baixo
const menu=$('#menu'),scrim=$('#scrim');
function openMenu(){menu.classList.add('on');scrim.classList.add('on');['where','mb'].forEach(i=>$('#'+i).setAttribute('aria-expanded',true));$('#mb').textContent='Fechar';setTimeout(()=>{const a=$('#mlist a.on')||$('#mlist a');a&&a.focus({preventScroll:true});},60);}
function closeMenu(){if(!menu.classList.contains('on'))return;menu.classList.remove('on');scrim.classList.remove('on');['where','mb'].forEach(i=>$('#'+i).setAttribute('aria-expanded',false));$('#mb').textContent='Menu';}
const toggleMenu=()=>menu.classList.contains('on')?closeMenu():openMenu();
// no contato, a barra de baixo vira "voltar ao topo": um toque e a pessoa está no começo
$('#where').onclick=()=>cur==='contato'&&!menu.classList.contains('on')?go(0):toggleMenu();$('#mb').onclick=toggleMenu;scrim.onclick=closeMenu;
addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});

// no computador, clientes, projetos e como funciona mostram só a área que o desenho usa (v), para a letra ficar maior
const vb=(svg,w,h,v)=>svg.setAttribute('viewBox',v?v.join(' '):'0 0 '+w+' '+h);
// nó no centro pos, com giro r (solto fica torto, ligado fica reto)
const tf=(p,W,H,r=0)=>'translate('+p[0]+'px,'+p[1]+'px) rotate('+r+'deg) translate('+(-W/2)+'px,'+(-H/2)+'px)';
const place=(g,p,W,H,r=0)=>{g.style.transform=tf(p,W,H,r);};
function node(svg,label,icon,pos,o,cls='node'){const g=el('g',{class:cls},svg);place(g,pos,o.W,o.H);
  el('rect',{width:o.W,height:o.H,rx:Math.round(o.H*.26)},g);const sc=o.fs/15;
  el('path',{d:IC[icon],class:'ic',transform:'translate('+Math.round(o.H*.3)+','+(o.H/2-12*sc)+') scale('+sc+')'},g);
  txt(g,{x:Math.round(o.H*.3+24*sc+10),y:o.H/2+o.fs*.36,'font-size':o.fs},label);return g;}
function hub(svg,a,b,pos,r,fs=MOB?24:17){const g=el('g',{class:'hub'},svg);g.style.transform='translate('+pos[0]+'px,'+pos[1]+'px) scale(0)';
  el('circle',{r:r*1.48,class:'g'},g);el('circle',{r,class:'c'},g);const t=txt(g,{y:-2,'font-size':fs},a);const s=txt(g,{y:MOB?22:20,class:'s','font-size':MOB?16:14},b);return {g,s,t};}
function wire(svg,d,cls='wire'){const p=el('path',{class:cls,d},svg);const L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;p.dataset.l=L;return p;}
const line=(a,b)=>'M'+a[0]+' '+a[1]+' L'+b[0]+' '+b[1];
const wrap=(s,max)=>{const ls=[];let a='';s.split(' ').forEach(w=>{if(a&&(a+' '+w).length>max){ls.push(a);a=w;}else a=a?a+' '+w:w;});ls.push(a);return ls;};

// ---------- história: cada pedido mostra o problema na ferramenta e a ligação que resolve ----------
const P=[
 {nome:'Atendimento',liga:['whats','agenda'],tp:'Cliente esperando',ts:'Responde 24 horas'},
 {nome:'Orçamentos',liga:['crm'],tp:'Orçamento parado',ts:'Retoma em 2, 5 e 10 dias'},
 {nome:'Pedidos',liga:['email','erp'],tp:'Digitado de novo',ts:'Do e-mail ao ERP'},
 {nome:'Financeiro',liga:['banco'],tp:'Conferido na mão',ts:'Confere e cobra'},
 {nome:'Painel',liga:['planilha','painel'],tp:'Planilha manual',ts:'Painel que responde'}
];
const TOOLS={whats:['WhatsApp','chat'],agenda:['Agenda','cal'],crm:['CRM','users'],email:['E-mail','mail'],erp:['ERP','box'],banco:['Banco','bank'],planilha:['Planilha','table'],painel:['Painel','chart']};
const ORDER=['whats','agenda','crm','email','erp','banco','planilha','painel'];
const MESS=[['whats','erp'],['agenda','banco'],['crm','planilha'],['email','whats'],['erp','crm'],['planilha','banco'],['agenda','email'],['crm','banco'],['whats','planilha']];
// soltos ficam fora do lugar que os já ligados ocupam na roda: [x, y, giro]; no celular o desenho é mais largo que alto
const S=MOB?{w:600,h:470,hub:[300,235],R:222,ry:.66,r:64,N:{W:150,H:50,fs:18},tfs:17,up:10,gap:4,down:6,bend:60,
   loose:{whats:[110,40,-4],agenda:[480,40,4],crm:[520,300,-4],email:[470,430,3],erp:[290,440,-3],banco:[110,420,4],planilha:[95,150,4],painel:[148,132,0]}}
 :{w:1000,h:800,hub:[500,410],R:290,ry:.86,r:74,N:{W:164,H:50,fs:16},tfs:17,up:14,gap:8,down:18,bend:110,
   loose:{whats:[170,160,-6],agenda:[790,110,5],crm:[900,300,-4],email:[820,690,4],erp:[560,740,-3],banco:[300,720,5],planilha:[120,520,-5],painel:[295,234,0]}};
const LOOSE=S.loose,HUB=S.hub;
const RING={};ORDER.forEach((k,i)=>{const a=-Math.PI/2+i/ORDER.length*Math.PI*2;RING[k]=[HUB[0]+Math.cos(a)*S.R,HUB[1]+Math.sin(a)*S.R*S.ry];});
// ao abrir, o desenho já nasce no estado da parada, sem animar a partir do zero (fios que acendiam e recolhiam)
const net=$('#net');vb(net,S.w,S.h);net.classList.add('boot');
const mess=MESS.map(([a,b])=>el('path',{class:'mess',d:'M'+LOOSE[a][0]+' '+LOOSE[a][1]+' Q '+(LOOSE[a][0]+LOOSE[b][0])/2+' '+((LOOSE[a][1]+LOOSE[b][1])/2-S.bend)+' '+LOOSE[b][0]+' '+LOOSE[b][1]},net));
const ring=el('ellipse',{class:'ring',cx:HUB[0],cy:HUB[1],rx:S.R,ry:S.R*S.ry},net);ring.style.opacity=0;
const wires={};ORDER.forEach(k=>{wires[k]=wire(net,line(HUB,RING[k]));});
const pkts={};ORDER.forEach(k=>{const c=el('circle',{r:MOB?5:4,class:'pkt'},net);el('animateMotion',{dur:(2.2+Math.random()).toFixed(2)+'s',repeatCount:'indefinite',path:line(RING[k],HUB)},c);c.style.opacity=0;pkts[k]=c;});
// no centro fica a empresa, com tudo o que a gente monta ligado a ela (a Eyes Bot é quem liga, não o centro)
const H1=hub(net,'Sua empresa','',HUB,S.r,MOB?19:17);
const nodes={};ORDER.forEach(k=>{nodes[k]=node(net,TOOLS[k][0],TOOLS[k][1],LOOSE[k],S.N);});
// a legenda da abertura fica no meio do desenho, onde o sistema vai nascer
const capG=el('g',{class:'capg'},net),CFS=MOB?19:17,CAP='HOJE: NADA CONVERSA COM NADA',CW=CAP.length*CFS*.66+36;
el('rect',{class:'bk',x:HUB[0]-CW/2,y:HUB[1]-CFS*1.05,width:CW,height:CFS*2.1,rx:9},capG);
txt(capG,{x:HUB[0],y:HUB[1]+CFS*.36,'font-size':CFS,'text-anchor':'middle'},CAP);
// a etiqueta do pedido: o problema (laranja, depois riscado) e o que a ligação faz (verde), com fundo da cor da página
const tags=P.map(p=>{const g=el('g',{class:'tag'},net);const fs=S.tfs;const bk=el('rect',{class:'bk',rx:6},g);
  const tp=txt(g,{class:'tp',y:0,'font-size':fs},p.tp),ts=txt(g,{class:'ts',y:fs+S.gap,'font-size':fs},p.ts);
  const stk=el('line',{class:'stk',y1:-fs*.32,y2:-fs*.32},g);return {g,bk,tp,ts,stk};});
// a etiqueta fica do lado de fora da roda (acima dos nós de cima, abaixo dos de baixo), longe do fio que chega no nó
function placeTag(t,pos,solved){const fs=S.tfs,H=S.N.H,wp=t.tp.getComputedTextLength()||fs*9,wid=Math.max(wp,t.ts.getComputedTextLength()||fs*9);
  const above=pos[1]-H/2-S.up-fs-S.gap,below=pos[1]+H/2+S.down+fs;
  const fitsA=above-fs>=4,fitsB=below+fs+S.gap<=S.h-4;
  const y=pos[1]>=HUB[1]-10?(fitsB?below:above):(fitsA?above:below);
  const out=y===below&&Math.abs(pos[0]-HUB[0])>60?Math.sign(pos[0]-HUB[0])*40:0;
  const x=Math.min(S.w-8-wid/2,Math.max(8+wid/2,pos[0]+out));
  t.stk.setAttribute('x1',-wp/2);t.stk.setAttribute('x2',wp/2);t.stk.style.strokeDasharray=wp;
  for(const [k,v] of Object.entries({x:-wid/2-8,y:-fs-4,width:wid+16,height:fs*2+S.gap+12}))t.bk.setAttribute(k,v);
  const fresh=!t.g.classList.contains('show');if(fresh){t.g.style.transition='none';t.stk.style.transition='none';}
  t.g.style.transform='translate('+x+'px,'+y+'px)';t.stk.style.strokeDashoffset=solved?0:wp;
  if(fresh){t.g.getBoundingClientRect();t.g.style.transition='';t.stk.style.transition='';}}

function railInto(box,names,onPick){box.innerHTML=names.map((n,i)=>'<button data-j="'+i+'" data-k="0'+(i+1)+'" aria-label="'+n+'"><s><i></i></s><span>'+n+'</span></button>').join('');
  [...box.children].forEach(b=>b.onclick=()=>onPick(+b.dataset.j));return [...box.querySelectorAll('s i')];}
// salto pelo trilho: os pedidos do meio não aparecem no caminho, a história vai direto ao escolhido
let storyHold=null;
const railFill=railInto($('#ri'),P.map(p=>p.nome),j=>{storyHold={k:j+1,until:performance.now()+2400};go(stopY($('#historia'),j+1,7));});

let step=-1,solveT=0;
function setStep(s){if(s===step)return;step=s;clearTimeout(solveT);
  $$('#slides .sl').forEach(a=>a.classList.toggle('on',+a.dataset.s===s));
  $('#rail').classList.toggle('vis',s>=1);$('#hint').classList.toggle('off',s>=1);
  $$('#ri button').forEach((b,i)=>b.classList.toggle('on',i+1===s));
  capG.classList.toggle('on',s===0);
  draw(s,false);
  // primeiro aparece o problema; um instante depois, a ligação resolve
  if(s>=1&&s<=5)solveT=setTimeout(()=>draw(s,true),RM?0:850);
  where();}
function draw(s,solvedNow){
  const act=new Set(s>=1&&s<=5?P[s-1].liga:[]),linked=new Set();
  P.forEach((p,i)=>{if(i+1<s||s>=6||(i+1===s&&solvedNow))p.liga.forEach(k=>linked.add(k));});
  const focus=s>=1&&s<=5;
  ORDER.forEach(k=>{const on=linked.has(k),g=nodes[k],L=LOOSE[k];place(g,on?RING[k]:L,S.N.W,S.N.H,on?0:L[2]);
    g.classList.toggle('on',on);g.classList.toggle('loose',!on);g.classList.toggle('prob',act.has(k)&&!on);
    g.classList.toggle('dim',focus&&!act.has(k));g.classList.toggle('hide',k==='painel'&&!on);
    wires[k].style.strokeDashoffset=on?0:wires[k].dataset.l;wires[k].classList.toggle('dim',focus&&!act.has(k));pkts[k].style.opacity=on?(focus&&!act.has(k)?.4:1):0;});
  // o centro só nasce com a primeira ligação
  H1.g.style.transform='translate('+HUB[0]+'px,'+HUB[1]+'px) scale('+(linked.size?(s>=6?1.12:1):0)+')';
  H1.s.textContent=s>=6?'Tudo ligado':s>=1?linked.size+(MOB?' de 8':' de 8 ligadas'):'';
  mess.forEach((m,i)=>{const [a,b]=MESS[i];m.style.opacity=linked.has(a)||linked.has(b)?0:1;m.classList.toggle('hot',act.has(a)||act.has(b));});
  ring.style.opacity=s>=6?1:0;
  // a etiqueta do pedido não some: chega com o problema em laranja e, na ligação, viaja junto com o nó até a roda,
  // o problema fica riscado e legível e a solução entra embaixo. No fim, as 5 ficam em volta: o antes e o agora juntos.
  tags.forEach((t,i)=>{const k=P[i].liga[0],cur=i+1===s,fin=s>=6;
    if(!cur&&!fin){t.g.classList.remove('show','solved','fin');return;}
    const solved=fin||solvedNow;t.g.classList.toggle('fin',fin);
    placeTag(t,linked.has(k)?RING[k]:LOOSE[k],solved);t.g.classList.add('show');t.g.classList.toggle('solved',solved);});}

// ---------- clientes: os 3 tipos à esquerda, as 17 empresas à direita; rolando, cada tipo acende a sua vez ----------
// quem ainda não mandou logo aparece com as iniciais no lugar dele (4º campo)
const CL=[['Redimagem','redimagem','w'],['Melina Kichler Dermatologia','melina','w'],['Sindicred','sindicred','w'],['Aquatez Dermatologia','aquatez','w'],['IESB Centro Universitário','iesb','w'],['Yah Church','yah','w'],['BF Engenharia e Serviço','bf','wa'],['Bernartt Advogados','bernartt','as'],['Casco Comércio Exterior','casco','as'],['Roveda & Marcelino Advogados','roveda','as'],['Zarpellon','zarpellon','as'],['Autoseg Seguros','autoseg','as'],['Clinimercês','clinimerces','a'],['GEL Engenharia','gel','a'],['Grupo Stabia','stabia','a'],['Welcome Corp','welcometrip','s'],['Longeva Investimentos','longeva','s']];
const logoOr=(g,c,x,y,w,h)=>{if(!c[3]){el('image',{href:'assets/clientes/'+c[1]+'.webp',x,y,width:w,height:h,preserveAspectRatio:'xMidYMid meet'},g);return;}
  const bw=Math.min(w,h*2.4);el('rect',{class:'nolg',x:x+(w-bw)/2,y,width:bw,height:h,rx:Math.round(h*.22)},g);txt(g,{class:'nolt',x:x+w/2,y:y+h/2+h*.17,'font-size':Math.round(h*.56),'text-anchor':'middle'},c[3]);};
const TY={w:['Agente no WhatsApp','bot','WhatsApp','Agentes que atendem, tiram dúvidas e agendam clientes 24 horas por dia.'],a:['Automação','gear','Automação','Tarefas repetidas rodando sozinhas, sem planilha e sem retrabalho.'],s:['Sistema sob medida','grid','Sistema','Sistemas criados do zero, do jeito que cada empresa trabalha.']};
const FK=['','w','a','s'];
const C=MOB?{w:600,h:516,tx:88,ty:{w:120,a:262,s:404},N:{W:156,H:46,fs:17},rx:232,y0:24,dy:28.5,fs:17,logo:0}
 :{w:1000,h:800,tx:170,ty:{w:230,a:420,s:610},N:{W:220,H:52,fs:16},rx:470,y0:96,dy:41,fs:17,logo:1,v:[40,56,830,740]};
const cn=$('#cnet');vb(cn,C.w,C.h,C.v);const cw=[],crow=[];
const cy=i=>C.y0+i*C.dy;
CL.forEach((c,i)=>[...c[2]].forEach(t=>{const x0=C.tx+C.N.W/2,y0=C.ty[t],x1=C.rx-6,y1=cy(i),m=(x0+x1)/2;
  const p=wire(cn,'M'+x0+' '+y0+' C '+m+' '+y0+' '+m+' '+y1+' '+x1+' '+y1);p.dataset.t=t;p.style.transitionDelay=(.035*i)+'s';cw.push(p);}));
const tnodes={};Object.entries(TY).forEach(([k,t])=>{tnodes[k]=node(cn,MOB?t[2]:t[0],t[1],[C.tx,C.ty[k]],C.N);});
CL.forEach((c,i)=>{const g=el('g',{class:'cli'},cn);el('circle',{cx:C.rx,cy:cy(i),r:MOB?4.5:3.5},g);
  if(C.logo)logoOr(g,c,C.rx+16,cy(i)-11,84,22);
  txt(g,{x:C.rx+(C.logo?114:16),y:cy(i)+C.fs*.36,'font-size':C.fs},c[0]);crow.push(g);});
let filt='',cliOn=0,cliAuto=-1;
// depois de um toque, a página desliza até a vez escolhida; enquanto desliza, a rolagem não troca a escolha
let hold=null;const holdFor=(id,k)=>{hold={id,k,until:performance.now()+2200};};
function setFilt(f){filt=f;$$('#filt button').forEach(x=>x.classList.toggle('on',x.dataset.f===f));
  $('#fdesc').textContent=f?TY[f][3]:'Toda empresa aqui recebeu pelo menos um destes três.';drawCli();where();}
$$('#filt button').forEach(b=>b.onclick=()=>{const k=FK.indexOf(b.dataset.f);cliAuto=k;holdFor('clientes',k);setFilt(b.dataset.f);go(stopY($('#clientes'),k,4));});
// o que não é do filtro fica bem apagado, mas no lugar: a ligação toda continua à vista
function drawCli(){cw.forEach(w=>{const on=!filt||w.dataset.t===filt;w.style.strokeDashoffset=cliOn?0:w.dataset.l;w.style.opacity=on?1:.08;});
  crow.forEach((g,i)=>g.classList.toggle('dim',!!filt&&!CL[i][2].includes(filt)));
  Object.entries(tnodes).forEach(([k,g])=>{g.classList.toggle('on',!!cliOn&&(!filt||filt===k));g.classList.toggle('off',!!filt&&filt!==k);});}

// ---------- projetos: o setor escolhido acende quem montou o quê ----------
const SECT=[['Saúde',['melina','aquatez','clinimerces','redimagem']],['Escritórios de advocacia',['bernartt','roveda']],['Engenharia',['bf','gel']],['Comércio exterior',['casco']],['Educação e comunidade',['iesb','yah']],['Turismo e eventos',['welcometrip','stabia']],['Outros setores',['sindicred','zarpellon','longeva','autoseg']]];
$('#sect').innerHTML=SECT.map((s,i)=>'<li data-i="'+i+'" tabindex="0" role="button"><i></i>'+s[0]+'<em>'+s[1].length+'</em></li>').join('');
const pn=$('#pnet');let sel=-1,projAuto=-1;
// os cartões do setor numa fileira, com os serviços embaixo; com mais cartões, duas fileiras e os serviços no meio delas:
// a de cima liga para baixo, a de baixo para cima, e nenhum fio passa por baixo de outro cartão
const rowsOf=(n,per)=>{const r=Math.ceil(n/per),out=[];let j=0;for(let k=0;k<r;k++){const c=Math.ceil((n-j)/(r-k));out.push(c);j+=c;}return out;};
const PJ=MOB?{w:560,h:600,tt:[280,52,32],sub:[280,82,15],nfs:16,N:{W:170,H:48,fs:15},
   lay:n=>{if(n<=2)return {pos:Array.from({length:n},(_,j)=>[n===1?280:j?410:150,220]),cH:104,cW:240,max:24,pt:{w:[95,530],a:[280,530],s:[465,530]}};
     const pos=[];rowsOf(n,3).forEach((c,k)=>{for(let j=0;j<c;j++)pos.push([280+(j-(c-1)/2)*186,k?460:180]);});
     return {pos,cH:112,cW:172,max:16,pt:{w:[95,320],a:[280,320],s:[465,320]}};}}
 :{w:1000,h:800,v:[30,66,940,654],tt:[500,120,30],sub:[500,150,15],nfs:16,N:{W:224,H:52,fs:16},
   lay:n=>{const r=rowsOf(n,4),pos=[];r.forEach((c,k)=>{for(let j=0;j<c;j++)pos.push([500+(j-(c-1)/2)*235,r.length===1?340:k?625:285]);});
     return {pos,cH:100,cW:210,max:22,pt:r.length===1?{w:[220,630],a:[500,670],s:[780,630]}:{w:[220,455],a:[500,455],s:[780,455]}};}};
vb(pn,PJ.w,PJ.h,PJ.v);
function showSect(i){if(i===sel)return;sel=i;$$('#sect li').forEach(l=>l.classList.toggle('on',+l.dataset.i===i));
  if(MOB){const li=$('#sect li[data-i="'+i+'"]'),ul=$('#sect');ul.scrollTo({left:li.offsetLeft-20,behavior:RM?'auto':'smooth'});}
  pn.innerHTML='';const s=SECT[i],cl=s[1].map(f=>CL.find(c=>c[1]===f));
  txt(pn,{x:PJ.tt[0],y:PJ.tt[1],class:'ttl','font-size':PJ.tt[2]},s[0]);
  txt(pn,{x:PJ.sub[0],y:PJ.sub[1],class:'capt','font-size':PJ.sub[2]},(cl.length>1?cl.length+' clientes':'1 cliente')+' · O que a gente montou');
  const L=PJ.lay(cl.length),pos=L.pos,cH=L.cH,PT=L.pt,used=new Set(cl.flatMap(c=>[...c[2]]));
  cl.forEach((c,j)=>[...c[2]].forEach(k=>{const dn=pos[j][1]<PT[k][1],a=[pos[j][0],pos[j][1]+(dn?cH:-cH)/2],b=[PT[k][0],PT[k][1]+(dn?-PJ.N.H:PJ.N.H)/2],m=(a[1]+b[1])/2;
    const w=wire(pn,'M'+a[0]+' '+a[1]+' C '+a[0]+' '+m+' '+b[0]+' '+m+' '+b[0]+' '+b[1]);requestAnimationFrame(()=>requestAnimationFrame(()=>{w.style.strokeDashoffset=0;}));}));
  Object.entries(TY).forEach(([k,ty])=>{const g=node(pn,MOB?ty[2]:ty[0],ty[1],PT[k],PJ.N);g.classList.toggle('on',used.has(k));g.classList.toggle('off',!used.has(k));});
  cl.forEach((c,j)=>{const [x,y]=pos[j],g=el('g',{class:'card'},pn);
    const lh=34,top=y-cH/2+12,lw=Math.min(140,L.cW-24);
    el('rect',{x:x-L.cW/2,y:y-cH/2,width:L.cW,height:cH,rx:14},g);
    logoOr(g,c,x-lw/2,top,lw,lh);
    const ls=wrap(c[0],L.max).slice(0,2),ny=top+lh+(ls.length>1&&cH<110?16:20);ls.forEach((ln,k)=>txt(g,{x,y:ny+k*(PJ.nfs+2),'font-size':PJ.nfs},ln));});where();}
const pickSect=i=>{projAuto=i;holdFor('projetos',i);showSect(i);go(stopY($('#projetos'),i,SECT.length));};
$$('#sect li').forEach(l=>{l.onclick=()=>pickSect(+l.dataset.i);l.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pickSect(+l.dataset.i);}};});

// ---------- como funciona: três cenas no mesmo desenho ----------
// 1. você conta: a mensagem é escrita e viaja pelo fio até o centro; 2. a gente monta: as ferramentas chegam e se ligam;
// 3. funciona e evolui: o sistema roda sozinho e uma parte nova se encaixa
const FX=MOB?{w:600,h:470,hub:[332,235],r:56,R:196,ry:.62,N:{W:130,H:44,fs:16},you:[76,235],yN:{W:112,H:44,fs:16},
   bub:{x:12,y:30,w:300,h:100,fs:18,l:['Preciso que o WhatsApp','responda sozinho.']},feed:{x:12,y:381,w:300,h:86,fs:16,rh:24,r0:50,n:2}}
 :{w:1000,h:800,hub:[600,400],r:74,R:242,ry:.78,N:{W:150,H:50,fs:16},you:[170,400],yN:{W:150,H:50,fs:16},
   bub:{x:36,y:200,w:360,h:124,fs:21,l:['Preciso que o WhatsApp','responda aos clientes sozinho.']},feed:{x:28,y:578,w:304,h:150,fs:16,rh:30,r0:60,n:3},v:[-10,130,965,624]};
const fn=$('#fnet');vb(fn,FX.w,FX.h,FX.v);
// a grade de fundo, discreta: a planta do que está sendo montado
const defs=el('defs',{},fn);const pat=el('pattern',{id:'dots',width:24,height:24,patternUnits:'userSpaceOnUse'},defs);el('circle',{cx:2,cy:2,r:1,fill:'rgba(255,255,255,.07)'},pat);
el('rect',{class:'grid',x:0,y:0,width:FX.w,height:FX.h,fill:'url(#dots)'},fn);
const slot=a=>[FX.hub[0]+Math.cos(a*Math.PI/180)*FX.R,FX.hub[1]+Math.sin(a*Math.PI/180)*FX.R*FX.ry];
el('ellipse',{class:'ghost',cx:FX.hub[0],cy:FX.hub[1],rx:FX.R,ry:FX.R*FX.ry},fn);
const FT=[['whats',-90],['agenda',-45],['crm',0],['email',45],['erp',90],['planilha',135]];
// fios das ferramentas e os pacotes que correm por eles quando o sistema roda
const fw=FT.map(([k,a],i)=>{const w=wire(fn,line(FX.hub,slot(a)),'wire tw');return w;});
FT.forEach(([k,a])=>{const c=el('circle',{r:MOB?4.5:4,class:'pkt tpk'},fn);el('animateMotion',{dur:(1.8+Math.random()*.9).toFixed(2)+'s',repeatCount:'indefinite',path:line(slot(a),FX.hub)},c);c.style.opacity=0;});
const novoPos=slot(225);el('path',{class:'wire nw2',d:line(FX.hub,novoPos)},fn);
// você e o fio até o centro
const yRight=[FX.you[0]+FX.yN.W/2,FX.you[1]],hubLeft=[FX.hub[0]-FX.r,FX.hub[1]];
const yw=wire(fn,line(yRight,hubLeft),'wire');
const msgDot=el('circle',{r:MOB?6:6,class:'pkt'},fn);msgDot.style.opacity=0;
const msgMove=el('animateMotion',{dur:'.9s',begin:'indefinite',fill:'freeze',path:line(yRight,hubLeft)},msgDot);
const you=node(fn,'Você','user',FX.you,FX.yN);you.classList.add('on');
// no centro, o seu pedido, que vira o seu sistema
const H3=hub(fn,'Seu pedido','Escutando',FX.hub,FX.r,17);H3.g.style.transform='translate('+FX.hub[0]+'px,'+FX.hub[1]+'px) scale(1)';
const arcR=FX.r+12,arcL=2*Math.PI*arcR;
const arc=el('circle',{class:'arc',cx:FX.hub[0],cy:FX.hub[1],r:arcR,transform:'rotate(-90 '+FX.hub[0]+' '+FX.hub[1]+')'},fn);arc.style.strokeDasharray=arcL;arc.style.strokeDashoffset=arcL;
// as ferramentas chegam de fora do desenho e se encaixam em volta do centro
const ftools=FT.map(([k,a],i)=>{const p=slot(a),far=[FX.hub[0]+(p[0]-FX.hub[0])*2.1,FX.hub[1]+(p[1]-FX.hub[1])*2.1];
  const g=node(fn,TOOLS[k][0],TOOLS[k][1],p,FX.N,'node tool on');g.style.setProperty('--to',tf(p,FX.N.W,FX.N.H));g.style.setProperty('--from',tf(far,FX.N.W,FX.N.H,(i%2?8:-8)));g.style.transform='var(--from)';return g;});
const novo=el('g',{class:'novo'},fn);novo.style.transform=tf(novoPos,FX.N.W,FX.N.H);
el('rect',{width:FX.N.W,height:FX.N.H,rx:Math.round(FX.N.H*.26)},novo);txt(novo,{x:FX.N.W/2,y:FX.N.H/2+FX.N.fs*.36,'font-size':FX.N.fs,'text-anchor':'middle'},'+ Nova parte');
// o pedido escrito por você
const B=FX.bub,bub=el('g',{class:'bub'},fn);
el('rect',{x:B.x,y:B.y,width:B.w,height:B.h,rx:16},bub);txt(bub,{class:'who',x:B.x+18,y:B.y+26,'font-size':15},'VOCÊ');
const bl=B.l.map((s,i)=>txt(bub,{x:B.x+18,y:B.y+58+i*(B.fs+8),'font-size':B.fs},''));
const caret=el('rect',{class:'caret',width:2,height:B.fs+2},bub);
// o sistema rodando: o que aconteceu agora há pouco, um embaixo do outro
const F=FX.feed,feed=el('g',{class:'feed'},fn);
el('rect',{class:'bx',x:F.x,y:F.y,width:F.w,height:F.h,rx:16},feed);txt(feed,{class:'fh',x:F.x+18,y:F.y+24,'font-size':14},'RODANDO AGORA');
const clipId='fclip';const cp=el('clipPath',{id:clipId},defs);el('rect',{x:F.x,y:F.y+36,width:F.w,height:F.h-40},cp);
const fwin=el('g',{'clip-path':'url(#'+clipId+')'},feed);
const EV=['Cliente respondido no WhatsApp','Pedido lançado no ERP','Cobrança enviada','Orçamento retomado','Visita confirmada na agenda'];
const rows=[0,1,2,3].map(i=>{const g=el('g',{class:'rw'},fwin);txt(g,{class:'ok',x:F.x+18,y:0,'font-size':F.fs},'✓');const t=txt(g,{x:F.x+40,y:0,'font-size':F.fs},'');return {g,t};});
let evI=0;
function feedLay(anim){rows.forEach((r,i)=>{r.g.style.transition=anim?'':'none';r.g.style.transform='translateY('+(F.y+F.r0+i*F.rh)+'px)';r.g.style.opacity=i<F.n?1:0;r.t.textContent=EV[(evI+i)%EV.length];});}
feedLay(false);
function feedTick(){rows.forEach((r,i)=>{r.g.style.transition='';r.g.style.transform='translateY('+(F.y+F.r0+(i-1)*F.rh)+'px)';r.g.style.opacity=i>=1&&i<=F.n?1:0;});
  setTimeout(()=>{evI=(evI+1)%EV.length;feedLay(false);},650);}
// a sequência de cada cena
let cstep=-1,cT=[],cVis=false;
const later=(f,ms)=>cT.push(setTimeout(f,RM?0:ms));
function clearC(){cT.forEach(clearTimeout);cT=[];}
// o cursor só aparece enquanto a mensagem é escrita
function typeBubble(done){bl.forEach(t=>t.textContent='');let li=0,ci=0;const put=()=>{const t=bl[li],full=B.l[li];t.textContent=full.slice(0,ci);
    const w=t.getComputedTextLength();caret.setAttribute('x',B.x+18+w+3);caret.setAttribute('y',+t.getAttribute('y')-B.fs+2);};
  const fin=()=>{caret.style.display='none';done();};
  if(RM){bl.forEach((t,i)=>t.textContent=B.l[i]);fin();return;}
  caret.style.display='';const tick=()=>{ci++;if(ci>B.l[li].length){li++;ci=0;if(li>=B.l.length){fin();return;}}put();cT.push(setTimeout(tick,30));};tick();}
caret.style.display='none';
function playC(k){clearC();fn.classList.remove('k0','k1','k2');fn.classList.add('k'+k);H3.g.classList.remove('got');
  // ferramentas: entram em sequência na montagem, saem quando volta para a conversa
  ftools.forEach((g,i)=>{g.style.transitionDelay=(k>=1?i*.09:0)+'s';g.style.transform=k>=1?'var(--to)':'var(--from)';});
  fw.forEach((w,i)=>{w.style.transitionDelay=(k>=1?.45+i*.1:0)+'s';w.style.strokeDashoffset=k>=1?0:w.dataset.l;});
  arc.style.strokeDashoffset=k>=1?0:arcL;arc.style.opacity=k>=1?1:0;
  $$('#fnet .tpk').forEach(c=>c.style.opacity=k===2?1:0);
  H3.t.textContent=k===0?'Seu pedido':'Sua solução';
  if(k===0){yw.style.transition='none';yw.style.strokeDashoffset=yw.dataset.l;yw.getBoundingClientRect();yw.style.transition='';H3.s.textContent='Escutando';
    typeBubble(()=>{yw.style.strokeDashoffset=0;later(()=>{msgDot.style.opacity=1;try{msgMove.beginElement();}catch(_){}},700);
      later(()=>{msgDot.style.opacity=0;H3.g.classList.add('got');H3.s.textContent='Entendido';},1650);});}
  else{yw.style.strokeDashoffset=0;bl.forEach((t,i)=>t.textContent=B.l[i]);caret.style.display='none';}
  if(k===1){H3.s.textContent='Montando';later(()=>{H3.s.textContent='Pronto';H3.g.classList.add('got');},2200);}
  if(k===2){H3.s.textContent='Rodando';feedLay(false);const loop=()=>{feedTick();cT.push(setTimeout(loop,RM?99999:1700));};later(loop,1500);}}
function setC(k){if(k===cstep)return;cstep=k;
  $$('#cslides .sl').forEach(a=>a.classList.toggle('on',+a.dataset.c===k));
  $$('#cri button').forEach((b,i)=>{b.classList.toggle('on',i===k);b.classList.toggle('done',i<k);});
  if(cVis)playC(k);where();}
const cFill=railInto($('#cri'),['Você conta','A gente monta','Funciona e cresce'],j=>go(stopY($('#como'),j,3)));

// ---------- contato: a conversa com o assistente ----------
// O agente se liga depois: basta existir window.eyesAgent(mensagens), que recebe [{de:'pessoa'|'assistente',texto}]
// e devolve (ou promete) o texto da resposta. Enquanto ele não existe, a caixa responde a mensagem provisória e
// oferece seguir no WhatsApp com a conversa. Os 3 textos abaixo são provisórios (esperam o ok do Vitor).
const CHAT={oi:'Oi! Me conta o que a sua empresa precisa, ou pergunte como a gente trabalha.',
  sug:['Como vocês trabalham?','Quanto tempo leva?','Atender no WhatsApp com IA','Criar um sistema sob medida','Automatizar planilhas e ERP'],
  prov:'Ainda estou sendo ligado. Enquanto isso, o time responde no WhatsApp.'};
const chl=$('#chl'),chi=$('#chi'),chs=$('#chs'),conv=[];
// a lista desce ao fim deslizando, e não num pulo: depois de o dedo rolar a lista, o pulo deixava o celular
// achando que a lista ainda rolava, e o 1º deslize seguinte não levava a página
const chlEnd=()=>chl.scrollTo({top:chl.scrollHeight,behavior:'smooth'});
function bubble(cls,text){const d=document.createElement('div');d.className='bb '+cls;d.textContent=text;chl.appendChild(d);chlEnd();return d;}
bubble('ag',CHAT.oi);
chs.innerHTML=CHAT.sug.map(s=>'<button type="button">'+s+'</button>').join('');
let chBusy=false;
async function ask(text){text=text.trim();if(!text||chBusy)return;chBusy=true;conv.push({de:'pessoa',texto:text});bubble('eu',text);chi.value='';chs.classList.add('off');
  const dig=bubble('ag dig','');dig.innerHTML='<i></i><i></i><i></i>';dig.setAttribute('aria-label','Digitando');
  let r=null;try{if(typeof window.eyesAgent==='function')r=await window.eyesAgent(conv.slice());}catch(_){r=null;}
  if(!r)await new Promise(f=>setTimeout(f,RM?0:900));dig.remove();chBusy=false;
  if(r){conv.push({de:'assistente',texto:String(r)});bubble('ag',String(r));return;}
  const b=bubble('ag',CHAT.prov),a=document.createElement('a');a.className='btn b1';a.target='_blank';a.rel='noopener';a.textContent='Continuar no WhatsApp →';
  a.href=waURL(WA_TXT+'\n\n'+conv.filter(m=>m.de==='pessoa').map(m=>m.texto).join('\n'));b.appendChild(a);chlEnd();}
$('#chf').addEventListener('submit',e=>{e.preventDefault();ask(chi.value);});
// escrevendo na caixa, Page Up e Page Down não levam a página (o navegador rolaria e deixaria a página entre duas paradas)
chi.addEventListener('keydown',e=>{if(e.key==='PageUp'||e.key==='PageDown')e.preventDefault();});
$$('#chs button').forEach(b=>b.onclick=()=>ask(b.textContent));
// a lista rola sozinha: o gesto de roda ou trackpad que começa nela termina nela, sem levar a página junto.
// Mesmo gesto é o que segue no mesmo sentido sem parar 250 ms (a inércia do trackpad, mesmo com uma travada no meio).
let chT=-1e9,chD=0;
chl.addEventListener('wheel',e=>{if(!e.deltaY)return;const dir=Math.sign(e.deltaY),can=dir<0?chl.scrollTop>0:chl.scrollTop+chl.clientHeight<chl.scrollHeight-1;
  if(!can&&!(dir===chD&&e.timeStamp-chT<250))return;chT=e.timeStamp;chD=dir;e.stopPropagation();if(!can&&e.cancelable)e.preventDefault();},{passive:false});

// ---------- paradas: no toque, o navegador encaixa; no computador, a rolagem macia encaixa depois que a pessoa para ----------
const STOPS=[['historia',7],['clientes',4],['projetos',7],['como',3]];
function snapStops(){const a=[0];STOPS.forEach(([id,N])=>{const s=$('#'+id);for(let k=0;k<N;k++)a.push(stopY(s,k,N));});
  a.push(pageY($('#contato')));a.push(document.documentElement.scrollHeight-innerHeight);return a;}
// no computador, quando a pessoa para entre duas paradas, a página termina o gesto na direção em que ela vinha.
// No toque, o próprio navegador encaixa em cada parada (uma por deslize, sem pular), como num carrossel.
// Do contato para baixo a rolagem é livre: ali é formulário e rodapé, não uma história.
let snapT=0,snapping=false,lastY=scrollY,dirY=0;
const sortedStops=()=>snapStops().sort((a,b)=>a-b);
function buildSnaps(){$$('.snap').forEach(n=>n.remove());if(!COARSE)return;
  STOPS.forEach(([id,N])=>{const s=$('#'+id),tot=s.offsetHeight-innerHeight;for(let k=0;k<N;k++){const i=document.createElement('i');i.className='snap';i.style.top=(k===0?0:tot*(k+.5)/N)+'px';s.appendChild(i);}});
  const c=document.createElement('i');c.className='snap';c.style.top='0';$('#contato').appendChild(c);}
// o encaixe obrigatório vale só até o começo do contato; dali para baixo, rolagem livre
let snapMode='';
function snapZone(){if(!COARSE)return;const m=scrollY<pageY($('#contato'))-2?'y mandatory':'none';if(m!==snapMode){snapMode=m;document.documentElement.style.scrollSnapType=m;}}
function snapNow(){if(menu.classList.contains('on')||document.activeElement===chi)return;
  const y=scrollY,free=pageY($('#contato'))+4;if(y>=free)return;
  const st=sortedStops().filter(s=>s<=free);let prev=st[0],next=st[st.length-1];
  for(const s of st){if(s<=y)prev=s;if(s>=y){next=s;break;}}
  const gap=next-prev;if(gap<4)return;
  // qualquer gesto de verdade (uma volta da roda, uma seta, um deslizar) termina na parada seguinte; tremida pequena volta
  const moved=dirY>0?y-prev:next-y;
  const best=moved>Math.min(24,gap*.04)?(dirY>0?next:prev):(Math.abs(y-prev)<Math.abs(next-y)?prev:next);
  if(Math.abs(best-y)<3)return;
  snapping=true;setTimeout(()=>snapping=false,900);
  lenis.scrollTo(best,{duration:.6,easing:t=>1-Math.pow(1-t,3),onComplete:()=>{snapping=false;}});}
function onAnyScroll(){const y=scrollY;if(Math.abs(y-lastY)>.5)dirY=Math.sign(y-lastY);lastY=y;
  if(snapping||navTo!=null)return;clearTimeout(snapT);snapT=setTimeout(snapNow,110);}
if(lenis)lenis.on('scroll',onAnyScroll);
// no computador, da abertura até o contato, a roda anda de parada em parada: um gesto, uma parada.
// Um gesto novo durante o deslize parte do destino, não do meio do caminho.
let navTo=null,navT=0,lastStep=0;
function stepFrom(dir){const free=pageY($('#contato')),st=sortedStops().filter(s=>s<=free+1),base=navTo!=null?navTo:scrollY;
  return dir>0?st.find(s=>s>base+4):[...st].reverse().find(s=>s<base-4);}
function stepGo(t){navTo=t;lastStep=performance.now();clearTimeout(navT);navT=setTimeout(()=>{navTo=null;snapNow();},1400);
  lenis.scrollTo(t,{duration:.7,easing:x=>1-Math.pow(1-x,3),onComplete:()=>{navTo=null;}});}
// Três jeitos de rolar, separados pelo ritmo e pela força dos eventos:
// clique de roda: eventos de 4 px ou mais, soltos (80 ms ou mais entre eles) ou todos do mesmo tamanho (giro da roda do Windows).
//   Abaixo de 80 ms é deslize: num computador lento, o navegador entrega o trackpad em eventos juntados, 40 a 60 ms um do outro.
//   Cada clique pede uma parada, e as paradas vêm no máximo uma a cada 110 ms: girar rápido anda mais que girar devagar, sem disparar.
// deslize de trackpad: eventos colados; anda uma parada depois de 40 px somados, e a inércia é o mesmo gesto.
// dedo de volta: depois que a força da inércia cai, três eventos seguidos bem mais fortes que o ponto mais fraco são o dedo
//   empurrando de novo, e valem um deslize novo (com a força caída pela metade; ou só 15%, quando o empurrão passa do dobro do pico).
// A força da inércia é medida em px por ms em 3 eventos, pelo horário de cada evento: dois eventos que o navegador junta num só
// têm a mesma força. Eventos a menos de 4 ms um do outro (o navegador solta vários de uma vez depois de uma travada) contam
// como um só e não servem de empurrão. Pausa de 100 ms ou virada de sentido também começam um gesto novo, a não ser que
// o evento depois da pausa continue a inércia (do tamanho do anterior, ou com a força dela).
// A vez de andar enche 1 a cada 110 ms; parado, guarda no máximo 1 (rajada de cliques anda uma), girando, guarda a sobra.
// Um clique que logo vira deslize (até 250 ms depois, mesmo sentido) era o começo do deslize, entregue antes de uma travada.
// Rajada curta de eventos de 4 px ou mais que para antes dos 40 px (um clique, ou cliques acelerados do mouse do Mac) anda uma;
// com mais de um evento, só se for rápida (0,3 px/ms) e acelerando (o último com o dobro do primeiro, como no mouse do Mac),
// para o dedo parado ou o arrasto lento no trackpad de um computador lento não contarem.
let seg=null,lastT=-1e9,clickT=0,tok=1,clickAt=-1e9,clickDir=0,holdFree=false,wantDown=false;
const pxOf=e=>e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);
function newSeg(d){seg={dir:Math.sign(d),mv:0,n:0,kind:'',stepped:false,first:Math.abs(d),same:true,min:1e9,la:0,fast:0,pts:[],vp:0,vl:0,v:0,ups:0};}
function stepSeg(){seg.stepped=true;tok-=1;const s=stepFrom(seg.dir);if(s!=null){stepGo(s);holdFree=s>=pageY($('#contato'))-2;wantDown=false;}else if(seg.dir>0)wantDown=true;}
const burst=()=>seg&&!seg.stepped&&!seg.after&&seg.kind!=='clique'&&seg.min>=4&&tok>=1&&(seg.n===1||seg.la>=seg.first*2&&Math.abs(seg.mv)/Math.max(16,lastT-seg.t0)>=.3);
function armClick(){if(seg.min>=4)clickT=setTimeout(()=>{if(burst()){stepSeg();seg.byClick=true;clickAt=lastT;clickDir=seg.dir;}},70);}
function onWheel(d,t){if(!d)return;
  const dt=t-lastT;lastT=t;tok=Math.min(dt>=110?1:2,tok+dt/110);
  // eventos a menos de 4 ms um do outro são um só: o navegador soltou vários de uma vez (um clique, ou um trecho do deslize)
  if(seg&&dt<4&&Math.sign(d)===seg.dir){const a=Math.abs(d),P=seg.pts;seg.mv+=d;seg.la+=a;if(P.length)P[P.length-1][1]+=a;
    if(seg.n===1){clearTimeout(clickT);armClick();}else if(seg.kind==='deslize'&&!seg.stepped&&Math.abs(seg.mv)>=40&&tok>=1)stepSeg();return;}
  // o rabo de um deslize de trackpad que já andou (depois de uma travada) não vale como clique, nem quando vira gesto novo;
  // o que andou como clique (rajada curta do mouse) não tem rabo: o clique seguinte é clique
  const tail=!!seg&&seg.kind==='deslize'&&seg.stepped&&!seg.byClick&&(seg.fast>=1||seg.n>=4)&&!seg.same&&d*seg.dir>0&&dt<400;
  if(!seg||dt>=100&&!(tail&&(d*seg.dir>=.15*seg.v*dt||d*seg.dir>=.5*seg.la))){newSeg(d);seg.after=tail;}
  else if(Math.sign(d)!==seg.dir&&Math.abs(d)>=4){clearTimeout(clickT);if(burst())stepSeg();newSeg(d);tok=Math.max(tok,1);}
  const a=Math.max(0,d*seg.dir);
  seg.n++;seg.mv+=d;seg.min=Math.min(seg.min,a);seg.la=a;if(seg.n>1&&dt<25)seg.fast++;if(seg.n>1&&Math.abs(a-seg.first)>seg.first*.005)seg.same=false;
  clearTimeout(clickT);
  if(seg.n===1){seg.pts=[[t,a]];seg.t0=t;armClick();return;}
  if(seg.n===2){seg.kind=dt>=80&&a>=4&&seg.first>=4?'clique':'deslize';if(seg.kind==='deslize'&&!seg.same&&seg.t0-clickAt<250&&seg.dir===clickDir)seg.stepped=true;}
  if(seg.kind==='deslize'&&seg.n>=3&&seg.same&&seg.first>=40)seg.kind='clique';
  // depois de andar como clique (rajada curta), o evento seguinte solto também é clique: o giro acelerado do mouse do Mac
  else if(seg.kind==='deslize'&&seg.byClick&&seg.n<=3&&seg.fast<3&&dt>=80&&a>=4)seg.kind='clique';
  else if(seg.kind==='clique'&&dt<45&&!seg.same)seg.kind='deslize';
  const P=seg.pts;P.push([t,a]);if(P.length>5)P.shift();
  if(seg.kind==='clique'){if(a>=4&&tok>=1)stepSeg();return;}
  if(!seg.stepped){if(Math.abs(seg.mv)>=40&&tok>=1)stepSeg();else armClick();return;}
  if(P.length<5)return;
  // a força vem do trecho que acabou de fechar (os 3 eventos antes deste, já com os amontoados somados)
  const w=P[1][1]+P[2][1]+P[3][1],v=seg.v=w/Math.max(16,P[3][0]-P[0][0]),u=a/Math.max(8,dt),pd=seg.pd;seg.pd=dt;
  // a conta do dedo de volta vem antes de mexer no pico: um empurrão que passa do pico antigo de uma vez também vale.
  // Só conta o empurrão que vem no ritmo normal dos eventos: o que chega logo depois de uma travada vem amontoado e parece forte.
  const up=seg.vp&&seg.vl<=seg.vp*.85&&u>=seg.vl*2+.25&&(seg.vl<=seg.vp*.5||u>=seg.vp*2&&dt<=20&&pd<=20);
  if(up){if(++seg.ups>=3){const m=P[2][1]+P[3][1]+P[4][1];newSeg(d);seg.kind='deslize';seg.same=false;seg.n=3;seg.fast=3;seg.mv=m*Math.sign(d);seg.min=0;seg.la=a;seg.pts=P.slice(1);
    if(m>=40&&tok>=1)stepSeg();}return;}
  seg.ups=0;if(v>seg.vp){seg.vp=v;seg.vl=v;}else if(v<seg.vl)seg.vl=v;}
// devolver false sem impedir o navegador deixaria a página rolar sozinha por baixo: por isso o preventDefault.
// Chegando ao contato, a roda espera enquanto a página desliza até ele e enquanto dura o gesto que levou até lá.
// Quem decide o que é o mesmo gesto é a regra das paradas: cada evento passa por ela, e o que lá valeria uma parada
// nova para baixo (clique novo, pausa, dedo empurrando de novo) aqui solta a página, que rola livre até o rodapé.
// O giro da roda sem pausa (cliques a menos de 100 ms) é um gesto só: para no contato, e o giro seguinte desce.
// Subindo do rodapé, o gesto que chega ao contato para nele, e o resto dele fica com a roda das paradas.
function wheelGate({deltaY,event}){if(!event||event.type!=='wheel'||event.ctrlKey||menu.classList.contains('on'))return true;
  const free=pageY($('#contato')),t=event.timeStamp,y=navTo!=null?navTo:scrollY;
  if(y>=free-2&&deltaY>0){const old=seg;onWheel(pxOf(event),t);
    if(navTo==null&&(!holdFree||wantDown&&seg.kind==='deslize'&&!seg.byClick||seg!==old&&!seg.after)){holdFree=false;wantDown=false;return true;}
    if(event.cancelable)event.preventDefault();return false;}
  if(y>free+4){if(deltaY<0&&navTo==null&&(lenis.targetScroll+deltaY<=free+4||seg&&seg.dir<0&&t-lastT<100)){if(event.cancelable)event.preventDefault();onWheel(pxOf(event),t);return false;}
    return true;}
  if(event.cancelable)event.preventDefault();
  onWheel(pxOf(event),t);return false;}
// teclado no computador: cada seta, Page Down ou espaço vai para a parada seguinte, sem pular nenhuma
addEventListener('keydown',e=>{if(!lenis||e.altKey||e.ctrlKey||e.metaKey||menu.classList.contains('on'))return;
  const tg=e.target;if(tg.closest&&tg.closest('input,textarea,select,[contenteditable]'))return;
  // tecla segurada anda uma parada só, mas só na parte das paradas; do contato para baixo, a seta funciona normal
  if(e.repeat&&['ArrowDown','ArrowUp','PageDown','PageUp',' '].includes(e.key)&&scrollY<pageY($('#contato'))-2){e.preventDefault();return;}
  const k=e.key,down=k==='ArrowDown'||k==='PageDown'||(k===' '&&!e.shiftKey),up=k==='ArrowUp'||k==='PageUp'||(k===' '&&e.shiftKey);
  if(k===' '&&tg.closest&&tg.closest('button,a'))return;
  const y=scrollY,free=pageY($('#contato'));
  if(k==='Home'){e.preventDefault();go(0);return;}
  if(k==='End'){e.preventDefault();go(document.documentElement.scrollHeight-innerHeight);return;}
  if(!down&&!up)return;
  if(down&&y>=free-2&&navTo==null)return;if(up&&y>free+4)return;
  const t=stepFrom(down?1:-1);if(t==null)return;e.preventDefault();stepGo(t);});

// ---------- rolagem: tudo sai da posição da página ----------
const NAMES={historia:'Soluções',clientes:'Clientes',projetos:'Projetos',como:'Como funciona',contato:'Contato'};
const prog=sec=>{const r=sec.getBoundingClientRect(),tot=sec.offsetHeight-innerHeight;return tot>0?clamp(-r.top/tot):0;};
let cur='';
function moveInd(){const a=$('#nav a.on'),ind=$('#ind');if(!a||MOB){ind.style.width=0;return;}ind.style.width=a.offsetWidth+'px';ind.style.transform='translateX('+a.offsetLeft+'px)';}
function setCur(id){if(id===cur)return;cur=id;$$('#nav a,#mlist a').forEach(a=>a.classList.toggle('on',a.dataset.n===cur));moveInd();where();}
function onScroll(){const hp=prog($('#historia')),hs=Math.min(6,Math.floor(hp*7));
  if(storyHold&&(hs===storyHold.k||performance.now()>storyHold.until))storyHold=null;
  if(!storyHold)setStep(hs);
  railFill.forEach((f,i)=>f.style.transform='scaleX('+clamp(hp*7-(i+1))+')');
  const c=$('#clientes'),cr=c.getBoundingClientRect(),cOn=cr.top<innerHeight*.6&&cr.bottom>0?1:0;if(cOn!==cliOn){cliOn=cOn;drawCli();}
  const held=(id,k)=>{if(!hold||hold.id!==id)return false;if(k===hold.k||performance.now()>hold.until){hold=null;return false;}return true;};
  const ca=Math.min(3,Math.floor(prog(c)*4));if(!held('clientes',ca)&&ca!==cliAuto){cliAuto=ca;setFilt(FK[ca]);}
  const pa=Math.min(SECT.length-1,Math.floor(prog($('#projetos'))*SECT.length));if(!held('projetos',pa)&&pa!==projAuto){projAuto=pa;showSect(pa);}
  // como funciona: a cena só começa quando a faixa está na tela
  const co=$('#como'),cb=co.getBoundingClientRect(),cp2=prog(co),vis=cb.top<innerHeight*.5&&cb.bottom>innerHeight*.5;
  setC(Math.min(2,Math.floor(cp2*3)));if(vis&&!cVis){cVis=true;playC(cstep);}else if(!vis&&cVis){cVis=false;clearC();}
  cFill.forEach((f,i)=>f.style.transform='scaleX('+clamp(cp2*3-i)+')');
  let now='historia';Object.keys(NAMES).forEach(id=>{if($('#'+id).getBoundingClientRect().top<innerHeight*.5)now=id;});
  if(navHold&&(now===navHold.id||performance.now()>navHold.until))navHold=null;
  if(!navHold)setCur(now);
  snapZone();secNav();
  $('#wp').style.transform='scaleX('+clamp(scrollY/(document.documentElement.scrollHeight-innerHeight))+')';}
// a barra de baixo do celular diz onde a pessoa está (também logo depois de um toque):
// a parte em cima, pequena, e o detalhe embaixo, para o detalhe caber inteiro até em 360 px
function where(){if(!cur)return;let k=NAMES[cur],lab=k;
  if(cur==='historia'){if(step<=0){k='';lab='Role para ver <span class="ar">↓</span>';}else lab=step<=5?step+' de 5':'Tudo ligado';}
  else if(cur==='clientes')lab=filt?TY[filt][2]:'Todas';
  else if(cur==='projetos')lab=SECT[Math.max(0,sel)][0];
  else if(cur==='como')lab='Passo '+(cstep+1)+' de 3';
  else{k='';lab='↑ Voltar ao topo';}
  const wk=$('#wk'),wl=$('#wl');if(wk.textContent!==k)wk.textContent=k;if(wl.innerHTML!==lab)wl.innerHTML=lab;}
// de parte em parte (computador): no meio da tela, em cima a parte de antes e embaixo a seguinte, com o nome;
// no canto de baixo, o começo e o fim. A roda continua de parada em parada; estes botões pulam a parte inteira.
const SEC=Object.keys(NAMES),snUp=$('#snUp'),snDn=$('#snDn'),toTop=$('#toTop'),toEnd=$('#toEnd');
function goSec(id){navHold={id,until:performance.now()+2600};setCur(id);go(id==='historia'?0:pageY($('#'+id)));}
// no contato a conversa ocupa o alto e o canto: o botão de cima sai, e o do começo sai se fosse cobrir a caixa
function secNav(){const i=Math.max(0,SEC.indexOf(cur)),up=cur==='contato'?null:SEC[i-1],dn=SEC[i+1],end=pageY($('#contato'));
  snUp.classList.toggle('on',!!up);if(up){snUp.querySelector('b').textContent=NAMES[up];snUp.setAttribute('aria-label','Subir para '+NAMES[up]);}snUp.dataset.to=up||'';
  snDn.classList.toggle('on',!!dn);if(dn){snDn.querySelector('b').textContent=NAMES[dn];snDn.setAttribute('aria-label','Descer para '+NAMES[dn]);}snDn.dataset.to=dn||'';
  // o ↑ do canto some onde cobriria a conversa ou o "Voltar ao topo" do rodapé
  // (com o ↓ à vista, o ↑ fica 42 px mais à esquerda)
  const endOn=scrollY<end-10,wR=endOn?106:64,hits=r=>r.right>innerWidth-wR&&r.bottom>innerHeight-112&&r.top<innerHeight,clash=hits($('#chat').getBoundingClientRect())||hits($('.fup').getBoundingClientRect());
  toTop.classList.toggle('on',scrollY>innerHeight*.8&&!clash);toEnd.classList.toggle('on',endOn);}
snUp.onclick=()=>snUp.dataset.to&&goSec(snUp.dataset.to);snDn.onclick=()=>snDn.dataset.to&&goSec(snDn.dataset.to);
toTop.onclick=()=>goSec('historia');toEnd.onclick=()=>goSec('contato');
addEventListener('scroll',onScroll,{passive:true});
addEventListener('resize',()=>{buildSnaps();moveInd();onScroll();});
buildSnaps();onScroll();
// quem chega por um link com #contato, #clientes etc. já cai no lugar
const h0=location.hash.slice(1),t0=h0&&document.getElementById(h0);if(t0)requestAnimationFrame(()=>{jump(pageY(t0));onScroll();});
requestAnimationFrame(()=>requestAnimationFrame(()=>net.classList.remove('boot')));
// a letra da página chega depois e muda a altura do que vem antes; quem chegou pelo link e ainda não mexeu volta ao lugar certo
let touched=false;['wheel','touchstart','keydown','pointerdown'].forEach(n=>addEventListener(n,()=>{touched=true;},{once:true,passive:true}));
document.fonts.ready.then(()=>{if(t0&&!touched)jump(pageY(t0));moveInd();step=-1;onScroll();});
