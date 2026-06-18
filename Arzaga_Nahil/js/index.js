import { preloadFonts } from './utils.js';
import { Menu } from './menu.js';
import { initScene } from './particles.js';

Splitting();

new Menu(document.querySelector('.menu'));

initScene(document.getElementById('three-canvas'));

preloadFonts('Inter:300,400,600,700').then(() => {
    document.body.classList.remove('loading');
});
