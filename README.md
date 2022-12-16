# eslint-plugin-dialtone

dialtone eslint plugin containing rules to help developers maintain dialtone recommended practices. 

## Adding a new rule

We use yeoman generator to generate new rules, simply run the command below and follow the steps.

```shell
yo eslint:rule
```

### Writing rules

You can try the code you're trying to detect here: https://astexplorer.net/ to know which function you need to call
inside `create` function.

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

Add `@dialpad/dialtone` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

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

* Fill in provided rules here


