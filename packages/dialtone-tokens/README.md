# Design Tokens for Dialtone

Design tokens for Dialpad's design system Dialtone and everything related to building and publishing them.

Design tokens are all the defined values that are part of the design system, such as color, spacing, typography, and
more. The goal is to store design tokens as JSON and output and publish them to many different formats (CSS, LESS,
Android, iOS, etc) upon build.

## Usage

To use Dialtone Tokens in your project:

### Web (npm)

#### Install Dependency

```shell
npm install @dialpad/dialtone-tokens
```

#### Import CSS Tokens

```css
@import "node_modules/@dialpad/dialtone-css/css/variables.css";
```

#### Use CSS Token

```css
.my-css-class {
  color: var(--dt-color-purple-200)
}
```

Or

#### Import LESS Tokens

```less
@import "node_modules/@dialpad/dialtone-css/less/variables.less";
```

#### Use LESS Token

```less
.my-css-class {
  color: @dt-color-purple-200
}
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
2. `npm install`
3. `pnpm run build` to build tokens. Built tokens will be output to the dist folder.

- `base.json` Contains tokens exported from figma.
- `tokens/tokens.json` Contains tokens in style dictionary format (generated from `base.json`).
- `dist` Contains tokens in their final output form, in multiple different formats.
