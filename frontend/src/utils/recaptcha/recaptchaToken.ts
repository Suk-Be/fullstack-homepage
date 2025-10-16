// Ein Promise, das sicherstellt, dass das Skript nur einmal geladen wird
export let recaptchaScriptPromise: Promise<void> | null = null;

const loadRecaptchaScript = (): Promise<void> => {
    const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    if (recaptchaScriptPromise) return recaptchaScriptPromise;

    recaptchaScriptPromise = new Promise((resolve, reject) => {
        if (typeof window.grecaptcha !== 'undefined') {
            // schon geladen
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
        script.async = true;
        script.defer = true;

        script.onload = () => resolve();
        script.onerror = () => reject('Failed to load reCAPTCHA script');

        document.head.appendChild(script);
    });

    return recaptchaScriptPromise;
};

/**
 * Generiert ein reCAPTCHA v3 Token für eine spezifische Aktion.
 * Liest den Site Key aus der Umgebungsvariable VITE_RECAPTCHA_SITE_KEY.
 * * @param action - Der Name der Aktion (z.B. 'login', 'rename_grid').
 * @returns Das generierte reCAPTCHA Token.
 */
const getRecaptchaToken = async (action: string): Promise<string> => {
    const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

    // 💡 Zugriff auf die Vite Umgebungsvariable
    if (!RECAPTCHA_SITE_KEY) throw new Error('VITE_RECAPTCHA_SITE_KEY fehlt.');

    // Skript laden, falls noch nicht
    await loadRecaptchaScript();

    if (typeof grecaptcha === 'undefined' || !grecaptcha.execute) {
        throw new Error('grecaptcha ist nicht verfügbar.');
    }

    return new Promise((resolve, reject) => {
        grecaptcha.ready(() => {
            grecaptcha.execute(RECAPTCHA_SITE_KEY, { action }).then(resolve).catch(reject);
        });
    });
};

export default getRecaptchaToken;
