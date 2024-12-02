export const availableLocales = [
  'bn', // Bengali
  'bs', // Bosnian
  'pt-BR', // Brazilian Portuguese
  'bg', // Bulgarian
  'ca', // Catalan
  'hr', // Croatian
  'cs', // Czech
  'da', // Danish
  'nl', // Dutch
  'en', // English
  'et', // Estonian
  'fi', // Finnish
  'fr', // French
  'de', // German
  'el', // Greek
  'hi', // Hindi
  'hu', // Hungarian
  'id', // Indonesian
  'it', // Italian
  'ja', // Japanese
  'ko', // Korean
  'lv', // Latvian
  'lt', // Lithuanian
  'ms', // Malay
  'mn', // Mongolian
  'nb', // Norwegian
  'pl', // Polish
  'pt', // Portuguese
  'ro', // Romanian
  'ru', // Russian
  'sr', // Serbian
  'zh-CN', // Simplified Chinese
  'sl', // Slovenian
  'es', // Spanish
  'sw', // Swahili
  'sv', // Swedish
  'th', // Thai
  'zh-TW', // Traditional Chinese
  'tr', // Turkish
  'uk', // Ukrainian
  'vi', // Vietnamese
]

export function getCountryNameByCode(code: string): string {
  const languages: { [key: string]: string } = {
    bn: 'Bengali',
    bs: 'Bosnian',
    'pt-BR': 'Brazilian Portuguese',
    bg: 'Bulgarian',
    ca: 'Catalan',
    hr: 'Croatian',
    cs: 'Czech',
    da: 'Danish',
    nl: 'Dutch',
    en: 'English',
    et: 'Estonian',
    fi: 'Finnish',
    fr: 'French',
    de: 'German',
    el: 'Greek',
    hi: 'Hindi',
    hu: 'Hungarian',
    id: 'Indonesian',
    it: 'Italian',
    ja: 'Japanese',
    ko: 'Korean',
    lv: 'Latvian',
    lt: 'Lithuanian',
    ms: 'Malay',
    mn: 'Mongolian',
    nb: 'Norwegian',
    pl: 'Polish',
    pt: 'Portuguese',
    ro: 'Romanian',
    ru: 'Russian',
    sr: 'Serbian',
    'zh-CN': 'Simplified Chinese',
    sl: 'Slovenian',
    es: 'Spanish',
    sw: 'Swahili',
    sv: 'Swedish',
    th: 'Thai',
    'zh-TW': 'Traditional Chinese',
    tr: 'Turkish',
    uk: 'Ukrainian',
    vi: 'Vietnamese',
  }
  return languages[code] || code
}
