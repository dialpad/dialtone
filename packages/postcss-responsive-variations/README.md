# postcss-responsive-variations

[PostCSS](https://github.com/postcss/postcss) plugin for creating responsive variations from a list of classes.

```css
/* Input example */
.foo {
    .background-color: red;
}
```

```css
/* Output example */
.foo {
  .background-color: red;
}

@media (min-width: 480px){
  .sm\:foo {
    .background-color: red;
  }
}

@media (min-width: 640px){
  .md\:foo {
  .background-color: red;
  }
}

@media (min-width: 980px){
  .lg\:foo {
  .background-color: red;
  }
}

@media (min-width: 1264px){
  .xl\:foo {
  .background-color: red;
  }
}
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss @dialpad/postcss-responsive-variations
```

**Step 2:** Check you project for existing PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to the [official docs](https://github.com/postcss/postcss#usage)
and set this plugin in settings.

**Step 3:** Add the plugin to the plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-responsive-variations'),
    require('autoprefixer')
  ]
}
```

**Step 4:** Create the responsive breakpoints and the classes you need and pass it to the plugin argument. Note: if you don't pass the breakpoints, the plugin will use the default ones, which are the ones shown in this example.

```diff
+const breakpoints = [
+  { prefix: 'sm\\:', mediaQuery: '(min-width: 480px)' },
+  { prefix: 'md\\:', mediaQuery: '(min-width: 640px)' },
+  { prefix: 'lg\\:', mediaQuery: '(min-width: 980px)' },
+  { prefix: 'xl\\:', mediaQuery: '(min-width: 1264px)' },
+];

+const classes = [
+ '.foo',
+ /\.bar-*/
+];

module.exports = {
  plugins: [
+   require('postcss-responsive-variations')({breakpoints, classes}),
    require('autoprefixer')
  ]
}
```
