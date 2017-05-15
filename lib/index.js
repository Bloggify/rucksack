"use strict";

const browserify = require("browserify")
    , watchify = require("watchify-with-cache")
    , streamp = require("streamp")
    , ul = require("ul")
    , os = require("os")
    , abs = require("abs")
    , isRemote = require("url-remote")
    , babelify = require("babelify")
    , es2015 = require("babel-preset-es2015")
    , reactify = require("babel-preset-react")
    , noStrictMode = require("babel-plugin-transform-remove-strict-mode")
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
    , noop = require("noop6")
    , matchAll = require("match-all")
    , lessSyntax = require("postcss-less")
    , forEach = require("iterate-object")
    , escapeRegex = require("regex-escape")
    , through = require("through2")
    , collapse = require("bundle-collapser/plugin")
    ;

module.exports = class Rucksack {

    /**
     * Ruckasck
     * Creates a new instance of `Ruckasck`.
     *
     * @param  {Object} opts The Rucksack options.
     * @return {Object}      The Rucksack instance.
     */
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
          , strictMode: false
          , cssUrlHook: noop
          , processOptions: {
                syntax: lessSyntax
            }
          , aliases: {}
        });

        this._watchingCssFiles = {};
        this.scripts = [
            this.opts.jsUrl
        ];

        this.stylesheets = [
            this.opts.cssUrl
        ];

        this.cssPaths = [];
        this.cssBlacklist = [];

        if (!opts.development) {
            opts.plugins.push(collapse);
        }

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

        const babelPlugins = [];
        if (this.opts.strictMode === false) {
            babelPlugins.push([
                noStrictMode
            ]);
        }

        this.browserify.transform(babelify, {
            global: true,
            babelrc: false,
            presets: [
                reactify
              , es2015
            ],
            plugins: babelPlugins
        });

        const replacements = [];
        forEach(this.opts.aliases, (target, source) => {
            // import ... from "bloggify"
            replacements.push([
                new RegExp(` from ("|')${escapeRegex(source)}("|')`, "g")
              , ` from '${target}'`
            ]);
            // require("bloggify")
            replacements.push([
                new RegExp(`require\\(("|')${escapeRegex(source)}("|')\\)`, "g")
              , `require('${target}')`
            ]);
        });

        // Aliases
        this.browserify.transform(file => {
            return through(function (buf, enc, next) {
                buf = buf.toString("utf8");
                replacements.forEach(([source, target]) => {
                    buf = buf.replace(source, target);
                });
                this.push(buf);
                next();
            });
        });

        if (opts.uglify !== false) {
            this.browserify = this.browserify.transform({
                global: true
            }, uglifyify);
        }

        this.remote = {
            js: []
          , css: []
        };
    }


    /**
     * add
     * Downloads the script from the resource file.
     *
     * @param  {String} resPath The path of the resource.
     * @param  {String} root    The file's root path.
     */
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

    /**
     * addJS
     * Downloads the JS scripts from the resource.
     *
     * @param  {String} resPath The path of the resource.
     * @param  {Boolean} inline Confirms if the resource needs to be downloaded or not.
     */
    addJS (resPath, inline) {
        let pathIsRemote = isRemote(resPath);
        if (pathIsRemote && inline === false) {
            this.cssBlacklist.push(resPath);
        }
        if (pathIsRemote) { return; }
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

    /**
     * _watchCSS
     * Watch the CSS paths.
     *
     * @name _watchCSS
     * @function
     * @param  {String} resPath The CSS resource path.
     */
    _watchCSS (resPath) {
        if (Array.isArray(resPath)) {
            return resPath.forEach(c => this._watchCSS(c));
        }
        resPath = abs(resPath);
        if (this._watchingCssFiles[resPath]) {
            return;
        }
        this._watchingCssFiles[resPath] = watch(resPath, (err, ev) => {
            setTimeout(() => {
                logger.log(`CSS File Updated: ${resPath}`);
                this.bundleCSS();
            }, 60);
        });
    }

    /**
     * addCSS
     * Adds a new CSS path.
     *
     * @name addCSS
     * @function
     * @param {String} resPath The CSS resource path to add.
     * @param {Boolean} inline Whether to add the CSS content inline or not.
     */
    addCSS (resPath, inline) {
        this._watchCSS(resPath);
        this.cssPaths.push(resPath);
    }


    /**
     * bundleJS
     * Bundles the JS files.
     *
     * @param  {String} output   The output of the JS script.
     * @param  {Function} cb     The callback function.
     */
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
            this.browserify.write();
            cb && cb();
        });
    }


    /**
     * bundleCSS
     * Bundles the CSS files.
     *
     * @param  {String} output   The output of the CSS script.
     * @param  {Function} cb     The callback function.
     * @return {String}          The URL of the script.
     */
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
                blacklist: this.cssBlacklist,
                onImport: paths => {
                    this._watchCSS(paths);
                }
            })
          , [postcssUrl, {
                url: (url, decl, from, dirname, to, options, result) => {
                    const newUrl = this.opts.cssUrlHook(url, decl, from, dirname, to, options, result);
                    if (newUrl) {
                        return newUrl;
                    }
                    return url;
                }
            }]
          , autoprefixer
        ];

        if (!this.opts.development) {
            extensions.push(postcssClean);
        }

        extensions.forEach(c => {
            cssBundler = Array.isArray(c) ? cssBundler.use(c[0](c[1])) : cssBundler = cssBundler.use(c);
        });

        logger.log("Bundling the the styles.");
        return cssBundler.process(cssImports, this.opts.processOptions).then(result => {
            output.write(result.css);
            output.on("close", () => {
                cb && cb();
            });
            if (output !== process.stdout) {
                logger.log("Bundling done.");
                output.end();
            }
        }).catch(e => {
            logger.log(e, "error");
            cb && cb(e);
        });
    }


    /**
     * bundle
     * Bundles the JS files with the CSS ones.
     * @return {Object}
     */
    bundle () {
        return new Promise((res, err) => {
            this.bundleJS(null, err => {
                if (err) { return rej(err); }
                this.bundleCSS(null, err => {
                    if (err) { return rej(err); }
                    res();
                });
            });
        });
    }


    /**
     * toObject
     * Creates an array containing each map to the resources.
     *
     * @return {Array}  The resources list.
     */
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


    /**
     * cssHtml - description
     * Generates the HTML markup for CSS.
     * @return {String} The HTML markup.
     */
    cssHtml() {
        return this.html(this.toObject().filter(c => c.type === "stylesheet"));
    }


    /**
     * jsHtml
     * Generates the HTML markup for JS.
     * @return {String} The HTML markup.
     */
    jsHtml() {
        return this.html(this.toObject().filter(c => c.type === "script"));
    }


    /**
     * html
     * Loads the HTML script.
     *
     * @param  {Array} resources The resources list.
     * @return {String}          The source of the script or stylesheet.
     */
    html (resources) {
        resources = resources || this.toObject();
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
