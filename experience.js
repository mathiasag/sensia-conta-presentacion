(() => {
  const $=s=>document.querySelector(s),NS='http://www.w3.org/2000/svg';
  const el=(tag,attrs={},parent,text)=>{const e=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,v);if(text!==undefined)e.textContent=text;if(parent)parent.append(e);return e;};
  const pipeline=$('#data-pipeline'),mobile=matchMedia('(max-width:680px)');
  function buildPipeline(){
    const compact=mobile.matches;
    pipeline.replaceChildren();pipeline.setAttribute('viewBox',compact?'0 0 420 1300':'0 0 1700 620');
    const defs=el('defs',{},pipeline),marker=el('marker',{id:'pipeline-arrow',markerWidth:7,markerHeight:7,refX:6,refY:3.5,orient:'auto'},defs);
    el('path',{d:'M0 0L7 3.5L0 7Z',fill:'#9abfdc'},marker);
    function wire(d,kind=''){
      el('path',{d,class:'pipeline-wire','marker-end':'url(#pipeline-arrow)'},pipeline);
      el('path',{d,class:'pipeline-stream '+kind},pipeline);
    }
    function text(x,y,copy,cls='pipeline-label',parent=pipeline){return el('text',{x,y,class:cls},parent,copy);}
    function actor(kind,cx,cy){
      const scale=compact?.86:1,outer=el('g',{transform:`translate(${cx} ${cy}) scale(${scale})`},pipeline),g=el('g',{transform:compact?'scale(1)':'scale(1.12)'},outer);
      if(kind==='server'){
        el('rect',{x:-64,y:-88,width:140,height:186,rx:12,fill:'#daeaf9'},g);
        el('rect',{x:-74,y:-98,width:140,height:186,rx:12,fill:'#19315e'},g);
        [-78,-25,28].forEach((y,i)=>{el('rect',{x:-58,y,width:108,height:40,rx:5,fill:i===1?'#23558b':'#25467b'},g);el('circle',{cx:-42,cy:y+20,r:4,fill:'#56dbef',class:'pipeline-led'+(i%2?' second':'')},g);el('path',{d:`M-25 ${y+15}H30M-25 ${y+25}H16`,stroke:'#c2e6ff','stroke-width':3,'stroke-linecap':'round'},g);});
        el('path',{d:'M-48 89V105M40 89V105',stroke:'#19315e','stroke-width':8,'stroke-linecap':'round'},g);
        text(0,compact?170:200,'Servidor','pipeline-label',outer);text(0,compact?192:224,'Registro y procesamiento','pipeline-sub',outer);
      }
      if(kind==='dashboard'){
        el('rect',{x:-115,y:-84,width:238,height:170,rx:10,fill:'#d5e7f9'},g);
        el('rect',{x:-123,y:-93,width:238,height:170,rx:10,fill:'#fff',stroke:'#19315e','stroke-width':4},g);
        el('path',{d:'M-121 -68H113',stroke:'#19315e','stroke-width':3},g);
        [-108,-96,-84].forEach(x=>el('circle',{cx:x,cy:-80,r:3,fill:'#6ebbea'},g));
        [-102,-34,34].forEach((x,i)=>{el('rect',{x,y:-52,width:58,height:25,rx:4,fill:'#edf6ff'},g);el('path',{d:`M${x+8} -39H${x+42-i*7}`,stroke:'#76b1e3','stroke-width':4,'stroke-linecap':'round'},g);});
        for(let i=0;i<7;i++)el('rect',{x:-103+i*28,y:49-[16,26,18,37,30,46,39][i],width:13,height:[16,26,18,37,30,46,39][i],rx:2,fill:'#c0e7f8'},g);
        el('path',{d:'M-104 39L-76 31L-48 34L-20 11L8 16L36 -1L64 4L94 -16',class:'pipeline-screen-curve'},g);
        el('path',{d:'M-8 79V113M-55 118H38',stroke:'#19315e','stroke-width':7,'stroke-linecap':'round'},g);
        text(0,compact?170:200,'Dashboard','pipeline-label',outer);text(0,compact?192:224,'Información lista para usar','pipeline-sub',outer);
      }
    }
    function output(kind,cx,cy,label){
      const g=el('g',{transform:`translate(${cx} ${cy})`},pipeline),icon=el('g',{transform:compact?'scale(1.12)':'scale(1.55)'},g);
      el('rect',{x:-30,y:-30,width:60,height:60,rx:15,fill:'#edf6ff'},icon);
      const shapes={graph:'M-17 15V-15M-17 15H18M-12 6L-4 -4L4 0L15 -13',report:'M-13 -20H6L14 -12V19H-13ZM6 -20V-11H14M-7 -5H7M-7 2H7M-7 9H3',alert:'M-15 11H15L11 5V-5A11 11 0 0 0-11 -5V5ZM-4 17Q0 23 4 17M0 -19V-22',prediction:'M-18 13L-9 3L0 7M0 7L9 -8L18 -16M10 -17H19V-8'};
      el('path',{d:shapes[kind],fill:'none',stroke:kind==='alert'?'#d08a49':'#0968d6','stroke-width':2.4,'stroke-linecap':'round','stroke-linejoin':'round',class:kind==='alert'?'out-alert':''},icon);
      if(compact)text(0,64,label,'pipeline-output-label pipeline-mobile-output-label',g);else text(60,6,label,'pipeline-output-label',g);
    }
    function creek(x,y,width){
      const g=el('g',{transform:`translate(${x} ${y}) scale(${width/1536})`,'data-scene':'creek-station'},pipeline);
      el('image',{href:'assets/ciudad-flat-v2.webp',x:0,y:0,width:1536,height:1024},g);
      const sonar=el('g',{transform:'translate(743 666)'},g);
      el('path',{d:'M-19 0Q0 10 19 0',class:'creek-sonar-out'},sonar);el('path',{d:'M-19 0Q0 10 19 0',class:'creek-sonar-back'},sonar);
      const radio=el('g',{transform:'translate(1014 291)'},g);
      el('path',{d:'M-14 -7Q0 -23 14 -7',class:'creek-radio'},radio);el('path',{d:'M-14 -7Q0 -23 14 -7',class:'creek-radio second'},radio);
    }
    if(compact){
      creek(0,10,420);
      // Origin coincides with the antenna in the creek image, not a duplicate sensor.
      wire('M277.265625 89.5703125C370 100 365 335 210 396','pipeline-raw-stream');
      text(303,349,'Datos sensados','pipeline-wire-label');
      wire('M210 670V718','pipeline-clean-stream');text(285,700,'Datos limpios','pipeline-wire-label');
      wire('M210 983V998H110V1006','pipeline-branch');wire('M210 983V998H310V1006','pipeline-branch');wire('M210 983V1160H110V1176','pipeline-branch');wire('M210 983V1160H310V1176','pipeline-branch');
      actor('server',210,480);actor('dashboard',210,800);
      output('graph',110,1040,'Gráficos');output('report',310,1040,'Reportes');output('alert',110,1210,'Alertas');output('prediction',310,1210,'Predicciones');
    }else{
      creek(0,130,560);
      wire('M369.6875 236.09375C470 125 545 185 635 300','pipeline-raw-stream');
      text(520,158,'Datos sensados','pipeline-wire-label');
      wire('M805 300H932','pipeline-clean-stream');text(868,258,'Datos limpios','pipeline-wire-label');
      [90,225,360,495].forEach(y=>wire(`M1208 300C1300 300 1320 ${y} 1400 ${y}`,'pipeline-branch'));
      actor('server',720,300);actor('dashboard',1070,300);
      [['graph','Gráficos'],['report','Reportes'],['alert','Alertas'],['prediction','Predicciones']].forEach(([kind,label],i)=>output(kind,1455,90+i*135,label));
      for(let i=0;i<2;i++){
        const clean=el('g',{transform:'translate(825 300)'},pipeline),q=el('g',{class:'pipeline-clean-packet'+(i?' second':'')},clean);
        el('rect',{x:0,y:-7,width:20,height:14,rx:3,fill:'#fff',stroke:'#0968d6','stroke-width':1.4},q);el('path',{d:'M5 0L9 3L15 -4',fill:'none',stroke:'#3b9b79','stroke-width':1.5},q);
      }
    }
  }
  buildPipeline();mobile.addEventListener('change',buildPipeline);

  let arrowFrame;
  function mapArrow(){
    const layout=$('.territory-layout'),svg=$('#flood-link'),point=$('.map-point.selected'),photo=$('#flood-photo');
    if(!point||!layout.getClientRects().length)return;
    const l=layout.getBoundingClientRect(),p=point.getBoundingClientRect(),f=photo.getBoundingClientRect();
    if(!f.width||!l.width)return;
    svg.setAttribute('viewBox',`0 0 ${l.width} ${l.height}`);
    const sx=p.left+p.width/2-l.left,sy=p.top+p.height/2-l.top;
    const side=f.left>p.right+20;
    let ex=side?f.left-l.left-7:f.left+f.width/2-l.left,ey=side?f.top+f.height/2-l.top:f.top-l.top-8;
    const dx=ex-sx,dy=ey-sy,len=Math.hypot(dx,dy)||1,startX=sx+dx/len*(p.width/2+4),startY=sy+dy/len*(p.height/2+4);
    const d=side?`M${startX} ${startY}C${startX+Math.max(40,dx*.5)} ${startY} ${ex-50} ${ey} ${ex} ${ey}`:`M${startX} ${startY}C${Math.max(startX,l.width-17)} ${startY+45} ${ex} ${ey-90} ${ex} ${ey}`;
    $('#flood-link-line').setAttribute('d',d);
  }
  function queueArrow(){cancelAnimationFrame(arrowFrame);arrowFrame=requestAnimationFrame(mapArrow);}
  const ro=new ResizeObserver(queueArrow);ro.observe($('.territory-layout'));ro.observe($('#flood-photo'));ro.observe($('.map-canvas'));
  document.addEventListener('sensia:photochange',queueArrow);document.addEventListener('sensia:layoutfit',queueArrow);addEventListener('resize',queueArrow);addEventListener('hashchange',()=>{queueArrow();setTimeout(queueArrow,800);});queueArrow();setTimeout(queueArrow,800);


  const names=['map','stations','alerts'];
  const devices=[...document.querySelectorAll('[data-device]')];
  const activeTabs={phone:'map',notebook:'stations',tablet:'alerts'};
  function updateTabs(){
    devices.forEach(device=>{
      const name=device.dataset.device;
      device.querySelectorAll('[data-device-tab]').forEach(button=>{
        const active=button.dataset.deviceTab===activeTabs[name];
        button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;
        document.getElementById(name+'-'+button.dataset.deviceTab+'-panel').hidden=!active;
      });
    });
  }
  function selectTab(device,tab){
    const order=['phone','notebook','tablet'];
    const start=order.indexOf(device),selected=names.indexOf(tab);
    order.forEach((name,i)=>{activeTabs[name]=names[(selected+i-start+3)%3];});
    updateTabs();
  }
  devices.forEach(device=>{
    const buttons=[...device.querySelectorAll('[data-device-tab]')];
    buttons.forEach((button,i)=>{
      button.onclick=()=>selectTab(device.dataset.device,button.dataset.deviceTab);
      button.onkeydown=event=>{
        if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
        event.preventDefault();event.stopPropagation();
        const next=buttons[(i+(event.key==='ArrowRight'?1:2))%3];
        selectTab(device.dataset.device,next.dataset.deviceTab);next.focus();
      };
    });
  });
  updateTabs();
  const rain=[0,0,.2,.5,1.1,2.2,4.6,6.4,5.1,3.8,2.2,1.1,.6,.4,.1];
  const level=[.40,.40,.42,.44,.46,.52,.61,.74,.92,1.14,1.45,1.68,1.85,2.06,2.21];
  const charts=devices.map(device=>{
    const chart=device.querySelector('[data-water-chart]'),x=i=>24+i*14.6,ly=v=>112-v/3*87,ry=v=>112-v/7*87;
    [0,1,2,3].forEach(v=>{el('line',{x1:24,y1:ly(v),x2:229,y2:ly(v),class:'phone-grid-line'},chart);el('text',{x:17,y:ly(v)+2.5,'text-anchor':'end',class:'phone-chart-label'},chart,String(v));});
    [0,2,4,6].forEach(v=>el('text',{x:233,y:ry(v)+2.5,class:'phone-chart-label'},chart,String(v)));
    el('text',{x:13,y:13,class:'phone-chart-label'},chart,'m');el('text',{x:229,y:13,class:'phone-chart-label'},chart,'mm');
    el('line',{x1:24,y1:ly(2),x2:229,y2:ly(2),stroke:'#c5cfdc','stroke-dasharray':'3 3','stroke-width':1},chart);
    const bars=rain.map((v,i)=>el('rect',{x:x(i)-3,y:112,width:6,height:0,rx:1,class:'phone-rain-bar'},chart));
    const curve=el('path',{class:'phone-trend-line'},chart),dot=el('circle',{r:3,fill:'#d84b56',stroke:'#fff','stroke-width':1},chart),alert=el('text',{x:26,y:134,class:'phone-chart-alert'},chart,'');
    return {device,x,ly,ry,bars,curve,dot,alert};
  });
  let frame=0,hold=0;
  function showFrame(i){
    charts.forEach(({device,x,ly,ry,bars,curve,dot,alert})=>{
      const station=Number(device.querySelector('[data-station]').value);
      const levels=level.map(v=>v*(1-station*.13)+station*.08);
      const rains=rain.map(v=>v*(1-station*.17));
      device.querySelector('[data-level]').textContent=levels[i].toFixed(2).replace('.',',');
      device.querySelector('[data-rain]').textContent=rains[i].toFixed(1).replace('.',',');
      bars.forEach((bar,k)=>{const visible=k<=i;bar.setAttribute('opacity',visible?'.85':'.12');bar.setAttribute('y',visible?ry(rains[k]):112);bar.setAttribute('height',visible?112-ry(rains[k]):0);});
      curve.setAttribute('d',levels.slice(0,i+1).map((v,k)=>(k?'L':'M')+x(k).toFixed(2)+' '+ly(v).toFixed(2)).join(' '));
      dot.setAttribute('cx',x(i));dot.setAttribute('cy',ly(levels[i]));
      alert.textContent=levels[i]>=2?'Umbral de ejemplo superado · Alerta':'';
      device.querySelector('[data-data-state]').textContent=levels[i]>=2?'Nivel crítico del escenario ilustrativo':'Estación 0'+(station+1)+' · Datos ilustrativos';
      const evac=device.querySelector('[data-evac-time]')||document.querySelector('[data-evac-for="'+device.dataset.device+'"]');
      if(evac)evac.textContent=(25-Math.floor(i/3))+' min';
    });
  }
  devices.forEach(device=>device.querySelector('[data-station]').onchange=()=>showFrame(frame));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  if(reduced.matches)frame=14;
  showFrame(frame);
  setInterval(()=>{
    if(reduced.matches||document.hidden||document.body.classList.contains('motion-paused')||!$('#decidir').classList.contains('active'))return;
    if(frame===14){if(++hold<5)return;frame=0;hold=0;}else frame++;
    showFrame(frame);
  },1200);
})();
