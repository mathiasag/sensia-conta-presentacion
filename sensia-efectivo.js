(() => {
  const page = document.querySelector('section[data-name="Efectivo"]');
  const data = window.sensiaCostData;
  if (!page || !data) return;

  let selectedMonth = 2;
  const million = value => new Intl.NumberFormat('es-PY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 1e6);
  const money = value => 'G. ' + new Intl.NumberFormat('es-PY').format(value);
  const signedMillion = value => (value > 0 ? '+' : '') + million(value) + ' M';

  page.classList.add('cash-story');
  page.innerHTML = `
    <div class="cash-heading">
      <div><span class="eyebrow">ESTADO DE FLUJOS DE EFECTIVO</span><h2>De los cobros <span>al saldo final.</span></h2></div>
      <button class="cash-replay">↻ Repetir animación</button>
    </div>
    <div class="cash-months" role="group" aria-label="Mes del flujo de efectivo"></div>
    <div class="cash-main">
      <article class="cash-receipts cash-panel">
        <div class="cash-panel-heading"><span class="cash-icon" aria-hidden="true">↓</span><h3>Cobros de operación</h3></div>
        <strong class="cash-receipts-total"></strong>
        <div class="cash-receipts-items"></div>
        <p>Ventas y suscripciones cobradas, incluidos anticipos.</p>
      </article>
      <div class="cash-link cash-link-in" aria-hidden="true"><i></i><i></i><span>→</span></div>
      <article class="cash-bank">
        <div class="cash-bank-drawing" aria-hidden="true"><div class="cash-bank-roof">▰</div><div class="cash-bank-pillars"><i></i><i></i><i></i></div><div class="cash-bank-base"></div></div>
        <span>SALDO BANCARIO AL CIERRE</span><strong class="cash-closing"></strong>
        <div class="cash-change"></div>
        <small class="cash-bank-period"></small>
      </article>
      <div class="cash-link cash-link-out" aria-hidden="true"><i></i><i></i><span>→</span></div>
      <article class="cash-payments cash-panel">
        <div class="cash-panel-heading"><span class="cash-icon" aria-hidden="true">↑</span><h3>Pagos de operación</h3></div>
        <strong class="cash-payments-total"></strong>
        <div class="cash-payments-items"></div>
        <p>Pagos efectuados durante el mes.</p>
      </article>
    </div>
    <div class="cash-reconciliation" aria-label="Conciliación del saldo de efectivo"></div>
    <div class="cash-bottom"><p>Importes en millones de G. · Cobros y pagos incluyen IVA. Pagos de impuestos registrados en el trimestre, G. 0. Quedan IPS, aguinaldo e impuestos pendientes. Aportes de bienes fuera del flujo.</p><button class="cash-details">Ver detalle del EFE ↗</button></div>`;

  data.periods.forEach((period, index) => {
    const button = document.createElement('button');
    button.className = 'cash-month';
    button.innerHTML = `<div><span>${period.month}</span><strong>${million(period.cashflow.closing)} M</strong></div><div class="cash-month-track"><i style="--cash-width:${period.cashflow.closing / data.periods[2].cashflow.closing * 100}%"></i></div><small>Saldo bancario al cierre</small>`;
    button.onclick = () => {
      selectedMonth = index;
      render();
    };
    page.querySelector('.cash-months').append(button);
  });

  const detail = document.createElement('dialog');
  detail.className = 'script-dialog cash-detail';
  detail.setAttribute('aria-labelledby', 'cash-detail-title');
  detail.innerHTML = '<div class="script-heading"><div><span class="eyebrow">RESPALDO EN LA PLANILLA</span><h2 id="cash-detail-title">Estado de Flujos de Efectivo</h2></div><button class="script-close">Cerrar ×</button></div><div class="cash-detail-body"></div>';
  detail.querySelector('.script-close').onclick = () => detail.close();
  document.body.append(detail);
  page.querySelector('.cash-details').onclick = () => {
    const period = data.periods[selectedMonth];
    const cash = period.cashflow;
    detail.querySelector('.cash-detail-body').innerHTML = `<p class="cost-detail-source">${period.month} · Movimientos del mes y conciliación del saldo.</p><div class="cost-entry"><table><thead><tr><th>Concepto</th><th>Importe</th><th>Celda</th></tr></thead><tbody>${cash.lines.map(line => `<tr><td>${line.label}</td><td>${money(line.value)}</td><td>${cash.column}${line.row}</td></tr>`).join('')}</tbody></table></div><p class="cost-detail-source">Saldo al cierre conciliado con Banco en el Mayor y el Estado de Situación Financiera. Pendientes al cierre seleccionado, IPS G. ${new Intl.NumberFormat('es-PY').format(period.outstanding.ips)}, aguinaldo G. ${new Intl.NumberFormat('es-PY').format(period.outstanding.aguinaldo)} e IVA neto G. ${new Intl.NumberFormat('es-PY').format(period.outstanding.vat)}. El IRE del ER es estimado y aún no tiene asiento.</p>`;
    detail.showModal();
  };

  function replay() {
    page.classList.remove('cash-animate');
    void page.offsetWidth;
    page.classList.add('cash-animate');
  }

  page.querySelector('.cash-replay').onclick = replay;

  function render() {
    const period = data.periods[selectedMonth];
    const cash = period.cashflow;
    page.querySelectorAll('.cash-month').forEach((button, index) => {
      button.setAttribute('aria-pressed', String(index === selectedMonth));
    });
    page.querySelector('.cash-receipts-total').textContent = '+' + million(cash.receipts) + ' M';
    page.querySelector('.cash-payments-total').textContent = '−' + million(cash.payments) + ' M';
    page.querySelector('.cash-receipts-items').innerHTML = `
      <div class="cash-receipt-item"><span>Venta de estaciones</span><strong>${million(cash.sales)} M</strong><i style="--cash-width:${cash.sales / cash.receipts * 100}%"></i></div>
      <div class="cash-receipt-item"><span>Suscripciones cobradas</span><strong>${million(cash.subscriptions)} M</strong><i style="--cash-width:${cash.subscriptions / cash.receipts * 100}%"></i></div>`;
    const paymentLines = cash.lines.filter(line => line.row >= 15 && line.row <= 20);
    const otherPayments = -paymentLines.filter(line => line.row >= 18).reduce((sum, line) => sum + line.value, 0);
    const paymentGroups = [
      ['Materiales y sensores', -paymentLines[0].value],
      ['Flete de compras', -paymentLines[1].value],
      ['Pagos netos a empleados', -paymentLines[2].value],
      ['Alquiler, conectividad y combustible', otherPayments]
    ];
    page.querySelector('.cash-payments-items').innerHTML = paymentGroups.map(([label, value]) => `<div><span>${label}</span><strong>${million(value)} M</strong></div>`).join('');
    page.querySelector('.cash-closing').textContent = million(cash.closing) + ' M';
    page.querySelector('.cash-change').innerHTML = `<b>${signedMillion(cash.change)}</b><span>variación del mes</span>`;
    page.querySelector('.cash-bank-period').textContent = period.month + ' de 2026';

    const terms = [
      ['Saldo inicial', cash.opening, 'opening'],
      ['Operación', cash.operating, 'operating'],
      ['Inversión', cash.investing, 'investing'],
      ['Financiación', cash.financing, 'financing'],
      ['Saldo final', cash.closing, 'closing']
    ];
    page.querySelector('.cash-reconciliation').innerHTML = terms.map(([label, value, name], index) => `${index ? `<b class="cash-equation-symbol">${index === 4 ? '=' : '+'}</b>` : ''}<div class="cash-equation-term ${name}"><span>${label}</span><strong>${million(value)} M</strong>${name === 'operating' ? '<small>Cobros − pagos de operación</small>' : name === 'investing' ? '<small>Sin pagos por activos fijos</small>' : name === 'financing' ? `<small>${cash.financing ? 'Aporte de capital en efectivo' : 'Sin aportes ni préstamos en efectivo'}</small>` : '<small>Banco</small>'}</div>`).join('');
    replay();
  }

  new MutationObserver(records => {
    const enteredPage = records.some(record => !(record.oldValue || '').split(/\s+/).includes('active'));
    if (enteredPage && page.classList.contains('active')) replay();
  }).observe(page, {attributes: true, attributeFilter: ['class'], attributeOldValue: true});
  document.addEventListener('keydown', event => {
    if (detail.open && ['ArrowLeft', 'ArrowRight'].includes(event.key)) event.stopImmediatePropagation();
  }, true);
  render();
})();
