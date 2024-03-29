"use strict"

const browserify = require("browserify")
    , watchify = require("watchify-cache")
    , streamp = require("streamp")
    , ul = require("ul")
    , os = require("os")
    , abs = require("abs")
    , isRemote = require("url-remote")
    , babelify = require("babelify")
    , presetEnv = require("@babel/preset-env")
    , reactify = require("babel-preset-react")
    , noStrictMode = require("babel-plugin-transform-remove-strict-mode")
    , transformRuntime = require("@babel/plugin-transform-runtime")
    , uglifyify = require("uglifyify")
    , CleanCSS = require("clean-css")
    , postcss = require("postcss")
    , watch = require("fwatcher")
    , logger = require("cute-logger")
    , atImport = require("postcss-import")
    , postcssUrl = require("postcss-url")
    , cssNano = require("cssnano")
    , idy = require("idy")
    , noop = require("noop6")
    , matchAll = require("match-all")
    , forEach = require("iterate-object")
    , escapeRegex = require("regex-escape")
    , through = require("through2")
    , collapse = require("bundle-collapser/plugin")
    , cssPreset = require("postcss-preset-env")
    , cssnextVariables = require("postcss-css-variables")
    , path = require("path")
    , RucksackLite = require("rucksack-lite")

module.exports = class Rucksack extends RucksackLite {

    /**
     * Ruckasck
     * Creates a new instance of `Ruckasck`.
     *
     * @param  {Object} opts The Rucksack options.
     * @return {Object}      The Rucksack instance.
     */
    constructor (opts) {
        super(opts)
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
          , aliases: {}
        })

        opts.cssExtensions = ul.merge(opts.cssExtensions, {
            atImport: true
          , postcssUrl: true
          , cssPreset: true
          , cssnextVariables: true
        })

        this._watchingCssFiles = {}
        this.cssBlacklist = []

        if (!opts.development) {
            opts.plugins.push(collapse)
        }

        this.browserify = browserify({
            debug: opts.development
          , packageCache: opts.browserifyPackageCache
          , plugin: opts.plugins
          , cache: opts.cacheFile ? watchify.getCache(opts.cacheFile) : {}
          , packageCache: {}
          , fullPaths: false,
        })

        opts.cacheFile = opts.cacheFile || `${os.tmpdir()}/${idy()}`
        if (opts.cacheFile) {
            this.browserify = watchify(this.browserify, {
                watch: opts.development
              , cacheFile: opts.cacheFile
            })
        }

        if (opts.development) {
            this.browserify.on("update", () => {
                this.bundleJS()
            })
        }

        if (opts.development) {
            opts.babelify = false
            opts.uglify = false
        }

        const babelPlugins = []
        babelPlugins.push(transformRuntime.default)
        if (this.opts.strictMode === false) {
            babelPlugins.push([
                noStrictMode
            ])
        }


        this.browserify.transform(babelify, {
            global: true,
            babelrc: false,
            presets: [
                reactify
              , presetEnv
            ],
            plugins: babelPlugins
        })

        const replacements = []
        forEach(this.opts.aliases, (target, source) => {
	    target = path.normalize(target)
	    if (path.sep === "\\"){
		target = target.replace(/\\/g, "\\\\")
		}
            // import ... from "bloggify"
            replacements.push([
                new RegExp(` from ("|')${escapeRegex(source)}("|')`, "g")
              , ` from '${target}'`
            ])
            // require("bloggify")
            replacements.push([
                new RegExp(`require\\(("|')${escapeRegex(source)}("|')\\)`, "g")
              , `require('${target}')`
            ])
        })

        // Aliases
        this.browserify.transform({ global: true }, file => {
            return through(function (buf, enc, next) {
                buf = buf.toString("utf8")
                replacements.forEach(([source, target]) => {
                    buf = buf.replace(source, target)
                })
                this.push(buf)
                next()
            })
        })

        if (opts.uglify !== false) {
            this.browserify = this.browserify.transform({
                global: true
            }, uglifyify)
        }

        this.remote = {
            js: []
          , css: []
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
            return resPath.forEach(c => this._watchCSS(c))
        }
        resPath = abs(resPath)
        if (this._watchingCssFiles[resPath]) {
            return
        }
        this._watchingCssFiles[resPath] = watch(resPath, (err, ev) => {
            setTimeout(() => {
                logger.log(`CSS File Updated: ${resPath}`)
                this.bundleCSS()
            }, 60)
        })
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
        super.addCSS(resPath, inline)
        this._watchCSS(resPath)
    }


    /**
     * bundleJS
     * Bundles the JS files.
     *
     * @param  {String} output   The output of the JS script.
     * @param  {Function} cb     The callback function.
     */
    bundleJS (output, cb) {
        let maybeOutputFileName = output = output || this.opts.jsOutput
        if (typeof maybeOutputFileName === "string") {
            maybeOutputFileName = path.basename(maybeOutputFileName)
        } else {
            maybeOutputFileName = ""
        }

        let bundling = this.browserify.bundle({
            debug: this.opts.development
        })

        if (!bundling) {
            return cb && cb()
        }
        if (typeof output === "string") {
            output = new streamp.writable({ path: output, flags: "w" })
        }
        logger.log(`Bundling ${maybeOutputFileName ? maybeOutputFileName : " the scripts."}`)
        bundling.on("error", e => {
            if (!cb) {
                if (e.codeFrame) {
                    logger.log(`${e.message}\n${e.codeFrame}`, "error")
                } else {
                    logger.log(e, "error")
                    console.error(e.stack)
                }
            }
            cb && cb(e)
        })
        bundling.pipe(output)
        bundling.on("end", () => {
            if (maybeOutputFileName) {
                logger.log(`Bundled: ${maybeOutputFileName}`)
            }
            this.browserify.write()
            cb && cb()
        })
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
        let maybeOutputFileName = output = output || this.opts.cssOutput
        if (typeof output === "string") {
            output = new streamp.writable({ path: output, flags: "w" })
        }

        if (typeof maybeOutputFileName === "string") {
            maybeOutputFileName = path.basename(maybeOutputFileName)
        } else {
            maybeOutputFileName = ""
        }

        let cssImports = this.cssPaths.map(function (c) {
            return `@import url('${c}');`
        }).join("\n")

        let cssBundler = postcss()

        let extensions = [
            this.opts.cssExtensions.atImport && atImport({
                root: "/",
                blacklist: this.cssBlacklist,
                onImport: paths => {
                    this._watchCSS(paths)
                }
            })
          , this.opts.cssExtensions.postcssUrl && [postcssUrl, {
                url: (url, decl, from, dirname, to, options, result) => {
                    const newUrl = this.opts.cssUrlHook(url, decl, from, dirname, to, options, result)
                    if (newUrl) {
                        return newUrl
                    }
                    return url
                }
            }]
          , this.opts.cssExtensions.cssPreset && cssPreset({ stage: 0 })
          , this.opts.cssExtensions.cssnextVariables && cssnextVariables({
                features: {
                    customProperties: false
                }
            })
        ].filter(Boolean)

        if (!this.opts.development) {
            extensions.push([cssNano, { preset: "default" }])
        }

        extensions.forEach(c => {
            cssBundler = Array.isArray(c)
                       ? cssBundler.use(c[0](c[1]))
                       : cssBundler = cssBundler.use(c)
        })

        logger.log(`Bundling ${maybeOutputFileName ? maybeOutputFileName : " the styles."}`)
        return cssBundler.process(cssImports).then(result => {
            const messages = result.messages.map(c => ({
                message: c.text
              , type: c.type === "warning" ? "warn" : c.type
            }))
            messages.forEach(c => {
                if (c.message) {
                    logger.log(c.message, c.type)
                }
            })
            output.write(result.css)
            output.on("close", () => {
                cb && cb()
            })
            if (output !== process.stdout) {
                if (maybeOutputFileName) {
                    logger.log(`Bundled: ${maybeOutputFileName}`)
                }
                output.end()
            }
        }).catch(e => {
            logger.log(e, "error")
            cb && cb(e)
        })
    }
}
