const hover = new Audio('assets/audio/hover.mp3');
hover.preload = 'auto';
hover.volume = 0.3;

function unlock() {
    hover.muted = true;
    hover.play().then(() => {
        hover.pause();
        hover.currentTime = 0;
        hover.muted = false;
    }).catch(() => {});
}

function playHover() {
    try {
        hover.currentTime = 0;
        hover.play().catch(() => {});
    } catch (e) {}
}

export function initHoverSound(selector) {
    const targets = document.querySelectorAll(selector);
    if (!targets.length) return;

    window.addEventListener('pointerdown', unlock, { once: true });
    document.addEventListener('click', unlock, { once: true });

    targets.forEach(el => {
        el.addEventListener('mouseenter', playHover);
    });
}