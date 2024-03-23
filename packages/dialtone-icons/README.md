# Dialtone Icons

This is the home for Dialtone icons. It includes the resources needed to implement icons on your application that conform to Dialpad’s design principles and best practices.

## Install Dialtone icons via NPM

To add Dialtone icons into your project, you can install it via NPM:

```shell
npm install --save @dialpad/dialtone-icons
```

Once installed, you can import icons in a couple different ways:

### In Vue.js

- Individually (preferred):

```js
// named import
import { DtIconAccessibility } from '@dialpad/dialtone-icons';
// default import
import DtIconAccessibility from '@dialpad/dialtone-icons/Accessibility.vue';
```

- All the icon components:

```js
import icons from '@dialpad/dialtone-icons';
```

### In other framework (backbone, jQuery, vanilla)

```js
import DtIconAccessibility from '@dialpad/dialtone-icons/svg/accessibility.svg';
```

## Committing

If you need to add icons, follow the next steps to get your icons committed.

1. Place the `.svg` files into `src/svg` inside the category folder.
2. Run `nx build dialtone-icons`
3. Commit and push your changes.

## Requesting features / reporting bugs

Requesting a feature or reporting a bug? Please do so at the below links:

- [Request Feature](https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=10975&pid=12508)
- [Report Bug](https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=1&pid=12508)

Please also feel free to contact us via the #dialtone Dialpad channel with any questions.
