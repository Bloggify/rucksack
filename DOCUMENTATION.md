## Documentation

You can see below the API reference of this module.

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

