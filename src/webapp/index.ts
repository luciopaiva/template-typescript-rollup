
import * as PIXI from "pixi.js";
import Application from "../application";

function run() {
    // this is just to demonstrate that the import worked
    // will print PixiJS's version message to the browser console
    new PIXI.Application({
        antialias: true,
        view: document.getElementById("map") as HTMLCanvasElement,
        width: 800,
        height: 600,
    });

    // demo using TypeScript syntax
    const div: HTMLDivElement = document.createElement("div");
    div.innerText = "Hello";
    document.querySelector("body")?.appendChild(div);

    const app = new Application();
    app.run();
}

window.addEventListener("load", run);
