
# rucksack

 [![Support me on Patreon][badge_patreon]][patreon] [![Buy me a book][badge_amazon]][amazon] [![PayPal][badge_paypal_donate]][paypal-donations] [![Version](https://img.shields.io/npm/v/rucksack.svg)](https://www.npmjs.com/package/rucksack) [![Downloads](https://img.shields.io/npm/dt/rucksack.svg)](https://www.npmjs.com/package/rucksack)

> JavaScript and CSS bundler.

## :cloud: Installation

```sh
$ npm i --save rucksack
```


## :clipboard: Example



```js
const Rucksack = require("rucksack");


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
```

## :question: Get Help

There are few ways to get help:

 1. Please [post questions on Stack Overflow](https://stackoverflow.com/questions/ask). You can open issues with questions, as long you add a link to your Stack Overflow question.
 2. For bug reports and feature requests, open issues. :bug:
 3. For direct and quick help from me, you can [use Codementor](https://www.codementor.io/johnnyb). :rocket:


## :memo: Documentation


### constructor

Ruckasck
Creates a new instance of `Ruckasck`.

#### Params
- **Object** `opts`: The Rucksack options.

#### Return
- **Object** The Rucksack instance.

### `add(resPath, root)`
Downloads the script from the resource file.

#### Params
- **String** `resPath`: The path of the resource.
- **String** `root`: The file's root path.

### `addJS(resPath, inline)`
Downloads the JS scripts from the resource.

#### Params
- **String** `resPath`: The path of the resource.
- **Boolean** `inline`: Confirms if the resource needs to be downloaded or not.

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

### `bundle()`
Bundles the JS files with the CSS ones.

#### Return
- **Object**

### `toObject()`
Creates an array containing each map to the resources.

#### Return
- **Array** The resources list.

### `cssHtml()`
cssHtml - description
Generates the HTML markup for CSS.

#### Return
- **String** The HTML markup.

### `jsHtml()`
Generates the HTML markup for JS.

#### Return
- **String** The HTML markup.

### `html(resources)`
Loads the HTML script.

#### Params
- **Array** `resources`: The resources list.

#### Return
- **String** The source of the script or stylesheet.



## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].


## :sparkling_heart: Support my projects

I open-source almost everything I can, and I try to reply everyone needing help using these projects. Obviously,
this takes time. You can integrate and use these projects in your applications *for free*! You can even change the source code and redistribute (even resell it).

However, if you get some profit from this or just want to encourage me to continue creating stuff, there are few ways you can do it:

 - Starring and sharing the projects you like :rocket:
 - [![PayPal][badge_paypal]][paypal-donations]—You can make one-time donations via PayPal. I'll probably buy a ~~coffee~~ tea. :tea:
 - [![Support me on Patreon][badge_patreon]][patreon]—Set up a recurring monthly donation and you will get interesting news about what I'm doing (things that I don't share with everyone).
 - **Bitcoin**—You can send me bitcoins at this address (or scanning the code below): `1P9BRsmazNQcuyTxEqveUsnf5CERdq35V6`

    ![](https://i.imgur.com/z6OQI95.png)

Thanks! :heart:


## :dizzy: Where is this library used?
If you are using this library in one of your projects, add it in this list. :sparkles:


 - [`bloggify-prebuilt`](https://github.com/Bloggify/bloggify-prebuilt#readme)—The prebuilt Bloggify version.

## :scroll: License

[MIT][license] © [Ionică Bizău][website]

[badge_patreon]: http://ionicabizau.github.io/badges/patreon.svg
[badge_amazon]: http://ionicabizau.github.io/badges/amazon.svg
[badge_paypal]: http://ionicabizau.github.io/badges/paypal.svg
[badge_paypal_donate]: http://ionicabizau.github.io/badges/paypal_donate.svg
[patreon]: https://www.patreon.com/ionicabizau
[amazon]: http://amzn.eu/hRo9sIZ
[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(http%3A%2F%2Fionicabizau.net)&year=2016#license-mit
[website]: http://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
