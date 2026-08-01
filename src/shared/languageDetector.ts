export function detectLanguage(): 'es-MX' | 'en-GB' {
  try {
    if (typeof navigator === 'undefined') return 'en-GB';

    const navLang = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    if (!navLang) return 'en-GB';

    // Si comienza con 'es' (es, es-ES, es-MX, etc.) lo consideramos español
    if (/^es(-|$)/i.test(navLang)) return 'es-MX';

    return 'en-GB';
  } catch (e) {
    return 'en-GB';
  }
}

export default detectLanguage;
