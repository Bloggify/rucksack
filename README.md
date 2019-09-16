













![rucksack](http://i.imgur.com/hSPcrjC.png)




# rucksack

JavaScript and CSS bundler.




## Installation

```sh
$ npm i rucksack
```









## Example






```js
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

bundler.bundleCSS()
// => info  [Tuesday, November 28, 2017 06:53:48 AM] Bundling  the styles.
// => warn  [Tuesday, November 28, 2017 06:53:48 AM] Skipping remote @import of "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/styles/default.min.css" as resource is not allowed.
// => @import url(https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/styles/default.min.css);strong{color:#000}strong{color:#ff0}body{background:#fff;-webkit-transform:translate(10px);transform:translate(10px)}

bundler.bundleJS()
// => info  [Tuesday, November 28, 2017 06:53:48 AM] Bundling  the scripts.
// => (function e(t,n,r){...})

```






## Documentation





### constructor

Ruckasck
Creates a new instance of `Ruckasck`.

#### Params
- **Object** `opts`: The Rucksack options.

#### Return
- **Object** The Rucksack instance.

### `_watchCSS(resPath)`
Watch the CSS paths.

#### Params
- **String** `resPath`: The CSS resource path.

### `addCSS(resPath, inline)`
Adds a new CSS path.

#### Params
- **String** `resPath`: The CSS resource path to add.
- **Boolean** `inline`: Whether to add the CSS content inline or not.

### `bundleJS(output, cb)`
Bundles the JS files.

#### Params
- **String** `output`: The output of the JS script.
- **Function** `cb`: The callback function.

### `bundleCSS(output, cb)`
Bundles the CSS files.

#### Params
- **String** `output`: The output of the CSS script.
- **Function** `cb`: The callback function.

#### Return
- **String** The URL of the script.






## How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].



## License
See the [LICENSE][license] file.


[license]: /LICENSE
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
