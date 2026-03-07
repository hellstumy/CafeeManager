import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Импорт переводов
import translationEN from './locales/en.json'
import translationUA from './locales/ua.json'
import translationPL from './locales/pl.json'

const resources = {
  en: {
    translation: translationEN,
  },
  ua: {
    translation: translationUA,
  },
  pl: {
    translation: translationPL,
  },
}

export const savedLanguage = localStorage.getItem('language')
const browserLanguage = navigator.language.split('-')[0] // 'en-US' → 'en'
const defaultLanguage =
  savedLanguage || (resources[browserLanguage] ? browserLanguage : 'en')

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
