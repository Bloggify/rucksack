"use strict";

const browserify = require("browserify")
    , watchify = require("watchify-with-cache")
    , streamp = require("streamp")
    , ul = require("ul")
    , os = require("os")
    , isRemote = require("url-remote")
    , babelify = require("babelify")
    , es2015 = require("babel-preset-es2015")
    , reactify = require("babel-preset-react")
    , uglifyify = require("uglifyify")
    , CleanCSS = require("clean-css")
    , postcss = require("postcss")
    , watch = require("fwatcher")
    , logger = require("bug-killer")
    , typpy = require("typpy")
    , parseUrl = require("parse-url")
    , atImport = require("postcss-import")
    , postcssUrl = require("postcss-url")
    , autoprefixer = require("autoprefixer")
    , postcssClean = require("postcss-clean")
    , idy = require("idy")
    ;

module.exports = class Rucksack {

    constructor (opts) {
        opts = this.opts = ul.merge(opts, {
            jsOutput: process.stdout
          , cssOutput: process.stdout
          , jsUrl: ""
          , cssUrl: ""
          , development: false
          , browserifyCache: {}
          , browserifyPackageCache: {}
          , plugins: []
          , cacheFile: ".rucksack-cache.json"
        });

        this.scripts = [
            this.opts.jsUrl
        ];


        this.stylesheets = [
            this.opts.cssUrl
        ];

        this.cssPaths = [];
        this.cssBlacklist = [];

        this.browserify = browserify({
            debug: opts.development
          , packageCache: opts.browserifyPackageCache
          , plugin: opts.plugins
          , cache: opts.cacheFile ? watchify.getCache(opts.cacheFile) : {}
          , packageCache: {}
          , fullPaths: false,
        });

        opts.cacheFile = opts.cacheFile || `${os.tmpdir()}/${idy()}`
        if (opts.cacheFile) {
            this.browserify = watchify(this.browserify, {
                watch: opts.development
              , cacheFile: opts.cacheFile
            });
        }

        if (opts.development) {
            this.browserify.on("update", () => {
                this.bundleJS();
            });
        }

        if (opts.development) {
            opts.babelify = false;
            opts.uglify = false;
        }

        this.browserify.transform(babelify, {
            global: true,
            babelrc: false,
            presets: [reactify, es2015]
        });

        if (opts.uglify !== false) {
            this.browserify.transform({
                global: true
            }, uglifyify);
        }

        this.remote = {
            js: []
          , css: []
        };
    }

    add (resPath, root) {

        let type = "";
        if (typpy(resPath, Object)) {
            if (resPath.type) {
                type = resPath.type;
                resPath = resPath.url;
            } else {
                this.add(resPath.styles, root);
                this.add(resPath.scripts, root);
                return;
            }
        } else if (typpy(resPath, Array)) {
            resPath.forEach(c => this.add(c, root));
            return;
        } else if (!typpy(resPath, String)) {
            return;
        }

        if (!isRemote(resPath) && typpy(root, String)) {
            resPath = root + "/" + resPath;
        }

        if (!type) {
            if (resPath.endsWith(".js")) {
                type = "js";
            } else if (resPath.endsWith(".css")) {
                type = "css";
            }
        }

        switch (type) {
            case "js":
                this.addJS(resPath);
                break;
            case "css":
                this.addCSS(resPath);
                break;
            default:
                throw new Error("Unknown resource type.");
                break;
        }
    }

    addJS (resPath, inline) {
        if (isRemote(resPath)) {
            if (inline === true) {
                this.remote.js.push(resPath);
            } else {
                this.scripts.push(resPath);
            }
        } else {
            this.browserify.add(resPath);
        }
    }

    addCSS (resPath, inline) {
        let pathIsRemote = isRemote(resPath);

        if (pathIsRemote && inline === false) {
            this.cssBlacklist.push(resPath);
        }

        if (!pathIsRemote && this.opts.development) {
            watch(resPath, (err, ev) => {
                setTimeout(() => {
                    this.bundleCSS();
                }, 100);
            });
        }

        this.cssPaths.push(resPath);
    }

    bundleJS (output, cb) {
        output = output || this.opts.jsOutput;
        let bundling = this.browserify.bundle({
            debug: this.opts.development
        });
        if (!bundling) {
            return cb();
        }
        if (typeof output === "string") {
            output = new streamp.writable(output);
        }
        bundling.on("error", e => logger.log(e));
        bundling.pipe(output);
        bundling.on("end", () => {
            debugger
            this.browserify.write();
        });
        cb && bundling.on("end", cb);
    }

    bundleCSS (output, cb) {
        output = output || this.opts.cssOutput;
        if (typeof output === "string") {
            output = new streamp.writable(output);
        }

        let cssImports = this.cssPaths.map(c => `@import url('${c}');`).join("\n");
        let cssBundler = postcss();

        let extensions = [
            atImport({
                root: "/",
                blacklist: this.cssBlacklist
            })
          , postcssUrl
          , autoprefixer
        ];

        if (!this.opts.development) {
            extensions.push(postcssClean);
        }

        extensions.forEach(c => {
            cssBundler = cssBundler.use(c);
        });

        return cssBundler.process(cssImports).then(result => {
            output.write(result.css);
            if (output !== process.stdout) {
                output.end();
            }
            cb();
        }).catch(e => {
            logger.log(e, "error");
            cb(e);
        });
    }

    bundle () {
        return new Promise(res => {
            this.bundleJS(null, () => {
                this.bundleCSS(null, () => {
                    res();
                });
            });
        });
    }

    toObject () {
        let resources = [];
        resources.push.apply(resources, this.scripts.map(c => ({
            type: "script"
          , url: c
        })));
        resources.push.apply(resources, this.stylesheets.map(c => ({
            type: "stylesheet"
          , url: c
        })));
        return resources;
    }

    html () {
        let resources = this.toObject();
        return resources.map(c => {
            switch (c.type) {
                case "script":
                    return `<script src="${c.url}"></script>`;
                case "stylesheet":
                    return `<link rel="stylesheet" href="${c.url}" />`
                default:
                    throw new Error("Invalid resource type.");
            }
        }).join("\n")
    }
};
