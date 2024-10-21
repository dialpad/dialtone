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

@media (max-width: 480px){
  .sm\:foo {
    .background-color: red;
  }
}

@media (max-width: 640px){
  .md\:foo {
  .background-color: red;
  }
}

@media (max-width: 980px){
  .lg\:foo {
  .background-color: red;
  }
}

@media (max-width: 1264px){
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

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs](https://github.com/postcss/postcss#usage)
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-responsive-variations'),
    require('autoprefixer')
  ]
}
```

**Step 4:** Create the responsive breakpoints and the classes you need and pass it to the plugin argument.

```diff
+const breakpoints = [
+  { prefix: 'sm\\:', mediaQuery: '(max-width: 480px)' },
+  { prefix: 'md\\:', mediaQuery: '(max-width: 640px)' },
+  { prefix: 'lg\\:', mediaQuery: '(max-width: 980px)' },
+  { prefix: 'xl\\:', mediaQuery: '(max-width: 1264px)' },
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
