import { menuConfig } from './menuConfig.js';
import { MenuItem } from './menuItem.js';

export class Menu {
    DOM = {
        el: null,
        items: null,
        menuCtrl: { el: null },
        bg: null,
        tagline: null,
    }
    menuItems = [];
    menuStatus = { isOpen: false, isAnimating: false };
    segments = {};

    constructor(DOM_el) {
        this.DOM = { el: DOM_el };
        this.DOM.items = [...this.DOM.el.querySelectorAll('.menu__item')];
        this.DOM.menuCtrl = { el: this.DOM.el.querySelector('.menu__button') };
        this.DOM.bg = this.DOM.el.querySelector('.menu__bg');
        this.DOM.tagline = this.DOM.el.querySelector('.menu__tagline');

        this.initSegments();
        this.DOM.items.forEach(item => this.menuItems.push(new MenuItem(item)));
        this.initEvents();
    }

    restart() {
        if (this.menuTimeline) this.menuTimeline.kill();
        this.menuStatus.isAnimating = false;

        if (this.DOM.el.parentNode) {
            this.DOM.items.forEach((item) => {
                if (item.dataset.label === undefined) return;
                const fresh = item.cloneNode(false);
                fresh.dataset.label = item.dataset.label;
                fresh.textContent = item.dataset.label;
                item.replaceWith(fresh);
            });
        }

        this.DOM.items = [...this.DOM.el.querySelectorAll('.menu__item')];
        this.DOM.items.forEach((item) => {
            item.setAttribute('data-splitting', '');
            item.classList.add('splitting');
        });

        Splitting({ target: this.DOM.items });

        this.menuItems = [];
        this.DOM.items.forEach((item) => this.menuItems.push(new MenuItem(item)));
    }

    initSegments() {
        const pathA = document.getElementById('pathA');
        const pathB = document.getElementById('pathB');
        const pathC = document.getElementById('pathC');

        if (pathA && pathB && pathC) {
            this.segments = {
                A: new Segment(pathA, 80, 320),
                B: new Segment(pathB, 80, 320),
                C: new Segment(pathC, 80, 320),
            };
        }
    }

    initEvents() {
        this.DOM.menuCtrl.el.addEventListener('click', () => {
            if (this.menuStatus.isAnimating) return;
            this.menuStatus.isOpen ? this.close() : this.open();
        });

        this.DOM.items.forEach(item => {
            if (item.getAttribute('href') === '#') {
                item.addEventListener('click', (e) => e.preventDefault());
            }
        });
    }

    animateToClose() {
        const { A, B, C } = this.segments;
        if (!A || !B || !C) return;

        A.stop(); B.stop(); C.stop();

        const inAC = (s) => {
            s.draw('80% - 240', '80%', 0.3, {
                delay: 0.1,
                callback: () => {
                    s.draw('100% - 545', '100% - 305', 0.6, {
                        easing: ease.ease('elastic-out', 1, 0.3)
                    });
                }
            });
        };

        const inB = (s) => {
            s.draw(20, 380, 0.1, {
                callback: () => {
                    s.draw(200, 200, 0.3, {
                        easing: ease.ease('bounce-out', 1, 0.3)
                    });
                }
            });
        };

        inAC(A);
        inB(B);
        inAC(C);
    }

    animateToOpen() {
        const { A, B, C } = this.segments;
        if (!A || !B || !C) return;

        A.stop(); B.stop(); C.stop();

        const outAC = (s) => {
            s.draw('90% - 240', '90%', 0.1, {
                easing: ease.ease('elastic-in', 1, 0.3),
                callback: () => {
                    s.draw('20% - 240', '20%', 0.3, {
                        callback: () => {
                            s.draw(80, 320, 0.7, {
                                easing: ease.ease('elastic-out', 1, 0.3)
                            });
                        }
                    });
                }
            });
        };

        const outB = (s) => {
            s.draw(80, 320, 0.7, {
                delay: 0.1,
                easing: ease.ease('elastic-out', 2, 0.4)
            });
        };

        outAC(A);
        outB(B);
        outAC(C);
    }

    open() {
        if (this.menuStatus.isAnimating || this.menuStatus.isOpen) return;
        this.menuStatus.isAnimating = true;
        this.menuStatus.isOpen = true;

        const gradient = { value: 'linear-gradient(135deg, #0f0f1a, #1a1a2e)' };

        this.animateToClose();

        this.menuTimeline = gsap.timeline({
            defaults: { duration: 1.7, ease: 'expo.inOut' },
            onComplete: () => this.menuStatus.isAnimating = false
        })
        .addLabel('start', 0)
        .add(() => this.DOM.el.classList.add('menu--open'), 'start')
        .to(this.DOM.bg, {
            startAt: { 
                x: -1 * this.DOM.bg.offsetWidth + 0.2 * window.innerWidth + 0.11 * window.innerHeight,
                opacity: 0.45
            },
            x: 0,
            opacity: 1
        }, 'start')
        .to(gradient, {
            value: 'linear-gradient(135deg, #16213e, #0f3460)',
            onUpdate: () => this.DOM.bg.style.backgroundImage = gradient.value
        }, 'start')
        .to(this.DOM.tagline, { opacity: 0, x: '-50%' }, 'start')
        .to(this.menuItems.map(item => item.DOM.slotMachine), {
            y: `${100 / menuConfig.slotMachineTotalLetters * (menuConfig.slotMachineTotalLetters - 1)}%`,
            stagger: 0.03
        }, 'start');

        this.menuItems.forEach(item => {
            this.menuTimeline.to(item.DOM.chars, {
                startAt: { x: '100%', rotation: 10, opacity: 1 },
                x: '0%',
                opacity: 1,
                rotation: 0,
                stagger: 0.04
            }, 'start');
        });
    }

    close() {
        if (this.menuStatus.isAnimating || !this.menuStatus.isOpen) return;
        this.menuStatus.isAnimating = true;
        this.menuStatus.isOpen = false;

        const gradient = { value: 'linear-gradient(135deg, #16213e, #0f3460)' };

        this.animateToOpen();

        this.menuTimeline = gsap.timeline({
            defaults: { duration: 1.3, ease: 'expo.inOut' },
            onComplete: () => this.menuStatus.isAnimating = false
        })
        .addLabel('start', 0)
        .add(() => this.DOM.el.classList.remove('menu--open'), 'start')
        .to(this.DOM.bg, { 
            startAt: { opacity: 1 },
            opacity: 0.45
        }, 'start')
        .to(this.menuItems.map(item => item.DOM.slotMachine), {
            duration: 1.5,
            y: '0%',
            stagger: -0.01
        }, 'start');

        this.menuItems.forEach(item => {
            this.menuTimeline.to(item.DOM.chars, {
                x: '100%',
                rotation: 10,
                stagger: -0.04
            }, 'start');
        });

        this.menuTimeline
        .to(this.DOM.bg, {
            x: -1 * this.DOM.bg.offsetWidth + 0.2 * window.innerWidth + 0.11 * window.innerHeight,
            onComplete: () => {
                this.DOM.bg.style.transform = 'translateX(-100%) translateX(20vw) translateX(11vh)';
            }
        }, 'start+=0.2')
        .to(gradient, {
            value: 'linear-gradient(135deg, #0f0f1a, #1a1a2e)',
            onUpdate: () => this.DOM.bg.style.backgroundImage = gradient.value
        }, 'start')
        .to(this.DOM.tagline, { opacity: 1, x: '0%' }, 'start');
    }
}
