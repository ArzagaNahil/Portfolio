import { menuConfig } from './menuConfig.js';

export class MenuItem {
    DOM = {
        el: null,
        chars: null,
        slotMachine: null,
    }
    itemPosition;

    constructor(DOM_el) {
        this.DOM = { el: DOM_el };
        this.DOM.chars = [...this.DOM.el.querySelectorAll('span.char')];
        this.itemPosition = [...this.DOM.el.parentNode.children].indexOf(this.DOM.el);
        this.layout();
    }

    layout() {
        const totalRandomChars = menuConfig.slotMachineTotalLetters - 2;
        const allChars = 'ABCDEFGHIJKLMNOPRSTUVWXYZ';

        this.DOM.chars.forEach((char, charPosition) => {
            const wrapEl = document.createElement('span');
            wrapEl.classList = 'letter-wrap';
            char.parentNode.appendChild(wrapEl);
            wrapEl.appendChild(char);

            if (charPosition === 0) {
                this.DOM.slotMachine = document.createElement('span');
                this.DOM.slotMachine.classList = 'letter-wrap__inner';
                wrapEl.appendChild(this.DOM.slotMachine);

                const randomCharsArray = Array.from(
                    { length: totalRandomChars },
                    () => allChars.charAt(Math.floor(Math.random() * allChars.length))
                );

                let htmlStr = `<span>${char.innerHTML}</span>`;
                for (let i = 0; i <= totalRandomChars - 1; ++i) {
                    htmlStr += i === totalRandomChars - 1
                        ? `<span>${randomCharsArray[i]}</span><span>${menuConfig.displayVerticalTitle.charAt(this.itemPosition)}</span>`
                        : `<span>${randomCharsArray[i]}</span>`;
                }
                this.DOM.slotMachine.innerHTML = htmlStr;
                wrapEl.removeChild(char);
            }
        });
    }
}
