import {terser} from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/browser/bundle.js",
                format: "iife",
                sourcemap: true,
                globals: {
                    "pixi.js": "PIXI",
                },
            },
            {
                file: "dist/browser/bundle.min.js",
                format: "iife",
                sourcemap: true,
                plugins: [terser()],
                globals: {
                    "pixi.js": "PIXI",
                },
            },
        ],
        plugins: [
            typescript(),
            copy({
                targets: [
                    { src: "node_modules/pixi.js/dist/pixi.js", dest: "dist/browser/" },
                ]
            }),
        ],
        external: ["pixi.js"],
    },
    {
        input: "src/cli.ts",
        output: [
            {
                file: "dist/node/cli.js",
                format: "cjs",
                sourcemap: true,
            },
        ],
        plugins: [typescript()],
    },
]
