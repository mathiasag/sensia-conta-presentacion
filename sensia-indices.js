(() => {
  const page = document.querySelector('section[data-name="Índices"]');
  const data = window.sensiaCostData;
  if (!page || !data) return;

  let selectedMonth = 2;
  const decimal = value => new Intl.NumberFormat('es-PY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
  const percent = value => decimal(value * 100) + ' %';
  const million = value => decimal(value / 1e6) + ' M';
  const metrics = [
    {key: 'liquidity', title: 'Liquidez corriente', color: '#096bdd', unit: '×', formula: 'Activo corriente / pasivo corriente'},
    {key: 'debtAssets', title: 'Pasivo sobre activos', color: '#be873b', unit: '%', formula: 'Pasivo total / activo total'},
    {key: 'margin', title: 'Margen neto estimado', color: '#138770', unit: '%', formula: 'Resultado neto estimado / ingresos acumulados'}
  ];

  page.classList.add('ratios-story');
  page.innerHTML = `
    <div class="ratios-heading"><div><span class="eyebrow">ANÁLISIS FINANCIERO</span><h2>Indicadores <span>para decidir.</span></h2></div><span class="ratios-period-label"></span></div>
    <div class="ratios-toolbar"><div class="ratios-periods" role="group" aria-label="Cierre de los indicadores"></div><span>Liquidez y pasivo al cierre · margen acumulado desde agosto</span></div>
    <div class="ratios-cards"></div>
    <div class="ratios-bottom"><p>Impuesto estimado todavía sin contabilizar. Los rendimientos corresponden al período de la simulación.</p><button class="ratios-details">Ver fórmulas y demás índices ↗</button></div>`;

  data.periods.forEach((period, index) => {
    const button = document.createElement('button');
    button.textContent = period.month;
    button.onclick = () => { selectedMonth = index; render(); };
    page.querySelector('.ratios-periods').append(button);
  });

  function trend(metric) {
    const values = data.periods.map(period => period.indices[metric.key]);
    const maximum = Math.max(...values) * 1.15;
    const points = values.map((value, index) => [28 + index * 122, 51 - value / maximum * 43]);
    return `<div class="ratio-trend"><span>Evolución de agosto a octubre</span><svg viewBox="0 0 300 70" role="img" aria-label="${metric.title} en agosto, septiembre y octubre"><path d="M28 54H272" stroke="#e4edf7" fill="none"/><path class="ratio-trend-line" d="${points.map(([x, y], index) => `${index ? 'L' : 'M'}${x} ${y}`).join(' ')}" stroke="${metric.color}" stroke-width="3" stroke-linecap="round" fill="none"/>${points.map(([x, y], index) => `<circle cx="${x}" cy="${y}" r="${index === selectedMonth ? 6 : 4}" fill="${metric.color}" stroke="white" stroke-width="2"/><text x="${x}" y="68" text-anchor="middle" font-size="12" fill="#536987">${metric.unit === '×' ? decimal(values[index]) + '×' : percent(values[index])}</text>`).join('')}</svg></div>`;
  }

  function liquidityGraphic(balance) {
    const height = 95;
    return `<svg viewBox="0 0 300 133" role="img" aria-label="Activo corriente ${million(balance.current)} frente a pasivo corriente ${million(balance.liabilities)}"><line x1="30" y1="106" x2="270" y2="106" stroke="#dce7f5"/><rect class="ratio-column" x="52" y="11" width="64" height="${height}" rx="5" fill="#096bdd"/><rect class="ratio-column" x="184" y="${106 - height * balance.liabilities / balance.current}" width="64" height="${height * balance.liabilities / balance.current}" rx="5" fill="#a9c9eb"/><text x="84" y="32" text-anchor="middle" fill="white" font-size="16" font-weight="800">${million(balance.current)}</text><text x="216" y="${98 - height * balance.liabilities / balance.current}" text-anchor="middle" fill="#35587c" font-size="15" font-weight="800">${million(balance.liabilities)}</text><text x="84" y="127" text-anchor="middle" fill="#536987" font-size="12">Activo corriente</text><text x="216" y="127" text-anchor="middle" fill="#536987" font-size="12">Pasivo corriente</text></svg>`;
  }

  function debtGraphic(balance, ratio) {
    const circumference = 2 * Math.PI * 43;
    return `<svg viewBox="0 0 300 133" role="img" aria-label="${percent(ratio)} del activo financiado con pasivos y ${percent(1 - ratio)} con patrimonio"><circle cx="77" cy="64" r="43" fill="none" stroke="#138770" stroke-width="19"/><circle class="ratio-ring" cx="77" cy="64" r="43" fill="none" stroke="#ce9b50" stroke-width="19" stroke-dasharray="${ratio * circumference} ${circumference}" transform="rotate(-90 77 64)"/><text x="77" y="64" text-anchor="middle" font-size="20" font-weight="800" fill="#17315c">100 %</text><text x="77" y="81" text-anchor="middle" font-size="11" fill="#7185a0">del activo</text><circle cx="151" cy="47" r="5" fill="#ce9b50"/><text x="164" y="51" font-size="13" fill="#536987">Pasivo</text><text x="164" y="70" font-size="18" font-weight="800" fill="#be873b">${percent(ratio)}</text><circle cx="151" cy="91" r="5" fill="#138770"/><text x="164" y="95" font-size="13" fill="#536987">Patrimonio</text><text x="164" y="114" font-size="18" font-weight="800" fill="#138770">${percent(1 - ratio)}</text></svg>`;
  }

  function marginGraphic(ratio) {
    return `<svg viewBox="0 0 300 133" role="img" aria-label="Por cada cien guaraníes de ingresos quedan ${decimal(ratio * 100)} guaraníes de ganancia neta estimada"><line x1="30" y1="106" x2="270" y2="106" stroke="#dce7f5"/><rect class="ratio-column" x="52" y="11" width="64" height="95" rx="5" fill="#c2dfd6"/><text x="84" y="35" text-anchor="middle" font-size="18" font-weight="800" fill="#355e53">G. 100</text><rect class="ratio-column" x="184" y="${106 - 95 * ratio}" width="64" height="${95 * ratio}" rx="5" fill="#138770"/><text x="216" y="${97 - 95 * ratio}" text-anchor="middle" font-size="18" font-weight="800" fill="#138770">G. ${decimal(ratio * 100)}</text><text x="84" y="127" text-anchor="middle" fill="#536987" font-size="12">Ingresos</text><text x="216" y="127" text-anchor="middle" fill="#536987" font-size="12">Neto estimado</text></svg>`;
  }

  function render() {
    const period = data.periods[selectedMonth];
    const ratios = period.indices;
    const balance = period.balance;
    page.querySelector('.ratios-period-label').textContent = period.month + ' de 2026';
    page.querySelectorAll('.ratios-periods button').forEach((button, index) => {
      button.setAttribute('aria-pressed', String(index === selectedMonth));
    });
    const graphics = [liquidityGraphic(balance), debtGraphic(balance, ratios.debtAssets), marginGraphic(ratios.margin)];
    const interpretations = [
      `Por cada G. 1 de pasivo corriente, hay G. ${decimal(ratios.liquidity)} de activo corriente. Vigilar caja y vencimientos.`,
      `${percent(ratios.debtAssets)} del activo está financiado con pasivos. Incluye obligaciones y anticipos de clientes.`,
      `Por cada G. 100 de ingresos acumulados, quedan G. ${decimal(ratios.margin * 100)} de ganancia neta estimada.`
    ];
    const related = [
      `<span>Prueba ácida</span><strong>${decimal(ratios.quick)} ×</strong><small>Cobertura excluyendo inventarios</small>`,
      `<span>Pasivo / patrimonio</span><strong>${percent(ratios.debtEquity)}</strong><small>Obligaciones respecto al patrimonio</small>`,
      `<span>ROA ${percent(ratios.roa)}</span><strong>ROE ${percent(ratios.roe)}</strong><small>Rendimientos acumulados estimados</small>`
    ];
    page.querySelector('.ratios-cards').innerHTML = metrics.map((metric, index) => `<article class="ratio-card" style="--ratio-color:${metric.color};--delay:${index * .15}s"><div class="ratio-title"><h3>${metric.title}</h3><strong>${metric.unit === '×' ? decimal(ratios[metric.key]) + ' ×' : percent(ratios[metric.key])}</strong></div><div class="ratio-graphic">${graphics[index]}</div><p class="ratio-formula">${metric.formula}</p><p class="ratio-interpretation">${interpretations[index]}</p>${trend(metric)}<div class="ratio-related">${related[index]}</div></article>`).join('');
  }

  const dialog = document.createElement('dialog');
  dialog.className = 'script-dialog ratios-detail';
  dialog.setAttribute('aria-labelledby', 'ratios-detail-title');
  dialog.innerHTML = '<div class="script-heading"><div><span class="eyebrow">RESPALDO EN LA PLANILLA</span><h2 id="ratios-detail-title">Índices financieros</h2></div><button class="script-close">Cerrar ×</button></div><div class="ratios-detail-body"></div>';
  dialog.querySelector('.script-close').onclick = () => dialog.close();
  document.body.append(dialog);
  page.querySelector('.ratios-details').onclick = () => {
    const period = data.periods[selectedMonth];
    const ratios = period.indices;
    const groups = ['Liquidez', 'Apalancamiento financiero', 'Actividad', 'Productividad'];
    const formatted = row => typeof row.value === 'number' ? row.unit === '%' ? percent(row.value) : decimal(row.value) + ' ' + row.unit : row.value;
    dialog.querySelector('.ratios-detail-body').innerHTML = `<p class="cost-detail-source">${period.month} · Valores del cierre seleccionado y decisiones basadas en el trimestre completo.</p>${groups.map((group, index) => `<h3>${index + 1}. ${group}</h3><div class="cost-entry"><table><thead><tr><th>Ratio y fórmula</th><th>Valor</th><th>PI de la guía</th><th>Explicación y decisión trimestral</th><th>Celda</th></tr></thead><tbody>${ratios.rows.filter(row => row.group === index + 1).map(row => `<tr><td>${row.name}<small>${row.formula}</small></td><td>${formatted(row)}</td><td>${typeof row.reference === 'number' ? row.unit === '%' ? percent(row.reference) : decimal(row.reference) + ' ' + row.unit : row.reference}</td><td><small>${row.note}</small><p>${row.decision}</p></td><td>${ratios.column}${row.row}</td></tr>`).join('')}</tbody></table></div>`).join('')}<p class="cost-detail-source">Los PI proceden de la guía aportada. Las ventas y utilidades son acumuladas. La comparación requiere períodos equivalentes. Cobertura de intereses N/A por ausencia de intereses y cobranza de 0 días por ventas al contado.</p>`;
    dialog.showModal();
  };
  document.addEventListener('keydown', event => {
    if (dialog.open && ['ArrowLeft', 'ArrowRight'].includes(event.key)) event.stopImmediatePropagation();
  }, true);
  render();
})();
