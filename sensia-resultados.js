(() => {
  const page = document.querySelector('section[data-name="Resultados"]');
  const data = window.sensiaCostData;
  if (!page || !data) return;
  let selected = 3, cumulative = false;
  const million = value => new Intl.NumberFormat('es-PY',{minimumFractionDigits:2,maximumFractionDigits:2}).format(value/1e6);
  page.classList.add('results-story');
  page.innerHTML = `<div class="results-heading"><div><span class="eyebrow">03 · ESTADO DE RESULTADOS</span><h2>De los ingresos <span>a la ganancia.</span></h2></div><div class="results-headline"><span>ANTES DEL IMPUESTO · TRIMESTRE</span><strong>G. ${million(data.quarter.pretax)} M</strong></div></div>
  <div class="results-toolbar"><div class="results-periods" role="group" aria-label="Período del Estado de Resultados"></div><span>G. en millones · 8-ER de la v2 · importes mensuales</span></div>
  <div class="results-distribution"><article class="results-allocation"><div class="results-allocation-heading"><span class="eyebrow">EL TOTAL DE INGRESOS · 100 %</span><strong></strong></div><h3>Cómo se distribuyen los ingresos</h3><div class="results-stacked-bar" role="img"></div><div class="results-allocation-legend"></div></article><aside class="results-profit"><span class="eyebrow">LO QUE QUEDA</span><div class="results-profit-main"></div><div class="results-profit-steps"></div></aside></div>
  <div class="results-evolution-heading"><h3>Ganancia antes del impuesto por mes</h3><div class="results-mode" role="group" aria-label="Tipo de evolución"><button aria-pressed="true">Mensual</button><button aria-pressed="false">Acumulada</button></div></div>
  <div class="results-months"></div><p class="results-footnote">Impuesto: estimación del 10 % sobre la ganancia contable positiva, todavía sin asiento. El resultado neto es estimado.</p>`;
  const parts = [
    ['Costos operativos','costs','#176ed3','Estaciones vendidas + nube'],
    ['Gastos operativos','expenses','#91afd2','Sueldos, alquiler y otros gastos'],
    ['Impuesto estimado','tax','#e0a44f','Estimación; todavía sin asiento'],
    ['Ganancia neta estimada','net','#138770','Saldo después de las deducciones']
  ];
  [...data.periods.map(p=>p.month),'Trimestre'].forEach((label,i)=>{
    const button=document.createElement('button'); button.textContent=label;
    button.onclick=()=>{selected=i;render();};page.querySelector('.results-periods').append(button);
  });
  page.querySelectorAll('.results-mode button').forEach((button,i)=>button.onclick=()=>{cumulative=Boolean(i);renderMonths();});
  function renderMonths(){
    const values=data.periods.map(p=>cumulative?p.results.cumulativePretax:p.results.pretax);
    const max=Math.max(...values);
    page.querySelector('.results-evolution-heading h3').textContent=cumulative?'Ganancia antes del impuesto acumulada':'Ganancia antes del impuesto por mes';
    page.querySelectorAll('.results-mode button').forEach((b,i)=>b.setAttribute('aria-pressed',String(Boolean(i)===cumulative)));
    page.querySelector('.results-months').innerHTML=data.periods.map((p,i)=>`<button class="results-month ${selected===i?'selected':''}" data-month="${i}" aria-label="Ver Estado de Resultados de ${p.month}"><div><span>${p.month}</span><strong>${million(values[i])} M</strong></div><div class="results-mini-track"><i style="--result-width:${values[i]/max*100}%;--delay:${i*.15}s"></i></div><small>${cumulative?'Desde agosto hasta este cierre':'Resultado exclusivo del mes'}</small></button>`).join('');
    page.querySelectorAll('.results-month').forEach(b=>b.onclick=()=>{selected=Number(b.dataset.month);render();});
  }
  function render(){
    const p=selected===3?data.quarter:{...data.periods[selected],...data.periods[selected].results};
    const values={...p,costs:p.hardware+p.cloud};
    const title=selected===3?'TRIMESTRE':data.periods[selected].month.toUpperCase();
    page.querySelectorAll('.results-periods button').forEach((b,i)=>b.setAttribute('aria-pressed',String(selected===i)));
    page.querySelector('.results-toolbar>span').textContent = 'G. en millones · 8-ER de la v2 · ' + (selected === 3 ? 'trimestre acumulado' : 'importes exclusivos del mes');
    const percent=value=>new Intl.NumberFormat('es-PY',{minimumFractionDigits:2,maximumFractionDigits:2}).format(value/values.revenue*100);
    page.querySelector('.results-headline>span').textContent='ANTES DEL IMPUESTO · '+title;
    page.querySelector('.results-headline strong').textContent='G. '+million(values.pretax)+' M';
    page.querySelector('.results-allocation-heading>strong').textContent= 'G. '+million(values.revenue)+' M';
    const bar=page.querySelector('.results-stacked-bar');
    bar.setAttribute('aria-label',parts.map(([label,key])=>`${label}: ${million(values[key])} millones; ${percent(values[key])} por ciento`).join('. '));
    bar.innerHTML=parts.map(([label,key,color],i)=>`<div style="--share:${values[key]/values.revenue*100}%;--part-color:${color};--delay:${i*.12}s" title="${label}: ${percent(values[key])} %"><span>${values[key]/values.revenue>.06?percent(values[key])+' %':''}</span></div>`).join('');
    page.querySelector('.results-allocation-legend').innerHTML=parts.map(([label,key,color,note])=>`<div style="--part-color:${color}"><div class="results-legend-label"><i></i><b>${label}</b><span>${percent(values[key])} %</span></div><strong>${million(values[key])} M</strong><small>${note}</small></div>`).join('');
    page.querySelector('.results-profit-main').innerHTML=`<span>GANANCIA NETA ESTIMADA</span><strong>${million(values.net)} <small>M</small></strong><p>De cada G. 100 de ingresos,<br>quedan <b>G. ${percent(values.net)}</b> de ganancia estimada.</p>`;
    page.querySelector('.results-profit-steps').innerHTML=`<div><span>Ganancia bruta</span><strong>${million(values.gross)} M</strong><small>Ingresos − costos operativos</small></div><div><span>Antes del impuesto</span><strong>${million(values.pretax)} M</strong><small>Ganancia bruta − gastos operativos</small></div>`;
    renderMonths();
  }
  render();
})();
