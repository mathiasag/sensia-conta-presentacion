(() => {
  const page = document.querySelector('.operation-story');
  if (!page) return;
  // Same SVG artwork as the cover, cropped to its symbol and device.
  const originals = [...document.querySelectorAll('.cover .sensor-card')];
  function station(index) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '12 0 110 76');
    svg.setAttribute('aria-hidden', 'true');
    svg.classList.add('catalog-station');
    const drawing = originals[index].cloneNode(true);
    drawing.removeAttribute('transform');
    drawing.querySelectorAll('.sensor-title,.sensor-subtitle').forEach(node => node.remove());
    svg.append(drawing);
    return svg;
  }
  const models = window.sensiaCostData.catalog.map(model => [model.name, model.cost, model.price, model.costCell, model.priceCell]);
  const combinations = [[0, 1], [4, 2, 3, 5], [1, 2]];
  const quantities = [['4 lluvia', '4 nivel'], ['3 energía', '3 temp. / humedad', '2 vibr. / corriente', '2 presión'], ['5 nivel', '5 temp. / humedad']];
  page.querySelectorAll('.op-equipment').forEach((container, i) => {
    container.replaceChildren();
    combinations[i].forEach((model, j) => {
      const item = document.createElement('div'); item.className = 'monthly-station';
      item.append(station(model));
      const label = document.createElement('span'); label.textContent = quantities[i][j];
      item.append(label); container.append(item);
    });
  });
  const board = document.createElement('aside');
  board.className = 'station-priceboard';
  board.setAttribute('aria-label', 'Catálogo de costos y precios estimados por estación');
  board.innerHTML = '<div class="priceboard-title"><span class="eyebrow">CATÁLOGO DE ESTACIONES</span><h3>Cuánto cuesta cada modelo</h3></div><div class="priceboard-columns"><span>Estación</span><span>Costo unitario</span><span>Venta con IVA</span></div><div class="priceboard-rows"></div><p class="priceboard-source">G. por unidad · Costo base estimado del catálogo.<br>Sin aplicar el descuento por volumen.</p>';
  const format = value => new Intl.NumberFormat('es-PY').format(value);
  models.forEach(([name, cost, price, costCell, priceCell], i) => {
    const row = document.createElement('div'); row.className = 'priceboard-row';
    row.dataset.source = `copia de sensia/SensIA EAS v2.xlsx | 5-COSTO DE VENTAS!${costCell},${priceCell}`;
    const label = document.createElement('div'); label.className = 'priceboard-model';
    label.append(station(i));
    const text = document.createElement('span'); text.textContent = name; label.append(text);
    const costText = document.createElement('strong'); costText.textContent = format(cost);
    const priceText = document.createElement('span'); priceText.className = 'priceboard-sale'; priceText.textContent = format(price);
    row.append(label, costText, priceText); board.querySelector('.priceboard-rows').append(row);
  });
  const layout = document.createElement('div'); layout.className = 'operation-catalog-layout';
  const monthly = page.querySelector('.cards'); monthly.before(layout); layout.append(monthly, board);
})();
