/**
 * lightbox.js
 * ---------------------------------------------------------------------------
 * Visor de imagen de las galerías de "Design" y de "Fotografía".
 *
 * A propósito no hace nada más que ampliar la foto: sin shader, sin
 * desintegración, sin transiciones. Al pulsar una miniatura la imagen se carga
 * a tamaño grande y se navega con las flechas, el teclado o los botones.
 *
 * El fondo sigue siendo el de las partículas: no se añade ningún fondo aquí ni
 * en el CSS, solo el velo oscuro que ya tenía el visor.
 *
 * Depende de estas reglas CSS: .lightbox, .lightbox__stage, .lightbox__img y
 * body.is-lightbox-open.
 */

export function initLightbox() {
    const root = document.querySelector('[data-lightbox]');
    const lightbox = document.querySelector('.lightbox');
    if (!root || !lightbox) return;

    const imgEl = lightbox.querySelector('.lightbox__img');
    const counterEl = lightbox.querySelector('[data-lb-counter]');
    const closeEls = Array.from(lightbox.querySelectorAll('[data-lb-close]'));
    const prevEl = lightbox.querySelector('[data-lb-prev]');
    const nextEl = lightbox.querySelector('[data-lb-next]');
    const closeBtn = lightbox.querySelector('button[data-lb-close]');
    if (!imgEl) return;

    /* El carrusel clona tarjetas para que el bucle sea continuo, así que cada
       foto aparece repetida. La lista de navegación se saca por data-index y no
       por data-full: dos tarjetas distintas pueden apuntar a la misma imagen (los
       placeholders se repiten) y si se filtrara por src la segunda se quedaría
       sin listener, es decir, un botón muerto. Si el marcado no trae data-index se
       cae al src, que es lo que se usaba antes. */
    const cards = Array.from(root.querySelectorAll('[data-full]'));
    const byKey = new Map();
    cards.forEach((el) => {
        const key = el.dataset.index ?? el.dataset.full;
        if (!byKey.has(key)) byKey.set(key, el);
    });
    const triggers = Array.from(byKey.values());
    if (triggers.length === 0) return;

    const sources = triggers.map((el) => el.dataset.full);
    const alts = triggers.map((el) => {
        const img = el.querySelector('img');
        return img ? img.alt : '';
    });

    let index = 0;
    let isOpen = false;
    let lastFocused = null;

    function updateCounter() {
        if (counterEl) counterEl.textContent = `${index + 1} / ${sources.length}`;
    }

    // Precarga la imagen actual y sus vecinas para que las flechas no parpadeen.
    function preloadAround(i) {
        [i, (i + 1) % sources.length, (i - 1 + sources.length) % sources.length]
            .forEach((n) => {
                const image = new Image();
                image.src = sources[n];
            });
    }

    function show(i) {
        index = (i + sources.length) % sources.length;
        imgEl.alt = alts[index] || '';
        imgEl.src = sources[index];
        updateCounter();
        preloadAround(index);
    }

    function open(at) {
        if (isOpen) return;
        isOpen = true;
        lastFocused = document.activeElement;

        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('is-lightbox-open');

        show(at);
        document.addEventListener('keydown', onKeydown);
        if (closeBtn) closeBtn.focus();
    }

    function go(delta) {
        if (!isOpen) return;
        show(index + delta);
    }

    function close() {
        if (!isOpen) return;
        isOpen = false;
        document.removeEventListener('keydown', onKeydown);

        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('is-lightbox-open');

        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    function onKeydown(event) {
        switch (event.key) {
            case 'Escape':
                event.preventDefault();
                close();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                go(-1);
                break;
            case 'ArrowRight':
                event.preventDefault();
                go(1);
                break;
            case 'Tab': {
                // Mantiene el foco dentro del visor mientras está abierto.
                const focusables = [prevEl, nextEl, closeBtn].filter(Boolean);
                if (focusables.length === 0) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
                break;
            }
            default:
                break;
        }
    }

    /* Se escucha en todas las tarjetas, copias del carrusel incluidas. Si solo
       se escuchara en la original, en el tramo del bucle que se repite no abriría
       ninguna. */
    cards.forEach((el) => {
        const key = el.dataset.index ?? el.dataset.full;
        el.addEventListener('click', () => open(triggers.indexOf(byKey.get(key))));
    });

    closeEls.forEach((el) => el.addEventListener('click', close));
    prevEl?.addEventListener('click', () => go(-1));
    nextEl?.addEventListener('click', () => go(1));
}
