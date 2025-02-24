import { THEME_WS } from '@/constants/constant';
import { THEMES } from '@/constants/themeCss';
import { ThemeProvider, useTheme as useNextTheme } from 'next-themes';
import React, { createContext, useContext, useEffect, useMemo } from 'react';

interface ThemeContextProps {
    theme?: string;
    setTheme: (theme: string) => void;
}

export const ThemeContext = createContext({} as ThemeContextProps);

const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { theme, setTheme } = useNextTheme();

    useEffect(() => {
        if (theme !== THEME_WS.LIGHT) {
            setTheme(THEME_WS.LIGHT);
        }
        
        const root = document.documentElement;
        THEMES.forEach((themeValue) => {
            root.style.setProperty(themeValue.variableName, themeValue.light);
        });
    }, [setTheme, theme]);

    const themeContextValue = useMemo(() => ({ theme: THEME_WS.LIGHT, setTheme }), [setTheme]);

    return <ThemeContext.Provider value={themeContextValue}>{children}</ThemeContext.Provider>;
};

const ThemeContextWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ThemeProvider attribute="class" defaultTheme={THEME_WS.LIGHT} enableSystem={false} forcedTheme={THEME_WS.LIGHT}>
            <ThemeContextProvider>{children}</ThemeContextProvider>
        </ThemeProvider>
    );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContextWrapper;
