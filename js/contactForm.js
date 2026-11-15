import { I18N, getLang } from './i18n.js';

const t = (key) => (I18N[getLang()] || I18N.es)[key] || key;

const form = document.querySelector('.contact__form');
if (form) {
    const status = form.querySelector('.form-status');
    const button = form.querySelector('button[type="submit"]');
    const honey = form.querySelector('[name="_honey"]');
    let started = Date.now();

    const setStatus = (key, state) => {
        if (!status) return;
        status.dataset.i18n = key;
        status.dataset.state = state;
        status.textContent = t(key);
        status.hidden = false;
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Bot: honeypot relleno o envío casi instantáneo.
        if (honey && honey.value.trim()) return;
        if (Date.now() - started < 2500) return;
        if (!form.reportValidity()) return;

        button.disabled = true;
        setStatus('c_status_sending', 'sending');

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' },
            });
            const result = await response.json().catch(() => ({}));
            if (String(result.success) === 'false') {
                if (/activat/i.test(result.message || '')) {
                    throw new Error('activate');
                }
                throw new Error(result.message || 'send failed');
            }
            if (!response.ok) throw new Error(result.message || 'send failed');
            form.reset();
            started = Date.now();
            setStatus('c_status_ok', 'ok');
        } catch (error) {
            if (error && error.message === 'activate') {
                setStatus('c_status_activate', 'error');
            } else {
                setStatus('c_status_error', 'error');
            }
        } finally {
            button.disabled = false;
        }
    });
}
