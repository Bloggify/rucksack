## Documentation

You can see below the API reference of this module.

### `Rucksack(options)`
Creates a new instance of `Rucksack`.

#### Params

- **Object** `options`: The options object:
  - `name` (String): The bundle name.
  - `bundle_dir` (String): The bundle directory.
  - `bundle_url` (String): The bundle URL.
  - `input` (String): The input file.
  - `aliases` (Object): A map of aliases for module resolution.
  - `production` (Boolean): Whether to bundle for production.
  - `watch` (Boolean): Whether to watch files for changes.

#### Return
- **Object** The Rucksack instance containing:
  - `options` (Object): The options object.
  - `bundle_paths` (Object): The bundle paths:
    - `js` (String): The JS bundle path.
    - `css` (String): The CSS bundle path.
  - `bundle_urls` (Object): The bundle URLs:
    - `js` (String): The JS bundle URL.
    - `css` (String): The CSS bundle URL.
  - `local` (Object): The local resources collection.
    - `js` (Array): The JS resources.
    - `css` (Array): The CSS resources.
  - `remote` (Object): The remote resources collection.
    - `js` (Array): The JS resources.
    - `css` (Array): The CSS resources.
  - `markup` (Object): The cached HTML markup:
    - `js` (String): The JS HTML markup.
    - `css` (String): The CSS HTML markup.
    - `all` (String): The combined HTML markup.

### `bundleJS()`
Bundles JavaScript files using Vite.

#### Return
- **Promise** A promise that resolves when the JavaScript bundling is complete.

