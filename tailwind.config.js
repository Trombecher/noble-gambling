import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import("tailwindcss").Config} */
export default {
    theme: {
        fontFamily: {
            "sans": ["Playfair Display", ...defaultTheme.fontFamily.sans],
            "mono": [...defaultTheme.fontFamily.mono],
        },
        colors: {
            white: "#CAD2C5",
            black: "#100E11",
            green: "#034732",
            red: "#d62626",
            brown: "#2e1209",
            lime: "#66af1d"
        }
    },
    content: [
        "./index.html",
        "./src/**/*.tsx"
    ],
};