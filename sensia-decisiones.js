(() => {
  const page = document.querySelector('section[data-name="Decisiones"]');
  const data = window.sensiaCostData;
  if (!page || !data) return;

  const million = value => new Intl.NumberFormat('es-PY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 1e6);
  const decimal = value => new Intl.NumberFormat('es-PY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
  const october = data.periods[2];

  const drawings = {
    discount: '<path d="M16 19h25l16 16-24 24L9 35V19Z"/><circle cx="22" cy="30" r="3"/><path d="m35 33 11 11M44 33h.1M35 44h.1"/><path class="decision-icon-motion" d="M62 18v25m-7-7 7 7 7-7"/>',
    service: '<rect x="7" y="22" width="23" height="32" rx="5"/><path d="M18 22V13M13 33h11M13 42h6"/><rect x="48" y="22" width="28" height="24" rx="4"/><path d="M62 46v8M54 57h16"/><path class="decision-icon-motion" d="M33 31h11m-4-4 4 4-4 4M44 41H33m4-4-4 4 4 4"/>',
    validate: '<rect x="15" y="13" width="40" height="49" rx="5"/><rect x="25" y="8" width="20" height="10" rx="3"/><path d="M24 29h20M24 39h13M24 49h9"/><path class="decision-icon-motion" d="m60 34 15 25H45Z"/><path d="M60 44v6M60 54h.1"/>'
  };
  const decisions = [
    {
      kind: 'success', label: 'Decisión acertada', icon: 'discount',
      title: 'Comprar sensores con descuento'
    },
    {
      kind: 'success', label: 'Decisión acertada', icon: 'service',
      title: 'Combinar equipos y monitoreo'
    },
    {
      kind: 'improve', label: 'Decisión incorrecta', icon: 'validate',
      title: 'Fijar precios con supuestos'
    }
  ];
  const actions = [
    ['Validar costos', 'Confirmar precios de proveedores y descuentos.'],
    ['Proyectar ventas y caja', 'Estimar demanda, cobros y pagos.'],
    ['Completar registros', 'Liquidar IVA y prever IPS, aguinaldo e impuesto a la renta.'],
    ['Revisar cada mes', 'Controlar costos, margen, liquidez y vencimientos.']
  ];

  page.classList.add('decisions-story');
  page.innerHTML = `
    <div class="decisions-heading"><span class="eyebrow">EVALUACIÓN DEL PRIMER TRIMESTRE</span><h2>Qué aprendimos. <span>Qué haremos.</span></h2></div>
    <div class="decisions-evaluation">
      <div><span>Ganancia antes del impuesto</span><strong>${million(data.quarter.pretax)} M</strong><small>Resultado positivo del trimestre</small></div>
      <div><span>Saldo bancario de octubre</span><strong>${million(october.cashflow.closing)} M</strong><small>Incluye aportes y anticipos cobrados</small></div>
      <div><span>Liquidez corriente</span><strong>${decimal(data.periods[0].indices.liquidity)} <i>→</i> ${decimal(october.indices.liquidity)} ×</strong><small>La cobertura disminuye de agosto a octubre</small></div>
    </div>
    <div class="decision-cards"></div>
    <div class="decisions-next"><h3>Acciones para el siguiente trimestre</h3><div class="decisions-roadmap">${actions.map(([title, explanation], index) => `<div class="decision-next-step" style="--delay:${.6 + index * .15}s"><span class="decision-next-dot" aria-hidden="true"></span><strong>${title}</strong><p>${explanation}</p></div>`).join('')}</div></div>
    <p class="decisions-footnote">Evaluación de la simulación académica · Importes en millones de G. · Resultado antes del impuesto estimado, todavía sin contabilizar.</p>`;

  function animate() {
    page.classList.remove('decisions-animate');
    void page.offsetWidth;
    page.classList.add('decisions-animate');
  }
  new MutationObserver(records => {
    const enteredPage = records.some(record => !(record.oldValue || '').split(/\s+/).includes('active'));
    if (enteredPage && page.classList.contains('active')) animate();
  }).observe(page, {attributes: true, attributeFilter: ['class'], attributeOldValue: true});
  page.classList.add('decisions-illustrated');
  page.querySelector('.decisions-heading h2').innerHTML = 'Decisiones <span>del trimestre.</span>';
  const device = (x, y) => `<g transform="translate(${x} ${y})"><rect width="27" height="37" rx="5" fill="#e3f3ff" stroke="#17315c" stroke-width="2"/><path d="M14 0v-9" stroke="#17315c" stroke-width="2"/><circle class="decision-device-light" cx="14" cy="15" r="4" fill="#1bc5db"/><path d="M7 27h13" stroke="#7aafda" stroke-width="2"/></g>`;
  const art = [
    `<svg viewBox="0 0 360 190" role="img" aria-label="Compra al contado de ocho sensores con descuento del treinta por ciento"><ellipse cx="175" cy="166" rx="136" ry="12" fill="#e8eff7"/><g class="decision-box"><path d="m42 99 63-23 62 23v57l-62 22-63-22Z" fill="#dcecf9" stroke="#749cc1" stroke-width="2"/><path d="m42 99 63 23 62-23M105 122v56" fill="none" stroke="#749cc1" stroke-width="2"/><path d="m42 99-14-18 61-23 16 18 18-18 60 23-16 18-62 23Z" fill="#f1f8ff" stroke="#749cc1" stroke-width="2"/>${device(70,71)}${device(108,64)}${device(90,91)}</g><g class="decision-purchase-tag"><path d="M222 31h83l25 29-25 29h-83Z" fill="#138770"/><circle cx="314" cy="60" r="4" fill="#e9f8f3"/><text x="271" y="59" text-anchor="middle" fill="white" font-size="26" font-weight="800">−30 %</text><text x="271" y="77" text-anchor="middle" fill="#d1f0e4" font-size="10">SOLO SENSORES</text></g><path d="M188 112q35 0 37-22" fill="none" stroke="#138770" stroke-width="2" stroke-dasharray="5 5"/><g transform="translate(225 115)"><rect width="91" height="41" rx="8" fill="#edf8f4" stroke="#b9ddcd"/><text x="45" y="18" text-anchor="middle" fill="#138770" font-size="12" font-weight="700">8 o más</text><text x="45" y="33" text-anchor="middle" fill="#5d8274" font-size="10">al contado</text></g></svg>`,
    `<svg viewBox="0 0 360 190" role="img" aria-label="Estaciones instaladas transmiten datos al monitoreo por suscripción"><ellipse cx="178" cy="166" rx="145" ry="12" fill="#e8eff7"/><g transform="translate(30 87)">${device(0,0)}${device(35,13)}<path d="M12 40v32M49 53v19M0 73h63" stroke="#749cc1" stroke-width="3"/></g><path d="M95 104C127 104 117 55 153 55M199 55c32 0 18 49 48 49" fill="none" stroke="#bad5ec" stroke-width="3"/><path class="decision-data-flow" d="M95 104C127 104 117 55 153 55M199 55c32 0 18 49 48 49" fill="none" stroke="#1399dd" stroke-width="3" stroke-dasharray="5 13"/><path d="M148 63a16 16 0 0 1 1-31 24 24 0 0 1 45 2 15 15 0 0 1 1 30Z" fill="#e5f4ff" stroke="#096bdd" stroke-width="2"/><g transform="translate(243 83)"><rect width="89" height="61" rx="6" fill="white" stroke="#17315c" stroke-width="3"/><path d="M0 12h89M44 62v13M26 77h38" stroke="#17315c" stroke-width="3"/><rect x="9" y="22" width="18" height="27" rx="3" fill="#dcf0fc"/><path class="decision-monitor-chart" d="m35 46 11-12 10 5 12-16 11 4" fill="none" stroke="#138770" stroke-width="3"/></g><text x="63" y="69" text-anchor="middle" fill="#657a98" font-size="11">Estaciones</text><text x="288" y="69" text-anchor="middle" fill="#657a98" font-size="11">Monitoreo</text><g class="decision-renewal" transform="translate(165 118)"><path d="M-16 0a17 17 0 1 1 4 16M-16 0v-10M-16 0h10" fill="none" stroke="#138770" stroke-width="3"/><text x="0" y="6" text-anchor="middle" fill="#138770" font-size="15" font-weight="800">G.</text></g></svg>`,
    `<svg viewBox="0 0 360 190" role="img" aria-label="Revisar cotizaciones, costos y demanda antes de fijar precios"><ellipse cx="180" cy="166" rx="138" ry="12" fill="#e8eff7"/><g transform="translate(43 32) rotate(-6 44 60)"><rect width="91" height="121" rx="7" fill="#f4f8fd" stroke="#8ca7c5" stroke-width="2"/><text x="45" y="23" text-anchor="middle" fill="#657a98" font-size="11">COTIZACIÓN</text><path d="M17 42h58M17 55h43M17 68h51" stroke="#b0c8de" stroke-width="3"/><rect x="15" y="84" width="61" height="22" rx="5" fill="#e3edf7"/><text x="45" y="100" text-anchor="middle" fill="#7490ae" font-size="13">G. ?</text></g><g transform="translate(190 36)"><rect width="111" height="119" rx="8" fill="white" stroke="#17315c" stroke-width="2"/><rect x="27" y="-7" width="57" height="16" rx="5" fill="#dcecf9" stroke="#17315c" stroke-width="2"/><text x="55" y="32" text-anchor="middle" fill="#17315c" font-size="11" font-weight="700">VALIDAR PRECIO</text><g class="decision-checkmarks" fill="none" stroke="#138770" stroke-width="3"><path d="m15 50 5 5 9-11M15 72l5 5 9-11M15 94l5 5 9-11"/></g><g fill="#536987" font-size="11"><text x="37" y="54">Costos</text><text x="37" y="76">Demanda</text><text x="37" y="98">Margen</text></g></g><g class="decision-magnifier"><circle cx="151" cy="109" r="26" fill="#eaf3ffcc" stroke="#b98436" stroke-width="5"/><path d="m169 129 22 24" stroke="#b98436" stroke-width="9" stroke-linecap="round"/><path d="M139 108h24M151 96v24" stroke="#b98436" stroke-width="2"/></g></svg>`
  ];
  const descriptions = [
    ['Comprar sensores con descuento', '30 %', 'de ahorro en el precio de los sensores', 'El menor precio de compra reduce el costo de las estaciones.', 'Confirmar cantidades, cotizaciones y descuento.'],
    ['Vender equipos y monitoreo', million(data.quarter.service) + ' M', 'de ingresos por suscripciones devengadas', 'El monitoreo suma ingresos al negocio de equipos.', 'Proyectar renovaciones, cobros y costo del servicio.'],
    ['Fijar precios con supuestos', 'Validar', 'cotizaciones, costos y demanda', 'El costo base del catálogo difiere del costo registrado con descuento y depreciación. Usarlo sin conciliar distorsiona el margen esperado.', 'Verificar los datos antes de ajustar precios.']
  ];
  page.querySelector('.decision-cards').innerHTML = descriptions.map(([title, value, label, effect], index) => `
    <article class="decision-picture-card ${index === 2 ? 'review' : 'positive'}" style="--delay:${index * .2}s">
      <span class="decision-picture-kind">${index === 2 ? '↗ Decisión incorrecta' : '✓ Decisión acertada'}</span>
      <div class="decision-picture">${art[index]}</div>
      <h3>${title}</h3>
      <div class="decision-picture-value"><strong>${value}</strong><span>${label}</span></div>
      <p>${effect}</p>
    </article>`).join('');
  animate();

})();
