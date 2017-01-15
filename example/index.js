"use strict";

const Rucksack = require("..");


let bundler = new Rucksack();

// Add remote url as resource
//bundler.add("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js");
//bundler.add(`${__dirname}/data/main.js`);
//bundler.add(`${__dirname}/data/another-main.js`);
bundler.add(`${__dirname}/data/bar.css`);
bundler.add(`${__dirname}/data/main.css`);
bundler.addCSS("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/styles/default.min.css", false);
bundler.bundleCSS();
bundler.bundleJS();
