# Finds old dialtone svg icons usage (old-svg-icons)

We separated icons from dialtone into dialtone-icons repo, 
so we are deprecating old svg icons on dialtone once the migrations are finished.

## Rule Details

This rule aims to inform developers that they're importing icons from dialtone instead of dialtone-icons.

Examples of **incorrect** code for this rule:

```js
import svgLockIcon from '@dialpad/dialtone/lib/build/svg/system/lock.svg';
import svgLockIcon from '../node_modules/@dialpad/dialtone/lib/dist/svg/system/lock.svg';
```

Examples of **correct** code for this rule:

**If you can't use vue**:
```js
import svgLockIcon from '@dialpad/dialtone-icons/dist/svg/lock.svg';
```

**If you can use vue**
```js
import { DtIcon } from '@dialpad/dialtone-vue';
<dt-icon name="lock" />
```
