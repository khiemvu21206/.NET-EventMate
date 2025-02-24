import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {resources} from "../translation/lang/index";


// add resource
export type TLocaleNamespaces = (keyof (typeof resources)['en'])[];

export const localeNamespaces = Object.keys(resources['en']) as TLocaleNamespaces;


export const defaultNS = 'translation';


  // initialize i18next with catalog and language to use
  i18n
  .use(initReactI18next) // Sử dụng react-i18next
  .init({
    resources,
    lng: "en", // Ngôn ngữ mặc định
    fallbackLng: "en", // Ngôn ngữ dự phòng
    ns: ["commons", "login"], // Namespace
    defaultNS: "commons", // Namespace mặc định
    interpolation: {
      escapeValue: false, // Không cần escape ký tự HTML
    },
  });
  

export default i18n;
