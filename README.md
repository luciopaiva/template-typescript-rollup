
# Typescript+Rollup application template

This is a keep-it-simple template for writing TypeScript that can run as both web and CLI apps using Rollup as a bundler and browser-sync to help with development.

Beware that this is not ready for production. It is intended as a working ground for proof-of-concept projects. For example, .ts files will be copied to the destination folder during the build phase to help when debugging on the browser. 

The project also supports unit testing and code coverage. Debugging works well in WebStorm.

It deploys with pixi.js and d3.js support, but they're there really as an example of how to include third-party libraries. Of course, they may be of use if you intend to work with any kind of visualization.

This template was tested on macOS Catalina, Windows 10, and Windows 10 via WSL2. It works fine on mac and Windows, and partially fine on WSL2. For WSL2 users, please read the troubleshooting section below. Should run with no problems on Linux as well.

## How to use it?

Start by cloning this repository:

    git clone git@github.com:luciopaiva/template-typescript-rollup.git your-project-name
    cd your-project-name
    git remote remove origin
    git remote add origin <your origin>
    git push origin master -u

Then use [nvm](https://github.com/nvm-sh/nvm) to select the correct Node.js version (optional, but highly recommended as this project is not frequently built on other Node.js versions) and npm to install dependencies:

    nvm i
    npm i

After the initial environment is set up, use Rollup to build your project and watch for changes:

    npm run rollup

This will also start serving the resulting browser application at http://localhost:10001. Changes made to the code will reflect in the browser automatically refreshing.

To run the bundled CLI app, simply do `node dist/node/cli` or right-click it in WebStorm and select Run or Debug.

### Config files

- `package.json`: the usual npm configuration file. Change `name` and `description` accordingly. Make sure `repository.url`, `bugs.url` and `homepage` point to your repo. The `author` should also be changed.

- `tsconfig.json`: this is the TypeScript configuration file. You should have no problems using it as it is. It is configured to dump the transpiled output to `./dist`. The browser bundle will be available at `./webapp/js/bundle.js` (which can be accessed at http://localhost:10001), and the CLI bundle at `./dist/node/cli.js`.

- `rollup.config.js`: this is the Rollup configuration file. It is configured to take the TypeScript files in `./src`, transpile them and produce three bundles: two for web (regular and minified) and one for Node.js. The minified one uses the Terser plugin to do the actual minification. External libraries that you do not want to include in the final web bundle must be explicitly informed in the `external` property. Not adding certain libraries to the bundle is a good option when they are already minified, because it's easier for the browser to cache them if they are not part of the same bundle as your app. Just remember to include them via `script` HTML tags.

### Testing and code coverage

Simply run:

    npm test

The `./coverage` folder will have detailed info on coverage.

The test command uses Mocha in combination with ts-node to run the unit tests. The `module` property in tsconfig.json is overridden in the command line so TypeScript outputs Node.js module code instead (following a suggestion [here](https://stackoverflow.com/a/64896966/778272)).

To run tests and code coverage in Webstorm, create a new run configuration for Mocha, make sure it points to the Mocha inside this project's node modules folder and paste the following in the Extra Mocha options field:

    --require ts-node/register --recursive 'test/**/*.ts'

Also set the Environment Variables field with this:

    TS_NODE_COMPILER_OPTIONS={"module":"commonjs"}

These are the exact arguments passed to Mocha in the `npm test` command in `package.json`. The only difference here is that Webstorm does not use `c8`, but `nyc` instead. It will run just fine, though, since `nyc` is already added as a dependency here.

Finally, select "All in directory" and pass the tests folder. Try running to confirm that it works. "Run with coverage" should work just fine too.

But... failing tests will not produce useful stack traces. Not exactly sure why, but it must be nyc's fault since c8 works fine. Normal stack trace lines have a file name followed by line number and column number, but the stack traces produced come with nonsensical numbers.

So right now the best option seems to be running `npm test` to be able to find the exact line where it failed.

#### WSL2

WSL2 users may have problems to debug code via WebStorm. I tried debugging unit tests, but WebStorm just halts at the following message and nothing else happens:

    Debugger listening on ws://127.0.0.1:36935/bd95006d-0336-4898-bbac-3abc18d6e48b

This looks like a firewall problem, but I don't know how to fix this. I can see a few people complaining about this problem on the Jetbrains forums, but no clear way on how to solve it.

What I ended up doing was to install [nvm for Windows](https://github.com/coreybutler/nvm-windows/releases) and clone the project directly via Windows to get WSL2 out of the equation.

## How was this template constructed?

I started with nvm to install the latest Node.js version:

    nvm install stable

Then I created a default npm package:

    npm init -y

Here's a list of dependencies and where they are needed:

- rollup: used to bundle the TypeScript code (more below)
- browser-sync: used to reload the page automatically during development.
- @rollup-plugin/typescript: this is used so Rollup can take TypeScript directly and transpile it itself
- tslib: needed by @rollup-plugin/typescript
- rollup-plugin-copy: Rollup plugin used to copy dependencies from the node_modules folder to the destination folder
- rollup-plugin-terser: this plugin is used to minify the code that goes to the browser
- ts-node: CLI to run TypeScript directly, without transpiling to disk first (used for tests, but can also be used to run the code directly from the terminal as well)
- cross-env: to be able to pass env arguments in npm run commands that are cross-platform (used in `test` command)
- mocha: unit test library 
- c8: used for code coverage
- nyc: for code coverage in WebStorm
- @types/mocha: the TypeScript definitions for Mocha

## Why use a bundler?

Ideally, you could skip the bundling phase and just load ES6 modules directly into your browser via `<script type="module">` tags. Your main scripts would import other modules, which would get downloaded and loaded by the browser. You'd just set `target` and `module` to `es6` in `tsconfig.json` and things would just work in modern browsers.

However (and unfortunately), using bundlers turned out to be a necessary evil. There are few reasons why.

### Using third-party libraries

Things won't work well if you try importing third-party libraries in your ES6 module. Let's take as example the pixi.js library:

    import * as PIXI from "pixi.js";

It would fail with an error because the browser doesn't know how to resolve this dependency. Including the PIXI library manually in the HTML will not work. The browser will just complain about:

    Uncaught TypeError: Failed to resolve module specifier "pixi.js". Relative references must start with either "/", "./", or "../".

This [article](http://dplatz.de/blog/2019/es6-bare-imports.html) talks about the problem and tries different solutions (the least intrusive one seeming to be pika, but I haven't tried it). Seems the author ends up using Webpack.

### Efficiently loading the page

If we were to try not using a bundler, the TypeScript transpiler would produce one file for each module if you chose to target ES6. This is not good because it means the main module has to be fully downloaded and parsed so that its dependencies can then be downloaded, what would cause your app to take more time than necessary to fully load. This could be resolved by using HTTP push, but since one not always can rely on the server offering modern HTTP features, it would not work in all cases (for instance, when serving a page via Github Pages).

I wouldn't mind targeting an older JavaScript version if TypeScript was able to turn ES6 modules into IIFEs or something, but I it can't and they are [not willing to do it](https://github.com/microsoft/TypeScript/issues/32463) - the OP mentions using Rollup after tsc, which can be interesting (more on the Rollup section below).

### Minification

Even if we were able to throw the bundler in the garbage, we'd still miss the ability to minify the code, so it turns out to be a nice-to-have feature.

### But why Rollup?

No strong reason. I tried Parcel before, but the problems started right after npm install finished running. npm complained about two potentially dangerous dependencies. I tried letting npm fix them, but then it ended up finding another group of dangerous dependencies. Trying to resolve those returned me back to the original two, so I just gave up.

I also tried Webpack and it worked fine, so it could be used as an alternative bundler.

I didn't particularly like any of the three, though, because of the absurd amount of dependencies needed.

Rollup was really easy to use, though. For instance, this is one of the commands I tried at the very beginning:

    npx rollup dist/index.js --file dist/bundle.js --format iife

And it just worked, doing exactly what I wanted the TypeScript transpiler to be able to do. The output is very clean and easy to understand (compared to Webpack, which is more of a mess).

For future reference, this [project](https://github.com/FlorianRappl/bundler-comparison) compares several bundlers.
