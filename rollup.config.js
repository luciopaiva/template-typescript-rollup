import {terser} from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";

export default [
    {
        input: "src/webapp/index.ts",
        output: [
            {
                file: "dist/browser/bundle.js",
                format: "iife",
                sourcemap: true,
                globals: {
                    "pixi.js": "PIXI",
                    "d3": "d3",
                    "d3-hierarchy": "d3",
                },
            },
            {
                file: "dist/browser/bundle.min.js",
                format: "iife",
                sourcemap: true,
                plugins: [terser()],
                globals: {
                    "pixi.js": "PIXI",
                    "d3": "d3",
                    "d3-hierarchy": "d3",
                },
            },
        ],
        plugins: [
            typescript(),
            copy({
                targets: [
                    { src: "node_modules/pixi.js/dist/pixi.min.js", dest: "dist/browser/" },
                    { src: "node_modules/pixi.js/dist/pixi.min.js.map", dest: "dist/browser/" },
                    { src: "node_modules/d3/dist/d3.min.js", dest: "dist/browser/" },
                    { src: "node_modules/d3-hierarchy/dist/d3-hierarchy.min.js", dest: "dist/browser/" },
                    { src: "src/webapp/**/*.html", dest: "dist/browser/" },
                    { src: "src/webapp/**/*.css", dest: "dist/browser/" },
                ]
            }),
        ],
        external: ["pixi.js", "d3", "d3-hierarchy"],
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
