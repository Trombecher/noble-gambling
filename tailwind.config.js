import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import("tailwindcss").Config} */
export default {
    theme: {
        fontFamily: {
            "sans": ["Playfair Display", ...defaultTheme.fontFamily.sans],
            "mono": [...defaultTheme.fontFamily.mono],
        },
        colors: {
            shade: {
                50: '#ffffff',
                100: '#eae7ea',
                200: '#cbc6cf',
                300: '#bdb3bf',
                400: '#a59aac',
                500: '#8e8298',
                600: '#786b80',
                700: '#5b5061',
                800: '#37303B',
                900: '#1D191F',
                950: '#100E11'
            },
            rot: "#034732"
        }
    },
    content: [
        "./index.html",
        "./src/**/*.tsx"
    ],
};