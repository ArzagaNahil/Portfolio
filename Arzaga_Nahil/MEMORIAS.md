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

*Registro iniciado: 15 de junio de 2026*
