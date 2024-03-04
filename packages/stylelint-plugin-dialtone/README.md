# stylelint-plugin-dialtone

Dialtone StyleLint plugin containing rules to help developers maintain dialtone recommended practices for CSS.

## Installation

You'll first need to install [stylelint](https://stylelint.io/) into your project:

```sh
npm install -D stylelint
```

Next, install `@dialpad/stylelint-plugin-dialtone`:

```sh
npm install -D @dialpad/stylelint-plugin-dialtone
```

## Usage

Add `@dialpad/stylelint-plugin-dialtone` to the plugins array in your stylelint.config file.

```json
{
  "plugins": ["@dialpad/stylelint-plugin-dialtone"],
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "@dialpad/stylelint-plugin-dialtone/no-mixins": true
  }
}
```
