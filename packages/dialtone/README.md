# Dialtone

This is the home for Dialtone, Dialpad's design system. It includes the resources needed to create consistent, predictable interfaces that conform to Dialpad’s design principles, language, styles, and best practices.

## Install Dialtone

### Install it via NPM:
```
npm install @dialpad/dialtone
```

### Import dialtone:
- CSS/LESS:
```less
@import "node_modules/@dialpad/dialtone/lib/dist/css/dialtone.min.css";
```
- Javascript:
```js
import '@dialpad/dialtone/lib/dist/css/dialtone.min.css';
```

### Add dialtone's theme class to the `<body>`

- Light mode
```html
<body class="dialtone-theme-light">...</body>
```

- Dark mode
```html
<body class="dialtone-theme-dark">...</body>
```

This will define the Dialtone CSS variables for your desired theme. 
It is required to do this for Dialtone to function.

## Building Dialtone locally

To build Dialtone locally, visit our [installation instructions](https://dialpad.design/guides/getting-started/#build-dialtone-locally).

## Contributing

If you're interested in contributing to Dialtone, please read our [contributing docs](https://github.com/dialpad/dialtone/blob/master/.github/CONTRIBUTING.md) **before submitting a pull request**.

## Requesting features / reporting bugs

Requesting a feature or reporting a bug? Please do so at the below links:

- [Request Feature](https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=10901&pid=12428)
- [Report Bug](https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=10878&pid=12428)


Please also feel free to contact us via the [#dialtone Slack channel](https://dialpad.slack.com/messages/dialtone/) with any questions
