import Rucksack from "../lib/index.js"

const __dirname = new URL(".", import.meta.url).pathname;

// Create a new bundler
let bundler = new Rucksack({
    name: "my-app",
    bundle_dir: `${__dirname}/output`,
    bundle_url: "/static",
    input: `${__dirname}/js-and-css-with-assets/main.js`,
    production: true,
    watch: false,
    config: async (existingConfig) => {
        existingConfig.build.rollupOptions.output.format = "es"
        return existingConfig
    }
})

// Add remote url as resource
bundler.add("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js")

bundler.bundle();
// vite v7.3.1 building client environment for production...
// ✓ 3 modules transformed.
// example/output/bg.svg      1.82 kB │ gzip: 0.66 kB
// example/output/my-app.css  0.08 kB │ gzip: 0.09 kB
// example/output/my-app.js   0.12 kB │ gzip: 0.11 kB
// ✓ built in 158ms

console.log(bundler.html())
// <script src="/static/my-app.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js"></script>
// <link rel="stylesheet" href="/static/my-app.css" />

