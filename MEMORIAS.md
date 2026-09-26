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

## Estado actual del proyecto — 18/09/2026

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
├── site.webmanifest            # Manifest PWA (iconos, theme-color)
├── css/style.css               # Único CSS (1906 líneas; incluye el layout por página consolidado)
├── js/
│   ├── index.js                # Entry point (Splitting, Menu, HoverSound, Particles, Gooey)
│   ├── menu.js / menuItem.js / menuConfig.js / utils.js   # Menú LetterShuffle
│   ├── i18n.js                 # Diccionario ES/EN + toggle de idioma
│   ├── particles.js            # Fondo Three.js: 2000 partículas + 3 anillos
│   ├── gooey.js                # Efecto gooey (shader snoise3 inline)
│   ├── hoverSound.js           # Sonido de hover en topnav
│   └── segment.min.js / ease.min.js  # Morphing del botón de menú
└── assets/
    ├── IMG/                    # Encabezado portfolio.png + SVGs sociales + dev/{woods,rocks,cities}
    │                           # + favicon.svg / favicon.ico / favicon-192.png / favicon-512.png / apple-touch-icon.png
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
12. Development: sin CTA, títulos grandes, prev/next y wave (18/09)
13. Fix responsive Development/Design/Photography/Contact (18/09)
14. Galerías rediseñadas (carrusel infinito) + fix botón zombie (18/09)
15. Nav alineada con el título + títulos coherentes (18/09)
16. Extensiones: imágenes y descripciones fijas (18/09)
17. Descripciones profesionales en las 3 galerías (18/09)
18. Páginas Web: 5 tarjetas con imágenes reales (18/09)
19. Sitio bilingüe ES/EN con toggle de idioma (18/09)
20. Cierre del bloque i18n + CTA real + favicon/manifest (18/09)
21. Refactor del CSS inline (501→210 líneas) + Open Graph completo (18/09)

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
- [ ] Recibir links reales de páginas/proyectos/extensiones y reemplazar `href="#"` de las tarjetas de demo.
- [ ] CTA "Ver proyectos" del index apunta a `#`.
- [ ] Instagram con `href="#"`.
- [ ] Favicon/manifest.
- [ ] Consolidar `<style>` inline repetido en `style.css`.

---

## Sesión 17 — Descripciones profesionales en las 3 galerías

*Registrado el 18 de septiembre de 2026.*

###  Parrafos `.gallery__desc` (bajo la flecha)
- Reemplazados los placeholders por descripciones profesionales generales (mismo tamaño):
  - **Desarrollo Web**: "Proyectos de desarrollo web construidos de cero: sitios, aplicaciones y experiencias digitales con foco en rendimiento, diseño limpio y automatización."
  - **Páginas Web**: "Sitios web de negocio e institucionales pensados para transmitir identidad, generar confianza y convertir visitas en clientes."
  - **Extensiones**: "Extensiones de navegador publicadas en la Chrome Web Store y en Edge Add-ons: herramientas propias de uso diario que automatizan tareas y optimizan el trabajo digital."

###  Desarrollo Web (`gallery-proyecto-1.html`)
- Tarjeta 1 → imagen **`assets/IMG/Dw/holographic_web_hud.jpg`** + descripción fija con formato título (strong) + cuerpo:
  - **Distrito-R** — "Ranking tracker local observacional: mide tu posición real en Google por distrito y ciudad, con IPs residenciales reales, desktop y móvil, sin manipulación."

###  Tipografía
- `.gallery__desc`: `1.3rem → 1.5rem`.

###  Pendientes
- [ ] Recibir links reales de páginas/proyectos/extensiones y reemplazar `href="#"` de las tarjetas de demo.
- [ ] CTA "Ver proyectos" del index apunta a `#`.
- [ ] Instagram con `href="#"`.
- [ ] Favicon/manifest.
- [ ] Consolidar `<style>` inline repetido en `style.css`.

---

## Sesión 18 — Páginas Web: 5 tarjetas con imágenes y descripciones

*Registrado el 18 de septiembre de 2026.*

###  `gallery-proyecto-2.html` (Páginas Web)
- Se amplía de 3 a **5 tarjetas**.
- Imágenes reales nuevas en `assets/IMG/Pw/`: `at.jpg`, `DR.jpg`, `ps.jpg`, `qh1.jpg` (y `qh.jpg`) + una placeholder (`rocks/base.jpg`).
- Descripciones con formato título (strong) + cuerpo:
  - **Aurora Travel** — página de viajes: destinos, inspiración y planes.
  - **Distrito-R** — ranking tracker local: posición real en Google por distrito y ciudad (versión resumida).
  - **Property Scraper** — web de la extensión inmobiliaria.
  - **¿Qué Harías?** — podcast de historias cotidianas con humor y cercanía.
  - Tarjeta 5 → placeholder (próximo proyecto).
- La versión larga de Distrito-R se mantiene en `gallery-proyecto-1.html` (Desarrollo Web), por decisión del autor.

###  Pendientes
- [ ] Recibir links reales de páginas/proyectos/extensiones y reemplazar `href="#"` de las tarjetas de demo.
- [ ] CTA "Ver proyectos" del index apunta a `#`.
- [ ] Instagram con `href="#"`.
- [ ] Favicon/manifest.
- [ ] Consolidar `<style>` inline repetido en `style.css`.

---

## Sesión 15 — Nav alineada con el título + títulos coherentes de galerías

*Registrado el 18 de septiembre de 2026.*

###  Nav alineada con el título
- `.topnav__brand` ("Arzaga") queda con su borde izquierdo alineado al `.page-title`:
  - Desktop (≥54em): `.topnav { padding-left: 4vw }` (igual al `left` del título).
  - Móvil (≤53.99em): `.topnav { padding-left: 1.25rem }` (igual al `left: 1.25rem` del título móvil).

###  Títulos coherentes
- `gallery-proyecto-2.html` → **"Páginas Web"** (title, og:title, h1, description, desc placeholder, aria-labels y alts de las tarjetas).
- `gallery-proyecto-3.html` → **"Extensiones"** (ídem).
- `development.html`: alts de los tiles → "Desarrollo Web" / "Páginas Web" / "Extensiones" (los `h2` ya coincidían).

###  Pendientes
- [ ] Recibir links reales de páginas/proyectos/extensiones y reemplazar `href="#"` de las tarjetas de demo.
- [ ] CTA "Ver proyectos" del index apunta a `#`.
- [ ] Instagram con `href="#"`.
- [ ] Favicon/manifest.
- [ ] Consolidar `<style>` inline repetido en `style.css`.

---

## Sesión 16 — Extensiones: imágenes y descripciones fijas

*Registrado el 18 de septiembre de 2026.*

###  Galería `gallery-proyecto-3.html` (Extensiones)
- **Nuevas imágenes** en `assets/IMG/ext/` (`ps.jpg`, `Vir.jpg`):
  - Tarjeta 1 → `ps.jpg` — **Property Scraper**: "Extensión de Chrome que extrae propiedades de los portales de inmobiliarias de España".
  - Tarjeta 2 → `Vir.jpg` — **Viralizer**: "Extensión de Chrome para creadores de YouTube: analiza el rendimiento del canal y optimiza títulos SEO anti-clickbait sin spoilers".
  - Tarjeta 3 → sin texto (placeholder `cities/base.jpg`).
- Descripciones con `<strong>Propiedad/Viralizer</strong>` como título en su línea y el cuerpo debajo.

###  `css/style.css` — descripciones de tarjetas
- `.gallery__item__desc`: texto **fijo** (se sacó del hover; `opacity`/`transition` y regla `:hover` removidas).
- Layout en columna: `.gallery__item__desc` `flex-direction: column; justify-content: flex-end; align-items: stretch` (título arriba, descripción debajo, al pie de la tarjeta).
- `.gallery__item__desc strong`: bloque, `font-weight:700`, `font-size:1.2em`, `margin-bottom`.
- Fuente de la descripción: `1.35rem`.

###  Pendientes
- [ ] Recibir links reales de páginas/proyectos/extensiones y reemplazar `href="#"` de las tarjetas de demo.
- [ ] CTA "Ver proyectos" del index apunta a `#`.
- [ ] Instagram con `href="#"`.
- [ ] Favicon/manifest.
- [ ] Consolidar `<style>` inline repetido en `style.css`.

---

## Sesión 19 — Sitio bilingüe ES/EN (i18n) con toggle de idioma

*Registrado el 18 de septiembre de 2026.*

###  Objetivo
Que todo el sitio se pueda leer en español o en inglés sin duplicar páginas (MPA ya existente).

###  Decisión técnica
- **Diccionario plano** en `js/i18n.js`: `SUPPORTED_LANGS = ['es','en']`, `DEFAULT_LANG = 'es'`, exporta `getLang()`, `setLang()`, `initI18n()`.
- **Marcado declarativo** en el HTML, sin lógica por página:
  - `data-i18n="clave"` → escribe `textContent`.
  - `data-i18n-offset="clave"` → títulos partidos en dos: prefijo en el texto del `<h1>`/`<h2>` + `<span class="page-title__offset">` / `.tile__title__offset`.
  - `data-i18n-attr="attr"` + `data-i18n-key="clave"` → atributos (`alt`, `aria-label`, `content`).
- **Persistencia**: `localStorage.lang`; se actualiza `document.documentElement.lang`.
- **Menú LetterShuffle**: `initI18n(cb)` avisa al menú y `Menu.restart()` vuelve a montar los items (`data-label`) con `Splitting` para relanzar el shuffle con las etiquetas nuevas.
- **Toggle** `.lang__toggle` en el `frame` (index/contact) y en el `topnav` (resto); muestra el idioma destino y expone `aria-label` bilingüe.

###  Archivos
```
Arzaga_Nahil/
├── js/i18n.js          # NUEVO — diccionario ES/EN + apply/setLang/initI18n
├── js/menu.js          # NUEVO método restart()
├── js/index.js         # initI18n(() => menu.restart())
├── css/style.css       # estilos del botón de idioma
└── 9 páginas HTML      # data-i18n / data-i18n-offset / data-i18n-attr + toggle
```

###  Verificación (entonces)
- Cobertura medida con script: **87 claves usadas = 87 en `es` = 87 en `en`** (0 faltantes, 0 sin usar).

###  Pendientes detectados en esa sesión
- [ ] Traducir `<title>`, `meta description` y Open Graph (el SEO quedaba en español).
- [ ] El 3er tile de Design ("UI / UX") no tenía clave i18n.

---

## Sesión 20 — Cierre del bloque i18n + navegación real + favicon/manifest

*Registrado el 18 de septiembre de 2026.*

###  Objetivo
Cerrar todos los pendientes que **no dependen de contenido externo**: SEO bilingüe, CTA real, identidad de pestaña/PWA y limpieza.

###  SEO bilingüe (`<title>` + meta + Open Graph) — sin JS nuevo
- `<title data-i18n="meta_title_*">`: el `apply()` ya escribía `textContent`, así que basta con marcar la etiqueta.
- `<meta name="description" data-i18n-attr="content" data-i18n-key="meta_desc_*">`.
- `og:title` / `og:description` **reutilizan las mismas claves**.
- 18 claves nuevas por idioma (36 en total): `meta_title_{index,about,contact,design,dev,photo,gal1,gal2,gal3}` y `meta_desc_*`.
- Se añadieron `og:description` y `og:type` en `design`, `development`, `photography` y las 3 galerías (no existían).

###  Navegación
- CTA "Ver proyectos" del index: `href="#"` → **`development.html`** (era el último enlace muerto de la home).
- `<title>` de galerías: se quitó el sobrante "— Development —" (`Páginas Web — Arzaga Nahil`, `Extensiones — Arzaga Nahil`).

###  i18n — huecos cerrados
- `tile_ui: 'UI / UX'` en ambos idiomas (era la única cadena del sitio sin clave).
- `apply()`: eliminado el `offset.textContent = dict[key]` que quedaba sobreescrito (código muerto) → `offset.textContent = offsetKey in dict ? dict[offsetKey] : dict[key]`.

###  Favicon + manifest (en las 9 páginas)
- Assets nuevos en `assets/IMG/` (monograma "A" monoline teal `#0093a5` sobre cuadrado negro redondeado, generado con GDI+):
  `favicon.svg` · `favicon.ico` (32px) · `favicon-192.png` · `favicon-512.png` · `apple-touch-icon.png` (180px).
- `site.webmanifest` en la raíz: `name`, `start_url`, `display: standalone`, `background_color #000000`, `theme_color #0093a5` y 4 iconos (SVG + 192 + 512 en `any` y `maskable`).
- En cada `<head>`: `<link rel="icon">` (svg/png/ico), `apple-touch-icon`, `manifest` y `<meta name="theme-color">`.

###  Verificación (medida, no asumida)
- **Cobertura i18n: 106 claves usadas = 106 en `es` = 106 en `en`** (0 faltantes / 0 sin usar).
- `node --check` sobre los 9 módulos JS: **OK**.
- Chrome headless + `python -m http.server` con sonda que fija `localStorage.lang='en'` y recorre las 9 páginas:
  - `lang=en`, `<title>`, `description` y `og:title` en inglés en todas.
  - `icon` y `manifest` presentes en las 9.
  - **`leaks=NONE` y `pending=NONE`** en las 9 → cero restos de español en modo EN.
- Render ES por defecto (perfil limpio): `lang="es"`, título y descripción en español, `theme-color #0093a5`, `body.loading` retirada, CTA → `development.html`.
- Sin errores JS en consola (solo ruido GCM de Chrome); `site.webmanifest` parsea como JSON y `favicon.svg` como XML; PNGs 512×512 / 180×180 verificados.
- Integridad UTF-8: 0 mojibake en las 9 páginas y en `js/i18n.js` (acentos y guiones largos intactos).

###  Pendientes
- [ ] **About / Design / Photography**: contenido real (bio, skills, imágenes) — los tiles siguen con `blank.jpg` y `about.html` no tiene sección.
- [ ] **26 `href="#"`** por reemplazar cuando existan URLs reales (eran 27; el CTA del index ya quedó resuelto): design 4, photography 4, gallery-1 4, gallery-2 6, gallery-3 4 (tarjetas demo) + Instagram en about/contact/development.
- [ ] Consolidar los `<style>` inline repetidos (~500 líneas en 8 páginas) en `css/style.css`.
- [ ] `sitemap.xml`: valorar `lastmod` / `<changefreq>`.
- [ ] `og:image`: solo la tiene `index.html`; las otras 8 páginas comparten sin imagen de preview.
- [ ] (Opcional) Unificar idioma de los `<title>` ES de Design/Photography ("Design/Photography" vs nav "Diseño/Fotografía").

---

## Sesión 21 — Refactor del CSS inline + Open Graph completo

*Registrado el 18 de septiembre de 2026.*

###  Objetivo
Eliminar la duplicación de estilos entre páginas (deuda técnica pendiente desde la sesión 10) y completar las previews al compartir.

###  Refactor: ~500 líneas de `<style>` inline → un bloque único en `style.css`
- **8 páginas** llevaban su propio `<style>` en el `<head>`: about (76), contact (86), design (58), development (58), photography (58) y las 3 galerías (55 c/u). `index.html` no tenía.
- Se extrajeron con un script (`node`) y se consolidaron **al final de `css/style.css`**, por una razón de cascada: esos bloques se cargaban **después** de la hoja, así que al final conservan exactamente la misma prioridad.
- Selectores agrupados: lo que era idéntico entre páginas (secciones, `.frame`, `.frame::after`, `.frame__links`, `.frame__links img`) es ahora **una sola regla**.
- **Diferencias que se respetaron** (no se unificó a ciegas):
  - `z-index: 3` en `.frame` **solo** en development / design / photography / galerías; about y contact lo tenían en `auto`.
  - `grid-area` es único por página y se mantiene separado.
- Resultado: **505 líneas borradas** de los HTML y **+210** en `style.css` (77 declaraciones únicas frente a 251 con repetidos).

###  Open Graph / Twitter (las 9 páginas)
- `og:image` en **URL absoluta**: `https://arzaganahil.github.io/assets/IMG/Encabezado%20portfolio.png`. Antes solo la tenía el index y en ruta relativa (muchos scrapers la ignoran).
- Añadidos `og:image:width` (1510), `og:image:height` (634), `og:image:alt` (**bilingüe**, reutilizando la clave `meta_desc_index`), `og:url` (canonical de cada página) y `twitter:card = summary_large_image`.
- Se eligió `Encabezado portfolio.png` (1510×634, apaisada) porque el resto de imágenes son verticales (1152×1571) y se recortarían mal en las previews.

###  Verificación (con red de seguridad de regresión visual)
1. **Baseline** de estilos computados antes del refactor: 9 páginas × 2 anchos (390px y 1200px) × 38 selectores = **684 líneas**.
2. Después: **dos corridas** del mismo probe.
3. **Integridad estructural**: 251 declaraciones originales → 77 consolidadas; **0 perdidas, 0 inventadas**; llaves balanceadas 274/274.
4. **Regresión visual**: baseline vs después excluyendo las flechas prev/next → **648 vs 648 líneas, 0 diferencias**.
   - Las 4 discrepancias iniciales eran `.dev-nav__arrow--prev` (`opacity` 1 vs 0.2): estado `is-disabled` que alterna el JS según el scroll. Se comprobó que **dos corridas del mismo código** divergen en esos mismos selectores → flakiness de la medición, no regresión.
5. **Extracción**: 0 bloques `<style>` restantes, 0 comentarios huérfanos y diffs de HTML de **solo borrado**.
6. Probe final end-to-end en EN: `inline_styles=0` en las 9, `leaks=NONE` en las 9, `og:image` y `og:image:alt` presentes y traducidos.
7. `og:image` con `%20`: **HTTP 200**, `image/png`, 75 KB.
8. Cobertura i18n intacta: **106 claves usadas = 106 es = 106 en**, 0 faltantes.

###  Pendientes
- [ ] **About / Design / Photography**: contenido real (bio, skills, imágenes) — el mayor hueco que queda.
- [ ] **26 `href="#"`:** demos de galerías, Instagram y tiles.
- [ ] (Opcional) `og:locale` / `og:locale:alternate` para previews bilingües.

---

## Sesión 22 — Sitemap enriquecido, lazy-loading + dimensiones intrínsecas + titles en ES

*Registrado el 18 de septiembre de 2026.*

###  sitemap.xml — `lastmod` y `changefreq`
- Añadido a las **9 URLs**:
  - `<lastmod>2026-09-18</lastmod>` en todas (fecha de la última actualización significativa).
  - `<changefreq>`: `weekly` para el homepage (nuevos proyectos, toggle de idioma); `monthly` para el resto (contenido más estable: galerías, páginas estáticas).
- Validado con parser XML: **9 urls ✓ / 9 lastmod ✓ / 9 changefreq ✓**.

###  Lazy-loading + dimensiones intrínsecas (49 imágenes)
- **`loading="lazy"`** añadido a **todas** las 49 imágenes `<img>` en las 9 páginas.
- **`width` y `height` intrínsecos** definidos para evitar CLS:
  - SVG del frame (instagram/github/linkedin): 32×32.
  - Imágenes de tiles/galería: 400×300 (placeholder `blank.jpg` y fotos reales).
  - Hero del index (`Encabezado portfolio.png`): 1510×634 (nativo).
- **Cobertura final**: 9/9 páginas con `lazy attrs` = `total imgs` ✓.
- No se rompe el layout: el CSS `.tile__img` (absolute, width 100%) y `.gallery__item img` (width 100%) los absorben; los atributos sirven para *layout stability*, no para dimensionar visualmente.

###  Titles en español
- `design.html`: "Design — Arzaga Nahil" → **"Diseño — Arzaga Nahil"** ✓
- `photography.html`: "Photography — Arzaga Nahil" → **"Fotografía — Arzaga Nahil"** ✓

###  Verificación final
| Archivo | imgs | lazy | width/height |
|---|---|---|---|
| index.html | 4 | 4 | 4 (3× SVG 32×32, hero 1510×634) |
| about.html | 3 | 3 | 3 (SVG 32×32) |
| contact.html | 3 | 3 | 3 (SVG 32×32) |
| development.html | 6 | 6 | 6 (3× SVG + 3× 400×300) |
| design.html | 6 | 6 | 6 (3× SVG + 3× 400×300) |
| photography.html | 6 | 6 | 6 (3× SVG + 3× 400×300) |
| gallery-proyecto-1.html | 6 | 6 | 6 (3× SVG + 3× 400×300) |
| gallery-proyecto-2.html | 8 | 8 | 8 (3× SVG + 5× 400×300) |
| gallery-proyecto-3.html | 6 | 6 | 6 (3× SVG + 3× 400×300) |

###  Pendientes actualizados
- [ ] **About / Design / Photography**: contenido real (bio, skills, imágenes).
- [ ] **26 `href="#"`:** demos de galerías, Instagram y tiles.

---

## Sesión 23 — Indicador de scroll (Development / Design / Photography)

*Registrado el 19 de septiembre de 2026.*

###  Objetivo
Ayudar al visitante a entender que las páginas de la galería (development, design, photography) se desplazan: el usuario veía *"¿cuál es tu próximo proyecto?"* y no tenía una señal visual de que el carrusel horizontal de tiles scrollea.

###  Qué se hizo
- **Indicador tipo "scroll down"** (patrón clásico de scroll indicator, adaptado del de nudaui.dev / demos de Codrops): un **mini mouse SVG** con **ruedita animada** que se desliza hacia abajo (fade loop 1.6s) + texto chiquito **"scroll"** en `--font-mono`, mayúsculas con `letter-spacing`.
- Todo el conjunto hace un **bob** suave (translateY, 2s) para llamar la atención.
- Estilo coherente con el sitio: color `#7fd4dd`, sin fondo (solo líneas), respeta `prefers-reduced-motion` (se congela la animación).
- **Posición**: esquina **inferior izquierda** (`left: 1.5rem; bottom: 1.5rem`), `position: fixed`, `z-index: 4`. Se eligió la izquierda porque la esquina derecha ya la ocupan los iconos sociales (`.frame__links`).
- **Compuerta de aparición**: la lógica en `js/index.js` solo lo muestra si hay overflow horizontal (`tiles.scrollWidth > tiles.clientWidth`); si no hay overflow, queda oculto con `.is-hidden`.
- **Desaparición**: al primer scroll horizontal (`tiles.scrollLeft > 8`) se agrega `.is-hidden` (fade out 0.5s) de forma permanente: invita a scrollear y desaparece una vez que el usuario "lo experimentó".

###  Archivos modificados
```
Arzaga/
├── development.html        # + <div class="scroll-hint"> con SVG mouse
├── design.html             # ídem
├── photography.html        # ídem
├── css/style.css           # bloque .scroll-hint + keyframes (bob / wheel)
└── js/index.js             # lógica de aparición/ocultamiento al scrollear
```

###  Nota de proceso
- Se intentó primero una versión *pill* de vidrio con chevron `»` animado, pero el usuario la descartó por dos motivos: chocaba con los iconos sociales (esquina derecha) y prefería la animación de mouse/scroll clásica. Se pivotó a la posición izquierda + mouse SVG.
- Importante: hubo un error de edición en `index.js` que borró de paso el bloque del `page-title` y las declaraciones `prevBtn`/`nextBtn`; se detectó leyendo el diff y se restauró íntegro. Siempre verificar con `node --check` + `git diff` tras editar bloques grandes.

###  Pendientes (sin cambios)
- [ ] **About / Design / Photography**: contenido real (bio, skills, imágenes).
- [ ] **26 `href="#"`:** demos de galerías, Instagram y tiles.

---

## Sesión 24 — Cursor invisible + galería real de Rescate Animal con lightbox

*Registrado el 26 de septiembre de 2026.*

###  Objetivo
Sustituir los placeholders de las galerías de Diseño y Fotografía por contenido real, e incorporar Rescate Animal como cuarta galería de diseño con fotos reales, y unificar el puntero en todo el sitio.

###  Qué se hizo

**Cursor**
- `cursor: none` global, en una sola regla, para que el cursor propio (Three.js + anillo) no se mezcle con el del sistema.
- Se aplicó también dentro del lightbox, que se abre como un overlay por encima de todo.
- Se ajustó la zona sensible del marquee del hero: con el cursor oculto, la zona anterior resultaba demasiado fácil de activar.

**Rescate Animal entra en Diseño**
- Cuarta tarjeta en `design.html` con `animal.jpg` (800×1096) como portada y `data-hover` propio.
- Página `gallery-design-4.html` completa: anillo de vuelta, descripción, CTA y carrusel.

**18 fotos reales, dos versiones cada una**
- `thumbs/` → miniaturas a **506px de alto**, que es exactamente el tope de `height: clamp(250px, 41vh, 506px)`, así que en pantallas grandes no se escalan hacia arriba.
- `full/` → la misma foto a tamaño grande para el visor.
- 13 proporciones distintas entre las 18 (de 0.71 a 2.04). Por eso la tarjeta **no fija ancho**: fija altura y deja que el ancho salga de la proporción natural. Ninguna se recorta ni se estira.
- Los `<img>` llevan `width`/`height` reales, que es lo que el navegador usa como ratio mientras carga y evita saltos de maquetación.

**Lightbox**
- `js/lightbox.js` nuevo, a propósito **sin shader**: solo amplía. El fondo sigue siendo el de las partículas, no se añade ningún fondo nuevo.
- Navegación con flechas, teclado (←/→/Esc) y botones; contador `n / total`; precarga de la actual y sus vecinas para que las flechas no parpadeen; foco atrapado dentro del diálogo con Tab.
- `initLightbox()` se llama desde `js/index.js` en todas las páginas y **no hace nada** si no encuentra `[data-lightbox]` ni `.lightbox`. Por eso las demás galerías no cargan nada extra.
- Regla que solo aplica a las galerías con visor: `.page-gallery:has(.lightbox) .gallery__carousel { margin-right: -2rem; }` — el carrusel se sangra por la derecha sin invadir la columna de texto.

###  Archivos nuevos
```
assets/IMG/design/rescate-animal/
├── thumbs/                   # 18 miniaturas a 506px de alto
└── full/                     # 18 originales a tamaño grande
js/lightbox.js                # visor de imagen
gallery-design-4.html         # galería de Rescate Animal
```

###  Archivos modificados
```
Arzaga/
├── design.html               # + tarjeta de Rescate Animal
├── css/style.css             # cursor:none, .gallery__card, reglas del visor
├── js/index.js               # + initLightbox()
└── js/gooey.js               # cursor oculto dentro del lightbox
```

###  Nota de proceso
- Con 18 fotos duplicadas en `thumbs/` y `full/` son 36 rutas nuevas. Un `src` mal escrito no se detecta leyendo el HTML, así que antes de dar la galería por buena se recorren todos los `src` y `data-full` contra el disco. Esa comprobación seIxó en el guion de verificación de cada sesión.

---

## Sesión 25 — CTA de contacto en las galerías de diseño + portada editorial

*Registrado el 26 de septiembre de 2026.*

###  Objetivo
Que las cuatro galerías de diseño ofrezcan una vía de contacto, y dar a Diseño Editorial una portada real en lugar de un placeholder.

###  Qué se hizo

**CTA "Trabajemos juntos"**
- Botón `→ contact.html` con la clave `g_hire` (ES/EN) en las cuatro galerías de diseño.
- Donde ya existía un enlace de código (`g_code`, en Fotografía y Web) **se conservó**: el CTA se añadió, no sustituyó.

**Portada editorial**
- `poratadaDI_ED.jpg` (original del usuario, ya optimizada por su cuenta) se integró como tarjeta 1 de Diseño Editorial.
- Salida: `portada.jpg`, 680×850, **ratio 4:5 exacto**, 103 KB, JPEG progresivo.
- El original es más ancho que 4:5, así que para no deformarlo se completó con **barras laterales difuminadas** (radio grande, 170px) en lugar de recortar: **0 píxeles de foto perdidos**.
- `base.jpg` y `hover.jpg` de esa carpeta quedaron intactos, byte a byte.

###  Archivos modificados
```
Arzaga/
├── gallery-design-1.html     # + CTA
├── gallery-design-2.html     # + CTA, portada como tarjeta 1
├── gallery-design-3.html     # + CTA
├── gallery-design-4.html     # + CTA
├── js/i18n.js                # + g_hire ES/EN
└── assets/IMG/design/editorial/portada.jpg
```

---

## Sesión 26 — Slogan de Rescate Animal: posición, opacidad y raya

*Registrado el 26 de septiembre de 2026.*

###  Objetivo
Añadir una frase bajo el carrusel de Rescate Animal, alineada con la retícula y con un peso visual que no compita con el título de la página.

###  Qué se hizo

**Posición**
- El slogan entra en la **misma celda que el carrusel** (`grid-area: carousel`, `align-self: end`, `justify-self: start`), no en una fila nueva. Así la fila `'text carousel'` se queda exactamente como estaba, sin cambiar la retícula.
- Alineado al borde izquierdo del carrusel sin aritmética de columnas: al compartir celda, el borde coincide por construcción.
- En móvil conserva su tercera fila mediante el modificador `.gallery--slogan`.

**Tipografía y opacidad**
- Mismo `var(--font-name)` (Bruno Ace) y mismo color que el título (`--color-heading`). El título va a `0.18`; el slogan a `0.25` porque siendo más pequeño necesita algo más de cuerpo.
- `max-width` en `ch` (no en px) para que la medida acompañe al tamaño de fuente en todo el rango del `clamp`.

**Raya de acento**
- `::after` de 3.5rem × 2px en `--color-accent`, con `margin-top` para separarla del texto.

###  Nota de proceso — el detalle que costó más
La opacidad del texto estaba en el `<p>`, y **en CSS la opacidad de un elemento se multiplica sobre sus pseudo-elementos**. Con el `0.25` en el padre, la raya quedaba topada a `0.25` y no había forma de subirla desde dentro; con su propio `opacity: 0.55` Bajaba a `0.1375` y desaparecía.

Solución: la opacidad se movió a un `<span>` interior que contiene el texto. El texto se atenúa solo y la raya queda a opacidad plena. Eso obligó a **mudar la clave i18n al `<span>`**, porque el script escribe con `textContent` sobre lo que lleve `data-i18n`: si se quedaba en el `<p>`, cada cambio de idioma borraría el span.

###  Verificación
| Comprobación | Resultado |
|---|---|
| Paridad i18n ES/EN | 209 claves, sin huérfanas |
| Peor holgura lema ↔ carrusel | 8px (1280×720, 2 líneas) |
| Peor holgura lema ↔ links sociales | 12px |
| `node --check` en los JS | OK |

---

## Sesión 27 — Las tres galerías de diseño con la configuración de Rescate Animal

*Registrado el 26 de septiembre de 2026.*

###  Objetivo
Que Identidad Visual, Diseño Editorial y UI/UX tengan exactamente la misma configuración que Rescate Animal, sin tocar las imágenes.

###  Qué se hizo
Por cada una de las tres:
- `<section class="gallery">` → `gallery gallery--slogan`, y con ello la tercera fila y el reparto de escritorio.
- `data-lightbox` en el carrusel + el markup completo del visor.
- Las tres `gallery__item__link` (con `figure`, `figcaption` y enlace a demo) sustituidas por `gallery__card` con `data-index` y `data-full`. Se van los `figcaption` y los enlaces a demo.
- El slogan bajo el carrusel, con su `span` y su raya.

No hizo falta ningún `<script>` nuevo: `index.js` ya llama a `initLightbox()` en todas las páginas.

**Etiqueta propia del visor.** `lb_gallery` está cableada a "Galería de imágenes de Rescate Animal", así que reutilizarla habría hecho que las otras tres anunciaran eso al lector de pantalla. Se añadieron `lb_gallery_1/2/3` y se corrigió también el `aria-label` estático del HTML, que es lo que se lee antes de que corra el i18n.

**El slogan** reutiliza la frase de Rescate Animal bajo una clave compartida, `g_slogan_design`, para que cambiarlo sea una edición y quitarlo un borrado. Queda pendiente sustituirlo por texto propio de cada galería.

###  Bug encontrado y corregido en `js/lightbox.js`
Las tarjetas 1 y 3 de estas galerías apuntaban al mismo `base.jpg`. El visor **deduplicaba la lista de navegación por `data-full`**, así que la segunda se quedaba filtrada y, sin listener, era **un botón muerto**.

- La lista se saca ahora por `data-index`, que los clones del carrusel repitan pero las tarjetas distintas no. Si el marcado no trae `data-index`, cae al `src`, que es lo que se usaba antes.
- El listener se pone en **todas** las tarjetas, clones incluidos. Antes solo estaba en la original, de modo que en el tramo repetido del bucle infinito no abría ninguna. Rescate Animal se beneficia de ambos arreglos.

###  Imágenes
`data-full` apunta al `src` actual, así que el visor muestra la misma foto dos veces hasta que lleguen las reales. Cuando lleguen: generar `thumbs/` a 506px de alto y `full/`, y poner las dimensiones reales en el `width`/`height`.

###  Verificación
| Comprobación | Resultado |
|---|---|
| Paridad i18n ES/EN | 214 claves, sin huérfanas |
| Lógica del visor (nodo, con clones) | 3 entradas con 2 src repetidos; ninguna tarjeta sin listener |
| Las 4 galerías con visor | OK |
| Assets referenciados en disco | todos |

---

## Sesión 28 — Tarjeta de Rescate Animal en `design.html`: título a dos líneas y hover propio

*Registrado el 26 de septiembre de 2026.*

###  Objetivo
Que la tarjeta de Rescate Animal en el índice de Diseño se comporte como sus tres hermanas: título en dos líneas y hover con la misma imagen de portada.

###  Qué se hizo

**Título a dos líneas**
- Se adoptó el patrón de las tarjetas 1 y 2: `data-i18n` + `data-i18n-offset` con un `<span class="tile__title__offset">`, que es `display: block` con `margin-left: 18%`. El salto de línea no lo fuerza el `white-space` (el título es `nowrap`), sino el `display: block` del span.
- `tile_rescate` se sustituye por `tile_res_pre` / `tile_res_off`. En inglés invierte a "Animal / Rescue".
- UI/UX se queda en una línea: es una sola expresión con barra.

**Hover propio**
- El `data-hover` apuntaba a `thumbs/02-anika.jpg`, que no es como funcionan las otras: cada una tiene su imagen base en la carpeta y un `hover.jpg` al lado. Ahora sigue la misma forma, con `animal.jpg` en reposo y `hover.jpg` al lado.

###  Hallazgo — por qué el hover de las hermanas se ve más oscuro
Las tres hermanas tienen `base.jpg` y `hover.jpg` **idénticos por SHA256**. O sea, **en el hover no cambia la foto**: el shader mezcla la portada consigo misma (`mix(image, hover, ...)`) y lo único que se anima es la deformación líquida. El oscurecimiento que se percibe es ese efecto, no un cambio de imagen.

El primer `hover.jpg` de Rescate Animal era una copia del thumb de anika, lo que hacía que esa tarjeta **sí** cambiara de foto al hover: era la única de las cuatro con distinto comportamiento. Corregido: ahora es copia de `animal.jpg`.

De paso quedó alineado el ratio: el hover tiene ahora las mismas 800×1096 que la portada, así que `u_hoverratio` en el shader mapea las mismas UV. Con el thumb de 358×506 el plano del hover se muestreaba a un ratio distinto del base dentro del mismo `object-fit: cover`.

###  Verificación
| Comprobación | Resultado |
|---|---|
| Paridad i18n ES/EN | 214 claves, sin huérfanas |
| `base`/`hover` idénticos en las 4 carpetas | OK (SHA256) |
| Las 4 tarjetas con `src` + `data-hover` en la misma carpeta | OK |
| Assets sirviendo por HTTP | 200 |

###  Pendientes
- [ ] **Slogans propios** para Identidad Visual, Diseño Editorial y UI/UX (ahora comparten `g_slogan_design` con la frase de Rescate Animal). El usuario dijo que probablemente convenga eliminarlos más adelante.
- [ ] **Imágenes reales** de las tres galerías: optimizadas `thumbs/` + `full/`, `data-full` corregido y `width`/`height` reales. El usuario tiene la ruta pendiente de enviar.
- [ ] **`hover.jpg` propio** de Rescate Animal: hoy es copia de `animal.jpg`; basta con sobrescribir el fichero.
- [ ] **About / Design / Photography**: contenido real (bio, skills, imágenes).

---

## Sesión 29 — Las tres galerías de Diseño con WebP

**Objetivo**: servir las imágenes de las galerías en WebP en vez de JPEG, como ya se hacía en otro sitio del proyecto, y comprobar que no se pierde nada visible.

**Decisiones**:
- WebP en `thumbs/` a calidad 82 y en `full/` a 80, `method=6`.
- Sin pictures de reserva: el sitio ya solo sirve WebP en las galerías.
- `base.jpg` y `hover.jpg` se quedan en JPEG porque `design.html` los pasa como textura al shader.

**Identidad Visual**: 42 ficheros, 3,81 → 1,49 MB. Se retiraron las tarjetas de ALO Rental y una más sin identificar, dejando 21.
**Rescate Animal**: 36 ficheros, 6,21 → 4,08 MB. Casi todo el ahorro vino de `full/` (5,27 → 3,02 MB); los `thumbs/` apenas bajaron porque las miniaturas son las mismas. `animal.jpg` y `hover.jpg` siguen en JPEG para el shader.

**Pendiente que quedó**: los `thumbs/` de Rescate Animal se probaron a q82 por prudencia. Son fotos y probablemente no haría falta tanta calidad; a q76 darían unos 300 KB menos. No se tocó sin medir el impacto visual.

## Sesión 30 — Velocidad de los carruseles y portada de Editorial

**Objetivo**: que los cuatro carruseles se movieran al mismo ritmo, y sacar la portada de Diseño Editorial del carrusel.

**El fallo**: la duración del marquee estaba fija en `40s`, pero el keyframe recorre el `50%` del ancho del track. La velocidad en píxeles por segundo salía proporcional al ancho, y cada galería tenía un track distinto:

| Galería | px/s | respecto a Rescate |
|---|---|---|
| Rescate Animal | 275 | referencia |
| Identidad Visual | 440 | +60% |
| Diseño Editorial | 965 | +251% |

Diseño Editorial iba 3,5 veces más rápido que Rescate Animal. Con 53 tarjetas el track medía 36.884 px contra los 10.446 de Rescate.

**La solución**: `initGalleryCarousel` mide el ancho real del track y deja la duración en `--marquee-duration`, dividiendo la distancia entre `PX_POR_SEGUNDO = 275`. En CSS queda `var(--marquee-duration, 40s)`, y los 40s son solo el valor de reserva. Rescate se queda en 40,0s, es decir, igual que antes; las otras dos pasan a 64,1s y 137,7s.

Un detalle: la tarjeta es `height: clamp(250px, 41vh, 506px)` con `width: auto`, así que el ancho del track depende de la **altura** de la ventana. La duración se recalcula en `resize` al cambiar la altura; si no, el ritmo se desvariaría igual que antes.

**La portada**: `portada.jpg` era una imagen creada a mano con su propio texto, no una pieza del trabajo. Se retira la card, se renumeran `data-index` y las claves `galdesign2_img_*`, y se borra el fichero al quedar sin uso. `base.jpg` y `hover.jpg` no se tocan.

**Error propio**: al quitarla se renumeró el `data-index` del HTML y por separado las claves del fichero i18n, pero no el atributo `data-i18n-key` del HTML. El HTML acabó pidiendo las claves 2..54 y el i18n tenía 1..53: cada tarjeta pintaba el texto alternativo de la imagen siguiente. Lo detectó la verificación antes de subir.

**Error propio, más grave**: la URL que se le dio al usuario, `arzaganahil.github.io/gallery-design-1`, da 404. El repositorio se llama `Portfolio`, así que la dirección real es `arzaganahil.github.io/Portfolio/gallery-design-1`. No se comprobó antes de decir que el sitio estaba publicado.

**Lección operativa**: GitHub Pages cachea con fuerza. Tras un push, la verificación por HTTP seguía viendo la versión anterior y casi se dio por rota. Hay que pedir las URLs con un parámetro distinto cada vez para saltar la caché del CDN.

## Sesión 31 — Calendario ALO Lift y el lema equivocado

**Objetivo**: reducir el peso de la galería de Editorial y arreglar textos que no correspondían.

**Calendario**: el calendario ALO Lift ocupaba 15 de las 53 tarjetas, todas del mismo proyecto y formato, y arrastraba el peso de la galería. Se reducen a tres: la página 1 (la portada), la 2 (primera dupla de meses) y la 15, que es la única de formato distinto — 255×506, el pliegue vertical de 1319×2618 del original. Se borran las 12 del 3 al 14.

La galería queda en 41 tarjetas, con `data-index` 0..40 y claves `galdesign2_img_1..41` en ES y EN. Los 74 ficheros que quedan se renombran para que el prefijo global siga siendo 01..41, pero **el sufijo no se toca**: `calendario-15` sigue llamándose `calendario-15` porque es la página 15 del PDF original y es lo que permite rastrear la pieza. El prefijo es la posición en la galería; el sufijo es la página del original; no se mezclan. La galería baja de 10,65 a 9,50 MB.

**Error propio**: el commit de esta sesión dejó preparados los 24 borrados y los 74 renombrados con `git rm` y `git mv`, pero el HTML y el i18n ya modificados en disco nunca se añadieron al área de preparación. Se publicó un commit donde el HTML pedía 53 imágenes con nombres que ya no existían. Hubo que corregirlo en un commit aparte.

**Error grave, truncado el HTML**: al quitar las 12 tarjetas, el reensamblado se hizo troceando el fichero con `re.split` y un grupo. `re.split` devuelve `[cabeza, tarjeta, separador, tarjeta, ..., cola]`, y el bucle `for i in range(1, len, 2)` recorre 1, 3, 5… y nunca llega al último elemento, que es la cola. Se publicó un `gallery-design-2.html` que **terminaba en `</button>`**: sin cerrar `</div>`, `</section>`, `</main>`, sin el lightbox entero y sin `</body></html>`. La galería seguía viéndose porque el navegador cerraba solo lo que faltaba, y no había forma de notarlo mirando la página. Se rehízo el fichero entero desde `5ddd012`, que era la última versión sana, localizando las tarjetas con `finditer` y reconstruyendo con `cabeza + tarjetas + cola`.

**LeCCIó operativa**: un verificador que solo mira lo que debería estar presente no detecta lo que falta. El que faltaba era un `count('</html>')` y un `data-lb` presente. Desde entonces la comprobación de cada galería incluye final del fichero, apertura y cierre del lightbox, y recuento de `<div>` contra `</div>`.

**El lema**: eran **tres** galerías con el lema equivocado, no dos. Identidad Visual (1), UI/UX (3) y también Editorial (2) pintaban "Únete a esta causa, ellos aún te necesitan!", que es el lema de la campaña de adopción de Rescate Animal. Al ser disciplinas distintas no bastaba con reescribir la clave compartida `g_slogan_design`: se hizo una clave por galería, `g_slogan_branding`, `g_slogan_editorial` y `g_slogan_uiux`. Rescate Animal conserva `g_slogan_rescate`, que sí es la suya.

**Por qué no se detectó antes**: la comprobación de paridad comparaba el bloque ES con el bloque EN de `i18n.js`, y ambos estaban completos. Lo que faltaba era contrastar las claves `data-i18n` del **HTML** contra las claves que existen en el i18n. Al borrar `g_slogan_design` del fichero de traducción, Editorial se quedó apuntando a una clave inexistente sin que nada lo indicara. La auditoría recorre ahora todas las páginas.

**Otro defecto previo, no de esta sesión**: el `<div class="lightbox">` de las galerías 1, 2 y 3 nunca se cerraba, desde `06b489a`. El navegador lo cerraba al llegar a `</body>`, así que nunca se vio, pero el HTML no era válido. La galería 4, que se hizo aparte, sí lo cierra. Corregido en las cuatro.

**Error propio, dos veces seguido**: se afirmó que faltaban 10 claves en inglés y que el bloque EN tenía 260 frente a 270 de ES. Era falso. El bloque EN usa comillas dobles y el ES comillas simples, y el escaneo solo buscaba comillas simples, así que medio archivo inglés era invisible. Con un extractor que acepta las dos formas: **ES 270, EN 270, ni una clave de diferencia**. Las 5 con texto idéntico son correctas (`Email`, `UI / UX`, `full frame`).

**Error propio, anterior**: se afirmó que había 92 claves huérfanas. También falso, por el mismo motivo: el sistema usa `data-i18n` y `data-i18n-attr`, y el escaneo buscaba `data-i18n-key`, que solo usan las tarjetas de galería. Las huérfanas reales son 25, casi todas restos de las galerías de maqueta (`galdesign*_card1`, `galdesign*_demo_*`) y de interruptores de vista previa.

---

## Pendiente

- [ ] **Nombres reales de los proyectos**: los textos alternativos de las 41 tarjetas de Editorial y las 21 de Identidad Visual son provisionales. "NH 1" dice cliente y número de pieza, no qué es la pieza. Sin esta información no se pueden escribir bien.
- [ ] **MOTO de baja resolución**: 3 de las 41 imágenes de Editorial son menores que la tarjeta (606×462, 812×456, 805×260) y quedan sin ampliar. Se ven blandas. Arreglarlo exige el original a mayor resolución.
- [ ] **T3 del calendario T**: en la carpeta de origen solo hay T1, T2, T4 y T5. Se respetó la numeración original en lugar de renumerar para tapar el hueco.
- [ ] **Lemas de Identidad Visual y Editorial**: los dos son provisionales. Se escribieron solo para que dejaran de mostrar el de Rescate Animal, que es el único real. "Cada página, una decisión de diseño." en Editorial y "Marcas que se reconocen de un vistazo." en Identidad Visual. Con la retirada de UI/UX solo quedan estos dos por decidir.
- [ ] **`thumbs/` de Rescate Animal a q76**: darían unos 300 KB menos, pero es bajar calidad de fotos sin medir el efecto.
- [ ] **Medidas de las tiles de `design.html`**: los tres `<img>` de Diseño declaran `width="400" height="300"` y los ficheros reales son verticales de 1296×1571. No se deforman porque el CSS los recorta con `object-fit: cover`, así que el atributo es inerte, pero sigue siendo markup incorrecto.
- [ ] **Nombres y descripciones de las 38 fotos de Producto**: los 27 ficheros que solo se nombran por número (`1.jpg`, `DSC04236.jpg`, `IMG_*.jpg`) y las piezas con código de referencia (`es3246-gallery-ext-platform2`, `jlg 600aj1`) están como "Pieza 01" a "Pieza 37" con descripción genérica. No dicen qué es cada fotografía. Los originales no se tocan y el manifiesto queda en `producto_manifest.json`, así que corregirlo no obliga a reprocesar las imágenes.
- [ ] **5 fotos de producto demasiado pequeñas, y una límite**: quedaron fuera por decisión del usuario `images.png` (225×225), `gorra.png` (466×374), `metros-flexibles-con-llavero-baratos.jpg` (476×392), `LIBRETA.jpg` (474×480) y `MUGS BL.jpg` (512×512). Entran si aparecen originales. `jlg 600aj1.jpg` se quedó dentro con 558×429, del mismo orden de magnitud pero todavía cabe en el visor.
- [ ] **20 claves i18n huérfanas**: se quedaron en 25 al quitar la galería de UI/UX, que se llevó por delante cuatro de ellas. Antes de borrarlas hay que buscar si algún sitio las construye por cadena, porque hay llaves que se arman en JavaScript y no salen en un `grep` de `data-i18n`.: restos de las galerías de maqueta y de interruptores de vista previa. Sin impacto visible.
- [ ] **About / Design / Photography**: contenido real (bio, skills, imágenes).

---

## Sesión 32 — Fuera la galería de UI / UX

**Motivo**: el usuario dijo que no tiene material para esa disciplina y que era mejor quitarla. Al mirarlo, la decisión queda justificada por los datos: la galería era relleno de maqueta, no trabajo real.

**Las pruebas**:

- Tres tarjetas, pero solo dos ficheros distintos: `uiux/base.jpg` aparecía dos veces.
- Los tres ficheros (`ui_ux/portadaUI_UX.jpg`, `uiux/base.jpg`, `uiux/hover.jpg`) son **copias byte a byte del mismo binario**, md5 `61b017fe75fb`. No había ni una imagen propia.
- El HTML declaraba `width="400" height="300"` y los ficheros son de 1296×1571, verticales. Se veían deformados.
- Los textos alternativos eran `UI / UX — proyecto 1/2/3`.
- Las claves `galdesign3_card1` y `galdesign3_demo_1..3`, que nadie usaba, describían un panel de métricas, navegación modular y design system. Texto de maqueta, sin nada detrás.

**Qué se retira**: `gallery-design-3.html`, el `<li>` de la tile en `design.html` (12 líneas), la entrada del `sitemap.xml`, las carpetas `assets/IMG/design/uiux/` y `assets/IMG/design/ui_ux/`, y 14 claves de i18n, ES y EN: `pt_galdesign3`, `tile_ui`, `alt_design_3`, `g_slogan_uiux`, `lb_gallery_3`, `galdesign3_card1`, `galdesign3_demo_1..3`, `galdesign3_img_1..3`, `meta_title_galdesign3`, `meta_desc_galdesign3`. La sección de Diseño pasa de cuatro disciplinas a tres: Identidad Visual, Editorial y Rescate Animal. Se recuperan unos 0,77 MB.

**Aviso sobre el sufijo `_3`**: aquí `_3` no significa "UI/UX". Las claves de Fotografía y de los proyectos de Desarrollo también acaban así (`alt_photo_3`, `g3_img_3`, `galphoto2_demo_3`…). Borrar "las que acaban en 3" habría roto tres páginas más. Solo se tocan las 14 claves con nombre propio de la galería 3, y antes se comprobó que ninguna la usaba otra página.

**Error propio**: el primer intento de quitar la tile usó `<li class="devtile">.*?gallery-design-3\.html.*?</li>` con `re.S`. Como `.*?` salta líneas, el patrón arrancaba en el primer `<li class="devtile">` y terminaba en el `</li>` de UI/UX, así que borró tres tiles de golpe y dejó la página con una sola disciplina. Lo detectó la comprobación que exigía 3 tiles y encontraba 1. Se restauró con `git checkout HEAD -- design.html` y se repitió troceando en bloques, quitando solo el que contenía la galería 3. **Lección**: para quitar un elemento de una lista hay que aislar primero el bloque y comprobar después cuántos quedan. Un `.*?` con `re.S` puede cruzar varios elementos sin avisar.

---

## Sesión 33 - El /Portfolio que faltaba en 62 URLs

**El error**: el repositorio se llama `Portfolio`, así que la URL pública es `arzaganahil.github.io/Portfolio/`. Pero 15 páginas declaraban `https://arzaganahil.github.io` en `og:url`, en `canonical` y en `og:image`, el `robots.txt` apuntaba al sitemap sin la carpeta, y las 15 entradas del `sitemap.xml` idénticas. Todo eso daba 404, y en SEO es justo lo que más pesa: canónica al 404 y sin indexar.

**Alcance**: 62 URLs en 17 ficheros, las 15 págiras más `sitemap.xml` y `robots.txt`. Por página son 3 (og:url, canonical, og:image), y `index.html` lleva además el enlace al sitemap. **Los enlaces relativos no se tocaron**: `design.html`, `assets/IMG/...` etc. siguen igual, que es lo correcto y lo que evita romper la navegación al cambiar de base.

**El error que se repitió**: el script de sustitución no era idempotente. Al reejecutarlo cambió `.../Portfolio/` por `.../Portfolio/Portfolio/` en los 62 sitios. Se normalizó después, pero un script de reemplazo de URLs tiene que ser idempotente o el segundo fallo es peor que el primero. La comprobación final compara cada `og:url` y cada `canonical` contra la base, y detecta el duplicado.

**Lección operativa**: la primera comprobación por HTTP se hizo **antes** de commitear y por eso seguía viendo la versión vieja. Concluir "no funciona" sobre lo que sirve el servidor, sin comprobar si lo cambio está subido, es el error de lectura más fácil de cometer. La secuencia que funciona es: verificar en local, commit, push, esperar, y **entonces** pedir por HTTP.

**Verificación**: las 15 entradas del sitemap responden 200, y `og:url` y `canonical` de las páginas comprobadas dan 200. El `og:image` correcto ya existía en el repo y responde 200.

---

## Sesión 34 - La galería de Producto, de 3 placeholders a 38 fotos

**Origen**: 43 ficheros en la carpeta de producto, 114,47 MB. El usuario confirmó que las 17 de nombre `DSC*` e `IMG_*` también son de producto y entran todas, y decidió dejar fuera las demasiado pequeñas. Quedan **38**.

**Decisiones que tomó el usuario**: las 38 entran; tarjeta con descripción **y** visor de imagen; fuera las que son demasiado pequeñas para el visor. Los nombres y textos los decide él, así que se montó con la estructura completa y los textos provisionales colocados en un solo sitio.

**Peso**: 114,10 MB de origen a **9,67 MB** de WebP, el 8,5 %. Miniatura con caja 1000×1000 y grande con 2000×2000, calidad 80 y 82. Los PNG con canal alfa se aplanan sobre blanco porque el visor va sobre fondo oscuro. Los originales no se tocan.

**Por qué un `<button>` y no un `<a>`**: las tarjetas de foto eran `<a href="#" target="_blank">` con el texto "Ver demo". Estas fotos no van a ninguna demo, abren el visor, y **`lightbox.js` no llama a `preventDefault()` en el click**: con un enlace el navegador naviga y el visor no llega a abrirse. Se reutiliza la utilidad `.unbutton` que ya había en el CSS, así que el botón hereda el aspecto de la tarjeta sin CSS nuevo.

**El `focus-visible` que faltaba**: `.unbutton` pone `outline: none`, y la regla `a:focus-visible` del proyecto no aplica a un `button`. Con 38 tarjetas, el teclado se quedaba sin ninguna guía. Añadida una regla propia para la tarjeta.

**Error propio, el más grave de la sesión, casi sube**: el generador añadió las claves nuevas de i18n con dos `replace(..., 1)` seguidos sobre el mismo texto de búsqueda. El primero escribía las 76 claves en el bloque ES, y el segundo volviía a encontrar la **misma** primera coincidencia, así que las 76 claves inglesas quedaron también dentro del bloque ES. El bloque EN se quedaba sin ninguna. Peor: como las dos escrituras iban al mismo objeto, la segunda **pisaba** a la primera, así que la galería habría funcionado en español y habría mostrado texto en inglís al cambiar de idioma, sin que nada pareciera roto. Lo detectó al comprobar **en qué bloque** había caído cada clave, no solo si existía. Arreglado partiendo el fichero por dónde empieza `en: {` y tratando cada mitad por separado.

**Error propio, y anunció al revés**: el parche del CSS usaba como ancla `.gallery__item__link:hover .gallery__item { ... }` en una sola línea, pero en `css/style.css` el selector y la llave están en líneas distintas. El `replace` no hizo nada y el script **imprimió "añadido"** porque solo comprobaba que la cadena no estuviera antes, no que el cambio se hubiera escrito. Se rehizo localizando la regla y saltando hasta su llave de cierre. Es el mismo fallo que se japan en las sesiones 31 y 32: un script que dice que ha hecho algo sin verificar el resultado.

**Error propio, del verificador**: dos comprobaciones daban un OK falso. Una contaba `loading="lazy"` en toda la página y salía 41 en vez de 38, porque el logo y el pie también lo llevan; la otra aceptaba que quedara un `href="#"` en la página, cuando el que queda es el del logo. Un `chk` que pasa en vacío es peor que no comprobar: en la verificación por HTTP llegó a decir "las 76 imágenes responden 200" habiendo comprobado solo 3, porque la página servida aún era la vieja. Ahora se comprueba también **cuántas** se han comprobado.

**Verificación en local**: 38 tarjetas, `data-index` 0..37 sin huecos, las 76 rutas existen, no queda ninguna WebP sin usar, las 38 medidas declaradas coinciden con las reales, i18n ES 327 y EN 327 sin diferencia, `node --check` limpio en los tres módulos, CSS con las llaves equilibradas y `gallery-photo-1` y `gallery-photo-2` sin tocar.

**Verificación en producción**: despué de esperar a la reconstrucción de Pages, la página servida ya tiene las 38 tarjetas, el `data-lightbox`, el visor, y las 38 miniaturas y las 38 imagenes grandes responden 200. Retrato y Paisaje siguen intactas y sin visor.
