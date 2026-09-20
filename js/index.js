import { preloadFonts } from './utils.js';
import { Menu } from './menu.js';
import { initScene } from './particles.js';
import { initHoverSound } from './hoverSound.js';
import { initGooey } from './gooey.js';
import { initI18n } from './i18n.js';

let menu = null;

initI18n(() => {
    if (menu) menu.restart();
});

Splitting();

const menuEl = document.querySelector('.menu');
if (menuEl) menu = new Menu(menuEl);

initHoverSound('.topnav__links a');

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

const container = document.getElementById('three-canvas');
const ringAttr = container.dataset.ringPos;
const ringPos = ringAttr ? (() => { const [x, y, z] = ringAttr.split(',').map(Number); return { x, y, z }; })() : null;
const showRings = container.dataset.rings !== 'off';
const cleanup = initScene(container, ringPos, showRings);
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
}
initGalleryCarousel();

const tiles = document.querySelector('.devtiles');
if (tiles && window.matchMedia('(min-width: 54em)').matches) {
    tiles.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        e.preventDefault();
        tiles.scrollLeft += e.deltaY;
    }, { passive: false });
}

const scrollHint = document.querySelector('.scroll-hint');
if (scrollHint && tiles.scrollWidth > tiles.clientWidth) {
    tiles.addEventListener('scroll', () => {
        if (tiles.scrollLeft > 8) scrollHint.classList.add('is-hidden');
    });
} else if (scrollHint) {
    scrollHint.classList.add('is-hidden');
}

const pageTitle = document.querySelector('.page-title');
if (pageTitle && tiles && window.matchMedia('(min-width: 54em)').matches) {
    tiles.addEventListener('scroll', () => {
        pageTitle.style.transform = `translate3d(${tiles.scrollLeft * 0.2}px, 0, 0)`;
    });
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

preloadFonts('Inter:300,400,600,700').then(() => {
    document.body.classList.remove('loading');
});

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
