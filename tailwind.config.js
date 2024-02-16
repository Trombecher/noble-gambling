import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import("tailwindcss").Config} */
export default {
    theme: {
        fontFamily: {
            "sans": [...defaultTheme.fontFamily.sans],
            "mono": [...defaultTheme.fontFamily.mono],
            "fancy": ["Rye", "sans-serif"]
        },
        colors: {
            shade: {
                50: '#DFDBE1',
                100: '#D5CFD8',
                200: '#C1B9C6',
                300: '#ADA2B3',
                400: '#998CA1',
                500: '#85768F',
                600: '#6B5E73',
                700: '#514757',
                800: '#37303B',
                900: '#1D191F',
                950: '#100E11'
            }
        }
    },
    content: [
        "./index.html",
        "./src/**/*.tsx"
    ],
};