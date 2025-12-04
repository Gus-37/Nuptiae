import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  es: {
    translation: {
      "settings.language": "Idioma",
      "language.spanish": "Español",
      "language.english": "Inglés",
    },
  },
  en: {
    translation: {
      "settings.language": "Language",
      "language.spanish": "Spanish",
      "language.english": "English",
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "es",
    fallbackLng: "es",
    compatibilityJSON: "v3",
    interpolation: { escapeValue: false },
    reactNative: { useSuspense: false },
  });

export default i18n;