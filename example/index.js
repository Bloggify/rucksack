"use strict"

const Rucksack = require("..")


// Create a new bundler
let bundler = new Rucksack()

// Add remote url as resource
bundler.add("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js")
bundler.add(`${__dirname}/data/main.js`)
bundler.add(`${__dirname}/data/another-main.js`)
bundler.add(`${__dirname}/data/bar.css`)
bundler.add(`${__dirname}/data/main.css`)
bundler.add("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/styles/default.min.css")

//bundler.bundleCSS()
// => info  [Tuesday, November 28, 2017 06:53:48 AM] Bundling  the styles.
// => warn  [Tuesday, November 28, 2017 06:53:48 AM] Skipping remote @import of "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/styles/default.min.css" as resource is not allowed.
// => @import url(https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/styles/default.min.css);strong{color:#000}strong{color:#ff0}body{background:#fff;-webkit-transform:translate(10px);transform:translate(10px)}

bundler.bundleJS()
// => info  [Tuesday, November 28, 2017 06:53:48 AM] Bundling  the scripts.
// => (function e(t,n,r){...})
