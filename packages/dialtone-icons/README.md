# Dialtone Icons

This is the home for Dialtone icons. It includes the resources needed to implement icons on your application that conform to Dialpad’s design principles and best practices.

## Install Dialtone icons via NPM

To add Dialtone icons into your project, you can install it via NPM:

```shell
npm install --save @dialpad/dialtone-icons
```

Once installed, you can import icons in a couple different ways:

### In Vue.js

- Individually (tree-shakeable):

```js
// named import (preferred on vite)
import { DtIconAccessibility } from '@dialpad/dialtone-icons/vue2'; // Vue 2.6+
import { DtIconAccessibility } from '@dialpad/dialtone-icons/vue3'; // Vue 3+

// default import (preferred on webpack)
import DtIconAccessibility from '@dialpad/dialtone-icons/vue2/accessibility'; // Vue 2.6+
import DtIconAccessibility from '@dialpad/dialtone-icons/vue3/accessibility'; // Vue 3+
```

- All the icon components:

```js
import * as icons from '@dialpad/dialtone-icons/vue2'; // Vue 2.6+
import * as icons from '@dialpad/dialtone-icons/vue3'; // Vue 3+
```

- Importing icon related data

```js
import keywords from '@dialpad/dialtone-icons/keywords-icons.json';
import iconsList from '@dialpad/dialtone-icons/icons.json';
```

## Committing

If you need to add icons, follow the next steps to get your icons committed.

1. Place the `.svg` files into `src/svg/icons` inside the category folder.
2. Run `nx build dialtone-icons`
3. Commit and push your changes.

## Requesting features / reporting bugs

Requesting a feature or reporting a bug? Please do so at the below links:

- [Request Feature](https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=10975&pid=12508)
- [Report Bug](https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=1&pid=12508)

Please also feel free to contact us via the #dialtone Dialpad channel with any questions.

# Dialtone Illustrations
Illustrations are also part of dialtone-icons package.
It includes the resources needed to implement illustrations on your application that conform to Dialpad’s design principles and best practices.

## Install Dialtone illustrations via NPM

To add Dialtone illustrations into your project, you can install it via NPM:

```shell
npm install --save @dialpad/dialtone-icons
```

Once installed, you can import illustrations in a couple different ways:

### In Vue.js

- Individually (tree-shakeable):

```js
// named import (preferred on vite)
import { DtIllustrationMind } from '@dialpad/dialtone-icons/vue2'; // Vue 2.6+
import { DtIllustrationMind } from '@dialpad/dialtone-icons/vue3'; // Vue 3+

// default import (preferred on webpack)
import DtIllustrationMind from '@dialpad/dialtone-icons/vue2/mind'; // Vue 2.6+
import DtIllustrationMind from '@dialpad/dialtone-icons/vue3/mind'; // Vue 3+
```

- All the illustrations components:

```js
import * as illustrations from '@dialpad/dialtone-icons/vue2'; // Vue 2.6+
import * as illustrations from '@dialpad/dialtone-icons/vue3'; // Vue 3+
```

- Importing illustration related data

```js
import keywords from '@dialpad/dialtone-icons/keywords-illustrations.json';
import illustrationsList from '@dialpad/dialtone-icons/illustrations.json';
```

## Committing

If you need to add illustrations, follow the next steps to get your icons committed.

1. Place the `.svg` files into `src/svg/illustrations` inside the category folder.
2. Run `nx build dialtone-icons`
3. Commit and push your changes.

## Requesting features / reporting bugs

Requesting a feature or reporting a bug? Please do so at the below links:

- [Request Feature](https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=10975&pid=12508)
- [Report Bug](https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=1&pid=12508)
