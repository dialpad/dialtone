# Design Tokens for Dialtone

Design tokens for Dialpad's design system Dialtone and everything related to building and publishing them.

Design tokens are all the defined values that are part of the design system, such as color, spacing, typography, and
more. The goal is to store design tokens as JSON and output and publish them to many different formats (CSS, LESS,
Android, iOS, etc.) upon build.

## Usage

To use Dialtone Tokens in your project:

### Web (npm)

#### Install Dependency

```shell
npm install @dialpad/dialtone-tokens
```

#### Import CSS Tokens

```css
@import "@dialpad/dialtone-tokens/dist/tokens-base-light.css"; // Light variables
@import "@dialpad/dialtone-tokens/dist/tokens-base-dark.css";  // Dark variables
```

dialtone-tokens provides a postcss plugin that you can use to convert all tokens using rem to px. This could be useful if you are using dialtone in an embedded situation where you don't have control over the root font size.

You can reference this script from:

- @dialpad/dialtone-tokens package: `@dialpad/dialtone-tokens/dist/postcss/rem-to-px.js`
- @dialpad/dialtone package: `@dialpad/dialtone/tokens/postcss/rem-to-px.js`

To use this script you will have to run it as part of your build process on the tokens files you are importing. There are various ways to run postcss as part of your build process, please see the documentation here: <https://github.com/postcss/postcss?tab=readme-ov-file#usage>

#### Use CSS Token

```css
.my-css-class {
  color: var(--dt-color-purple-200)
}
```

Or

#### Import LESS Tokens

```less
@import "@dialpad/dialtone-tokens/dist/less/tokens-base-light.less"; // Light variables
@import "@dialpad/dialtone-tokens/dist/less/tokens-base-dark.less";  // Dark variables
```

#### Use LESS Token

```less
.my-css-class {
  color: @dt-color-purple-200
}
```

#### Import JSON

```js
import "@dialpad/dialtone-tokens/dist/tokens-base-light.json" // Light tokens
import "@dialpad/dialtone-tokens/dist/tokens-base-dark.json" // Dark tokens
```

### iOS (swift)

1. Within your XCode project `File > Swift Packages > Add Package Dependency`
2. Enter repository url: `https://github.com/dialpad/dialtone-tokens-swift`

### Android (compose/xml)

#### pom.xml

```xml
<dependency>
  <groupId>design.dialpad.tokens</groupId>
  <artifactId>dialtone-tokens</artifactId>
  <version>1.2.0</version>
</dependency>
```

#### Install Dependency

```shell
mvn install
```

<!-- #### Import Compose Tokens

```
import design.dialpad.DialtoneTokens;
```

#### Use Compose Token

```
DialtoneTokens.dtColorPurple200
``` -->

## Quick Start for Contributors

1. clone repo
2. `pnpm install`
3. `nx build dialtone-tokens` to build tokens. Built tokens will be output to the dist folder.

- `base.json` Contains tokens exported from figma.
- `tokens/tokens.json` Contains tokens in style dictionary format (generated from `base.json`).
- `dist` Contains tokens in their final output form, in multiple different formats.
