# SensIA · Landing con seis páginas

Una landing navegable con la identidad azul de la demo de SensIA, ilustraciones gráficas animadas, evidencia fotográfica y un modelo de negocio sin precios.

## Abrir y navegar

Abre `index.html` en un navegador. Todo se sirve desde archivos locales. No hace falta instalar nada, compilar ni usar claves. Las fuentes y las imágenes están incluidas en `assets/`.

Las seis páginas respetan el orden del pitch:

1. SensIA y su primer caso.
2. Mburicaó: territorio, causas y fotografías de inundaciones.
3. El valor de la información para decidir.
4. Resultados del estudio y fotografías del circuito y la estación.
5. Producto, servicio, datos y aliados.
6. Equipo.

Usa los enlaces superiores o Anterior/Siguiente. También funcionan las flechas izquierda/derecha, las teclas 1–6 y los gestos horizontales. Las páginas se pueden desplazar verticalmente cuando el contenido lo necesita, especialmente en celulares. Ya no es un lienzo de diapositiva reducido a escala.

P pausa o reanuda animaciones. El movimiento respeta la configuración de accesibilidad `prefers-reduced-motion`. Las fotos del mapa se pueden seleccionar desde sus cuatro puntos o los indicadores. Las imágenes técnicas se amplían al tocarlas; Escape cierra la ampliación.

## GitHub Pages

Descomprime el ZIP y sube su contenido a la raíz de un repositorio, manteniendo `assets/`. No subas el ZIP como único archivo. Conserva la demo actual en su propio repositorio.

En **Settings → Pages**, selecciona **Deploy from a branch**, rama **main**, carpeta **/(root)**, y guarda. GitHub mostrará la URL definitiva de la publicación.

[Documentación oficial de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Este paquete no ha publicado ni modificado ningún repositorio remoto.

## Edición

- `index.html`: páginas, textos, estructura comercial y elementos de interfaz.
- `style.css`: colores, tipografías, adaptación móvil y animaciones.
- `content.js`: equipo y fotografías.
- `app.js`: navegación, iconos, mapa, galería y pausa de movimiento.

También se entrega `SensIA-presentacion-shell-lab.html`, una versión portátil que integra estilos, código, fuentes e imágenes en un único archivo.

## Diseño y fuentes

Paleta de la demo: azul marino `#19315e`, azul `#0968d6`, cian `#56dbef`, blanco y azules claros. Tipografías: Manrope y DM Sans, distribuidas a través de Google Fonts.

Logo, integrantes, roles y retratos proceden de la [demo de SensIA](https://mathiasag.github.io/sensia-demo/) y su archivo público `team.js`.

Las fotografías de inundaciones, mapa y desarrollo técnico proceden de los archivos facilitados por Mathias. Las fotografías de inundación y del desarrollo técnico se presentan a color, también en sus ampliaciones; no se ha modificado su contenido. Las imágenes técnicas se identifican como evidencia real. El mapa corresponde al contexto histórico y no a la red de estaciones actual. Los puntos siguen las relaciones de la referencia del equipo, sin asignar coordenadas geográficas nuevas.

El diagrama de portada, los datos del teléfono, su aviso y sus recorridos son conceptuales, sin lecturas ni rutas reales. El estudio reporta 40–50 minutos y 22/26 eventos según el pitch de SensIA; no se confunde ese resultado con la demo simulada ni con una garantía operativa. La plataforma, piloto y modelo comercial están en desarrollo o son propuestas.

La estructura de tres columnas del modelo de negocio se inspira en la imagen de referencia compartida posteriormente. Se omiten todos los precios por instrucción del usuario. Las columnas describen producto, servicio y datos, sin hacer comparaciones comerciales entre países o proveedores.

## Ilustraciones

Dos imágenes creadas con la herramienta integrada ImageGen usando las fotografías del usuario como referencia. La ilustración del arroyo y la estación se reemplazaron por dibujos de formas planas y una paleta estrictamente azul, sin acuarela ni colores naturales.

Prompt de ciudad: escena editorial plana de un barrio de Asunción con arroyo, puente y estación, perspectiva suave, formas geométricas limpias, fondo blanco, colores `#19315e`, `#0968d6`, `#56dbef` y azul pálido, sin fotografía, texturas ni textos.

Prompt de estación: estación aislada basada en el poste, gabinete, soporte superior, antena, cables y brazo de las fotografías reales. Formas planas con contorno azul marino, azul, cian y blanco; fondo transparente; sin materiales de colores naturales ni textos.

Los flujos de datos, el gráfico, el mapa esquemático, las señales y las notificaciones se animan en HTML, CSS y SVG. Las ilustraciones conceptuales no sustituyen las fotos del hardware real.

## Experiencia actualizada

La portada contiene un diagrama animado editable en SVG: datos sensados, servidor, datos limpios, dashboard y cuatro salidas (gráficos, reportes, alertas y predicciones). Se retiraron de esa página la presentación del CEO, el título y párrafo anteriores, y el gráfico de Agua y lluvia.

En El desafío, las cuatro fotos conservan sus colores y una flecha se recalcula desde el círculo numérico seleccionado hasta la fotografía. Se adapta a pantallas grandes y pequeñas.

En Decidir a tiempo, el teléfono tiene las pestañas Mapa y Datos. Las calles grises son transitables y las celestes representan inundación. Dos recorridos discontinuos comparten A y B: el habitual rojo entra en un tramo inundado y el alternativo verde lo evita siguiendo las calles. La notificación muestra una ventana ilustrativa para evacuar. La pestaña Datos anima nivel en metros y lluvia en mm por 10 minutos. Todos los valores y avisos son de ejemplo.

En Tecnología, las fotografías del circuito, estación y gabinete se muestran a color, tanto en miniatura como ampliadas.

En La propuesta, un signo + ocupa su propio espacio entre Equipo e instalación y Plataforma y análisis. En celular aparece entre las tarjetas apiladas. No se incluyen precios.

`experience.js` controla el diagrama, la flecha y el teléfono. `experience.css` contiene sus estilos. Se mantiene la pausa global y se respeta la preferencia de movimiento reducido.

## Portada en dos mitades

La ilustración del arroyo con el sensor orientado hacia el agua se recuperó a la izquierda. El diagrama animado de datos se conserva a la derecha. Cada ilustración ocupa la mitad del ancho disponible en escritorio. En pantallas pequeñas se apilan para conservar la lectura. Se mantienen las ondas de ida y retorno del sensor y la transmisión desde la antena.

## Lectura ampliada y página Equipo

El flujo de la derecha tiene sus ilustraciones ampliadas un tercio. Las etiquetas de navegación y el rótulo SensIA Analytics · En desarrollo tienen el doble del tamaño original; el resto de la tipografía aumentó aproximadamente 12 %. El encabezado se adapta al ancho disponible sin superponer los enlaces.

El equipo se trasladó a una sexta página independiente. Victoria Paredes sustituye el nombre anterior en el equipo y en la referencia técnica. Mathias Aguilar figura como Hardware y software. Los retratos se conservan.

## Escena principal unificada

La portada combina el arroyo y el flujo de datos en un solo SVG animado. La conexión de datos sensados nace exactamente en la antena de la estación del arroyo y llega al servidor. Se retiró el sensor aislado duplicado. Se mantienen el eco del sensor hacia el agua, la transmisión de radio, el procesamiento, el dashboard y sus cuatro salidas. La escena ocupa el ancho principal de la portada y se reorganiza en vertical en celular.

Portada ajustada: escena del arroyo, servidor y dashboard más pequeños; mayor separación entre etapas y cuatro salidas ampliadas. Se retiraron las notas de exposición y su acceso.
Decidir a tiempo incorpora una notebook sobre el teléfono. Ambos ofrecen Mapa, Estaciones y Alertas; al seleccionar una pestaña, el otro dispositivo muestra una distinta siguiendo el orden Mapa → Estaciones → Alertas. En Estaciones se elige entre tres estaciones de ejemplo y cambian el nivel, la lluvia y el gráfico animado. Los puntos rojos de Alertas representan zonas críticas ilustrativas. Se conservó la escala de los textos de la página y se reordenaron las tres decisiones. Se eliminó Ver demo. En La propuesta, el bloque de hidrología, nuevas aplicaciones y Shell Lab precede a las tres columnas.
Se añadió una tablet a la derecha del teléfono. Las tres pestañas se distribuyen sin repetirse entre teléfono, notebook y tablet, con el logo SensIA en las tres pantallas. Las notificaciones ilustrativas del teléfono y la tablet están fuera de sus marcos, a los lados, conectadas visualmente y contenidas en la columna gráfica. Los logos suministrados de Shell Lab y FIUNA aparecen a la derecha del encabezado; el logo de Shell Lab sustituye al icono del bloque Con Shell Lab en La propuesta. Se verificaron las vistas a 870 px y 390 px, sin desbordamiento horizontal ni superposición de notificaciones con el texto.
La página Decidir a tiempo presenta los dispositivos en una columna: notebook, tablet y teléfono. La notebook tiene pantalla horizontal y base; la tablet es más ancha que el teléfono y el teléfono conserva una silueta vertical alargada. Se mantienen las pestañas distintas, los logos y las alertas laterales. El contenido se desplaza verticalmente en pantallas de menor altura.
Ajustes para proyección: pestañas superiores a la mitad de tamaño, encabezado más compacto, contenido elevado y textos secundarios en azul oscuro. El logo superior de Shell Lab se amplió para igualar la presencia visual del logo SensIA. En ventanas de escritorio (desde 700 × 420 px), presentation-fit.js adapta cada página a la altura disponible sin desplazamiento vertical. Se verificaron las seis páginas a 870 × 668 px y el diseño a 1280 × 720 px. En celulares se conserva desplazamiento vertical para mantener legible el contenido. Las fotos del equipo y las tarjetas de la propuesta se compactan antes de aplicar la escala.
Mejora de lectura: textos principales, descripciones, nombres, referencias y encabezados ampliados. El ajuste de presentación ahora aprovecha todo el ancho disponible y busca la mayor escala que cabe en la altura, en lugar de reducir el conjunto hacia el centro. Se conserva el orden del contenido. Las seis páginas se verificaron completas a 870 × 668 y 1280 × 720 px, sin desbordamientos ni superposición del bloque de texto con los dispositivos o sus notificaciones.
