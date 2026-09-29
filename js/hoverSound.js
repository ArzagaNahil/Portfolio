/* El Audio se crea la primera vez que hace falta. Antes se instanciaba al
   importar el módulo, así que páginas sin hover con sonido (index y contacto,
   que llevan el menú LetterShuffle y no el topnav) descargaban hover.mp3 sin
   usarlo nunca. */
let hover = null;

function getAudio() {
    if (!hover) {
        hover = new Audio('assets/audio/hover.mp3');
        hover.preload = 'auto';
        hover.volume = 0.3;
    }
    return hover;
}

function unlock() {
    const audio = getAudio();
    audio.muted = true;
    audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
    }).catch(() => {});
}

function playHover() {
    try {
        const audio = getAudio();
        audio.currentTime = 0;
        audio.play().catch(() => {});
    } catch (e) {}
}

export function initHoverSound(selector) {
    const targets = document.querySelectorAll(selector);
    if (!targets.length) return;
    /* En táctil no hay hover, así que ni se escucha ni se descarga el mp3. */
    if (!window.matchMedia('(hover: hover)').matches) return;

    window.addEventListener('pointerdown', unlock, { once: true });
    document.addEventListener('click', unlock, { once: true });

    targets.forEach(el => {
        el.addEventListener('mouseenter', playHover);
    });
}