# Design Tokens for Dialtone

## This repository is in development and NOT currently ready for use.

Design tokens for Dialpad's design system Dialtone and everything related to building and publishing them.

Design tokens are all the defined values that are part of the design system, such as color, spacing, typography and more. The goal is to store design tokens as JSON and output and publish them to many different formats (CSS, LESS, Android, iOS, etc) upon build.

### Usage

To use Dialtone Tokens in your project:

```
npm install @dialpad/dialtone-tokens
```

#### CSS

```
@import "node_modules/@dialpad/dialtone/css/variables.css";
```

#### LESS

```
@import "node_modules/@dialpad/dialtone/less/variables.less";
```

#### iOS (swift)

```
TBD
```

#### Android

```
TBD
```


### Quick Start for Contributors

1. clone repo
2. `npm install`
3. `npm run build` to build tokens. Built tokens will be output to the dist folder.

- `base.json` Contains tokens exported from figma.
- `tokens/tokens.json` Contains tokens in style dictionary format (generated from `base.json`).
- `dist` Contains tokens in their final output form, in multiple different formats.
