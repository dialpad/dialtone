# Detects usage of LESS mixins (no-mixins)

Less mixin usage is one of the primary causes of our extremely slow front end build performance. We are attempting to remove as many less mixins as possible and eventually transition to a more modern pure CSS approach.

## Rule Details

This rule aims to detect and prevent usage of LESS mixins.

Examples of **incorrect** code for this rule:

```js
import SpotFileUpload from '@dSpot/SpotFileUpload';
import IconDynamicLayout from '@dIcon/IconDynamicLayout';
```

```js
const requireIcon = require.context(
    '@dialpad/dialtone/lib/dist/vue/icons',
    false,
    /.*\\.vue$/,
);
```

Examples of **correct** code for this rule:

```js
import { DtIcon } from '@dialpad/dialtone-vue';
<dt-icon name="settings" />
```
