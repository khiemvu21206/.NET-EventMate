/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { localeNamespaces } from '../translation/i18n';

interface LanguageContextProps {
    t: any;
    // t: TFunction<TLocaleNamespaces>;
    language: string;
    changeLanguage: (lang?: string) => Promise<void>;
}

export const LanguageContext = createContext({} as LanguageContextProps);

const LANGUAGE_STORAGE_KEY = 'lang';

const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { t, i18n } = useTranslation(localeNamespaces);
    const [language, setLanguage] = useState<string>(i18n.language);

    useEffect(() => {
        const lang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (lang) {
            setLanguage(lang);
            i18n.changeLanguage(lang);
        }
    }, []);

    /**
     * Change the language for supporting i18n
     * @param {string} lang new selected language
     * By default lang is en(English)
     */
    const changeLanguage = useCallback(
        async (lang = 'en') => {
            if (i18n.language === lang) return;
            setLanguage(lang);
            localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
            await i18n.changeLanguage(lang);
        },
        [i18n]
    );

    const languageContextValue = useMemo(
        () => ({ t, language, changeLanguage }),
        [t, language, changeLanguage]
    );

    return (
        <LanguageContext.Provider value={languageContextValue}>{children}</LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageProvider;
