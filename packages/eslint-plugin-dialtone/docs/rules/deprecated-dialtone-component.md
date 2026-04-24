# Finds deprecated Dialtone components that should be replaced by newer alternatives

## Rule Details

This informs developers of deprecated Dialtone components and suggests what to use instead.

### DtIcon

`DtIcon` is a generic wrapper component that renders an icon by `name` prop. Import specific icon components directly from `@dialpad/dialtone-icons/vue3` instead — this avoids loading the entire icon registry and makes icon usage statically analyzable.

### DtRecipe* components

All `DtRecipe*` components have been moved to standalone UI-Kit packages and will no longer receive updates in Dialtone.
They will remain available until the next major Dialtone release.
See the [migration guide](https://dialtone.dialpad.com/about/whats-new/) for details.

| Deprecated | Replacement | Package |
| --- | --- | --- |
| `DtIcon` | e.g. `DtIconPhoneHangUp` | `@dialpad/dialtone-icons/vue3` |
| `DtRecipeComboboxMultiSelect` | `DtComboboxMultiSelect` | `@dialpad/dialtone` |
| `DtRecipeComboboxWithPopover` | `DtComboboxWithPopover` | `@dialpad/dialtone` |
| `DtRecipeMotionText` | `DtMotionText` | `@dialpad/dialtone` |
| `DtRecipeCallbarButton` | `DpCallbarButton` | `@dialpad/callbarkit` |
| `DtRecipeCallbarButtonWithPopover` | `DpCallbarButtonWithPopover` | `@dialpad/callbarkit` |
| `DtRecipeCallbarButtonWithDropdown` | `DpCallbarButtonWithDropdown` | `@dialpad/callbarkit` |
| `DtRecipeGroupedChip` | `DpGroupedChip` | `@dialpad/callbarkit` |
| `DtRecipeTopBannerInfo` | `DpTopBannerInfo` | `@dialpad/callbarkit` |
| `DtRecipeAttachmentCarousel` | `DpAttachmentCarousel` | `@dialpad/chatkit` |
| `DtRecipeMessageInput` | `DpMessageInput` | `@dialpad/chatkit` |
| `DtRecipeContactInfo` | `DpContactInfo` | `@dialpad/chatkit` |
| `DtRecipeEditor` | `DpEditor` | `@dialpad/chatkit` |
| `DtRecipeEmojiRow` | `DpEmojiRow` | `@dialpad/chatkit` |
| `DtRecipeFeedItemPill` | `DpFeedItemPill` | `@dialpad/chatkit` |
| `DtRecipeFeedItemRow` | `DpFeedItemRow` | `@dialpad/chatkit` |
| `DtRecipeContactCentersRow` | `DpContactCentersRow` | `@dialpad/navigationkit` |
| `DtRecipeContactRow` | `DpContactRow` | `@dialpad/navigationkit` |
| `DtRecipeGeneralRow` | `DpGeneralRow` | `@dialpad/navigationkit` |
| `DtRecipeGroupRow` | `DpGroupRow` | `@dialpad/navigationkit` |
| `DtRecipeUnreadPill` | `DpUnreadPill` | `@dialpad/navigationkit` |
| `DtRecipeCallbox` | `DpCallbox` | `@dialpad/navigationkit` |
| `DtRecipeSettingsMenuButton` | `DpSettingsMenuButton` | `@dialpad/navigationkit` |
| `DtRecipeIvrNode` | `DpIvrNode` | `@dialpad/workflowkit` |

Examples of **incorrect** code for this rule:

**using the generic DtIcon wrapper**:

```js
import { DtIcon } from '@dialpad/dialtone-vue';
```

**import of a deprecated DtRecipe component**:

```js
import { DtRecipeCallbarButton } from '@dialpad/dialtone-vue';
```

Examples of **correct** code for this rule:

**direct icon component import**:

```js
import { DtIconPhoneHangUp } from '@dialpad/dialtone-icons/vue3';
```

**import of the replacement UI-Kit component**:

```js
import { DpCallbarButton } from '@dialpad/callbarkit';
```

**import of a non-deprecated Dialtone component**:

```js
import { DtButton } from '@dialpad/dialtone-vue';
```
