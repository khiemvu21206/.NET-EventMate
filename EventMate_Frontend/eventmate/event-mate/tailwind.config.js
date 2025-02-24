/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        'node_modules/preline/dist/*.js',
    ],
    darkMode: 'class',
    theme: {
        fontFamily: {
            sans: ['"Inter"', 'sans-serif'],
            inter: 'var(--font-inter)',
        },
        extend: {
            colors: {
                bglight: '#ffffff',
                'white-transparent': '#ffffff1f',
                bgdark: '#24272b',
                primary: {
                    50: '#f2f7fc',
                    100: '#e1eef8',
                    150: '#F0F6FF',
                    200: '#cae2f3',
                    300: '#a5d0eb',
                    350: '#BCD1EB',
                    400: '#7bb6df',
                    450: '#8CB0DA',
                    500: '#5b9cd6',
                    550: '#5696D6',
                    600: '#4581c8',
                    700: '#3d6fb8',
                    800: '#375b96',
                    850: '#25456B',
                    900: '#314d77',
                    950: '#223149',
                    1000: '#132536',
                    1050: '#427BBF',
                    1100: '#132536',
                },
                secondary: {
                    50: '#FAFAFA',
                    100: '#F4F4F5',
                    200: '#E4E4E7',
                    300: '#D1D1D6',
                    400: '#A0A0AB',
                    500: '#62626B',
                    600: '#3A3A42',
                    700: '#303038',
                    800: '#2C2C33',
                    900: '#242429',
                    950: '#202024',
                },
                tertiary: {
                    50: '#F5F3FF',
                    100: '#E3E1F5',
                    200: '#CCC6EB',
                    300: '#A99DDB',
                    400: '#8A74D4',
                    500: '#6444B8',
                    600: '#5629AB',
                    700: '#44198C',
                    800: '#33136B',
                    900: '#2F1B53',
                    950: '#1a0e2e',
                },
                success: {
                    50: '#ECFDF3',
                    100: '#D1FADF',
                    200: '#A6F4C5',
                    300: '#74DBA4',
                    400: '#4BD68A',
                    500: '#25B773',
                    600: '#14985D',
                    700: '#0D7A4D',
                    800: '#08603B',
                    900: '#103E2B',
                    950: '#09261a',
                },
                warn: {
                    50: '#FEFBE8',
                    100: '#FEF7C3',
                    200: '#FEEE95',
                    300: '#FDE272',
                    400: '#FAC515',
                    500: '#EAAA08',
                    600: '#CA8504',
                    700: '#A15C07',
                    800: '#854A0E',
                    900: '#562F11',
                    950: '#402108',
                },
                error: {
                    50: '#FCECE8',
                    100: '#FAD9D2',
                    200: '#F5BDB3',
                    300: '#EA7D67',
                    400: '#E55D41',
                    500: '#E03C1B',
                    600: '#BB3217',
                    700: '#952812',
                    800: '#4B1409',
                    900: '#2D0C05',
                    950: '#240904',
                },
            },
            textColor: {
                subtle: 'var(--text-subtle)',
                inverse: 'var(--text-inverse)',
                disabled: 'var(--text-disabled)',
                strong: 'var(--text-strong)',
            },
            backgroundColor: {
                light: 'var(--bg-light)',
                'dark-transparent': 'rgb(24, 24, 27)',
                editor: 'var(--markdown-code-bg)',
                white: 'var(--bg-section-white-black)',
                'gray-strong': 'var(--bg-gray-strong)',
                'gray-light': 'var(--bg-gray-light)',
            },
            borderColor: {
                strong: 'var(--outline-strong)',
                small: 'var(--color-border-small)',
                default: 'var(--outline-default)',
                light: 'var(--border-light)',
            },
            scrollbarGutter: {
                'stable-both': 'stable',
            },
            boxShadow: {
                300: '0px 4px 16px -6px rgba(6, 13, 31, 0.06), 0px 8px 32px -4px rgba(23, 39, 82, 0.06)',
            },
            keyframes: {
                slideInRightToLeft: {
                    '0%': {
                        transform: 'translateX(100%)',
                        opacity: 0,
                    },
                    '100%': {
                        transform: 'translateX(0)',
                        opacity: 1,
                    },
                },
                slideInLeftToRight: {
                    '0%': {
                        transform: 'translateX(-100%)',
                        opacity: 0,
                    },
                    '100%': {
                        transform: 'translateX(0)',
                        opacity: 1,
                    },
                },
                fadeIn: {
                    '0%': {
                        opacity: 0,
                    },
                    '100%': {
                        opacity: 1,
                    },
                },
                blink: {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.4 },
                },
                lightSweep: {
                    '0%': { transform: 'translateX(-100%)', opacity: 0 },
                    '50%': { opacity: 1 },
                    '100%': { transform: 'translateX(100%)', opacity: 0 },
                },
            },
            animation: {
                'right-to-left': 'slideInRightToLeft 0.5s ease-in forwards',
                'left-to-right': 'slideInLeftToRight 0.5s ease-in forwards',
                'fade-in': 'fadeIn 0.8s ease-in forwards',
                blink: 'blink 2s infinite',
                lightSweep: 'lightSweep 2s ease-in-out infinite',
            },
        },
    },
    plugins: [
        require('preline/plugin'),
        function ({ addUtilities }) {
            addUtilities(
                {
                    '.scrollbar-hide': {
                        /* IE and Edge */
                        '-ms-overflow-style': 'none',

                        /* Firefox */
                        'scrollbar-width': 'none',

                        /* Safari and Chrome */
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                    },
                },
                ['responsive']
            );
        },
        function ({ addUtilities }) {
            const newUtilities = {
                '.scrollbar-gutter-stable': {
                    'scrollbar-gutter': 'stable',
                },
            };
            addUtilities(newUtilities, ['responsive', 'hover']);
        },
    ],
};
