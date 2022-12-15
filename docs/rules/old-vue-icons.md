# Finds old dialtone vue icons usage (old-vue-icons)

We separated icons from dialtone into dialtone-icons repo, 
so we are deprecating old vue icons on dialtone once the migrations are finished.

## Rule Details

This rule aims to inform developers that they're importing icons from dialtone instead of using dtIcon component from dialtone-vue.

Examples of **incorrect** code for this rule:

```js
import IconSettings from '@dialpad/dialtone/vue/icons/IconSettings';
```

Examples of **correct** code for this rule:

```js
import { DtIcon } from '@dialpad/dialtone-vue';
<dt-icon name="settings" />
```
