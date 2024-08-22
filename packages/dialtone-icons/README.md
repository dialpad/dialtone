# Dialtone Icons

This is the home for Dialtone icons and illustrations. It includes the resources needed to implement icons and illustrations on your application that conform to Dialpad’s design principles and best practices.

## Install Dialtone icons via NPM

To add Dialtone icons into your project, you can install it via NPM:

```shell
npm install --save @dialpad/dialtone-icons
```

Once installed, you can import icons and illustrations in a couple different ways:

### In Vue.js

- Individually (tree-shakeable):

```js
// named import (preferred on vite)
import { DtIconAccessibility } from '@dialpad/dialtone-icons/vue2'; // Vue 2.6+
import { DtIconAccessibility } from '@dialpad/dialtone-icons/vue3'; // Vue 3+
import { DtIllustrationBlankSpace } from '@dialpad/dialtone-icons/vue2'; // Vue 2.6+
import { DtIllustrationBlankSpace } from '@dialpad/dialtone-icons/vue3'; // Vue 3+

// default import (preferred on webpack)
import DtIconAccessibility from '@dialpad/dialtone-icons/vue2/accessibility'; // Vue 2.6+
import DtIconAccessibility from '@dialpad/dialtone-icons/vue3/accessibility'; // Vue 3+
import DtIllustrationBlankSpace from '@dialpad/dialtone-icons/vue2/blank-space'; // Vue 2.6+
import DtIllustrationBlankSpace from '@dialpad/dialtone-icons/vue3/blank-space'; // Vue 3+
```

- All the icon components:

```js
import { icons } from '@dialpad/dialtone-icons/vue2'; // Vue 2.6+
import { icons } from '@dialpad/dialtone-icons/vue3'; // Vue 3+
```

- All the illustration components:

```js
import { illustrations } from '@dialpad/dialtone-icons/vue2'; // Vue 2.6+
import { illustrations } from '@dialpad/dialtone-icons/vue3'; // Vue 3+
```

- Importing icon related data

```js
import keywords from '@dialpad/dialtone-icons/keywords-icons.json';
import iconsList from '@dialpad/dialtone-icons/icons.js';
```

- Importing illustration related data

```js
import keywords from '@dialpad/dialtone-icons/keywords-illustrations.json';
import illustrationsList from '@dialpad/dialtone-icons/illustrations.js';
```

## Committing

1. Place the `.svg` files into the category folder inside these directory depending if it's an icon or an illustration:

    - icon: `src/svg/icons`
    - illustration: `src/svg/illustrations`

2. Run `nx build dialtone-icons`
3. Commit and push your changes.

## Requesting features / reporting bugs

Requesting a feature or reporting a bug? Please do so at the below links:

- [Request Feature](https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=10975&pid=12508)
- [Report Bug](https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=1&pid=12508)

Please also feel free to contact us via the #dialtone Dialpad channel with any questions.
