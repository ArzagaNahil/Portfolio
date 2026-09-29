import { Menu } from './menu.js';
import { initScene } from './particles.js';
import { initHoverSound } from './hoverSound.js';
import { initGooey } from './gooey.js';
import { initI18n } from './i18n.js';
import { initLightbox } from './lightbox.js';

let menu = null;

initI18n(() => {
    if (menu) menu.restart();
});

// Splitting solo se carga en las páginas con menú LetterShuffle (index/contact).
// La guardia evita el ReferenceError que rompería todo el módulo en el resto.
if (typeof Splitting === 'function') Splitting();

/* La demo de Codrops importada en about.html monta sus propios .menu, que
   no llevan .menu__items ni .menu__button. Un selector a ciegas se los
   tragaba y new Menu() moría en menuCtrl.el, lo que tira el módulo entero
   (i18n, Three.js, cursor y lightbox). El menú de la web se reconoce por
   .menu__items/.menu__button. */
const menuEl = Array.from(document.querySelectorAll('.menu'))
    .find((el) => el.querySelector('.menu__items, .menu__button'));
if (menuEl) menu = new Menu(menuEl);

initHoverSound('.topnav__links a');

function initCustomCursor() {
    /* Solo con puntero fino (ratón o trackpad): en táctil no hay cursor que
       sustituir, así que no se crea el nodo ni se escucha mousemove. Con
       prefers-reduced-motion tampoco, porque el anillo persigue al ratón con
       retardo, que es justo el movimiento que esa preferencia pide evitar. */
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<span class="cursor-ring"></span><span class="cursor-dot"></span>';
    document.body.appendChild(cursor);
    /* La clase que oculta el cursor nativo la pone este JS, no el script en
       línea que marca html.js: si este módulo falla al cargar (por ejemplo si
       el CDN de Three.js no responde), el CSS no encuentra .has-cursor y el
       puntero del navegador sigue estando ahí. */
    document.documentElement.classList.add('has-cursor');

    const ring = cursor.querySelector('.cursor-ring');
    const dot = cursor.querySelector('.cursor-dot');

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let dotX = 0, dotY = 0;
    let rafId = null;

    /* translate3d en vez de left/top: se resuelve en el compositor y no fuerza
       a recalcular el diseño en cada fotograma. El translate(-50%, -50%) que
       centra el anillo se reescribe aquí para no perderlo. */
    function place(el, x, y) {
        el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    }

    function animate() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        dotX += (mouseX - dotX) * 0.3;
        dotY += (mouseY - dotY) * 0.3;

        place(ring, ringX, ringY);
        place(dot, dotX, dotY);

        /* Cuando ya alcanzó al ratón se corta el bucle: antes seguía animando
           60 veces por segundo aunque no hubiera nada que mover. */
        const settled = Math.abs(mouseX - ringX) < 0.1 && Math.abs(mouseY - ringY) < 0.1
            && Math.abs(mouseX - dotX) < 0.1 && Math.abs(mouseY - dotY) < 0.1;
        rafId = settled ? null : requestAnimationFrame(animate);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (rafId === null) rafId = requestAnimationFrame(animate);
    }, { passive: true });

    const interactive = 'a, button, .menu__item, .tile__link, .gallery__item__link, .dev-nav__arrow, .lang__toggle, .topnav__toggle, .shiny-cta, input, textarea, select';
    const isInteractive = (node) => node instanceof Element && node.closest(interactive);
    const setHover = (on) => cursor.classList.toggle('cursor-hover', on);

    document.addEventListener('mouseover', (e) => {
        if (isInteractive(e.target)) setHover(true);
    });
    document.addEventListener('mouseout', (e) => {
        /* Solo se quita al salir FUERA del elemento interactivo. Si se quitara
           al pasar de un hijo a otro, el anillo parpadearía dentro del mismo
           enlace o botón. */
        if (isInteractive(e.target) && !isInteractive(e.relatedTarget)) setHover(false);
    });
    document.addEventListener('mousedown', () => cursor.classList.add('cursor-click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('cursor-click'));

    document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
    document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
}
initCustomCursor();

function initTopnav() {
    const toggle = document.querySelector('.topnav__toggle');
    const nav = document.querySelector('.topnav');
    if (!toggle || !nav) return;
    const close = () => nav.classList.remove('is-open');

    toggle.addEventListener('click', () => {
        nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(nav.classList.contains('is-open')));
    });

    document.addEventListener('click', (e) => {
        if (nav.classList.contains('is-open') && !nav.contains(e.target)) close();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
    });

    window.matchMedia('(min-width: 54em)')
        .addEventListener('change', (e) => { if (e.matches) close(); });
}
initTopnav();

/* Las 16 páginas llevan #three-canvas, pero la guardia es barata: sin ella, un
   HTML nuevo sin el contenedor rompería el módulo entero y con él el menú, el
   lightbox y la navegación de las tiles. */
const container = document.getElementById('three-canvas');
const ringAttr = container?.dataset.ringPos;
const ringPos = ringAttr ? (() => { const [x, y, z] = ringAttr.split(',').map(Number); return { x, y, z }; })() : null;
const showRings = container?.dataset.rings !== 'off';
const cleanup = container ? initScene(container, ringPos, showRings) : () => {};
const cleanupGooey = initGooey();

function initGalleryCarousel() {
    const carousel = document.querySelector('.gallery__carousel');
    if (!carousel) return;
    const track = carousel.querySelector('.gallery__track');
    if (!track || track.children.length === 0) return;

    const baseItems = Array.from(track.children);
    const baseCount = baseItems.length;
    let guard = 0;
    while (track.scrollWidth < carousel.clientWidth * 2 && guard < 8) {
        baseItems.forEach((el) => track.appendChild(el.cloneNode(true)));
        guard++;
    }
    if ((track.children.length / baseCount) % 2 !== 0) {
        baseItems.forEach((el) => track.appendChild(el.cloneNode(true)));
    }

    // El keyframe es translate3d(-50%) sobre un track que se clona al doble, asi
    // que una vuelta es la mitad de su ancho. Con la duracion fija en 40s la
    // velocidad en pixeles por segundo salia proporcional al ancho del track y
    // cada galeria iba a su ritmo: Editorial, con 36884px de track, corria 3,5
    // veces mas rapida que Rescate Animal, con 10446px. Derivando la duracion
    // del ancho real las cuatro galerias comparten PX_POR_SEGUNDO.
    //
    // Medido a 1440x900, las diez galerias dan exactamente 275 px/s, asi que la
    // sensacion de "unas van mas rapido que otras" no venia de aqui sino del
    // tiempo total de vuelta, que depende de cuantas tarjetas tenga cada una:
    // Retrato (13 tarjetas) tardaba 18.4s en repetir, mientras que Desarrollo Web
    // y Ranking Tracker (3 tarjetas) la repasaban cada 3.7s, cinco veces mas
    // a menudo. Un solo trozon de tres fotos dando vueltas cada 3.7s es lo que
    // se percibe como nervioso, no el pixeles por segundo.
    //
    // PX_POR_SEGUNDO baja de 275 a 200 tomando Retrato como referencia, y
    // VUELTA_MINIMA pone un suelo de 22s para que las galerias cortas no
    // pisen ese suelo y repitan tan a menudo.
    const PX_POR_SEGUNDO = 200; // el ritmo ya venia de Retrato, aqui se baja un poco mas
    const VUELTA_MINIMA = 22;
    const fijarDuracion = () => {
        const recorrido = track.scrollWidth / 2;
        if (recorrido > 0) {
            const segundos = Math.max(recorrido / PX_POR_SEGUNDO, VUELTA_MINIMA);
            track.style.setProperty('--marquee-duration', segundos + 's');
        }
    };
    fijarDuracion();


    /* La primera medicion sale al construir el DOM, y si el navegador aun no
       ha resuelto el ancho de cada <img> a partir de su width/height, el track
       mide menos y la velocidad queda mas alta. Remedir al cargar deja los ocho
       carruseles al mismo ritmo desde el primer segundo. */
    window.addEventListener('load', fijarDuracion, { once: true });
    // La tarjeta es height: clamp(250px, 41vh, 506px) con width: auto, asi que
    // el ancho de cada una depende de la ALTURA de la ventana y el del track
    // entero depende de cuantas haya. Sin recalcular al cambiar la altura, el
    // ritmo se desvia justo como antes, solo que ahora depende del gesto.
    let ultimoAncho = window.innerWidth;
    let ultimoAlto = window.innerHeight;
    window.addEventListener('resize', () => {
        if (window.innerHeight === ultimoAlto && window.innerWidth === ultimoAncho) return;
        ultimoAncho = window.innerWidth;
        ultimoAlto = window.innerHeight;
        requestAnimationFrame(fijarDuracion);
    });
}
initGalleryCarousel();
initLightbox();

const desktop = window.matchMedia('(min-width: 54em)');
const tiles = document.querySelector('.devtiles');

/* La rueda del ratón no desplaza contenedores horizontales por sí sola. La
   comprobación de escritorio va DENTRO del manejador: si el listener se ata
   solo cuando ya es escritorio, al pasar de móvil a escritorio (o al girar la
   tablet) la página se queda sin rueda hasta recargar. */
if (tiles) {
    tiles.addEventListener('wheel', (e) => {
        if (!desktop.matches) return;
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        e.preventDefault();
        tiles.scrollLeft += e.deltaY;
    }, { passive: false });
}

const scrollHint = document.querySelector('.scroll-hint');
if (scrollHint) {
    if (tiles && tiles.scrollWidth > tiles.clientWidth) {
        tiles.addEventListener('scroll', () => {
            if (tiles.scrollLeft > 8) scrollHint.classList.add('is-hidden');
        });
    } else {
        scrollHint.classList.add('is-hidden');
    }
}

const pageTitle = document.querySelector('.page-title');
if (pageTitle && tiles) {
    const syncTitle = () => {
        pageTitle.style.transform = desktop.matches
            ? `translate3d(${tiles.scrollLeft * 0.2}px, 0, 0)`
            : '';
    };
    tiles.addEventListener('scroll', syncTitle);
    desktop.addEventListener('change', syncTitle);
}

const prevBtn = document.querySelector('.dev-nav__arrow--prev');
const nextBtn = document.querySelector('.dev-nav__arrow--next');

if (tiles && prevBtn && nextBtn) {
    const devNav = {
        items: Array.from(tiles.querySelectorAll('.devtile')),
        index: 0,
        update() {
            const last = this.items.length - 1;
            prevBtn.classList.toggle('is-disabled', this.index === 0);
            nextBtn.classList.toggle('is-disabled', this.index === last);
        },
        go(i) {
            const last = this.items.length - 1;
            this.index = Math.max(0, Math.min(last, i));
            const base = this.items[0].offsetLeft;
            gsap.to(tiles, {
                scrollLeft: this.items[this.index].offsetLeft - base,
                duration: 0.8,
                ease: 'power2.inOut',
            });
            this.update();
        },
        syncFromScroll() {
            const center = tiles.scrollLeft + tiles.clientWidth / 2;
            let nearest = 0;
            let best = Infinity;
            this.items.forEach((el, i) => {
                const dist = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center);
                if (dist < best) {
                    best = dist;
                    nearest = i;
                }
            });
            this.index = nearest;
            this.update();
        },
    };

    let scrollRaf = null;
    tiles.addEventListener('scroll', () => {
        if (scrollRaf) return;
        scrollRaf = requestAnimationFrame(() => {
            scrollRaf = null;
            devNav.syncFromScroll();
        });
    });

    prevBtn.addEventListener('click', () => devNav.go(devNav.index - 1));
    nextBtn.addEventListener('click', () => devNav.go(devNav.index + 1));

    document.addEventListener('keydown', (e) => {
        if (e.target.matches('input, textarea, [contenteditable]')) return;
        if (e.key === 'ArrowRight') devNav.go(devNav.index + 1);
        if (e.key === 'ArrowLeft') devNav.go(devNav.index - 1);
    });

    let drag = null;
    let suppressClick = false;
    tiles.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'mouse') return;
        drag = { x: e.clientX, y: e.clientY };
    });
    tiles.addEventListener('pointermove', (e) => {
        if (!drag) return;
        const dx = e.clientX - drag.x;
        const dy = e.clientY - drag.y;
        if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
            tiles.scrollLeft -= dx;
            drag.x = e.clientX;
        }
    });
    const endDrag = (e) => {
        if (!drag) return;
        const dx = e.clientX - drag.x;
        const dy = e.clientY - drag.y;
        drag = null;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
            suppressClick = true;
            if (dx < 0) devNav.go(devNav.index + 1);
            else devNav.go(devNav.index - 1);
        }
    };
    tiles.addEventListener('pointerup', endDrag);
    tiles.addEventListener('pointercancel', () => { drag = null; });
    tiles.addEventListener('click', (e) => {
        if (!suppressClick) return;
        e.preventDefault();
        e.stopPropagation();
        suppressClick = false;
    }, true);

    devNav.update();
}

/* La cortina negra (.loading) se retira cuando la tipografía está lista.
   Antes dependía del callback de WebFont.load (script externo): si ese CDN
   tardaba o fallaba, la página se quedaba en negro sin salida. Las fuentes ya
   se piden en el <link> de Google Fonts, así que aquí basta con document.fonts
   (resuelve siempre, incluso si una fuente falla) más dos redes de seguridad:
   un temporizador y el evento load. */
const hideLoader = () => document.body.classList.remove('loading');
if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(hideLoader, hideLoader);
}
setTimeout(hideLoader, 2500);
window.addEventListener('load', () => setTimeout(hideLoader, 200), { once: true });

window.addEventListener('beforeunload', cleanup);
window.addEventListener('beforeunload', cleanupGooey);
document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;

    const recompose = () => {
        const targets = Array.from(document.querySelectorAll('.gallery__btn, .gallery__links'));
        targets.forEach((el) => { el.style.visibility = 'hidden'; });
        void document.body.offsetWidth;
        requestAnimationFrame(() => {
            targets.forEach((el) => { el.style.visibility = ''; });
        });
    };

    void document.body.offsetWidth;
    requestAnimationFrame(recompose);
});

window.addEventListener('pageshow', (e) => {
    if (e.persisted) window.location.reload();
});
