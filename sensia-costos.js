(() => {
  const page = document.querySelector('section[data-name="Costos"]');
  const data = window.sensiaCostData;
  if (!page || !data) return;
  page.classList.add('cost-story');
  page.innerHTML = `<div class="cost-heading"><div><span class="eyebrow">02 · DEL LIBRO DIARIO AL RESULTADO BRUTO</span><h2>Cómo el costo llega <span>a la venta.</span></h2></div><button class="cost-play">▶ Reproducir</button></div>
    <div class="cost-toolbar"><div class="cost-periods" role="group" aria-label="Período del análisis"></div><span class="cost-period-note">Importes del mes · G.</span></div>
    <div class="cost-stages" role="group" aria-label="Pasos de la explicación"></div>
    <div class="cost-layout"><article class="cost-ledger" aria-live="polite"></article><article class="cost-chart" aria-label="Gráfico de ingresos, costos y ganancia bruta"><div class="cost-chart-title"><h3>Ingresos − costos = ganancia bruta</h3><span>Millones de guaraníes · misma escala entre barras</span></div><div class="cost-chart-rows"></div><div class="cost-equation"></div><p class="cost-chart-note">La ganancia bruta todavía no descuenta los gastos operativos ni el impuesto.</p></article></div>
    <div class="cost-bottom"><span class="cost-explanation"></span><button class="cost-source">Ver asientos del Diario ↗</button></div>`;
  const stepNames = ['Elementos del costo', 'Inventario terminado', 'Venta y costo de ventas', 'Resultado bruto'];
  let period = 0, step = 0, playing = false, timer;
  const money = value => 'G. ' + new Intl.NumberFormat('es-PY').format(value);
  const million = value => new Intl.NumberFormat('es-PY', {minimumFractionDigits:2,maximumFractionDigits:2}).format(value / 1e6);
  const ledger = page.querySelector('.cost-ledger');
  const detail = document.createElement('dialog'); detail.className = 'script-dialog cost-detail';
  detail.setAttribute('aria-labelledby', 'cost-detail-title');
  detail.innerHTML = '<div class="script-heading"><div><span class="eyebrow">RESPALDO EN LA PLANILLA</span><h2 id="cost-detail-title">Asientos del Libro Diario</h2></div><button class="script-close">Cerrar ×</button></div><div class="cost-detail-body"></div>';
  detail.querySelector('.script-close').onclick = () => detail.close(); document.body.append(detail);
  function entryTable(entry) {
    return `<div class="cost-entry"><h3>${entry.label}${entry.date ? ' · ' + entry.date : ''}</h3>${entry.rows.length ? `<table><thead><tr><th>Cuenta</th><th>Debe</th><th>Haber</th></tr></thead><tbody>${entry.rows.map(r => `<tr><td><small>${r.code}</small>${r.account}</td><td>${r.debit ? money(r.debit) : '—'}</td><td>${r.credit ? money(r.credit) : '—'}</td></tr>`).join('')}</tbody></table><p>2-DIARIO GENERAL · ${entry.range}</p>` : '<p>El Diario aplica el criterio de iniciar la depreciación en septiembre.</p>'}</div>`;
  }
  function openDetails(element) {
    stop();
    const periods = period === 3 ? data.periods : [data.periods[period]];
    detail.querySelector('.cost-detail-body').innerHTML = periods.map(p => `<h3 class="cost-detail-month">${p.month}</h3>` + (element !== undefined ? entryTable(p.elements[element].entry) : p.elements.map(e => entryTable(e.entry)).join('') + entryTable(p.inventoryEntry) + p.saleEntries.map(entryTable).join('') + entryTable(p.costEntry) + p.serviceEntries.map(entryTable).join(''))).join('');
    detail.showModal();
  }
  page.querySelector('.cost-source').onclick = () => openDetails();
  function current() {
    if (period !== 3) return data.periods[period];
    return {...data.quarter, month:'Trimestre', units:28, elements:data.periods[0].elements.map((e,i) => ({label:e.label,value:data.periods.reduce((sum,p) => sum + p.elements[i].value,0)}))};
  }
  function stop() { playing = false; clearTimeout(timer); page.querySelector('.cost-play').textContent = '▶ Reproducir'; }
  function schedule() {
    timer = setTimeout(() => {
      if (!page.classList.contains('active')) { stop(); return; }
      if (step === 3) { stop(); return; }
      step++; render(); schedule();
    }, 6500);
  }
  page.querySelector('.cost-play').onclick = () => {
    if (playing) { stop(); return; }
    playing = true; step = 0; render(); page.querySelector('.cost-play').textContent = 'Ⅱ Pausar'; schedule();
  };
  [...data.periods.map(p => p.month), 'Trimestre'].forEach((name,i) => {
    const button = document.createElement('button'); button.textContent = name;
    button.onclick = () => { stop(); period = i; render(); };
    page.querySelector('.cost-periods').append(button);
  });
  stepNames.forEach((name,i) => {
    const button = document.createElement('button'); button.innerHTML = `<span>${i+1}</span>${name}`;
    button.onclick = () => { stop(); step = i; render(); };
    page.querySelector('.cost-stages').append(button);
  });
  function render() {
    const p = current();
    page.dataset.costStep = step;
    page.querySelectorAll('.cost-periods button').forEach((b,i) => b.setAttribute('aria-pressed',String(i === period)));
    page.querySelectorAll('.cost-stages button').forEach((b,i) => { b.setAttribute('aria-pressed',String(i === step)); b.classList.toggle('visited',i < step); });
    page.querySelector('.cost-period-note').textContent = period === 3 ? 'Agosto–octubre · acumulado · G.' : `${p.month} · importes del mes · G.`;
    if (step === 0) {
      const icons = ['▦','⇢','⚒','◷'];
      ledger.innerHTML = `<div class="cost-panel-heading"><span class="eyebrow">01 · FABRICAR ${p.units} ESTACIONES</span><h3>Cuatro elementos, un costo</h3></div><div class="cost-elements">${p.elements.map((e,i) => `<button class="cost-element" data-element="${i}" style="--delay:${i * .18}s"><span class="cost-element-icon">${icons[i]}</span><span><b>${e.label}</b><small>${i===0?'Sensores con descuento + electrónica + accesorios':i===1?'Transporte incorporado a producción':i===2?'Trabajo aplicado al ensamblaje':period===0?'Sin cuota en agosto; inicia en septiembre':'Uso de equipos aplicado a fabricación'}</small></span><strong>${money(e.value)}</strong></button>`).join('')}</div><div class="cost-panel-total"><span>Costo de estaciones fabricadas y vendidas</span><strong>${money(p.hardware)}</strong></div><p class="cost-panel-note">IVA crédito separado del costo. El descuento del 30 % se aplica solo a sensores; no se agrega el indirecto genérico del catálogo.</p>`;
      ledger.querySelectorAll('[data-element]').forEach(b => b.onclick = () => openDetails(Number(b.dataset.element)));
    } else if (step === 1) {
      ledger.innerHTML = `<div class="cost-panel-heading"><span class="eyebrow">02 · TERMINAR LA FABRICACIÓN</span><h3>De producción a inventario</h3></div><div class="cost-transfer"><div><span>ESTACIONES EN PROCESO</span><strong>${money(p.hardware)}</strong><small>Acumula materiales, flete, mano de obra y depreciación productiva.</small></div><span class="cost-transfer-arrow">↓</span><div><span>ESTACIONES TERMINADAS</span><strong>${p.units} unidades</strong><small>Se incorporan al inventario al costo de fabricación.</small></div></div><div class="cost-posting"><span><b>Debe</b> · Inventario de estaciones</span><span><b>Haber</b> · Estaciones en proceso</span></div><p class="cost-panel-note">${period===3?'Asientos 10, 28 y 57':p.inventoryEntry.label} · Este traslado todavía no reconoce una venta ni una ganancia.</p>`;
    } else if (step === 2) {
      const bank = period === 3 ? data.periods.reduce((sum,x) => sum + x.saleEntries.reduce((s,e) => s + e.rows.reduce((a,r) => a+r.debit,0),0),0) : p.saleEntries.reduce((s,e) => s+e.rows.reduce((a,r) => a+r.debit,0),0);
      ledger.innerHTML = `<div class="cost-panel-heading"><span class="eyebrow">03 · ENTREGAR Y VENDER</span><h3>La venta tiene dos registros</h3></div><div class="cost-posting-block"><h4>1. Cobro y venta de equipos</h4><p><b>Debe · Banco</b><strong>${money(bank)}</strong></p><p>Haber · Ventas netas<strong>${money(p.sales)}</strong></p><p>Haber · IVA a pagar<strong>${money(bank-p.sales)}</strong></p></div><div class="cost-posting-block"><h4>2. Salida del inventario al costo</h4><p><b>Debe · Costo de estaciones vendidas</b><strong>${money(p.hardware)}</strong></p><p>Haber · Inventario de estaciones<strong>${money(p.hardware)}</strong></p></div><p class="cost-panel-note">${period===3?'Asientos de costo 13, 40 y 65':p.costEntry.label} · Resumen por período. Las suscripciones se reconocen al prestar el servicio, no al cobrar anticipos.</p>`;
    } else {
      ledger.innerHTML = `<div class="cost-panel-heading"><span class="eyebrow">04 · RELACIONAR LAS CUENTAS</span><h3>Qué integra el resultado bruto</h3></div><div class="cost-result-groups"><div><span>INGRESOS OPERATIVOS</span><p>Ventas de estaciones <strong>${money(p.sales)}</strong></p><p>Suscripciones devengadas <strong>${money(p.service)}</strong></p></div><div><span>COSTOS OPERATIVOS</span><p>Estaciones vendidas <strong>${money(p.hardware)}</strong></p><p>Nube y conectividad <strong>${money(p.cloud)}</strong></p></div></div><div class="cost-profit-callout"><span>${p.gross>=0?'GANANCIA':'PÉRDIDA'} BRUTA</span><strong>${money(p.gross)}</strong></div><p class="cost-panel-note">Incluye equipos y servicios, como el ER. Alquiler, sueldos no productivos y otros gastos se descuentan después.</p>`;
    }
    const totalCosts = p.hardware + p.cloud;
    const rows = [
      ['Ingresos operativos',p.revenue,'income',`Equipos ${million(p.sales)} M + servicios ${million(p.service)} M`],
      ['Costos operativos',totalCosts,'expense',`Estaciones ${million(p.hardware)} M + nube ${million(p.cloud)} M`],
      [p.gross>=0?'Ganancia bruta':'Pérdida bruta',p.gross,'profit','Ingresos menos costos operativos']
    ];
    page.querySelector('.cost-chart-rows').innerHTML = rows.map(([label,value,color,note],i) => `<div class="cost-bar-row"><div class="cost-bar-label"><b>${label}</b><strong>${million(value)} M</strong></div><div class="cost-bar-track"><div class="cost-bar-fill ${color}" style="--bar-width:${Math.abs(value)/p.revenue*100}%;--delay:${i*.2}s"></div></div><small>${note}</small></div>`).join('');
    page.querySelector('.cost-equation').innerHTML = `<span>${million(p.revenue)} M</span><b>−</b><span>${million(totalCosts)} M</span><b>=</b><strong>${million(p.gross)} M</strong>`;
    const explanations = ['Seleccioná un elemento para ver su asiento. Los costos corresponden al Diario, con descuento aplicado.', 'Los costos se acumulan en producción y pasan al inventario cuando se terminan las estaciones.', 'Al vender: se reconoce el ingreso neto y, por separado, se lleva el inventario al costo de ventas.', 'Barras del mes seleccionado. Trimestre muestra el acumulado; todos los períodos presentan ganancia bruta.'];
    page.querySelector('.cost-explanation').textContent = explanations[step];
  }
  new MutationObserver(() => { if (!page.classList.contains('active')) stop(); }).observe(page,{attributes:true,attributeFilter:['class']});
  document.addEventListener('keydown', event => { if (detail.open && ['ArrowLeft','ArrowRight'].includes(event.key)) event.stopImmediatePropagation(); },true);
  render();
})();
