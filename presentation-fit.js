(() => {
  const main=document.querySelector('#main');
  const desktop=matchMedia('(min-width:700px) and (min-height:420px)');
  let frame;
  function fit(){
    frame=0;
    document.body.classList.toggle('fitted-layout',desktop.matches);
    const page=document.querySelector('.page.active'),wrap=page?.querySelector(':scope > .wrap');
    if(!wrap)return;
    let scale=1;
    if(desktop.matches){
      // Keep the full visible width while finding the largest scale that fits vertically.
      let low=.2,high=1;
      wrap.style.setProperty('--presentation-scale','1');
      if(wrap.offsetHeight>main.clientHeight-6){
        for(let i=0;i<12;i++){
          const candidate=(low+high)/2;
          wrap.style.setProperty('--presentation-scale',String(candidate));
          if(wrap.offsetHeight*candidate<=main.clientHeight-6)low=candidate;else high=candidate;
        }
        scale=low;
      }
    }
    wrap.style.setProperty('--presentation-scale',String(scale));
    if(desktop.matches)main.scrollTo({top:0,left:0,behavior:'instant'});
    document.dispatchEvent(new Event('sensia:layoutfit'));
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(fit);}
  new ResizeObserver(schedule).observe(main);
  document.querySelectorAll('.page > .wrap').forEach(w=>new ResizeObserver(schedule).observe(w));
  new MutationObserver(schedule).observe(main,{subtree:true,attributes:true,attributeFilter:['class','hidden']});
  addEventListener('resize',schedule);addEventListener('hashchange',schedule);desktop.addEventListener('change',schedule);
  document.fonts.ready.then(schedule);schedule();
})();
