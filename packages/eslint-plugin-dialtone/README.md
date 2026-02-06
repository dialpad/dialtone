# eslint-plugin-dialtone

Dialtone ESLint plugin containing rules to help developers maintain dialtone recommended practices.

## Adding a new rule

We use [yeoman generator](https://github.com/eslint/generator-eslint) to generate new rules.

First, install it globally:

```shell
pnpm add -g yo generator-eslint mem-fs
```

Then, run the command below and follow the steps.

```shell
yo eslint:rule
```

### Writing rules

You can try the code you're trying to detect here: [AST Explorer](https://astexplorer.net/)
to know which function you need to call inside `create` function.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `@dialpad/eslint-plugin-dialtone`:

```sh
npm install @dialpad/eslint-plugin-dialtone --save-dev
```

## Usage

Add `@dialpad/dialtone` to the plugins section of your `.eslintrc` configuration file.
You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "@dialpad/dialtone"
    ]
}
```

Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "@dialpad/dialtone/rule-name": 2
    }
}
```

## Supported Rules

* [custom-implementation](docs/rules/custom-implementation.md)
* [deprecated-base-color-classes](docs/rules/deprecated-base-color-classes.md)
* [deprecated-component](docs/rules/deprecated-component.md)
* [deprecated-directive](docs/rules/deprecated-directive.md)
* [deprecated-flex-gap-classes](docs/rules/deprecated-flex-gap-classes.md)
* [deprecated-grid-gap-classes](docs/rules/deprecated-grid-gap-classes.md)
* [deprecated-icons](docs/rules/deprecated-icons.md)
* [deprecated-stack-alignment-classes](docs/rules/deprecated-stack-alignment-classes.md)
* [recommend-typography-style](docs/rules/recommend-typography-style.md)
