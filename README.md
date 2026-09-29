# Arzaga Nahil — Portafolio

Portafolio personal (MPA) en HTML + CSS + JavaScript vanilla, con Three.js
(partículas de fondo y el shader del hover de las tiles) y GSAP para el menú y
la navegación de las tiles. Bilingüe ES/EN sin duplicar páginas.

## Cómo verlo

El sitio usa módulos ES, `importmap` y texturas WebGL: **no funciona abriendo los
archivos con `file://`**. Hay que servirlo por HTTP.

```
python -m http.server 8000
```

Y abrir `http://localhost:8000/`.

## Estructura

- `index.html`, `contact.html` — menú LetterShuffle.
- `development.html`, `design.html`, `photography.html` — tiles con carrusel
  horizontal y efecto de hover en shader.
- `gallery-*.html` — galerías de Diseño, Fotografía, Desarrollo, Páginas Web y
  Extensiones. Las de Diseño y Fotografía llevan visor de imagen.
- `css/style.css` — única hoja de estilos; incluye el layout de cada página.
- `js/index.js` — punto de entrada: i18n, menú, cursor, partículas, gooey,
  carrusel, visor y navegación de las tiles.
- `js/i18n.js` — diccionario ES/EN y conmutador de idioma.
- `MEMORIAS.md` — bitácora de decisiones y sesiones.

Publicado en GitHub Pages: <https://arzaganahil.github.io/Portfolio/>