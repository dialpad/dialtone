# Finds deprecated dialtone svg and vue icons usage (deprecated-icons)

We moved the icons from dialtone-legacy to dialtone-icons package,
so we are deprecating old svg and vue icons on dialtone once the migrations are finished.

## Rule Details

This rule aims to inform developers that they're importing icons from dialtone instead of dialtone-icons.

Examples of **incorrect** code for this rule:

```js
import svgLockIcon from '@dialpad/dialtone/lib/build/svg/system/lock.svg';
import svgLockIcon from '../node_modules/@dialpad/dialtone/lib/dist/svg/system/lock.svg';
import IconSettings from '@dialpad/dialtone/vue/icons/IconSettings';
import IconSettings from '../node_modules/@dialpad/dialtone/vue/icons/IconSettings';
```

Examples of **correct** code for this rule:

- **If you can't use vue**:

```js
import svgLockIcon from '@dialpad/dialtone-icons/dist/svg/lock.svg';
```

- **If you can use vue**

```js
import { DtIcon } from '@dialpad/dialtone-vue';
<dt-icon name="lock" />
```

## Exceptions

For now, we are allowing the importing of `brand` and `spot illustrations` icons from dialtone,
so this rule will not trigger if you import an icon like:

```js
import dialpadAiIcon from '../../node_modules/@dialpad/dialtone/lib/build/svg/brand/dialpad-ai.svg';
```
