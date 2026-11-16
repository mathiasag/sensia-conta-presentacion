(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const data = window.SENSIA_CONTENT;
  const pages = [...document.querySelectorAll('.page')];
  const ids = pages.map(p=>p.id);
  const labels = pages.map(p=>p.dataset.label);
  let page=0, photo=0, timer, paused=false, touch, lastTouch=0;
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const paths={
    sensor:'M7 3v18M7 6h8v6H7M15 6h4v3M17 13q2-2 4 0M16 16q3-3 6 0M2 21q2-2 4 0t4 0t4 0t4 0t4 0',
    chart:'M4 3v17h17M8 15v-3M12 15V8M16 15V5',
    decision:'M4 19V9a3 3 0 0 1 3-3h12M15 2l4 4-4 4M12 17l3 3 6-7',
    infrastructure:'M3 21h18M5 21V8h14v13M3 8l9-5 9 5M9 12v4M15 12v4',
    rain:'M6 14a5 5 0 1 1 2-9 5 5 0 0 1 9 1 4 4 0 1 1 1 8M7 17l-1 4M12 17l-1 4M17 17l-1 4',
    city:'M3 21V7h7v14M10 21V3h7v18M17 10h4v11M6 10v1M6 15v1M13 7v1M13 12v1M13 17v1M2 21h20',
    route:'M6 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6M18 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6M6 13V8a3 3 0 0 1 3-3h6M18 7v9a3 3 0 0 1-3 3h-4',
    home:'M3 11l9-8 9 8M5 9v12h14V9M9 21v-7h6v7',
    shield:'M12 2l8 4v6c0 5-8 10-8 10S4 17 4 12V6zM8 12l3 3 5-6',
    municipality:'M3 9l9-7 9 7zM3 22h18M5 10v9M10 10v9M15 10v9M20 10v9',
    clock:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M12 7v5l4 3',
    bell:'M5 17h14l-2-3v-4a5 5 0 0 0-10 0v4zM10 20a2 2 0 0 0 4 0M12 3V2',
    research:'M6 3h9l4 4v14H6zM15 3v5h4M9 12h7M9 16h5',
    tools:'M14 3a5 5 0 0 0-5 7L3 17a2 2 0 0 0 4 4l7-7a5 5 0 0 0 7-5l-4 3-3-3 3-4z',
    wave:'M2 7q2-3 5 0t5 0t5 0t5 0M2 12q2-3 5 0t5 0t5 0t5 0M2 17q2-3 5 0t5 0t5 0t5 0',
    dashboard:'M3 5h18v15H3zM3 9h18M6 7h.1M9 7h.1M6 16l3-3 4 3 5-4',
    database:'M20 5c0 2-16 2-16 0s16-2 16 0M4 5v14c0 3 16 3 16 0V5M4 12c0 3 16 3 16 0',
    prediction:'M3 18l5-6 5 3 8-11M16 4h5v5M3 22h18',
    filter:'M3 4h18l-7 8v7l-4 2v-9z',
    dataset:'M3 4h18v16H3zM3 9h18M3 14h18M9 4v16M15 4v16',
    expansion:'M3 3h7v7H3zM3 14h7v7H3zM14 14h7v7h-7zM14 3h7v7M14 10l7-7',
    partners:'M9 15l6-6M8 17l-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0M16 7l2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0'
  };
  document.querySelectorAll('[data-icon]').forEach(el=>{
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.65');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',paths[el.dataset.icon]||paths.chart);svg.append(path);el.append(svg);
  });
  function showPhoto(n){
    photo=(n+data.floods.length)%data.floods.length;
    const item=data.floods[photo],img=new Image();img.src=item.src;img.alt=item.caption;
    $('#flood-photo').replaceChildren(img);$('#flood-title').textContent=item.caption;
    document.querySelectorAll('[data-point]').forEach((b,i)=>{b.classList.toggle('selected',i===photo);b.setAttribute('aria-pressed',String(i===photo));});
    document.querySelectorAll('.photo-dots button').forEach((b,i)=>{b.classList.toggle('selected',i===photo);b.setAttribute('aria-pressed',String(i===photo));});
    document.dispatchEvent(new CustomEvent('sensia:photochange'));
  }
  function startTimer(){clearInterval(timer);if(page===1&&!paused&&!document.hidden&&!reducedMotion.matches)timer=setInterval(()=>showPhoto(photo+1),5500);}
  function render(index,focus=false){
    page=Math.max(0,Math.min(pages.length-1,index));
    pages.forEach((p,i)=>{p.classList.toggle('active',i===page);p.hidden=i!==page;p.inert=i!==page;p.setAttribute('aria-hidden',String(i!==page));});
    document.querySelectorAll('.main-nav a').forEach((a,i)=>{if(i===page)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    $('#prev').disabled=page===0;$('#prev-label').textContent=page?labels[page-1]:'Anterior';$('#next-label').textContent=page===pages.length-1?'Volver al inicio':labels[page+1];
    $('#page-count').textContent=String(page+1).padStart(2,'0')+' / '+String(pages.length).padStart(2,'0');$('#page-count').setAttribute('aria-label',`Página ${page+1} de ${pages.length}: ${labels[page]}`);
    $('#page-progress-fill').style.width=((page+1)/pages.length*100)+'%';
    $('#main').scrollTo({top:0,left:0,behavior:'instant'});startTimer();
    document.title=`SensIA · ${labels[page]}`;
    if(focus){const heading=pages[page].querySelector('h1,h2');heading.tabIndex=-1;heading.focus({preventScroll:true});}
  }
  function go(id){if(ids.includes(id)){if(location.hash.slice(1)!==id)history.pushState(null,'','#'+id);render(ids.indexOf(id),true);}}
  document.querySelectorAll('.main-nav a,.brand').forEach(link=>link.onclick=e=>{const id=link.getAttribute('href').slice(1);if(ids.includes(id)){e.preventDefault();go(id);}});
  function fromHash(){const i=ids.indexOf(location.hash.slice(1));render(i<0?0:i);}
  document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
  $('.skip').onclick=e=>{e.preventDefault();$('#main').focus({preventScroll:true});};
  $('#prev').onclick=()=>{if(page>0)go(ids[page-1]);};$('#next').onclick=()=>go(ids[(page+1)%pages.length]);
  data.floods.forEach((_,i)=>{const b=document.createElement('button');b.setAttribute('aria-label',`Ver foto de inundación ${i+1}`);b.onclick=()=>{showPhoto(i);startTimer();};$('.photo-dots').append(b);});
  document.querySelectorAll('[data-point]').forEach(b=>b.onclick=()=>{showPhoto(Number(b.dataset.point));startTimer();});
  for(const person of data.team){
    const el=document.createElement('article');el.className='member';const img=new Image();img.src=person.photo;img.alt=person.name;img.className='member-photo';const h=document.createElement('h4');h.textContent=person.name;const p=document.createElement('p');p.textContent=person.roleLabel;el.append(img,h,p);$('#team').append(el);
  }
  function toggleMotion(){paused=!paused;document.body.classList.toggle('motion-paused',paused);$('#motion').setAttribute('aria-pressed',String(paused));$('#motion').setAttribute('aria-label',paused?'Reanudar animaciones':'Pausar animaciones');$('#motion').textContent=paused?'▶':'Ⅱ';startTimer();}
  $('#motion').onclick=toggleMotion;
  let zoomTrigger;
  document.querySelectorAll('[data-zoom]').forEach(b=>b.onclick=()=>{zoomTrigger=b;const info=data.hardware[b.dataset.zoom];$('#large-photo').src=info.src;$('#large-photo').alt=info.caption;$('#large-caption').textContent=info.caption;$('#photo-dialog').showModal();});
  $('#photo-close').onclick=()=>$('#photo-dialog').close();$('#photo-dialog').addEventListener('close',()=>zoomTrigger?.focus());
  $('#photo-dialog').addEventListener('click',e=>{if(e.target===$('#photo-dialog')){const b=e.target.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)e.target.close();}});
  addEventListener('hashchange',fromHash);addEventListener('popstate',fromHash);
  addEventListener('keydown',e=>{
    if($('#photo-dialog').open)return;if(e.altKey||e.metaKey||e.ctrlKey||e.target.matches('input,textarea,select,[contenteditable]'))return;
    if(e.key==='ArrowRight'){e.preventDefault();if(page<pages.length-1)go(ids[page+1]);}if(e.key==='ArrowLeft'){e.preventDefault();if(page>0)go(ids[page-1]);}
    if(/^[1-6]$/.test(e.key))go(ids[Number(e.key)-1]);if(e.key.toLowerCase()==='p')toggleMotion();
  });
  $('#main').addEventListener('touchstart',e=>{if(e.target.closest('.chart-scroll,.phone')){touch=null;return;}touch={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};},{passive:true});
  $('#main').addEventListener('touchend',e=>{if(!touch)return;const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;if(Math.abs(dx)>100&&Math.abs(dx)>Math.abs(dy)*2&&Date.now()-lastTouch>500){lastTouch=Date.now();if(dx<0&&page<pages.length-1)go(ids[page+1]);if(dx>0&&page>0)go(ids[page-1]);}touch=null;},{passive:true});
  document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('tab-hidden',document.hidden);startTimer();});reducedMotion.addEventListener('change',startTimer);
  showPhoto(0);fromHash();
})();
