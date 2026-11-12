/**
 * about.js — reescritura nativa de la About (antes demo de Codrops).
 *
 * Sustituye a anime.min.js, charming.min.js, imagesloaded.pkgd.min.js,
 * tympMain.js y photographer.js con un único script clásico. Mantiene los
 * mismos nombres de clase, la misma estructura de estados y el mismo orden de
 * animaciones que la demo original:
 *
 *   - Motor de tween propio (opacidad, translateX/Y y scale) con las mismas
 *     curvas y retardos que usaba anime.js en esta página.
 *   - PieceMaker: rejilla de 140 teselas (14x10) sobre .pieces.
 *   - GlitchFx: cortocircuito de clases mode--design / mode--code.
 *   - Título partido en letras (charming) y expuesto en window.AboutTitle.
 *   - Capa Photographer con las 140 teselas de alex-photo.webp y el
 *     conmutador de tres estados Fotógrafo | Diseñador | Desarrollador.
 *
 * El HTML de about.html no conserva los controles ocultos de la demo
 * (.controls, .link-wrap, símbolos svg ni imágenes ocultas), así que las
 * ramas que los tocaban se han eliminado; el resto del comportamiento es el
 * mismo.
 */
;(function (window, document) {
    'use strict';

    /* =====================================================================
       Utilidades
       ===================================================================== */

    function extend(a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) a[key] = b[key];
        }
        return a;
    }

    // Entero aleatorio, igual que anime.random(min, max).
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // from http://www.quirksmode.org/js/events_properties.html#position
    function getMousePos(e) {
        var posx = 0;
        var posy = 0;
        if (!e) e = window.event;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return { x: posx, y: posy };
    }

    // From https://davidwalsh.name/javascript-debounce-function.
    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this;
            var args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    var is3DBuggy = navigator.userAgent.indexOf('Firefox') > 0;

    /* =====================================================================
       Motor de tween
       ---------------------------------------------------------------------
       Solo cubre lo que la demo usaba: opacity, translateX, translateY y
       scale. Los valores pueden ser números, [desde, hasta], funciones
       (target, índice, total) o listas de keyframes {value, duration, delay,
       easing}. Las propiedades de transform se guardan por elemento para que
       una animación pueda empezar donde terminó la anterior, como hacía
       anime.js.
       ===================================================================== */

    var tweens = new Set();
    var rafId = null;
    var elStates = new WeakMap();
    var easingCache = Object.create(null);

    function now() {
        return window.performance && window.performance.now
            ? window.performance.now()
            : Date.now();
    }

    function toArray(targets) {
        if (!targets) return [];
        if (typeof targets === 'string') {
            return Array.prototype.slice.call(document.querySelectorAll(targets));
        }
        if (targets.nodeType === 1) return [targets];
        if (typeof targets.length === 'number') return Array.prototype.slice.call(targets);
        return [targets];
    }

    function readOpacity(el) {
        var parsed = parseFloat(el.style.opacity);
        if (isFinite(parsed)) return parsed;
        parsed = parseFloat(window.getComputedStyle(el).opacity);
        return isFinite(parsed) ? parsed : 1;
    }

    function getElState(el) {
        var state = elStates.get(el);
        if (!state) {
            state = { opacity: readOpacity(el), tx: 0, ty: 0, scale: 1 };
            elStates.set(el, state);
        }
        return state;
    }

    // Mantiene el estado del motor en sintonía cuando se toca el style a mano.
    function setOpacity(el, value) {
        getElState(el).opacity = value;
        el.style.opacity = value;
    }

    function clearTransform(el) {
        var state = getElState(el);
        state.tx = 0;
        state.ty = 0;
        state.scale = 1;
        el.style.transform = 'none';
    }

    function resetTransformOrigin(el) {
        // No hace falta: la demo nunca cambia transform-origin, pero dejarlo
        // explícito documenta que scale() se aplica desde el centro por defecto.
        void el;
    }

    function renderTransform(el, state) {
        resetTransformOrigin(el);
        // Transformaciones 2D: anime.js (la demo original) escribe translateX/translateY
        // y Chrome no asciende cada tesela a capa compuesta. Con translate3d las
        // 140 teselas fuera de pantalla siguen creando capas que fuerzan
        // antialiasing en escala de grises en TODO el texto de la página.
        var value = 'translateX(' + state.tx + 'px) translateY(' + state.ty + 'px)';
        if (state.scale !== 1) value += ' scale(' + state.scale + ')';
        el.style.transform = value;
    }

    function cubicBezier(x1, y1, x2, y2) {
        function A(a, b) { return 1 - 3 * b + 3 * a; }
        function B(a, b) { return 3 * b - 6 * a; }
        function C(a) { return 3 * a; }
        function calc(t, a, b) {
            return ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
        }
        function slope(t, a, b) {
            return 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);
        }
        return function (x) {
            if (x <= 0) return 0;
            if (x >= 1) return 1;
            var t = x;
            for (var i = 0; i < 8; ++i) {
                var dx = calc(t, x1, x2) - x;
                if (Math.abs(dx) < 1e-4) return calc(t, y1, y2);
                var d = slope(t, x1, x2);
                if (Math.abs(d) < 1e-6) break;
                t -= dx / d;
            }
            var lo = 0;
            var hi = 1;
            t = x;
            for (var j = 0; j < 20; ++j) {
                var v = calc(t, x1, x2);
                if (Math.abs(v - x) < 1e-4) break;
                if (v < x) lo = t;
                else hi = t;
                t = (lo + hi) / 2;
            }
            return calc(t, y1, y2);
        };
    }

    function getEasing(easing) {
        if (typeof easing === 'function') return easing;
        if (Array.isArray(easing) && easing.length === 4) {
            var key = easing.join(',');
            if (!easingCache[key]) {
                easingCache[key] = cubicBezier(easing[0], easing[1], easing[2], easing[3]);
            }
            return easingCache[key];
        }
        switch (easing) {
            case 'easeInQuad': return function (t) { return t * t; };
            case 'easeOutQuad': return function (t) { return 1 - (1 - t) * (1 - t); };
            case 'easeInQuint': return function (t) { return t * t * t * t * t; };
            case 'easeOutQuint': return function (t) { return 1 - Math.pow(1 - t, 5); };
            case 'easeInExpo':
                return function (t) { return t === 0 ? 0 : Math.pow(2, 10 * (t - 1)); };
            case 'easeOutExpo':
                return function (t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); };
            default: return function (t) { return t; };
        }
    }

    function currentValue(name, state) {
        switch (name) {
            case 'opacity': return state.opacity;
            case 'translateX': return state.tx;
            case 'translateY': return state.ty;
            case 'scale': return state.scale;
            default: return 0;
        }
    }

    function isKeyframe(value) {
        return value && typeof value === 'object' && !Array.isArray(value) && 'value' in value;
    }

    function resolveValue(value, el, index, total) {
        return typeof value === 'function' ? value(el, index, total) : value;
    }

    function buildTracks(el, index, total, state, name, spec, unitDelay, baseDuration, baseEasing) {
        var keys;
        if (Array.isArray(spec) && spec.every(isKeyframe)) {
            keys = spec;
        } else if (isKeyframe(spec)) {
            keys = [spec];
        } else {
            keys = [{ value: spec }];
        }

        var tracks = [];
        var cursor = unitDelay;
        var previousTo = null;

        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            var keyDelay = key.delay ? resolveValue(key.delay, el, index, total) : 0;
            cursor += keyDelay;

            var duration = key.duration != null ? key.duration : baseDuration;
            var easing = key.easing != null ? key.easing : baseEasing;
            var raw = resolveValue(key.value, el, index, total);
            var from;
            var to;

            if (Array.isArray(raw)) {
                from = raw[0];
                to = raw[1];
            } else {
                from = previousTo !== null ? previousTo : currentValue(name, state);
                to = raw;
            }

            tracks.push({
                start: cursor,
                duration: duration,
                easing: getEasing(easing),
                from: from,
                to: to
            });

            previousTo = to;
            cursor += duration;
        }

        return tracks;
    }

    function sampleTracks(tracks, elapsed) {
        var value = tracks[0].from;
        for (var i = 0; i < tracks.length; ++i) {
            var track = tracks[i];
            if (elapsed < track.start) break;
            if (track.duration <= 0 || elapsed >= track.start + track.duration) {
                value = track.to;
                continue;
            }
            var progress = (elapsed - track.start) / track.duration;
            value = track.from + (track.to - track.from) * track.easing(progress);
            return value;
        }
        return value;
    }

    function animateTween(opts) {
        if (!opts || !opts.targets) return null;

        var targets = toArray(opts.targets);
        if (!targets.length) {
            if (opts.complete) opts.complete();
            return null;
        }

        var total = targets.length;
        var baseDuration = opts.duration != null ? opts.duration : 1000;
        var baseEasing = opts.easing != null ? opts.easing : 'linear';
        var propertyNames = ['opacity', 'translateX', 'translateY', 'scale'];
        var units = [];
        var maxEnd = 0;

        for (var i = 0; i < total; ++i) {
            var el = targets[i];
            var state = getElState(el);
            var unitDelay = opts.delay ? resolveValue(opts.delay, el, i, total) : 0;
            var props = [];

            for (var p = 0; p < propertyNames.length; ++p) {
                var name = propertyNames[p];
                if (!(name in opts)) continue;

                var tracks = buildTracks(
                    el, i, total, state, name, opts[name],
                    unitDelay, baseDuration, baseEasing
                );
                var end = tracks[tracks.length - 1].start + tracks[tracks.length - 1].duration;
                if (end > maxEnd) maxEnd = end;
                props.push({ name: name, tracks: tracks });
            }

            units.push({ el: el, props: props });
        }

        var tween = {
            start: now(),
            end: maxEnd,
            cancelled: false,
            units: units,
            complete: opts.complete,
            step: function (elapsed) {
                for (var u = 0; u < this.units.length; ++u) {
                    var unit = this.units[u];
                    var state = getElState(unit.el);
                    var transformChanged = false;

                    for (var q = 0; q < unit.props.length; ++q) {
                        var prop = unit.props[q];
                        var value = sampleTracks(prop.tracks, elapsed);

                        if (prop.name === 'opacity') {
                            state.opacity = value;
                            unit.el.style.opacity = value;
                        } else if (prop.name === 'translateX') {
                            state.tx = value;
                            transformChanged = true;
                        } else if (prop.name === 'translateY') {
                            state.ty = value;
                            transformChanged = true;
                        } else if (prop.name === 'scale') {
                            state.scale = value;
                            transformChanged = true;
                        }
                    }

                    if (transformChanged) renderTransform(unit.el, state);
                }
            }
        };

        tweens.add(tween);
        if (opts.begin) opts.begin();
        scheduleTick();

        return tween;
    }

    function cancelTween(tween) {
        if (tween.cancelled) return;
        tween.cancelled = true;
        tweens.delete(tween);
    }

    function removeTweens(targets) {
        var els = toArray(targets);
        if (!els.length) return;
        Array.from(tweens).forEach(function (tween) {
            for (var i = 0; i < tween.units.length; ++i) {
                if (els.indexOf(tween.units[i].el) !== -1) {
                    cancelTween(tween);
                    return;
                }
            }
        });
    }

    function scheduleTick() {
        if (rafId === null) rafId = window.requestAnimationFrame(tick);
    }

    function tick(timestamp) {
        rafId = null;
        var elapsed;
        var finished = [];

        tweens.forEach(function (tween) {
            if (tween.cancelled) return;
            elapsed = timestamp - tween.start;
            tween.step(elapsed);
            if (elapsed >= tween.end) finished.push(tween);
        });

        for (var i = 0; i < finished.length; ++i) {
            var tween = finished[i];
            if (tween.cancelled) continue;
            tween.step(tween.end);
            cancelTween(tween);
            if (tween.complete) tween.complete();
        }

        if (tweens.size) scheduleTick();
    }

    // Ejecuta el complete de un tween al cancelarlo? No: anime.remove no lo
    // llama, así que aquí tampoco.

    /* =====================================================================
       PieceMaker
       ===================================================================== */

    function PieceMaker(el, options) {
        this.el = el;
        this.options = extend({}, this.options);
        extend(this.options, options);
        this._init();
    }

    PieceMaker.prototype.options = {
        pieces: { rows: 14, columns: 10 },
        tilt: { maxRotationX: -2, maxRotationY: 3, maxTranslationX: 6, maxTranslationY: -2 }
    };

    PieceMaker.prototype._init = function () {
        // Fuente de la imagen principal (la que llevan las teselas).
        this.imgsrc = this.el.style.backgroundImage
            .replace('url(', '')
            .replace(')', '')
            .replace(/"/gi, '');

        this.win = { width: window.innerWidth, height: window.innerHeight };

        // getBoundingClientRect para no perder los 0,9px del calc(90vh + 14.9px).
        var elBounds = this.el.getBoundingClientRect();
        this.dimensions = { width: elBounds.width, height: elBounds.height };

        this._layout();
        this.initTilt();
        this._initEvents();
    };

    PieceMaker.prototype._layout = function () {
        this.el.style.backgroundImage = this.el.getAttribute('data-img-code');

        this.pieces = [];
        for (var r = 0; r < this.options.pieces.rows; ++r) {
            for (var c = 0; c < this.options.pieces.columns; ++c) {
                var piece = this._createPiece(r, c);
                piece.style.backgroundPosition = -1 * c * 100 + '% ' + -1 * 100 * r + '%';
                this.pieces.push(piece);
            }
        }
    };

    PieceMaker.prototype._createPiece = function (row, column) {
        var w = Math.round(this.dimensions.width / this.options.pieces.columns);
        var h = Math.round(this.dimensions.height / this.options.pieces.rows);
        var piece = document.createElement('div');

        piece.style.backgroundImage = 'url(' + this.imgsrc + ')';
        piece.className = 'piece';
        piece.style.width = w + 'px';
        /* La demo escribía `h + + 'px'` (NaN), así que la altura se quedaba en
           auto y la ponía el stretch de las líneas flex. Se omite a propósito
           para conservar esa misma geometría. */
        piece.style.backgroundSize = w * this.options.pieces.columns + 'px ' +
            h * this.options.pieces.rows + 'px';
        piece.setAttribute('data-column', column);
        piece.setAttribute('data-delay', getRandomInt(-25, 25));
        this.el.appendChild(piece);
        this.el.style.width = w * this.options.pieces.columns + 'px';
        this.el.style.height = h * this.options.pieces.rows + 'px';

        return piece;
    };

    PieceMaker.prototype.initTilt = function () {
        if (is3DBuggy) return;
        this.tilt = true;
    };

    PieceMaker.prototype.removeTilt = function () {
        if (is3DBuggy) return;
        this.tilt = false;
    };

    PieceMaker.prototype._initEvents = function () {
        var self = this;

        var onMouseMoveFn = function (ev) {
            window.requestAnimationFrame(function () {
                if (!self.tilt) {
                    if (is3DBuggy) self.el.style.transform = 'none';
                    return false;
                }
                var mousepos = getMousePos(ev);
                var rotX = 2 * self.options.tilt.maxRotationX / self.win.height * mousepos.y - self.options.tilt.maxRotationX;
                var rotY = 2 * self.options.tilt.maxRotationY / self.win.width * mousepos.x - self.options.tilt.maxRotationY;
                var transX = 2 * self.options.tilt.maxTranslationX / self.win.width * mousepos.x - self.options.tilt.maxTranslationX;
                var transY = 2 * self.options.tilt.maxTranslationY / self.win.height * mousepos.y - self.options.tilt.maxTranslationY;

                self.el.style.transform = 'perspective(1000px) translate3d(' +
                    transX + 'px,' + transY + 'px,0) rotate3d(1,0,0,' + rotX +
                    'deg) rotate3d(0,1,0,' + rotY + 'deg)';
            });
        };

        var debounceResizeFn = debounce(function () {
            self.win = { width: window.innerWidth, height: window.innerHeight };
            self.el.style.width = self.el.style.height = '';
            var elBounds = self.el.getBoundingClientRect();
            self.dimensions = { width: elBounds.width, height: elBounds.height };

            for (var i = 0, len = self.pieces.length; i < len; ++i) {
                var w = Math.round(self.dimensions.width / self.options.pieces.columns);
                var h = Math.round(self.dimensions.height / self.options.pieces.rows);
                var piece = self.pieces[i];

                piece.style.width = w + 'px';
                piece.style.height = h + 'px';
                piece.style.backgroundSize = w * self.options.pieces.columns + 'px ' +
                    h * self.options.pieces.rows + 'px';
                self.el.style.width = w * self.options.pieces.columns + 'px';
                self.el.style.height = h * self.options.pieces.rows + 'px';
            }
        }, 10);

        document.addEventListener('mousemove', onMouseMoveFn);
        window.addEventListener('resize', debounceResizeFn);
    };

    PieceMaker.prototype.loopFx = function () {
        this.isLoopFXActive = true;
        this.el.style.backgroundImage = this.el.getAttribute('data-img-alt');

        var self = this;
        removeTweens(this.pieces);
        animateTween({
            targets: this.pieces,
            duration: 50,
            easing: 'linear',
            opacity: [
                {
                    value: function () { return !getRandomInt(0, 5) ? 0 : 1; },
                    delay: function () { return getRandomInt(0, 2000); }
                },
                {
                    value: 1,
                    delay: function () { return getRandomInt(200, 2000); }
                }
            ],
            complete: function () {
                if (self.isLoopFXActive) self.loopFx();
            }
        });
    };

    PieceMaker.prototype.stopLoopFx = function () {
        this.isLoopFXActive = false;
        this.el.style.backgroundImage = this.el.getAttribute('data-img-code');
        removeTweens(this.pieces);
        for (var i = 0, len = this.pieces.length; i < len; ++i) {
            setOpacity(this.pieces[i], 1);
        }
    };

    PieceMaker.prototype.animatePieces = function (dir, callback) {
        var self = this;
        removeTweens(this.pieces);
        animateTween({
            targets: this.pieces.reverse(),
            duration: dir === 'out' ? 600 : 500,
            delay: function (t, i) {
                return Math.max(0, i * 6 + parseInt(t.getAttribute('data-delay'), 10));
            },
            easing: dir === 'out' ? [0.2, 1, 0.3, 1] : [0.8, 1, 0.3, 1],
            translateX: dir === 'out'
                ? function (t) {
                    return parseInt(t.getAttribute('data-column'), 10) < self.options.pieces.columns / 2
                        ? getRandomInt(50, 100)
                        : getRandomInt(-100, -50);
                }
                : function (t) {
                    return parseInt(t.getAttribute('data-column'), 10) < self.options.pieces.columns / 2
                        ? [getRandomInt(50, 100), 0]
                        : [getRandomInt(-100, -50), 0];
                },
            translateY: dir === 'out'
                ? function () { return [0, getRandomInt(-1000, -800)]; }
                : function () { return [getRandomInt(-1000, -800), 0]; },
            opacity: {
                value: dir === 'out' ? 0 : 1,
                duration: dir === 'out' ? 600 : 300,
                easing: 'linear'
            },
            complete: callback
        });
    };

    PieceMaker.prototype.fxCustom = function (dir) {
        this.fxCustomTriggered = true;
        var self = this;
        animateTween({
            targets: this.pieces.reverse().filter(function (t) {
                return parseInt(t.getAttribute('data-column'), 10) < self.options.pieces.columns / 2;
            }),
            duration: dir === 'left' ? 400 : 200,
            easing: dir === 'left' ? [0.2, 1, 0.3, 1] : [0.8, 0, 0.7, 0],
            delay: function (t, i, c) {
                return dir === 'left'
                    ? Math.max(0, i * 5 + parseInt(t.getAttribute('data-delay'), 10))
                    : Math.max(0, (c - 1 - i) * 2 + parseInt(t.getAttribute('data-delay'), 10));
            },
            translateX: function () {
                return dir === 'left'
                    ? getRandomInt(-500, -100)
                    : [getRandomInt(-500, -100), 0];
            },
            translateY: function () {
                return dir === 'left'
                    ? getRandomInt(0, 100)
                    : [getRandomInt(0, 100), 0];
            },
            opacity: {
                duration: 200,
                value: dir === 'left' ? 0 : [0, 1],
                easing: dir === 'left' ? 'linear' : [0.8, 0, 0.7, 0]
            }
        });
    };

    PieceMaker.prototype.fxCustomReset = function (dir, callback) {
        this.fxCustomTriggered = false;
        var self = this;
        removeTweens(this.pieces);
        animateTween({
            targets: this.pieces.reverse().filter(function (t) {
                return parseInt(t.getAttribute('data-column'), 10) < self.options.pieces.columns / 2;
            }),
            duration: dir === 'left' ? 200 : 400,
            easing: dir === 'left' ? [0.8, 0, 0.7, 0] : [0.2, 1, 0.3, 1],
            delay: function (t, i, c) {
                return dir === 'left'
                    ? Math.max(0, (c - 1 - i) * 2 + parseInt(t.getAttribute('data-delay'), 10))
                    : Math.max(0, i * 5 + parseInt(t.getAttribute('data-delay'), 10));
            },
            translateX: function () {
                return dir === 'left' ? 0 : getRandomInt(-500, -100);
            },
            translateY: function () {
                return dir === 'left' ? 0 : getRandomInt(0, 100);
            },
            opacity: {
                duration: 200,
                value: dir === 'left' ? 1 : [1, 0],
                easing: dir === 'left' ? [0.8, 0, 0.7, 0] : 'linear'
            },
            complete: callback
        });
    };

    /* =====================================================================
       GlitchFx
       ===================================================================== */

    function GlitchFx(elems, options) {
        this.elems = [].slice.call(elems);
        this.options = extend({}, this.options);
        extend(this.options, options);
        this.glitch();
    }

    GlitchFx.prototype.options = {
        glitchStart: { min: 500, max: 4000 },
        glitchState: { min: 50, max: 250 },
        glitchTotalIterations: 6
    };

    GlitchFx.prototype.glitch = function () {
        this.isInactive = false;
        var self = this;
        clearTimeout(this.glitchTimeout);
        this.glitchTimeout = setTimeout(function () {
            self.iteration = 0;
            self._glitchState(function () {
                if (!self.isInactive) self.glitch();
            });
        }, getRandomInt(this.options.glitchStart.min, this.options.glitchStart.max));
    };

    GlitchFx.prototype._glitchState = function (callback) {
        var self = this;

        if (this.iteration < this.options.glitchTotalIterations) {
            this.glitchStateTimeout = setTimeout(function () {
                self.elems.forEach(function (el) {
                    if (el.classList.contains('mode--code')) {
                        el.classList.add('mode--design');
                        el.classList.remove('mode--code');
                    } else {
                        el.classList.add('mode--code');
                        el.classList.remove('mode--design');
                    }
                    el.style.transform = self.iteration % 2 !== 0
                        ? 'translate3d(0,0,0)'
                        : 'translate3d(' + getRandomInt(-5, 5) + 'px,' + getRandomInt(-5, 5) + 'px,0)';
                });

                self.iteration++;
                if (!self.isInactive) self._glitchState(callback);
            }, getRandomInt(this.options.glitchState.min, this.options.glitchState.max));
        } else {
            callback.call();
        }
    };

    GlitchFx.prototype.stopGlitch = function () {
        this.isInactive = true;
        clearTimeout(this.glitchTimeout);
        clearTimeout(this.glitchStateTimeout);
        this.elems.forEach(function (el) {
            if (el.classList.contains('mode--code')) {
                el.classList.add('mode--design');
                el.classList.remove('mode--code');
                el.style.transform = 'translate3d(0,0,0)';
            }
        });
    };

    /* =====================================================================
       charming
       ===================================================================== */

    function charming(element, options) {
        options = options || {};
        var tagName = options.tagName || 'span';
        var classPrefix = options.classPrefix != null ? options.classPrefix : 'char';
        var count = 1;

        function splitTextNode(node) {
            var parent = node.parentNode;
            var text = node.nodeValue;
            for (var i = 0; i < text.length; ++i) {
                var span = document.createElement(tagName);
                if (classPrefix) span.className = classPrefix + count++;
                span.appendChild(document.createTextNode(text.charAt(i)));
                parent.insertBefore(span, node);
            }
            parent.removeChild(node);
        }

        function walk(node) {
            var children = Array.prototype.slice.call(node.childNodes);
            for (var i = 0; i < children.length; ++i) walk(children[i]);
            if (node.nodeType === Node.TEXT_NODE) splitTextNode(node);
        }

        walk(element);
        return element;
    }

    /* =====================================================================
       Estado de la demo
       ===================================================================== */

    var DOM = {};
    var pm, gfx, gfxTitle, gfxSwitch;
    var mode = 'design';
    var disablePageFx;
    var isAnimating;

    DOM.body = document.body;
    DOM.loading = document.querySelector('.loading');
    DOM.switchCtrls = document.querySelector('.switch');
    DOM.switchModeCtrls = {
        design: DOM.switchCtrls && DOM.switchCtrls.querySelector('.switch__item--design'),
        code: DOM.switchCtrls && DOM.switchCtrls.querySelector('.switch__item--code')
    };
    DOM.pieces = document.querySelector('.pieces');
    DOM.aboutDesc = document.querySelector('.about-desc');
    DOM.aboutLead = document.querySelector('.about-lead');
    DOM.glitchElems = document.querySelectorAll('[data-glitch]');
    DOM.glitchTitleElems = document.querySelectorAll('.title__cat[data-glitch]');
    DOM.glitchSwitchElems = document.querySelectorAll('.switch__item span[data-glitch]');
    DOM.title = {
        el: document.querySelector('.title > .title__inner'),
        get letters() {
            var cat = this.el && this.el.querySelector('.title__cat--' + (this.el.dataset.cat || 'photo'));
            return cat ? [].slice.call(cat.querySelectorAll('span')) : [];
        }
    };

    window.AboutDemo = {
        isAnimating: function () {
            return !!isAnimating;
        },
        restartGlitch: function () {
            if (gfx && gfx.isInactive) gfx.glitch();
        },
        stopSwitchGlitch: function () {
            if (gfxSwitch && !gfxSwitch.isInactive) gfxSwitch.stopGlitch();
        },
        startSwitchGlitch: function () {
            if (!gfxSwitch) gfxSwitch = new GlitchFx(DOM.glitchSwitchElems);
            else if (gfxSwitch.isInactive) gfxSwitch.glitch();
        }
    };

    function charmTitle() {
        if (!DOM.title.el) return;
        [].slice.call(DOM.title.el.querySelectorAll('.title__cat')).forEach(function (cat) {
            if (!cat.querySelector('span')) charming(cat);
        });
    }

    function setCat(cat) {
        if (!DOM.title.el || DOM.title.el.dataset.cat === cat) return;
        DOM.title.el.dataset.cat = cat;
        if (DOM.aboutDesc) DOM.aboutDesc.dataset.cat = cat;
        if (DOM.aboutLead) DOM.aboutLead.dataset.cat = cat;

        var spans = DOM.title.el.querySelectorAll('.title__cat--' + cat + ' span');
        for (var i = 0; i < spans.length; ++i) {
            spans[i].style.opacity = '';
            var state = elStates.get(spans[i]);
            if (state) state.opacity = 1;
        }
    }

    window.AboutTitle = { charm: charmTitle, set: setCat };

    function wordsToLetters() {
        charmTitle();
    }

    // Precarga las imágenes que la demo esperaba (las cuatro de About y los
    // iconos sociales del frame) antes de retirar la cortina.
    function preloadImages() {
        var urls = new Set();
        var imgs = document.querySelectorAll('img[src]');
        for (var i = 0; i < imgs.length; ++i) urls.add(imgs[i].src);

        var pieces = document.querySelector('.pieces');
        if (pieces) {
            var inlineBg = pieces.style.backgroundImage || '';
            if (inlineBg) urls.add(inlineBg.replace(/^url\(["']?/, '').replace(/["']?\)$/, ''));
            ['data-img-alt', 'data-img-code'].forEach(function (attr) {
                var value = pieces.getAttribute(attr);
                if (value) urls.add(value.replace(/^url\(["']?/, '').replace(/["']?\)$/, ''));
            });
        }
        urls.add('assets/IMG/about/alex-photo.webp');

        return Promise.all(Array.from(urls).map(function (src) {
            return new Promise(function (resolve) {
                var probe = new Image();
                probe.onload = resolve;
                probe.onerror = resolve;
                probe.src = src;
            });
        }));
    }

    function init() {
        preloadImages().then(function () {
            if (DOM.loading) DOM.loading.classList.add('loading--hide');

            pm = new PieceMaker(DOM.pieces);
            pm.loopFx();
            gfx = new GlitchFx(DOM.glitchElems);
            wordsToLetters();
            initEvents();
        });
    }

    function initEvents() {
        if (DOM.switchModeCtrls.design) {
            DOM.switchModeCtrls.design.addEventListener('click', switchMode);
        }
        if (DOM.switchModeCtrls.code) {
            DOM.switchModeCtrls.code.addEventListener('click', switchMode);
        }

        var pauseFxFn = function () {
            pm.stopLoopFx();
            gfx.stopGlitch();
            pm.removeTilt();
        };
        var playFxFn = function () {
            pm.loopFx();
            if (gfx.isInactive) gfx.glitch();
            pm.initTilt();
        };

        DOM.switchCtrls.addEventListener('mouseenter', function () {
            if (disablePageFx || isAnimating) return;
            pauseFxFn();
        });
        DOM.switchCtrls.addEventListener('mouseleave', function () {
            if (disablePageFx || isAnimating) return;
            playFxFn();
        });
    }

    function switchMode(ev) {
        ev.preventDefault();

        if (isAnimating) return false;
        isAnimating = true;

        // mode: design || code.
        mode = ev.target === DOM.switchModeCtrls.code ? 'code' : 'design';

        if (mode === 'code') {
            disablePageFx = true;
            pm.removeTilt();
            pm.stopLoopFx();
            gfx.stopGlitch();
            // El título conserva su propio cortocircuito blanco↔azul.
            if (!gfxTitle) gfxTitle = new GlitchFx(DOM.glitchTitleElems);
            else if (gfxTitle.isInactive) gfxTitle.glitch();
            // El conmutador mantiene su glitch igual que en los otros modos.
            if (!gfxSwitch) gfxSwitch = new GlitchFx(DOM.glitchSwitchElems);
            else if (gfxSwitch.isInactive) gfxSwitch.glitch();
        } else if (gfxTitle && !gfxTitle.isInactive) {
            gfxTitle.stopGlitch();
            if (gfxSwitch && !gfxSwitch.isInactive) gfxSwitch.stopGlitch();
        }

        DOM.switchModeCtrls[mode === 'code' ? 'design' : 'code']
            .classList.remove('switch__item--current');
        DOM.switchModeCtrls[mode].classList.add('switch__item--current');

        switchContent();

        pm.animatePieces(mode === 'code' ? 'out' : 'in', function () {
            isAnimating = false;
            if (mode === 'design') {
                pm.initTilt();
                pm.loopFx();
                gfx.glitch();
                disablePageFx = false;
            }
        });
    }

    function switchContent() {
        DOM.switchCtrls.classList.remove('mode--' + (mode === 'code' ? 'design' : 'code'));
        DOM.switchCtrls.classList.add('mode--' + mode);

        if (mode === 'code') switchToCode();
        else switchToDesign();
    }

    function switchToCode() {
        var hideDesign = function (target, callback) {
            var el = DOM[target].el || DOM[target];
            removeTweens(el);
            animateTween({
                targets: el,
                duration: 400,
                easing: 'easeInQuint',
                scale: 0.3,
                opacity: { value: 0, easing: 'linear' },
                complete: callback
            });
        };

        var showCode = function (target) {
            var el = DOM[target].el || DOM[target];
            el.classList.remove('mode--design');
            el.classList.add('mode--code');

            var letters = DOM[target].letters;
            if (letters) {
                animateLetters(letters, 'in', {
                    begin: function () {
                        setOpacity(el, 1);
                        clearTransform(el);
                    }
                });
            } else {
                setOpacity(el, 1);
                clearTransform(el);
            }
        };

        hideDesign('title', function () {
            setCat('code');
            showCode('title');
        });
    }

    function switchToDesign() {
        var showDesign = function (target) {
            var el = DOM[target].el || DOM[target];
            el.classList.remove('mode--code');
            el.classList.add('mode--design');

            removeTweens(el);
            animateTween({
                targets: el,
                duration: 400,
                easing: 'easeOutQuint',
                scale: [0.3, 1],
                opacity: { value: [0, 1], easing: 'linear' },
                begin: function () {
                    if (DOM[target].letters !== undefined) {
                        DOM[target].letters.forEach(function (letter) {
                            setOpacity(letter, 1);
                        });
                    }
                }
            });
        };

        animateLetters(DOM.title.letters, 'out', {
            complete: function () {
                setCat('design');
                showDesign('title');
            }
        });
    }

    function animateLetters(letters, dir, extraOptions) {
        var opts = {
            targets: letters,
            duration: 50,
            delay: function (t, i, c) {
                return dir === 'in' ? i * 50 : (c - i - 1) * 50;
            },
            easing: dir === 'in' ? 'easeInQuint' : 'easeOutQuint',
            opacity: dir === 'in' ? [0, 1] : [1, 0]
        };
        extend(opts, extraOptions);

        removeTweens(opts.targets);
        animateTween(opts);
    }

    /* =====================================================================
       Capa Photographer
       ---------------------------------------------------------------------
       Misma máquina de estados que js/photographer.js: photo | leaving | off.
       Los clics en Diseñador/Desarrollador se interceptan en fase de captura
       mientras la capa está visible y, al terminar la salida, se reenvían con
       .click() para que el conmutador nativo (ya sin capa) haga su cambio.
       ===================================================================== */

    (function initPhotographer() {
        var ROWS = 14;
        var COLS = 10;
        var BG = 'url(assets/IMG/about/alex-photo.webp)';

        var piecesEl = document.querySelector('.pieces');
        var switchCtrl = document.querySelector('.switch');
        if (!piecesEl || !switchCtrl) return;

        var itemPhoto = switchCtrl.querySelector('.switch__item--photo');
        var itemDesign = switchCtrl.querySelector('.switch__item--design');
        var itemCode = switchCtrl.querySelector('.switch__item--code');
        if (!itemPhoto || !itemDesign || !itemCode) return;

        var titleInner = document.querySelector('.title__inner');

        var state = 'photo';
        var pending = null;
        var waitingDemo = false;
        var demoMode = 'design';

        var layer = document.createElement('div');
        layer.className = 'pieces--photo';
        var tiles = [];

        function build() {
            piecesEl.appendChild(layer);
            for (var r = 0; r < ROWS; ++r) {
                for (var c = 0; c < COLS; ++c) {
                    var tile = document.createElement('div');
                    tile.className = 'piece piece--photo';
                    tile.style.backgroundImage = BG;
                    tile.style.backgroundPosition = -1 * c * 100 + '% ' + -1 * 100 * r + '%';
                    tile.setAttribute('data-column', c);
                    tile.setAttribute('data-delay', getRandomInt(-25, 25));
                    layer.appendChild(tile);
                    tiles.push(tile);
                }
            }
            layout();
        }

        function layout() {
            var width = layer.clientWidth;
            if (!width) return;
            var w = Math.round(width / COLS);
            var h = Math.round(layer.clientHeight / ROWS);
            for (var i = 0; i < tiles.length; ++i) {
                tiles[i].style.width = w + 'px';
                tiles[i].style.height = h + 'px';
                tiles[i].style.backgroundSize = w * COLS + 'px ' + h * ROWS + 'px';
            }
        }

        if (window.ResizeObserver) {
            new ResizeObserver(layout).observe(piecesEl);
        }

        var reduceMotion = function () {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        };

        function splitDelay(t) {
            var c = parseInt(t.getAttribute('data-column'), 10);
            return Math.max(0, Math.round(Math.abs(c - (COLS / 2 - 0.5)) * 40) +
                parseInt(t.getAttribute('data-delay'), 10));
        }

        function fxSplit(out, done) {
            removeTweens(tiles);
            if (reduceMotion()) {
                for (var i = 0; i < tiles.length; ++i) {
                    setOpacity(tiles[i], out ? 0 : 1);
                    clearTransform(tiles[i]);
                }
                if (done) done();
                return;
            }
            var half = COLS / 2;
            animateTween({
                targets: tiles,
                duration: out ? 400 : 500,
                delay: splitDelay,
                easing: out ? [0.2, 1, 0.3, 1] : [0.8, 1, 0.3, 1],
                translateX: function (t) {
                    var side = parseInt(t.getAttribute('data-column'), 10) < half ? -1 : 1;
                    var amp = getRandomInt(100, 500);
                    return out ? side * amp : [side * amp, 0];
                },
                translateY: function () {
                    var dy = getRandomInt(0, 100);
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
            [itemPhoto, itemDesign, itemCode].forEach(function (item) {
                item.classList.toggle('switch__item--current', item === el);
            });
        }

        function enterPhoto(fromLeaving) {
            if (!fromLeaving && window.AboutDemo && window.AboutDemo.isAnimating()) {
                if (waitingDemo) return;
                waitingDemo = true;
                var poll = function () {
                    if (!waitingDemo) return;
                    if (window.AboutDemo && window.AboutDemo.isAnimating()) {
                        setTimeout(poll, 80);
                        return;
                    }
                    waitingDemo = false;
                    if (state === 'off') enterPhoto();
                };
                setTimeout(poll, 80);
                return;
            }
            waitingDemo = false;
            pending = null;
            if (!fromLeaving) demoMode = currentMode();
            state = 'photo';
            layer.style.display = '';
            layout();

            if (demoMode === 'code') {
                switchCtrl.classList.remove('mode--code');
                switchCtrl.classList.add('mode--design');
                if (titleInner) {
                    titleInner.classList.remove('mode--code');
                    titleInner.classList.add('mode--design');
                }
                if (window.AboutDemo) window.AboutDemo.stopSwitchGlitch();
                if (window.AboutDemo) window.AboutDemo.restartGlitch();
            }

            setCurrent(itemPhoto);
            if (window.AboutTitle) window.AboutTitle.set('photo');
            fxSplit(false);
        }

        function exitTo(targetMode) {
            state = 'leaving';
            pending = targetMode;
            itemPhoto.classList.remove('switch__item--current');
            fxSplit(true, finish);
        }

        function finish() {
            if (state !== 'leaving') return;
            var targetMode = pending;
            pending = null;
            state = 'off';
            layer.style.display = 'none';

            if (targetMode === demoMode) {
                switchCtrl.classList.remove(targetMode === 'code' ? 'mode--design' : 'mode--code');
                switchCtrl.classList.add('mode--' + targetMode);
                if (titleInner) {
                    titleInner.classList.remove(targetMode === 'code' ? 'mode--design' : 'mode--code');
                    titleInner.classList.add('mode--' + targetMode);
                }
                setCurrent(targetMode === 'code' ? itemCode : itemDesign);
                if (window.AboutTitle) window.AboutTitle.set(targetMode);
            } else {
                var target = targetMode === 'code' ? itemCode : itemDesign;
                target.click();
                demoMode = targetMode;
                var switched = target.classList.contains('switch__item--current');
                setCurrent(target);
                if (!switched && window.AboutTitle) window.AboutTitle.set(targetMode);
            }
        }

        document.addEventListener('click', function (ev) {
            var target = ev.target;
            var item = target && target.closest
                ? target.closest('.switch__item--photo, .switch__item--design, .switch__item--code')
                : null;
            if (!item) return;

            if (item === itemPhoto) {
                ev.preventDefault();
                ev.stopPropagation();
                if (state === 'off') enterPhoto();
                else if (state === 'leaving') enterPhoto(true);
                return;
            }

            var targetMode = item === itemCode ? 'code' : 'design';
            if (state === 'photo') {
                ev.preventDefault();
                ev.stopPropagation();
                exitTo(targetMode);
            } else if (state === 'leaving') {
                ev.preventDefault();
                ev.stopPropagation();
                pending = targetMode;
            } else if (waitingDemo) {
                waitingDemo = false;
            }
        }, true);

        build();
    })();

    /* =====================================================================
       Arranque
       ===================================================================== */

    if (DOM.pieces && DOM.switchCtrls) init();

})(window, document);
