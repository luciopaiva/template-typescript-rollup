import {terser} from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";

export default [
    // rule to build the web app
    {
        input: "src/webapp/index.ts",
        output: [
            // regular bundle
            {
                file: "webapp/js/bundle.js",
                format: "iife",
                sourcemap: true,
                globals: {
                    "pixi.js": "PIXI",
                    "d3": "d3",
                    "d3-hierarchy": "d3",
                },
            },
            // minified bundle
            {
                file: "webapp/js/bundle.min.js",
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
                    { src: "node_modules/pixi.js/dist/pixi.min.js", dest: "webapp/js/" },
                    { src: "node_modules/pixi.js/dist/pixi.min.js.map", dest: "webapp/js/" },
                    { src: "node_modules/d3/dist/d3.min.js", dest: "webapp/js/" },
                    { src: "node_modules/d3-hierarchy/dist/d3-hierarchy.min.js", dest: "webapp/js/" },
                    { src: "src", dest: "webapp/" },  // to export .ts files when debugging on the browser
                ]
            }),
            serve({
                contentBase: "webapp/",
            }),
            livereload(),
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
