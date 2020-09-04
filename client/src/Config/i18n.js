import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import esTranslation from '../Components/locales/es/translation'
import enTranslation from '../Components/locales/en/translation'

i18n
  // connect with React
  .use(initReactI18next)
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,

    lng: 'es',
    fallbackLng: 'es',
    whitelist: ['es', 'en'],

    resources:{
      es: esTranslation,
      en: enTranslation
    }

  });

export default i18n;
