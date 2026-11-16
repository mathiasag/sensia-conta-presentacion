(() => {
  const grid = document.querySelector('section[data-name="SensIA"] .grid');
  const photo = grid?.querySelector('img.visual');
  if (!photo) return;
  const intro = grid.querySelector('div');
  const scene = document.createElement('div');
  scene.className = 'original-pipeline';
  scene.innerHTML = `<svg viewBox="0 0 1700 620" role="img" aria-labelledby="pipeline-title pipeline-desc">
    <title id="pipeline-title">De las estaciones SensIA a la información</title>
    <desc id="pipeline-desc">Seis estaciones envían señales al servidor. Los datos procesados llegan al dashboard y se muestran como gráficos, reportes, alertas y predicciones.</desc>
    <defs><marker id="sensia-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="#9abfdc"/></marker></defs>
    <g class="sensor-paths"></g>
    <text x="210" y="28" class="station-heading">SensIA Estaciones</text>
    <path d="M805 300H932" class="original-wire" marker-end="url(#sensia-arrow)"/><path d="M805 300H932" class="original-stream clean"/>
    <text x="868" y="258" class="original-wire-label">Datos limpios</text>
    <g class="branches"></g>
    <g transform="translate(720 300)"><g transform="scale(1.12)">
      <rect x="-64" y="-88" width="140" height="186" rx="12" fill="#daeaf9"/><rect x="-74" y="-98" width="140" height="186" rx="12" fill="#19315e"/>
      <g fill="#25467b"><rect x="-58" y="-78" width="108" height="40" rx="5"/><rect x="-58" y="-25" width="108" height="40" rx="5"/><rect x="-58" y="28" width="108" height="40" rx="5"/></g>
      <g fill="#56dbef" class="server-lights"><circle cx="-42" cy="-58" r="4"/><circle cx="-42" cy="-5" r="4"/><circle cx="-42" cy="48" r="4"/></g>
      <path d="M-25 -63H30M-25 -53H16M-25 -10H30M-25 0H16M-25 43H30M-25 53H16" stroke="#c2e6ff" stroke-width="3" stroke-linecap="round"/><path d="M-48 89V105M40 89V105" stroke="#19315e" stroke-width="8" stroke-linecap="round"/></g>
      <text y="200" class="original-label">Servidor</text><text y="224" class="original-sub">Registro y procesamiento</text></g>
    <g transform="translate(1070 300)"><g transform="scale(1.12)">
      <rect x="-115" y="-84" width="238" height="170" rx="10" fill="#d5e7f9"/><rect x="-123" y="-93" width="238" height="170" rx="10" fill="#fff" stroke="#19315e" stroke-width="4"/>
      <path d="M-121 -68H113" stroke="#19315e" stroke-width="3"/><g fill="#6ebbea"><circle cx="-108" cy="-80" r="3"/><circle cx="-96" cy="-80" r="3"/><circle cx="-84" cy="-80" r="3"/></g>
      <g fill="#edf6ff"><rect x="-102" y="-52" width="58" height="25" rx="4"/><rect x="-34" y="-52" width="58" height="25" rx="4"/><rect x="34" y="-52" width="58" height="25" rx="4"/></g>
      <path d="M-94 -39H-60M-26 -39H1M42 -39H64" stroke="#76b1e3" stroke-width="4" stroke-linecap="round"/>
      <g fill="#c0e7f8"><rect x="-103" y="33" width="13" height="16"/><rect x="-75" y="23" width="13" height="26"/><rect x="-47" y="31" width="13" height="18"/><rect x="-19" y="12" width="13" height="37"/><rect x="9" y="19" width="13" height="30"/><rect x="37" y="3" width="13" height="46"/><rect x="65" y="10" width="13" height="39"/></g>
      <path d="M-104 39L-76 31L-48 34L-20 11L8 16L36 -1L64 4L94 -16" class="original-chart"/><path d="M-8 79V113M-55 118H38" stroke="#19315e" stroke-width="7" stroke-linecap="round"/></g>
      <text y="200" class="original-label">Dashboard</text><text y="224" class="original-sub">Información lista para usar</text></g>
    <g class="output-icons"></g>
  </svg>`;
  const svg = scene.querySelector('svg');
  const ns = 'http://www.w3.org/2000/svg';
  const add = (parent, tag, attrs, text) => { const el = document.createElementNS(ns, tag); Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k,v)); if (text) el.textContent=text; parent.append(el); return el; };
  const stations = [
    ['Lluvia', 'Precipitación', '☂'], ['Nivel', 'Altura del agua', '≋'],
    ['Temperatura y humedad', 'Ambiente', '♨'], ['Vibración y corriente', 'Equipos', '∿'],
    ['Consumo de energía', 'Electricidad', 'ϟ'], ['Presión', 'Proceso', '◴']
  ];
  const wire = (parent, d, extra='') => { add(parent,'path',{d,class:'original-wire','marker-end':'url(#sensia-arrow)'}); add(parent,'path',{d,class:'original-stream '+extra}); };
  const paths = svg.querySelector('.sensor-paths');
  stations.forEach(([name,sub,icon],i) => {
    const y=45+i*91, g=add(svg,'g',{transform:`translate(30 ${y})`,class:'sensor-card'});
    add(g,'rect',{x:0,y:0,width:365,height:76,rx:15,fill:'#f5faff',stroke:'#e0eef9','stroke-width':2});
    add(g,'text',{x:30,y:48,class:'sensor-symbol-svg'},icon);
    add(g,'rect',{x:80,y:20,width:29,height:38,rx:5,fill:'#e3f3ff',stroke:'#143a70','stroke-width':3});
    add(g,'path',{d:'M94 20V10',stroke:'#143a70','stroke-width':3}); add(g,'circle',{cx:94,cy:38,r:4,fill:'#1bc5db',class:'server-lights'});
    add(g,'text',{x:128,y:34,class:'sensor-title'},name);add(g,'text',{x:128,y:55,class:'sensor-subtitle'},sub);
    wire(paths,`M398 ${y+38} C500 ${y+38} 555 300 635 300`,'raw');
  });
  const shapes={graph:'M-17 15V-15M-17 15H18M-12 6L-4 -4L4 0L15 -13',report:'M-13 -20H6L14 -12V19H-13ZM6 -20V-11H14M-7 -5H7M-7 2H7M-7 9H3',alert:'M-15 11H15L11 5V-5A11 11 0 0 0-11 -5V5ZM-4 17Q0 23 4 17M0 -19V-22',prediction:'M-18 13L-9 3L0 7M0 7L9 -8L18 -16M10 -17H19V-8'};
  const outputs=[['graph','Gráficos'],['report','Reportes'],['alert','Alertas'],['prediction','Predicciones']];
  const branches=svg.querySelector('.branches'),icons=svg.querySelector('.output-icons');
  outputs.forEach(([kind,label],i)=>{const y=90+i*135;wire(branches,`M1208 300C1300 300 1320 ${y} 1400 ${y}`,'branch');const g=add(icons,'g',{transform:`translate(1455 ${y})`});const icon=add(g,'g',{transform:'scale(1.55)'});add(icon,'rect',{x:-30,y:-30,width:60,height:60,rx:15,fill:'#edf6ff'});add(icon,'path',{d:shapes[kind],fill:'none',stroke:kind==='alert'?'#d08a49':'#0968d6','stroke-width':2.4,'stroke-linecap':'round','stroke-linejoin':'round'});add(g,'text',{x:60,y:6,class:'original-output'},label);});
  photo.replaceWith(scene);grid.classList.add('pipeline-hero');grid.prepend(scene);intro.classList.add('pipeline-intro-copy');
  const cover = grid.closest('.cover');
  if (cover) cover.querySelector('.cover-student').after(intro);
})();


// Operation narrative: equipment sold each month and the recurring service.
(() => {
 const page = document.querySelector('section[data-name="Operaci\u00f3n"]');
 if (!page) return;
 const icons = {
 rain:'<path d="M-18 -6a12 12 0 0 1 22-6 10 10 0 1 1 10 17h-32a9 9 0 0 1 0-18"/><g class="op-rain"><path d="M-11 15l-4 8M2 15l-4 8M15 15l-4 8"/></g>',
 level:'<path d="M-22 -19v39h44v-39M-20 5q10-9 20 0t20 0M-20 14q10-9 20 0t20 0"/><path d="M0-17v18m-5-5 5 5 5-5"/>',
 energy:'<path d="M5-24-15 5H0l-5 21L17-5H2Z"/>',
 temperature:'<path d="M-5 7v-25a6 6 0 0 1 12 0V7a12 12 0 1 1-12 0Z"/><path d="M1-10v27M15-12h7M15-2h7"/>',
 vibration:'<path class="op-wave" d="M-27 0h8l5-17 9 34L4-17l9 34 5-17h9"/>',
 pressure:'<path d="M-20 16a25 25 0 1 1 40 0M-16 12h32M0-18v5M-18-10l4 4M18-10l-4 4"/><g class="op-needle"><path d="M0 7 12-8"/><circle cx="0" cy="7" r="3"/></g>'
 };
 const symbols = '<defs>'+Object.entries(icons).map(([id,shape])=>`<g id="op-${id}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${shape}</g>`).join('')+'</defs>';
 const groups=[ [['rain','4 lluvia'],['level','4 nivel']], [['energy','Energ\u00eda'],['temperature','Temp. / humedad'],['vibration','Vibr. / corriente'],['pressure','Presi\u00f3n']], [['level','5 nivel'],['temperature','5 temp. / humedad']] ];
 page.querySelectorAll('.card').forEach((card,i)=>{
  const art=document.createElement('div');art.className='op-equipment';
  const items=groups[i], step=300/items.length;
  art.innerHTML=`<svg viewBox="0 0 300 110" role="img" aria-label="${card.querySelector('small').textContent}">${symbols}${items.map(([id,label],j)=>`<g transform="translate(${step*(j+.5)} 42)" class="op-device"><circle r="34" fill="#eaf5ff"/><use href="#op-${id}" color="#0876d5"/><text y="56" text-anchor="middle" fill="#35587c" font-size="${items.length>2?9:12}" font-weight="600">${label}</text></g>`).join('')}</svg>`;
  card.prepend(art);
 });
 const flow=document.createElement('div');flow.className='op-service';
 flow.innerHTML=`<div class="op-step"><svg viewBox="0 0 64 54" aria-hidden="true"><rect x="17" y="12" width="30" height="34" rx="5"/><path d="M32 12V3M24 25h16M24 34h9"/><circle class="op-pulse" cx="40" cy="34" r="3"/></svg><div><b>Venta e instalaci\u00f3n</b><span>La estaci\u00f3n llega al cliente</span></div></div><div class="op-connection"><i></i><i></i></div><div class="op-step"><svg viewBox="0 0 64 54" aria-hidden="true"><path d="M12 31a13 13 0 0 1 7-24 15 15 0 0 1 28 4 11 11 0 0 1 4 21H12"/><path class="op-data" d="M24 37v13M32 37v13M40 37v13"/></svg><div><b>Monitoreo continuo</b><span>Datos enviados al servicio</span></div></div><div class="op-connection"><i></i><i></i></div><div class="op-step"><svg viewBox="0 0 64 54" aria-hidden="true"><rect x="6" y="4" width="52" height="34" rx="4"/><path d="M24 49h16M32 38v11"/><path class="op-chart" d="m14 28 9-9 9 4 9-12 9 4"/></svg><div><b>Suscripci\u00f3n mensual</b><span>G. 2.000.000 por estaci\u00f3n*</span></div></div>`;
 page.querySelector('.cards').after(flow);
 const strip=page.querySelector('.strip');strip.classList.add('op-footnote');strip.textContent='* IVA incluido. Las operaciones y los clientes son supuestos acad\u00e9micos.';
})();


// Introduction to the monthly operations.
(() => {
  const operation = document.querySelector('section[data-name="Operación"]');
  operation.classList.add('operation-story');
  operation.querySelector('h2').innerHTML = '28 estaciones vendidas.<br><span>Un servicio que continúa.</span>';
  const summary = document.createElement('div');
  summary.className = 'operation-summary';
  summary.innerHTML = '<div><span class="eyebrow">VOLUMEN DEL TRIMESTRE</span><strong>28 <small>estaciones</small></strong><p>8 en agosto · 10 en septiembre · 10 en octubre</p></div><div><span class="eyebrow">SERVICIO POR ESTACIÓN</span><strong>G. 2.000.000 <small>/ mes*</small></strong><p>Suscripción al monitoreo, además de la venta del equipo.</p></div>';
  operation.querySelector('h2').after(summary);
  const descriptions = ['4 de lluvia + 4 de nivel', 'Energía · temperatura y humedad · vibración y corriente · presión', '5 de nivel + 5 de temperatura y humedad'];
  operation.querySelectorAll('.card').forEach((card, i) => {
    const heading = document.createElement('div');
    heading.className = 'operation-month';
    heading.append(card.querySelector('h3'), card.querySelector('strong'));
    card.prepend(heading);
    card.querySelector('small').textContent = descriptions[i];
  });

})();
