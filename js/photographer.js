/**
 * photographer.js — capa Photographer de about.html.
 *
 * Superpone a .pieces una segunda rejilla de 140 teselas con la foto del
 * carrete (alex-photo.webp) y gestiona el conmutador de tres estados:
 * Fotógrafo | Diseñador | Desarrollador.
 *
 * La capa se crea al cargar (Photographer es el estado inicial) y se retira
 * con una animación simétrica a la de fxCustom de la demo: cada tesela sale
 * hacia su lado (izquierda/derecha) con retardo proporcional a su distancia
 * al centro, de modo que las columnas 4 y 5 arrancan juntas y el barrido se
 * abre hacia ambos lados. Al entrar, la misma animación inversa.
 *
 * Los clics en Diseñador/Desarrollador se interceptan en fase de captura en
 * document (siempre antes que el listener de switchMode de tympMain.js, sin
 * depender del orden de registro): mientras la capa está visible el evento se
 * corta y, cuando la salida termina, se reenvía con .click() a la demo.
 */
;(function(window) {
	'use strict';

	const ROWS = 14, COLS = 10;
	const BG = 'url(assets/IMG/about/alex-photo.webp)';

	const pieces = document.querySelector('.pieces');
	const switchCtrl = document.querySelector('.switch');
	if (!pieces || !switchCtrl) return;

	const itemPhoto = switchCtrl.querySelector('.switch__item--photo');
	const itemDesign = switchCtrl.querySelector('.switch__item--design');
	const itemCode = switchCtrl.querySelector('.switch__item--code');
	if (!itemPhoto || !itemDesign || !itemCode) return;

	// photo: la capa se ve | leaving: animación de salida | off: capa fuera.
	let state = 'photo';
	let pending = null;

	const layer = document.createElement('div');
	layer.className = 'pieces--photo';
	const tiles = [];

	function build() {
		pieces.appendChild(layer);
		for (let r = 0; r < ROWS; ++r) {
			for (let c = 0; c < COLS; ++c) {
				const t = document.createElement('div');
				t.className = 'piece piece--photo';
				t.style.backgroundImage = BG;
				// Mismo criterio que PieceMaker._layout (tympMain.js:114).
				t.style.backgroundPosition = -1 * c * 100 + '% ' + -1 * 100 * r + '%';
				t.setAttribute('data-column', c);
				t.setAttribute('data-delay', anime.random(-25, 25));
				layer.appendChild(t);
				tiles.push(t);
			}
		}
		layout();
	}

	// Mismo cálculo que PieceMaker._createPiece: con .pieces ya ajustado por la
	// demo, las teselas de aquí miden exactamente igual que las de allí y no
	// quedan costuras. Mientras la capa esté oculta (clientWidth 0) no se toca.
	function layout() {
		const W = layer.clientWidth;
		if (!W) return;
		const w = Math.round(W / COLS),
			  h = Math.round(layer.clientHeight / ROWS);
		for (let i = 0; i < tiles.length; ++i) {
			tiles[i].style.width = w + 'px';
			tiles[i].style.height = h + 'px';
			tiles[i].style.backgroundSize = w * COLS + 'px ' + h * ROWS + 'px';
		}
	}

	new ResizeObserver(layout).observe(pieces);

	const reduceMotion = () =>
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Retardo por distancia a las columnas centrales (4 y 5 = las más cerca
	// del medio, distancia 0,5): el movimiento siempre arranca en el centro.
	function splitDelay(t) {
		const c = parseInt(t.getAttribute('data-column'), 10);
		return Math.max(0, Math.round(Math.abs(c - (COLS / 2 - 0.5)) * 40) +
			parseInt(t.getAttribute('data-delay'), 10));
	}

	function fxSplit(out, done) {
		anime.remove(tiles);
		if (reduceMotion()) {
			for (let i = 0; i < tiles.length; ++i) {
				tiles[i].style.opacity = out ? 0 : 1;
				tiles[i].style.transform = 'none';
			}
			if (done) done();
			return;
		}
		const half = COLS / 2;
		anime({
			targets: tiles,
			duration: out ? 400 : 500,
			delay: splitDelay,
			easing: out ? [0.2, 1, 0.3, 1] : [0.8, 1, 0.3, 1],
			translateX: function(t) {
				const side = parseInt(t.getAttribute('data-column'), 10) < half ? -1 : 1;
				const amp = anime.random(100, 500);
				return out ? side * amp : [side * amp, 0];
			},
			translateY: function() {
				const dy = anime.random(0, 100);
				return out ? dy : [dy, 0];
			},
			opacity: {
				value: out ? 0 : 1,
				duration: 200,
				easing: 'linear'
			},
			complete: done
		});
	}

	function currentMode() {
		return switchCtrl.classList.contains('mode--code') ? 'code' : 'design';
	}

	function setCurrent(el) {
		[itemPhoto, itemDesign, itemCode].forEach(function(item) {
			item.classList.toggle('switch__item--current', item === el);
		});
	}

	function enterPhoto() {
		state = 'photo';
		layer.style.display = '';
		layout();
		setCurrent(itemPhoto);
		fxSplit(false);
	}

	function exitTo(mode) {
		state = 'leaving';
		pending = mode;
		itemPhoto.classList.remove('switch__item--current');
		fxSplit(true, finish);
	}

	// Al terminar la salida se reenvía el clic a la demo. Si el modo destino
	// ya es el actual (por ejemplo Fotógrafo -> Diseñador con la demo ya en
	// diseño) no se vuelve a llamar a switchMode: se evitarían los parpadeos
	// de letras y el reinicio del bucle de teselas.
	function finish() {
		const mode = pending;
		pending = null;
		state = 'off';
		layer.style.display = 'none';
		if (mode === currentMode()) {
			setCurrent(mode === 'code' ? itemCode : itemDesign);
		}
		else {
			const target = mode === 'code' ? itemCode : itemDesign;
			target.click();
			// Si el click delegado cayera en el guard isAnimating de switchMode
			// (tympMain.js:552), la demo no marcaría el ítem: lo marcamos aquí.
			if (!target.classList.contains('switch__item--current')) setCurrent(target);
		}
	}

	document.addEventListener('click', function(ev) {
		const target = ev.target;
		const item = target && target.closest ?
			target.closest('.switch__item--photo, .switch__item--design, .switch__item--code') :
			null;
		if (!item) return;

		if (item === itemPhoto) {
			ev.preventDefault();
			ev.stopPropagation();
			if (state === 'off') enterPhoto();
			return;
		}

		const mode = item === itemCode ? 'code' : 'design';
		if (state === 'photo') {
			ev.preventDefault();
			ev.stopPropagation();
			exitTo(mode);
		}
		else if (state === 'leaving') {
			// Clics durante la salida: gana el último destino.
			ev.preventDefault();
			ev.stopPropagation();
			pending = mode;
		}
	}, true);

	build();
})(window);
