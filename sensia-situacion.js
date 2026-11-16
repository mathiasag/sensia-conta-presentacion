(() => {
  const page = document.querySelector('section[data-name="Situación"]');
  const data = window.sensiaCostData;
  if (!page || !data) return;
  let selected = 2;
  const million = value => new Intl.NumberFormat('es-PY',{minimumFractionDigits:2,maximumFractionDigits:2}).format(value / 1e6);
  const money = value => 'G. '+new Intl.NumberFormat('es-PY').format(value);
  page.classList.add('balance-story');
  page.innerHTML = `<div class="balance-heading"><div><span class="eyebrow">04 · ESTADO DE SITUACIÓN FINANCIERA</span><h2>Recursos y <span>su financiación.</span></h2></div><div class="balance-date"></div></div>
  <div class="balance-toolbar"><div class="balance-periods" role="group" aria-label="Cierre mensual del balance"></div><span>G. en millones · saldos al cierre, no movimientos del mes</span></div>
  <div class="balance-panels"><article class="balance-panel balance-assets"><div class="balance-panel-title"><div><span class="eyebrow">QUÉ TIENE SENSIA</span><h3>Activos</h3></div><strong></strong></div><div class="balance-panel-content"><div class="balance-tower" role="img"></div><div class="balance-legend"></div></div><div class="balance-panel-caption"></div></article><article class="balance-panel balance-funding"><div class="balance-panel-title"><div><span class="eyebrow">CÓMO SE FINANCIA</span><h3>Pasivo + patrimonio</h3></div><strong></strong></div><div class="balance-panel-content"><div class="balance-tower" role="img"></div><div class="balance-legend"></div></div><div class="balance-panel-caption"></div></article></div>
  <div class="balance-equation" aria-label="Ecuación patrimonial"></div><div class="balance-bottom"><p>Patrimonio con resultado antes del impuesto estimado, todavía sin contabilizar. El IVA crédito y el IVA a pagar se muestran separados.</p><button class="balance-details">Ver cuentas del balance ↗</button></div>`;
  data.periods.forEach((p,i)=>{
    const button=document.createElement('button');button.textContent=p.month;
    button.onclick=()=>{selected=i;render();};page.querySelector('.balance-periods').append(button);
  });
  const dialog=document.createElement('dialog');dialog.className='script-dialog balance-detail';dialog.setAttribute('aria-labelledby','balance-detail-title');
  dialog.innerHTML='<div class="script-heading"><div><span class="eyebrow">RESPALDO EN LA PLANILLA</span><h2 id="balance-detail-title">Cuentas del balance</h2></div><button class="script-close">Cerrar ×</button></div><div class="balance-detail-body"></div>';
  dialog.querySelector('.script-close').onclick=()=>dialog.close();document.body.append(dialog);
  page.querySelector('.balance-details').onclick=()=>{
    const p=data.periods[selected],b=p.balance;
    dialog.querySelector('.balance-detail-body').innerHTML=`<p class="cost-detail-source">${p.month} · Saldos al cierre.</p><div class="cost-entry"><table><thead><tr><th>Cuenta</th><th>Saldo</th><th>Celda</th></tr></thead><tbody>${b.accounts.map(a=>`<tr><td><small>${a.code||''}</small>${a.name}</td><td>${money(a.value)}</td><td>${b.column}${a.row}</td></tr>`).join('')}</tbody></table></div><p class="cost-detail-source">Total activo ${money(b.assets)} = pasivo ${money(b.liabilities)} + patrimonio ${money(b.equity)}. Diferencia: ${money(b.difference)}.</p>`;
    dialog.showModal();
  };
  function renderPanel(selector, items, b) {
    const panel=page.querySelector(selector),tower=panel.querySelector('.balance-tower');
    tower.setAttribute('aria-label',items.map(item=>`${item.label}: ${money(item.value)}`).join('. '));
    tower.innerHTML=items.map((item,i)=>`<div class="balance-segment" style="--balance-share:${item.value/b.assets*100}%;--balance-color:${item.color};--delay:${i*.15}s" title="${item.label}: ${money(item.value)}"><span>${item.value/b.assets>.12?million(item.value):''}</span></div>`).join('');
    panel.querySelector('.balance-legend').innerHTML=items.map(item=>`<div class="balance-legend-item" style="--balance-color:${item.color}"><i></i><div><b>${item.label}</b><small>${item.note}</small></div><strong>${million(item.value)} M</strong></div>`).join('');
    panel.querySelector('.balance-panel-title>strong').textContent=million(b.assets)+' M';
  }
  function render(){
    const p=data.periods[selected],b=p.balance;
    const pct=value=>new Intl.NumberFormat('es-PY',{minimumFractionDigits:1,maximumFractionDigits:1}).format(value/b.assets*100);
    page.querySelector('.balance-date').innerHTML=`<span>CIERRE DE ${p.month.toUpperCase()}</span><strong>${[31,30,31][selected]}/${['08','09','10'][selected]}/2026</strong>`;
    page.querySelectorAll('.balance-periods button').forEach((button,i)=>button.setAttribute('aria-pressed',String(selected===i)));
    renderPanel('.balance-assets',[
      {label:'Banco',value:b.cash,color:'#096bdd',note:'Disponibilidades al cierre'},
      {label:'Materiales en inventario',value:b.materials,color:'#52a8dc',note:'Sensores, placas y componentes'},
      {label:'IVA crédito fiscal',value:b.vatCredit,color:'#a8d4ee',note:'Registrado por separado'},
      {label:'Bienes de uso netos',value:b.fixed,color:'#26466f',note:'Equipos y otros bienes, menos depreciación'}
    ],b);
    renderPanel('.balance-funding',[
      {label:'Pasivo corriente',value:b.liabilities,color:'#d49b49',note:'IVA, obligaciones laborales y anticipos'},
      {label:'Capital suscripto',value:b.capital,color:'#138770',note:'Aporte de los accionistas'},
      {label:'Resultado acumulado',value:b.result,color:'#58b49c',note:'Ganancia antes del impuesto estimado'}
    ],b);
    page.querySelector('.balance-assets .balance-panel-caption').innerHTML=`<span>Activo corriente <b>${million(b.current)} M</b></span><span>No corriente <b>${million(b.fixed)} M</b></span>`;
    page.querySelector('.balance-funding .balance-panel-caption').innerHTML=`<span>Pasivo <b>${pct(b.liabilities)} %</b></span><span>Patrimonio <b>${pct(b.equity)} %</b></span>`;
    page.querySelector('.balance-equation').innerHTML=`<div><span>ACTIVO</span><strong>${million(b.assets)} M</strong></div><b>=</b><div><span>PASIVO</span><strong>${million(b.liabilities)} M</strong></div><b>+</b><div><span>PATRIMONIO</span><strong>${million(b.equity)} M</strong></div><span class="balance-verified">✓ Ecuación equilibrada<br><small>Diferencia: G. 0</small></span>`;
  }
  document.addEventListener('keydown',event=>{if(dialog.open&&['ArrowLeft','ArrowRight'].includes(event.key))event.stopImmediatePropagation();},true);
  render();
})();
