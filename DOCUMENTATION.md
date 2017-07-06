## Documentation

You can see below the API reference of this module.

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

