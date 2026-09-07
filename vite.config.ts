import tailwindcss from "@tailwindcss/vite";
import {defineConfig} from "vite";

export default defineConfig({
    plugins: [tailwindcss()],
    oxc: {
        jsx: {
            importSource: "aena",
            pragma: "createElement",
            pragmaFrag: "Fragment",
        },
        jsxInject: "import {createElement, Fragment} from 'aena';",
    },
    resolve: {
        preserveSymlinks: true,
    },
    base: "/noble-gambling/",
});
