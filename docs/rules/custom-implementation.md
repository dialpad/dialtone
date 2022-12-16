# Detects custom dialtone icons implementations (custom-implementation)

We detected some custom implementations of vue icons.

## Rule Details

This rule aims to detect and prevent custom implementations using require.context and @dIcon, @dSpot

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
