import { build } from "vite"
import RucksackLite from "rucksack-lite"
import path from "path"

export default class Rucksack extends RucksackLite {

    /**
     * Creates a new instance of `Rucksack`.
     *
     * @name Rucksack
     * @function
     * @param  {Object} options The options object:
     * 
     *   - `name` (String): The bundle name.
     *   - `bundle_dir` (String): The bundle directory.
     *   - `bundle_url` (String): The bundle URL.
     *   - `input` (String): The input file.
     *   - `aliases` (Object): A map of aliases for module resolution.
     *   - `production` (Boolean): Whether to bundle for production.
     *   - `watch` (Boolean): Whether to watch files for changes.
     * 
     * @return {Object} The Rucksack instance containing:
     * 
     *   - `options` (Object): The options object.
     *   - `bundle_paths` (Object): The bundle paths:
     *     - `js` (String): The JS bundle path.
     *     - `css` (String): The CSS bundle path.
     *   - `bundle_urls` (Object): The bundle URLs:
     *     - `js` (String): The JS bundle URL.
     *     - `css` (String): The CSS bundle URL.
     *   - `local` (Object): The local resources collection.
     *     - `js` (Array): The JS resources.
     *     - `css` (Array): The CSS resources.
     *   - `remote` (Object): The remote resources collection.
     *     - `js` (Array): The JS resources.
     *     - `css` (Array): The CSS resources.
     *   - `markup` (Object): The cached HTML markup:
     *     - `js` (String): The JS HTML markup.
     *     - `css` (String): The CSS HTML markup.
     *     - `all` (String): The combined HTML markup.
     */
    constructor(options = {}) {
        options.aliases = options.aliases || {}
        super(options)
    }

    /**
     * bundleJS
     * Bundles JavaScript files using Vite.
     * 
     * @name bundleJS
     * @function
     * @returns {Promise} A promise that resolves when the JavaScript bundling is complete.
     */
    async bundleJS() {
        const buildOptions = {
            mode: this.options.production ? "production" : "development",
            base: this.options.bundle_url || '',
            build: {
                write: true,
                outDir: this.options.bundle_dir,
                assetsDir: "",
                assetsInlineLimit: 0,
                cssCodeSplit: false,
                emptyOutDir: false,
                rollupOptions: {
                    input: this.options.input,
                    output: {
                        entryFileNames: path.basename(this.bundle_paths.js),
                        chunkFileNames: '[name].js',
                        assetFileNames: (assetInfo) => {
                            const ext = path.extname(assetInfo && assetInfo.name ? assetInfo.name : '')
                            if (ext === '.css') {
                                return path.basename(this.bundle_paths.css)
                            }
                            return '[name][extname]'
                        },
                        format: 'iife',
                    }
                },
                minify: this.options.production ? "terser" : false
            },
            resolve: {
                alias: Object.entries(this.options.aliases).map(([find, replacement]) => ({
                    find,
                    replacement: path.resolve(replacement)
                }))
            }
        }

        if (this.options.watch) {
            buildOptions.build.watch = {}
            const watcher = await build(buildOptions)
            return watcher
        }

        return await build(buildOptions)
    }

    async bundleCSS() {
        // CSS Bundling is done in bundleJs, with Vite
    }
}
