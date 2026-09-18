# MEMORIAS DEL PROYECTO — Arzaga Nahil

> Bitácora de desarrollo, decisiones técnicas y mejoras sugeridas.

---

## Sesión 1 — Inicio del proyecto + Menú LetterShuffleMenu

###  Objetivo
Iniciar el proyecto **Arzaga_Nahil** como portafolio web profesional con identidad moderna. Implementar un menú animado tipo *Letter Shuffle* basado en el demo de Codrops.

###  Decisión técnica
- **Estructura**: HTML + CSS + JS vanilla (sin framework). Se optó por simplicidad y control total.
- **Animación**: Se adaptó el [LetterShuffleMenu](https://tympanus.net/Development/LetterShuffleMenu/) de Codrops.
- **Dependencias externas** (vía CDN):
  - `GSAP 3.12.5` — Motor de animaciones.
  - `Splitting 1.0.6` — Divide texto en letras/char.
  - `WebFont Loader` — Carga tipografías.
- **Tipografía**: Inter + JetBrains Mono (Google Fonts) en lugar de Typekit (uso libre).
- **Paleta**: Fondo degradado oscuro (`#0f0f1a` → `#1a1a2e`) con acento violeta (`#6c63ff`) y rosa (`#ff6584`).

###  Archivos creados
```
Arzaga_Nahil/
├── index.html          # Página principal
├── css/style.css       # Estilos globales y del menú
├── js/index.js         # Entry point
├── js/menu.js          # Clase Menu (controla apertura/cierre)
├── js/menuItem.js      # Clase MenuItem (slot machine de letras)
├── js/menuConfig.js    # Configuración (letras, título vertical)
├── js/utils.js         # Utilidades (preloadFonts)
├── assets/             # Recursos estáticos (vacío)
└── MEMORIAS.md         # Este archivo
```

###  Mejora sugerida #1 — Rendimiento y accesibilidad
- **Problema**: El menú usa `pointer-events: none` en el contenedor y los items se habilitan con clase `menu--open`. Esto puede confundir lectores de pantalla.
- **Sugerencia**: Agregar `role="navigation"` y `aria-hidden="true"` cuando el menú está cerrado, alternándolo con JS.

###  Mejora sugerida #2 — SEO on-page
- Se agregaron meta tags Open Graph y description. Sugerencias adicionales:
  - Agregar *JSON-LD* (schema.org `Person` o `WebSite`) para mejorar rich snippets en Google.
  - Usar etiquetas `<link rel="canonical">` y `<meta name="robots">`.
  - Implementar un `sitemap.xml` cuando haya más páginas.

###  Mejora sugerida #3 — Marca personal
- El título vertical (`displayVerticalTitle`) actualmente muestra "ARZAGA". Se puede cambiar a "NAHIL" o apellido completo según branding.
- Sugerencia: Usar el nombre completo "ARZAGA NAHIL" como texto del shuffle para que el usuario vea su nombre en la animación de letras.

---

## Sesión 2 — Links a redes sociales + SVGs

###  Cambios realizados

- **Links corregidos**: Se reemplazaron los textos "LinkedIn", "GitHub" e "Instagram" por los SVGs correspondientes como iconos.
- **URLs reales**: Los href ahora apuntan a los perfiles verdaderos:
  - GitHub → `https://github.com/ArzagaNahil`
  - LinkedIn → `https://www.linkedin.com/in/alexis-rivera-miranda-1667a430a/`
  - Instagram → placeholder con `href="#"` y opacidad reducida (cuenta pendiente).
- **Color de marca**: Los SVGs se modificaron para usar `#0093a5` (accento del proyecto).
- **Tamaño**: Iconos aumentados de 24px a 32px.
- **Espaciado**: Padding derecho del `.frame` aumentado de `1.5rem` a `2.5rem` para separar los iconos del borde derecho.

###  Archivos modificados

```
Arzaga_Nahil/
├── index.html                  # Links reemplazados por SVGs + URLs reales
├── css/style.css               # Padding del frame aumentado
├── assets/IMG/github.svg       # Color cambiado a #0093a5
├── assets/IMG/instagram.svg    # Color cambiado a #0093a5
├── assets/IMG/follow-in.svg    # Color cambiado a #0093a5
└── MEMORIAS.md                 # Este registro
```

###  Próximos pasos
- [ ] Verificar que los links abran correctamente en una pestaña nueva.
- [ ] Crear cuenta de Instagram y actualizar el placeholder.
- [ ] Verificar que el menú funcione al abrir `index.html` en navegador.
- [ ] Probar en móvil y ajustar responsive.
- [ ] Agregar secciones reales (proyectos, servicios, contacto).
- [ ] Implementar página de proyecto individual.
- [ ] Agregar transiciones entre páginas (si se decide SPA o MPA).

---

## Sesión 3 — Botón de menú animado con Segment

###  Objetivo
Reemplazar la simple transición de opacidad del botón de menú (hamburguesa ↔ X) por una animación morphing basada en SVG paths, usando la librería [Segment](https://github.com/lmgonzalves/segment) del tutorial [AnimatedMenuIcon](https://tympanus.net/Tutorials/AnimatedMenuIcon/) de Codrops.

###  Cambios realizados

- **SVG reemplazado**: El SVG anterior con dos paths (lines + cross) fue reemplazado por tres paths (`pathA`, `pathB`, `pathC`) que describen la trayectoria de morphing entre hamburguesa y cruz, escalados con viewBox 1000×1000 y `transform: scale(0.1)`.
- **Segment + Ease**: Se agregaron las librerías `segment.min.js` y `ease.min.js` (ya presentes en `/js/`) como `<script>` tags globales antes del módulo.
- **Animación**: En lugar de fade in/out por opacidad, ahora el icono usa `Segment.draw()` con easing `elastic-out` y `bounce-out` para un morphing elástico y fluido.
- **Menu.js**: Se eliminaron las referencias a `.menu__button-lines` y `.menu__button-cross`. Se agregaron los métodos `initSegments()`, `animateToClose()` y `animateToOpen()` con la lógica del tutorial.

###  Archivos modificados

```
Arzaga_Nahil/
├── index.html                  # SVG del botón reemplazado, script tags agregados
├── css/style.css               # Estilos del icono wrapper y paths SVG
├── js/menu.js                  # Animación con Segment + transición suave de bg
└── MEMORIAS.md                 # Este registro
```

###  Hotfix — Transición suave al cerrar menú

- **Problema**: Al cerrar el menú, la clase `menu--open` se removía al inicio del timeline, causando que la opacidad del fondo (`menu__bg`) saltara instantáneamente de `1` a `0.45`.
- **Solución**: Se agregó un tween GSAP con `startAt: { opacity: 1 }` que fuerza la opacidad inicial inline y la anima gradualmente a `0.45` durante la transición de cierre, eliminando el salto visual.
- Adicionalmente se movieron los tweens de gradiente y tagline a `'start'` (antes estaban en `'start+=0.2'`) para que toda la transición de cierre sea progresiva.

---

## Sesión 4 — Responsive completo (mobile-first)

###  Objetivo
Adecuar todo el layout del portafolio para que sea completamente responsive en móvil, tablet y desktop, siguiendo un enfoque **mobile-first**.

###  Problemas detectados en mobile

| # | Problema | Línea (antes) | Severidad |
|---|---|---|---|
| 1 | `.content__column` con `padding-left: 20rem` (320px) | style.css:216 | ❌ Crítico — rompía el layout en mobile |
| 2 | `.content` con `gap: 10rem` (160px) | style.css:212 | ❌ Alto — separación excesiva |
| 3 | `.frame__links img` a 60×60px | style.css:200 | ⚠️ Medio — iconos desproporcionados |
| 4 | `.frame` con `margin-right: 6rem` | style.css:182 | ⚠️ Bajo — espacio innecesario |
| 5 | `.content__image` con `max-width: 600px` fijo | style.css:270 | ⚠️ Medio — sin escalado en mobile |
| 6 | Sin breakpoint intermedio (tablet) | — | ⚠️ Medio — salto directo a escritorio |

###  Cambios realizados en `css/style.css`

```
Base (mobile) — valores corregidos:
  .content__column       padding-left: 20rem → 0
  .content               gap: 10rem → 2rem
  .content               padding: 2rem 9vw → 2rem 5vw
  .frame                 margin-right: 6rem → eliminado
  .frame__links img      width/height: 60px → 28px
  .content__image        max-width: 600px → 100%

Tablet (≥40em ≈ 640px) — NUEVO:
  .content               gap: 3rem, padding: 2rem 6vw
  .content__column       padding-left: 2rem
  .content__image        max-width: 450px
  .frame__links img      32px

Desktop (≥54em ≈ 864px) — ajustados:
  .content__column       padding: 1rem 2rem (más espacio)
  .content__column:first-child  padding-left: 4rem, margin-top: -8vh
  .content__column:last-child   padding-left: 5rem (borde divisor)
  .content__image        max-width: 500px, margin-right: 3rem
  .frame__links img      36px
```

###  Archivos modificados
```
Arzaga_Nahil/
└── css/style.css        # Todos los ajustes responsive + breakpoint tablet
```

###  No requirió cambios
- **`particles.js`** — Three.js ya tiene listener `resize` que actualiza cámara y renderer.
- **`menu.js`** — Las posiciones del menú se calculan con `window.innerWidth/Height` dinámicamente.
- **`index.html`** — Ya incluía `<meta name="viewport" content="width=device-width">`.

###  Próximos pasos sugeridos
- [ ] Probar en dispositivo físico o emulador (Chrome DevTools)
- [ ] Ajustar espaciados específicos si alguna sección se ve apretada
- [ ] Agregar secciones reales (proyectos, servicios, contacto)
- [ ] Implementar página de proyecto individual

---

## Sesión 5 — Contacto como página independiente + Arquitectura MPA

###  Objetivo
Separar el formulario de contacto del `index.html` en una página independiente (`contact.html`) y definir la arquitectura del portafolio como Multi-Page Application (MPA).

###  Decisión técnica
- **Index** se mantiene como landing page de presentación: una sola vista, sin scroll, liviana. La animación LetterShuffle y las partículas Three.js no compiten con otras secciones.
- **Contacto** → `contact.html`, página independiente con su propio layout centrado, compartiendo CSS, scripts, menú y frame con el index.
- Se actualizó el link "Contact" del menú en `index.html` para apuntar a `contact.html`.
- En `contact.html` se agregó un item "Home" en el menú para volver al index.

###  Archivos creados/modificados
```
Arzaga_Nahil/
├── index.html                  # Contact section eliminada, menú link → contact.html
├── contact.html                # NUEVO — Página de contacto independiente
├── css/style.css               # Se conservan estilos .contact (compartidos)
└── MEMORIAS.md                 # Este registro
```

###  Consideración técnica — SPA vs MPA
Actualmente el portafolio es **MPA** (Multi-Page Application): cada navegación recarga la página y las partículas Three.js se reinician. Esto no es crítico ahora, pero si el proyecto crece y se desean transiciones suaves entre secciones, se recomienda evaluar:

- **OPCIÓN A — Router ligero**: Usar `history.pushState()` + fetch de HTML parcial para transiciones sin recarga total. Librerías como `Swup` o `Barba.js` se integran con GSAP.
- **OPCIÓN B — SPA progresivo**: Migrar solo las secciones que lo necesiten (Photography, Design, Development) a una sola página tipo `work.html` con navegación interna por tabs/paneles.
- **OPCIÓN C — Híbrido**: Mantener MPA pero cachear Three.js en segundo plano para evitar el reinicio de partículas al navegar.

Por ahora se mantiene MPA por simplicidad. La decisión se revisará al agregar las secciones de proyecto.

###  — Próxima sesión — Agrupar Photography, Design y Development

Se propone usar el template [SlidingHeaderLayout (Multi)](https://tympanus.net/Tutorials/SlidingHeaderLayout/layout-multi.html) de Codrops como base para agrupar las 3 áreas de trabajo en una sola página (`work.html` o `portfolio.html`).

**Por qué funciona:**
- Trata cada área como un panel independiente con su propio header + grid de proyectos.
- El "toggle content" permite expandir/colapsar proyectos sin recargar.
- Es HTML+CSS+JS vanilla, compatible con el stack actual (GSAP).

**Adaptaciones necesarias:**
- Reemplazar headers visuales (fotos de stock) por el sistema de gradiente + partículas del portafolio, o imágenes representativas de cada área.
- Las thumbnails del grid deben ser cuadradas con título corto.
- Reemplazar el menú del template por el LetterShuffleMenu existente para mantener identidad.
- Responsive: el template no es mobile-first; habrá que adaptarlo como se hizo en Sesión 4.

**Alternativa**: Si se prefiere evitar otro template de Codrops, se puede construir un layout propio con tabs/paneles y grid CSS, pero el SlidingHeaderLayout ahorra tiempo en la interacción de expandir/colapsar paneles.

---

## Sesión 6 — Botón Shiny CTA en formulario de contacto

###  Objetivo
Reemplazar el botón plano del formulario de contacto por un botón animado tipo *Shiny CTA* con borde conic-gradient, patrón de puntos y brillo interno, adaptado del [Pen de Ryan Mulligan](https://codepen.io/hexagoncircle/full/MWMqXbK).

###  Cambios realizados

- **HTML**: El botón `<button class="contact__btn">` se reemplazó por `<button class="shiny-cta"><span>Enviar mensaje</span></button>`.
- **CSS**: Se agregaron ~100 líneas de estilos CSS con `@property` para animar el gradiente rotatorio, el patrón de puntos con máscara cónica, el shimmer interno y la escala del brillo en hover.
- **Paleta adaptada**: El highlight usa `--color-accent` (`#0093a5`, teal) y en hover se ilumina con `--color-accent-alt` (`#ff6584`, rosa).

###  Archivos modificados

```
Arzaga_Nahil/
├── contact.html          # Botón reemplazado por shiny-cta
├── css/style.css         # Estilos del shiny button (reemplaza .contact__btn)
└── MEMORIAS.md           # Este registro
```

*Registro iniciado: 15 de junio de 2026*

---

## Sesión 7 — Ajustes de layout (hero + contacto) y limpieza de duplicados

###  Objetivo
Balancear el hero del index (texto vs. imagen) y compactar/reposicionar el formulario de contacto. Además, eliminar copias duplicadas que causaban que los cambios "se perdieran".

###  Hero (index.html + css/style.css)
- Saludo: `1.5rem → 1.2rem`.
- Nombre (`content__headline` / `content__headline1`): `clamp(2.5–4.5rem) → clamp(2–3.5rem)`.
- Párrafo: `1.1rem → 1rem`, line-height `1.5 → 1.45`.
- Sección completa angostada ~30% en desktop:
  - Columna de texto: `94ch → 66ch`.
  - Imagen: `640px → 448px` (antes `500px`).
  - Divider `padding-left: 5rem → 3.5rem`.

###  Contacto (contact.html + css/style.css)
- Tarjeta reducida 30%: `min-width: 670px → max-width: 469px` (móvil ya no desborda).
- `padding-bottom: 11rem` en la zona de contacto para que la tarjeta no pise los iconos sociales.
- Fuentes reducidas: overline `1rem`, título `clamp(1.3–1.7rem)`, sub `0.9rem`, labels `0.75rem`, inputs `0.9rem`, textarea `rows=4`.
- Reposicionamiento en desktop:
  - `margin-right: 220px` (corrida 110px + 110px hacia la izquierda).
  - `margin-top: 50px` (bajada 100px y subida 50px).

###  Limpieza de archivos duplicados
Se eliminaron copias obsoletas que se confundían con los archivos fuente:
```
css/css/            (style.css viejo del 19/06)
css/base.css        (versión del 18/06)
css/index.html      (copia vieja del index)
css/js/             (scripts duplicados)
css/assets/         (imágenes duplicadas)
css/MEMORIAS.md     (bitácora duplicada)
```
- Resultado: `css/` solo contiene `style.css` (la única fuente que cargan los HTML).

###  Nota — ¿Por qué "se perdían" los cambios?
- Había varias copias viejas del proyecto dentro de `css/`; abrir o subir cualquiera de ellas mostraba el diseño antiguo.
- Caché del navegador al recargar una página publicada: usar `Ctrl+F5` o versionar el CSS (`style.css?v=2`).

---

## Sesión 8 — Tipografías, iconos sociales y pulido del hero

###  Fuentes aplicadas
- **Tulpen One** (`--font-para`) en párrafos: bienvenida (index) y descripción (contacto).
  - Bienvenida: `1.6rem`, line-height `1.35`, sin itálica.
  - Contacto: `1.4rem`, line-height `1.35`.
- **Bruno Ace** (`--font-name`) en titulares:
  - Nombre del hero (`content__headline` / `content__headline1`): "Alexis" / "Rivera Miranda" en dos líneas, `clamp(1.5–2.8rem)`.
  - "Trabajemos juntos" (`contact__title`): `clamp(1.1–1.4rem)`.
  - "Enviar mensaje" (`.shiny-cta span`).
- Enlaces agregados en `index.html` y `contact.html`.

###  Botón flecha eliminado
- Se removió `.button-next` (medio círculo con flecha) del HTML y del CSS (base + media query desktop).

###  Iconos de redes
- Se movieron de abajo-izquierda a **abajo-derecha** (donde estaba la flecha): `grid-area: links; justify-self: end`. Aplicado en `index.html` y `contact.html` (reglas duplicadas en cada página).

###  Ajustes del hero
- Columna de texto bajada: `margin-top: -8vh → calc(-8vh + 20px)` (10px + 10px).
- Nombre unificado a una línea y luego dividido de nuevo en "Alexis" / "Rivera Miranda".

###  CTA "Ver proyectos" — rediseñado (pill glass)
- Antes: enlace simple con `hover-line`.
- Ahora: *pill* minimalista glass:
  - Borde fino teal `rgba(0,147,165,.45)`, fondo translúcido + `backdrop-filter: blur(6px)`.
  - Tipografía `--font-mono` en mayúsculas, `letter-spacing: 0.12em`.
  - Flecha en `<span>` que se desliza en hover (`translateX(4px)`).
  - Hover sutil: fondo `rgba(0,147,165,.12)`, texto en `--color-accent` (mismo que "Hola soy"), leve glow.

---

## Sesión 9 — Efecto Gooey (liquid hover) en Development + galerías

###  Qué se hizo
- Se estudió la plantilla **"Gooey Image Hover Effects"** de Codrops (Arno Di Nunzio):
  - Repo: `https://github.com/Aqro/gooey-hover-codrops` (fuentes en `src/js`, shaders en `src/glsl`).
  - El efecto "líquido" es `gooeyShader.glsl`: un círculo que sigue al ratón combinado con **ruido simplex 3D** (`snoise3`) y `smoothstep`, que revela la imagen hover con bordes orgánicos tipo fluido.
- Se implementó **en `development.html`** un slideshow de **3 tarjetas**, todas con el efecto gooey (el "líquido" que sigue al cursor).

###  Archivos nuevos
- `js/gooey.js`: módulo Three.js autocontenido (vertex shader + gooey shader con `snoise3` inlineado, sin glslify).
  - Crea un canvas `#gooey-scene` fijo, cámara perspectiva (perspective 800) y un plano por tarjeta que replica la posición/tamaño del `<img>` (`getBoundingClientRect`).
  - `mouseenter`/`mouseleave` animan `u_progressHover` (gsap `power2.inOut`); el ratón se interpola con gsap; `u_time` solo avanza mientras hay hover.
  - Sin cambio de color de fondo (se eliminó `--color-bg` de la demo) y sin vista detalle: el clic navega normal a la galería (`<a>` sin `preventDefault`).
- `js/index.js`: importa y llama `initGooey()` (se auto-desactiva si no hay `.js-tile`), y limpia en `beforeunload`.
- Imágenes placeholder descargadas del demo a `assets/IMG/dev/{woods,rocks,cities}/{base,hover}.jpg` (curl con User-Agent/Referer por Cloudflare).

###  Cambios en `development.html`
- Se sustituyó la sección vacía por:
  - Título gigante de fondo adaptado: **"¿Cuál es tu próximo proyecto?"** (`page-title` + `page-title__offset`, opacidad `0.08`, `--font-name`).
  - `<ul class="devtiles">` con 3 `.tile.js-tile`, cada una enlaza a `gallery-proyecto-1/2/3.html`.
- Se eliminó el cambio de fondo por tile y se usó el fondo de **partículas** existente (`#three-canvas`).

###  CSS (`css/style.css`)
- Nuevas reglas: `#gooey-scene` (fixed, `z-index: 1`), `.page-title`, `.devtiles`, `.devtile` (offsets verticales alternos en desktop), `.tile*` (tarjeta, figura 136% y `is-loaded` = `opacity: 0`), y bloque `.gallery*`.
- Desktop (≥54em): tarjetas en fila (`26vmin`), `translateY(±9vh)` alterno.
- `.frame` de Development y de las galerías con `z-index: 3` para que los iconos sociales queden clicables por encima del contenido.

###  Páginas galería nuevas
- `gallery-proyecto-1.html`, `gallery-proyecto-2.html`, `gallery-proyecto-3.html` (plantilla rellenable):
  - Topnav + frame social, enlace "← Development", título, descripción placeholder, rejilla de fotos y botones "Ver demo" / "Ver código".

###  Nota
- El efecto y todo el sitio requieren servirlo por **HTTP** (módulos ES + importmap + texturas WebGL no funcionan bien desde `file://`). Ej.: `python -m http.server`.

---

## Sesión 10 — Páginas About / Design / Photography + topnav + sonido de hover + fondo de anillos

*Registrado el 17 de septiembre de 2026.*

###  Objetivo
Completar el esqueleto MPA del portafolio: crear las páginas restantes del menú (About, Design, Photography) como **plantillas placeholder**, unificar su navegación en un **topnav** (diferente del LetterShuffleMenu del index/contacto) y mejorar el fondo Three.js con **anillos wireframe** configurables por página.

###  Páginas nuevas (plantillas)
- `about.html` — Meta SEO + OG + canonical `.../about`. Sección `.about` aún **vacía** (placeholder). Cuerpo con `#three-canvas data-ring-pos="10,0,0"`.
- `design.html` — Sección `.design` vacía; misma estructura que About.
- `photography.html` — Sección `.photography` vacía; misma estructura.

Cada una incluye inline `<style>` de página con overrides del grid (`grid-template-areas`) y el marco `.frame` reutilizado en desktop (iconos sociales abajo-derecha, overlay oscuro al abrir menú aunque no haya menú aquí).

###  Componente topnav (navegación secundaria)
- Nuevo en `css/style.css`: `.topnav` (barra fija superior, blur + borde sutil), `.topnav__brand` ("Arzaga" en Bruno Ace) y `.topnav__links` (6 enlaces, `.is-current` resalta la página activa).
- Lo usan **about, design, photography, development y las 3 galerías** (páginas con blueprint en lugar del menú LetterShuffle). **index y contact mantienen el LetterShuffleMenu**.

###  Sonido de hover en el topnav
- `js/hoverSound.js` (nuevo): módulo que reproduce `assets/audio/hover.mp3` (`volume 0.3`) al `mouseenter` de cada `.topnav__links a`.
- Autoplay policy: se "desbloquea" el audio en el primer `pointerdown`/`click` (se reproduce en silencio una vez y se resetea).
- Se auto-desactiva en páginas sin `.topnav__links a` (index/contact), ya que no hay elementos que coincidan con el selector.
- `js/index.js` llama `initHoverSound('.topnav__links a')`.

###  Fondo Three.js mejorado (`js/particles.js` reescrito)
- **Partículas**: 2000 puntos color violeta-azulado aleatorio, `AdditiveBlending`, `sizeAttenuation`, rotación lenta (velocidades por eje).
- **Anillos**: 3 toros wireframe (`#6c63ff` r=1, `#e040fb` r=1.5, `#00e5ff` r=0.5) con opacidad baja y rotaciones propias.
- **Configurable por página** vía atributos del `#three-canvas`:
  - `data-ring-pos="x,y,z"` → posición de los anillos (ej. `10,0,0`; default `3.5,3.5,0`).
  - `data-rings="off"` → desactiva los anillos (usado en `development.html` para no competir con las tiles gooey).
- Cámara sigue el mouse con lerp; `resize` mantiene aspect; `beforeunload` limpia renderer.

###  Index y Contacto (ajustes)
- Menú ampliado a **6 items**: Home, Development, Design, Photography, About, Contact.
- `index.html`: meta `keywords`, `robots`, `canonical` y `og:image` (`assets/IMG/Encabezado portfolio.png`).

###  Archivos nuevos/modificados
```
Arzaga_Nahil/
├── about.html          # NUEVO — plantilla About (sección vacía)
├── design.html         # NUEVO — plantilla Design (sección vacía)
├── photography.html    # NUEVO — plantilla Photography (sección vacía)
├── index.html          # Menú 6 items + SEO completo + #three-canvas
├── contact.html        # Conserva LetterShuffleMenu
├── css/style.css       # .topnav*, ajustes .page-*
├── js/hoverSound.js    # NUEVO — sonido de hover en topnav
├── js/particles.js     # Reescrito: 2000 partículas + 3 anillos, data-* config
├── js/index.js         # Importa initHoverSound
└── assets/audio/hover.mp3  # NUEVO — efecto de sonido hover
```

###  Pendientes detectados en la revisión
- [ ] `about.html`, `design.html`, `photography.html` tienen las secciones **vacías** (falta contenido real: biografía, skills, proyectos de diseño/fotografía). Los estilos `.about__card`, `.about__skills` ya existen en CSS.
- [ ] `content__cta` "Ver proyectos" en `index.html` apunta a `#` (placeholder; apuntar a `development.html` o `#proyectos`).
- [ ] Galerías usan imágenes placeholder y descripciones genéricas; botones "Ver demo" con `href="#"`.
- [ ] Instagram sigue con `href="#"` y opacidad reducida (cuenta pendiente).
- [ ] Favicon / manifest sin definir.
- [ ] Se puede consolidar el `<style>` inline repetido de about/design/photography/gallery en `style.css` (evita duplicación).

---

## Estado actual del proyecto — 17/09/2026

###  Árbol de archivos
```
Arzaga/
├── index.html                  # Landing (hero) + LetterShuffleMenu (6 items)
├── about.html                  # Plantilla About (topnav, sección vacía)
├── design.html                 # Plantilla Design (topnav, sección vacía)
├── photography.html            # Plantilla Photography (topnav, sección vacía)
├── development.html            # Galería horizontal gooey (3 tiles estilo Codrops) + topnav
├── gallery-proyecto-1.html     # Galería placeholder Proyecto Uno
├── gallery-proyecto-2.html     # Galería placeholder Proyecto Dos
├── gallery-proyecto-3.html     # Galería placeholder Proyecto Tres
├── contact.html                # Formulario + Shiny CTA + LetterShuffleMenu
├── css/style.css               # Único CSS (1320 líneas)
├── js/
│   ├── index.js                # Entry point (Splitting, Menu, HoverSound, Particles, Gooey)
│   ├── menu.js / menuItem.js / menuConfig.js / utils.js   # Menú LetterShuffle
│   ├── particles.js            # Fondo Three.js: 2000 partículas + 3 anillos
│   ├── gooey.js                # Efecto gooey (shader snoise3 inline)
│   ├── hoverSound.js           # Sonido de hover en topnav
│   └── segment.min.js / ease.min.js  # Morphing del botón de menú
└── assets/
    ├── IMG/                    # Encabezado portfolio.png + SVGs sociales + dev/{woods,rocks,cities}
    └── audio/hover.mp3
```

###  Arquitectura
- **MPA** (Multi-Page Application), HTML + CSS + JS vanilla.
- **Dos sistemas de navegación**: LetterShuffleMenu (index/contact) y topnav (demás páginas).
- Dependencias CDN: GSAP 3.12.5, Splitting 1.0.6, WebFont Loader, Three.js 0.170.0 (importmap). Segment/ease locales.

###  Sesiones documentadas
1. Inicio + LetterShuffleMenu (15/06)
2. Redes sociales + SVGs (16/06)
3. Botón de menú Segment (18/06)
4. Responsive mobile-first (18-19/06)
5. Contacto independiente + MPA (19-22/06)
6. Shiny CTA (15/06, anotado después)
7. Ajustes hero/contacto + limpieza duplicados
8. Tipografías (Tulpen One / Bruno Ace) + iconos
9. Efecto Gooey en Development + galerías (17/09)
10. About/Design/Photography + topnav + hover sound + anillos (17/09)
11. Galería Development estilo Codrops + fix scroll (17/09)

---

## Sesión 11 — Galería de Development estilo Codrops (GooeyImageHoverEffects)

*Registrado el 17 de septiembre de 2026.*

###  Objetivo
Adaptar el layout de las 3 tiles de `development.html` a la **galería horizontal original** del demo [Gooey Image Hover Effects](https://tympanus.net/Tutorials/GooeyImageHoverEffects/) (Codrops): tarjetas separadas y con offsets verticales alternos, ocultando la 3ª fuera de pantalla hasta scrollear.

###  Cambios en `css/style.css`
- **`.devtiles`**: ahora es una franja horizontal (`display:flex`, `align-items:center`, `height:100%`, `overflow-x:auto`) con **scrollbar oculta** y `overscroll-behavior-x:none`.
- **`.devtile`** (igual que el original):
  - `width:100%` con `min-width: 17.5rem` y `max-width: 28vmin` (**-30%** respecto a los 40vmin iniciales, para adaptar el tamaño del demo).
  - `margin-left: 22vw` (**separación ampliada** de los 15vw originales).
  - `.devtile:last-child` → `padding-right:10vw` con `box-sizing: content-box`.
- **Offsets verticales (desktop ≥54em)**: `nth-child(1)` → `translateY(8vh)`, `(2)` → `translateY(-8vh)`, `(3)` → `translateY(8vh)` (mismo patrón del demo).
- **Título/CTA desplazados como el original**: `.tile__title` `margin-left:-10%` (base) / `-45%` (desktop); `.tile__cta` `margin-left:6.4%` (base) / `-11%` (desktop); `.tile__content` en `bottom:3.6rem`; `.tile__cta` `margin-top:2rem`.
- Se **eliminó el `scroll-snap`** (type + align): con el margen grande de 15-22vw, el *proximity snap* anulaba el scroll (volvía siempre a la tarjeta actual).

###  Cambios en `js/index.js`
- **Wheel → scroll horizontal**: si existe `.devtiles` y la pantalla es desktop (≥54em), un listener `wheel` con `preventDefault()` traduce el `deltaY` del mouse a `scrollLeft` (las ruedas no scrollean contenedores horizontales por defecto).

###  Notas / hallazgos
- El ancho no puede ser "exactamente 2 tarjetas por pantalla" manteniendo el ratio alto (136%) sin recortar verticalmente en pantallas de poca altura; por eso se optó por el layout del demo (tarjetas separadas + offsets, 3ª fuera de pantalla).
- Título de tarjeta provisional: "Proyecto Uno/Dos/Tres" (pendiente renombrar a Desarrollo web / Páginas web / Extensiones).
- Recordatorio importante: **el navegador cachea CSS/JS**, los cambios se ven con `Ctrl+F5`. Durante esta sesión varios ajustes parecían "no funcionar" por no forzar recarga.

---

## Sesión 12 — Development: sin CTA, títulos más grandes, navegación prev/next y efecto wave

*Registrado el 17 de septiembre de 2026.*

###  Objetivo
Rediseñar la galería de `development.html`: quitar los links "Ver proyecto", agrandar los títulos de las 3 tiles, subir el título de fondo y reemplazar el efecto gooey por el de la **4ª tarjeta del demo original** (Sand & Deserts → waveShader).

###  Cambios en `development.html`
- Se **eliminaron los 3 `.tile__cta` / "Ver proyecto"** de las tarjetas.
- Se agregó `.dev-nav` con dos botones circulares: `‹` (prev) y `›` (next), con `aria-label`.

###  Cambios en `css/style.css`
- `.tile__title`: de `clamp(1.5rem, 2.4vw, 2rem)` → `clamp(1.8rem, 3vw, 2.5rem)`.
- `.page-title`: `top: 8rem` → `7rem` (subido).
- Limpieza: se eliminaron `.tile__cta` y `.tile__go` (base + desktop) por CSS muerto.
- Nuevo bloque `.dev-nav` / `.dev-nav__arrow`:
  - Base: fijo abajo-centrado (`bottom: 2rem`), círculos 48px glass (`rgba(15,15,26,.5)` + blur), hover teal `--color-accent`.
  - Desktop (≥54em): centrado vertical a los lados (`top: 50%`, `space-between`), botones 54px.
  - `.is-disabled` → opacidad 0.2 sin pointer-events.

###  Cambios en `js/index.js`
- Nuevo bloque de navegación del `.devtiles`:
  - `devNav.go(i)`: anima `scrollLeft` con GSAP `power2.inOut` (0.8s) hacia `offsetLeft - base` (conserva el ritmo del margen inicial para que el título negativo no se corte).
  - `devNav.syncFromScroll()`: sincroniza el índice con el scroll manual (con `requestAnimationFrame` throttling) y alterna `.is-disabled`.
  - **Teclado**: `←`/`→` navegan (salvo en inputs/textareas/contenteditable).
  - **Swipe con ratón**: `pointerdown/move/up` (solo `pointerType === 'mouse'`, el touch nativo móvil no se toca); drag > 60px navega y suprime el click siguiente para no abrir el `<a>`.

###  Cambios en `js/gooey.js` — efecto wave (4ª tarjeta original)
- El `gooeyShader` (círculo que sigue al cursor) se reemplazó por el **waveShader** del demo (`src/glsl/waveShader.glsl`):
  - Ondas de ruido: `offX = uv.x*.3 - time*.3`, `offY` con `sin(uv.x*5)`, `sin(time*.5)` y `snoise3` (inlineado).
  - `nc`/`nh` deforman y mezclan; `nh *= smoothstep(nh, 0.5, 0.6)` afina el rizo.
  - Mezcla: `image = u_map(uv_h + (nc+nh)*progressHover)` ↔ `hover = u_hovermap(uv + ...)`, `finalImage = mix(image, hover, clamp(nh*(1-progress)+progressHover, 0., 1.))`.
  - Sin máscara cuadrada/círculo: ahora la transición es en "ondas líquidas" en todo el marco.
  - `u_alpha` ahora sale directo (sin `finalMask`).
- Lógica JS del Tile (GSAP hover, `u_time` solo mientras hover, posiciones) permanece igual: el wave usa los mismos uniforms.

###  Estado actual
```
Arzaga/
├── development.html      # 3 tiles sin CTA + flechas prev/next
├── css/style.css         # títulos agrandados, page-title arriba, .dev-nav
├── js/index.js           # navegación prev/next + teclado + swipe ratón
└── js/gooey.js           # shader wave (4ª tarjeta Codrops) en las 3 tiles
```

###  Pendientes (sin cambios)
- [ ] Secciones About / Design / Photography siguen vacías.
- [ ] CTA "Ver proyectos" del index apunta a `#`.
- [ ] Galerías con placeholder; "Ver demo" con `href="#"`.
- [ ] Instagram con `href="#"`.
- [ ] Favicon/manifest.
- [ ] Consolidar `<style>` inline repetido en `style.css`.

---

## Sesión 13 — Fix responsive: Development / Design / Photography / Contact

*Registrado el 18 de septiembre de 2026.*

###  Diagnóstico (medido con Chrome headless a 390px)
- **Causa raíz**: las secciones (`.development`, `.design`, `.photography`, `.about`, `.contact`) solo recibían `grid-area` dentro del media query `≥54em` de cada página. En móvil se auto-ubicaban en una celda de ~64px → las tiles y el formulario quedaban fuera de lugar.
- **`.topnav__links`**: desbordaba 266px (los 6 links no cabían en móvil).
- **`.page-title`**: fijo, `white-space:nowrap` y `calc(2vw+3.25rem)` → desbordaba hasta 330px a la derecha.

###  Cambios
**`css/style.css`**
- `#three-canvas`: `100vw → 100%` (evita 15px de scroll horizontal con scrollbar vertical).
- Regla base **`grid-area`** para las secciones en móvil: `.page-development .development`, `.page-design .design`, `.page-photography .photography`, `.page-about .about`, `.page-contact .contact` (ahora siempre ocupan su fila nombrada, no solo en desktop).
- Nuevo bloque `@media (max-width: 53.99em)`:
  - **Topnav móvil**: botón hamburguesa (`.topnav__toggle`, base `display:none` en desktop) que despliega los links como panel absoluto bajo la barra; morph hamburguesa→X con `.is-open`.
  - `.topnav__links` en móvil: columna, fondo blur oscuro, `opacity/visibility/transform` animados.
  - `.frame` oculto en móvil para páginas con topnav (`page-development/design/photography/about/gallery`) — la barra duplicada quedaba tapa da por el topnav fijo.
  - `.page-title`: tamaño `clamp(1.5–2.3rem)`, `white-space:normal`, acotado a `1.25rem` de los bordes.
  - Secciones de tiles: `padding: 7rem 0 6.5rem` (espacio para flechas prev/next).
  - Contact: paddings compactos en móvil.

**HTML (6 páginas)** — `about`, `design`, `photography`, `development`, `gallery-proyecto-1/2/3`:
- Se agrega `<button class="topnav__toggle">` (con `aria-expanded`) y `id="topnav-links"` en `.topnav__links`.

**`js/index.js`**
- Nuevo `initTopnav()`: toggle `.is-open`, cierre al hacer click fuera, `Escape`, o al volver a desktop (`matchMedia`). Actualiza `aria-expanded`.
- Parallax del `.page-title` limitado a desktop (`≥54em`).

###  Verificación
- Probe headless a 390px: secciones a **ancho completo** (`.development w=390`), `.contact w=375` + card centrada (`w=311`, form `w=261`), `.page-title w=350` sin overflow, dropdown topnav mide `h=288` con `is-open=true`.
- Desktop 1200px sin cambios de layout.

###  Pendientes (sin cambios)
- [ ] Same pendientes de sesiones anteriores.

---

## Sesión 14 — Galerías rediseñadas estilo Development + fix botón zombie

*Registrado el 18 de septiembre de 2026.*

###  Galerías (`gallery-proyecto-1/2/3.html`)
- Layout horizontal en desktop (≥54em): `main` `100vh/overflow:hidden`, `.gallery` en grid de 2 columnas `minmax(280px,2fr) minmax(0,5fr)` con áreas `'text carousel'`.
- Columna izquierda `.gallery__text` centrada (vertical + horizontal), `gap:3rem`: botón de volver + descripción + links.
- Botón de volver con texto circular giratorio (patrón Codrops): anillo "· IR A DESARROLLO · IR A DESARROLLO" (textPath, viewBox 130, radio 48, rotación 40s) + flecha `←` centrada.
- Título gigante transparente `.page-title` arriba (una sola línea en galerías, `display:inline` en el offset).
- Carrusel infinito: `.gallery__track` marquee `translateX(-50%)` 40s, pausa al hover, descripción fade-in por tarjeta, fallback `prefers-reduced-motion` (scroll nativo).
- `initGalleryCarousel()` en `js/index.js`: clona el set base hasta `2×` del ancho del carrusel (set par para loop seamless).
- Tarjetas = links clicables a la demo: `<a class="gallery__item__link" href="#" target="_blank" rel="noopener">` (placeholder; URLs reales pendientes). Hover: `translateY(-4px)` + borde acento. JS `initGalleryCarousel` el clonado maneja los `<a>`.
- `data-rings="off"` en `#three-canvas` (sin anillos wireframe).

###  Botones
- Se eliminó "Ver demo" (redundante: toda la tarjeta ya abre la demo); queda solo **"Ver código"** (repo GitHub).
- "Ver código" ahora usa el estilo del `.content__cta` del index: pill teal translucent (borde `rgba(0,147,165,.45)`, fondo `.06` + blur), texto `#7fd4dd`, hover con glow `box-shadow` y flecha `→` que se desplaza (`translateX(4px)`).

###  Fix: botón "Ver código" zombi en Chrome
- **Síntoma**: al volver a la pestaña de la galería tras abrir GitHub (`target=_blank`), el botón quedaba invisible hasta pasar el mouse por encima.
- **Causa**: Chrome no re-rastrea la capa del botón al restaurar la pestaña (paint obsoleto del compositor); un simple reflow no alcanzaba.
- **Fix** (`js/index.js`): en `visibilitychange` (tab visible) se fuerza re-composite de `.gallery__btn`/`.gallery__links` togglando `visibility:hidden` en doble `requestAnimationFrame` + `void offsetWidth`.

###  Pendientes
- [ ] Reemplazar `href="#"` de las tarjetas de demo por URLs reales (pestaña nueva).
- [ ] CTA "Ver proyectos" del index apunta a `#`.
- [ ] Instagram con `href="#"`.
- [ ] Favicon/manifest.
- [ ] Consolidar `<style>` inline repetido en `style.css`.
