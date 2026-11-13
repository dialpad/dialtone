---
title: Filter Pill
description: Filter control with selectable options in a popover.
status: new
thumb: true
# storybook: https://dialtone.dialpad.com/vue/?path=/story/components-filter-pill--default @TODO: Uncomment once it's RFP
keywords: ["filter tag", "filter chip", "search filter", "d-filter-pill", "DtFilterPill", "dt-filter-pill", "removable tag", "dismissible chip"]
combinator: DtFilterPill
---

Controlled selection, trailing slots and `opened` are unreleased. Dialtone 10.5.1 predates these APIs; use a compatible published release when available.

<!-- @example {"exclude":{"reason":"Controlled options/selected require the DLT-3736 feature release; the current Dialtone 10.5.1 lookup profile predates that API. Withhold until compatible publication and profile qualification.","owner":"DLT-3736 / Dialtone component and lookup maintainers"}} -->

```vue demo-only
<!-- The options/selected API is unreleased. Use a compatible published release when available. -->
<dt-filter-pill
  v-model:selected="heroSelected"
  :options="[{ value: 'all', label: 'All Messages', shortLabel: 'All' }, { value: 'unread', label: 'Unread' }, { value: 'mentions', label: 'Mentions & Reactions', shortLabel: 'Mentions' }]"
  label="Filter by"
  neutral-value="all"
  end-tooltip-text="Clear"
  use-dropdown
/>
```

## Usage

Pass an `options` array when the component mounts and bind `v-model:selected` to manage selection in your application. Start with `[]` while loading options.

If you already use `v-model`, keep the same `{ name, active? }[]` array and update each item’s `active` value in place. Don’t combine the two selection APIs.

Choose the selection API and controlled dropdown/popover pattern when mounting. Use a new `key` to switch either.

<dialtone-usage>
<template #do>

- Filter a list, table or other set of results by a specific attribute.
- Use a dropdown for one choice and a checkbox popover for multiple choices.
- Give each filter a meaningful label and its Clear button an accessible name.

</template>

<template #dont>

- Use a filter pill as a general-purpose action button.
- Use a filter pill for a standalone on/off setting.

</template>
</dialtone-usage>

The next two examples use this Vue setup:

```js
import { ref } from 'vue';

const selectedMessage = ref('all');
const selectedChannels = ref([]);
```

### Controlled single selection

Use a string or `null` for `selected`. Each option needs a unique string `value` and a `label`. `shortLabel` changes the pill text; `null` falls back to `label`. You can replace options or translated labels while the dropdown stays open.

Set `neutral-value` to the choice that Clear restores. That choice stays checked without making the pill active. Omit it or use `null` for no neutral choice; an empty string is valid. Nothing is selected automatically.

Arrow keys move focus without changing selection. The filter’s label stays available to screen readers.

<!-- @example {"id":"examples/docs/components/filter-pill/controlled-single-selection","exclude":{"reason":"Controlled options/selected require the DLT-3736 feature release; the current Dialtone 10.5.1 lookup profile predates that API. Withhold until compatible publication and profile qualification.","owner":"DLT-3736 / Dialtone component and lookup maintainers"}} -->

```vue demo
<!-- The options/selected API is unreleased. Use a compatible published release when available. -->
<dt-filter-pill
  v-model:selected="selectedMessage"
  :options="[{ value: 'all', label: 'All Messages', shortLabel: 'All' }, { value: 'unread', label: 'Unread' }, { value: 'mentions', label: 'Mentions & Reactions', shortLabel: 'Mentions' }]"
  label="Filter by"
  neutral-value="all"
  end-tooltip-text="Clear"
  use-dropdown
/>

<!-- @code -->
<script setup>
import { ref } from 'vue';
import { DtFilterPill } from '@dialpad/dialtone/vue';

const selectedMessage = ref('all');
</script>

<template>
  <!-- The options/selected API is unreleased. Use a compatible published release when available. -->
  <dt-filter-pill
    v-model:selected="selectedMessage"
    :options="[{ value: 'all', label: 'All Messages', shortLabel: 'All' }, { value: 'unread', label: 'Unread' }, { value: 'mentions', label: 'Mentions & Reactions', shortLabel: 'Mentions' }]"
    label="Filter by"
    neutral-value="all"
    end-tooltip-text="Clear"
    use-dropdown
  />
</template>
```

Use `null` when nothing is selected.

### Controlled multiple selection

Use an array of strings for `selected`. Changes apply immediately unless you set `defer-selection`. Apply saves deferred edits; Cancel, Escape and dismissal discard them. Clear resets `selected` to `[]`.

A different `selected` value replaces pending edits. Replacing it with the same selections, or changing the options, preserves them, including selections temporarily missing from the options.

<!-- @example {"id":"examples/docs/components/filter-pill/controlled-multiple-selection","exclude":{"reason":"Controlled options/selected require the DLT-3736 feature release; the current Dialtone 10.5.1 lookup profile predates that API. Withhold until compatible publication and profile qualification.","owner":"DLT-3736 / Dialtone component and lookup maintainers"}} -->

```vue demo
<!-- The options/selected API is unreleased. Use a compatible published release when available. -->
<dt-filter-pill
  v-model:selected="selectedChannels"
  :options="[{ value: 'email', label: 'Email' }, { value: 'phone', label: 'Phone' }, { value: 'chat', label: 'Chat' }]"
  label="Channel"
  end-tooltip-text="Clear"
  defer-selection
/>

<!-- @code -->
<script setup>
import { ref } from 'vue';
import { DtFilterPill } from '@dialpad/dialtone/vue';

const selectedChannels = ref([]);
</script>

<template>
  <!-- The options/selected API is unreleased. Use a compatible published release when available. -->
  <dt-filter-pill
    v-model:selected="selectedChannels"
    :options="[{ value: 'email', label: 'Email' }, { value: 'phone', label: 'Phone' }, { value: 'chat', label: 'Chat' }]"
    label="Channel"
    end-tooltip-text="Clear"
    defer-selection
  />
</template>
```

The `content` slot provides `pendingSelected`, `apply` and `cancel`; the existing `v-model` API uses `pendingFilters`.

In a custom footer, call `apply()` alone. It saves and closes on success. Calling `apply(); close()` cancels the pending Apply. Changes to `selected` in the same handler, before or after `apply()`, take priority. If you need to change `selected` after asynchronous work, finish `await apply()` first. Otherwise Apply may overwrite that change.

Await `apply()` before work that depends on it. This does not wait for closing; use `opened(false)` before removal. Outside an open deferred-selection session, `apply()` does nothing.

### Closing before removal

Use `v-model:open` to keep your application’s open state in sync with the pill. People can still open it when `open` is `false`. If you handle `update:open` yourself, accept those updates; setting an unchanged `false` again cannot close it. Disabling the pill or making it read-only closes it.

Before removing an open or closing pill, close it and wait for `opened(false)`. Keep its modal setting, anchor and scroll container unchanged until then. Removing it sooner can leave scrolling locked. Use the same sequence before navigation or replacing a header.

`open(false)` and `update:open(false)` report that closing has started. `opened(false)` follows the completed transition and focus restoration. A cancelled close does not emit `opened(false)`. This event does not manage locks from other overlays.

The example then moves focus to Reset. A pill that has never opened can be removed directly. The existing `v-model` API keeps its open-event timing.

<!-- @example {"exclude":{"reason":"Terminal close/removal uses a named application handler and component refs beyond bounded lookup setup. The current Dialtone 10.5.1 consumer profile also lacks the controlled selection and opened notification APIs.","owner":"DLT-3736 / Dialtone component and lookup maintainers"}} -->

```vue demo
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    v-if="removalPillVisible"
    v-model:selected="removalSelection"
    :options="[{ value: 'email', label: 'Email' }, { value: 'phone', label: 'Phone' }]"
    label="Channel"
    end-tooltip-text="Clear"
    @opened="onRemovalOpened"
  >
    <template #footerContent="{ close }">
      <dt-button :size="200" @click="removalRequested = true; close()">Remove after closing</dt-button>
    </template>
  </dt-filter-pill>
  <dt-button ref="removalResetButton" kind="muted" importance="outlined" :size="200" @click="resetRemovalExample">Reset example</dt-button>
</dt-stack>

<!-- @code -->
<script setup>
import { ref, nextTick } from 'vue';
import { DtButton, DtFilterPill, DtStack } from '@dialpad/dialtone/vue';

const removalPillVisible = ref(true);
const removalRequested = ref(false);
const removalSelection = ref(['email']);
const removalResetButton = ref(null);
async function onRemovalOpened (isOpen) {
  if (isOpen || !removalRequested.value) return;
  removalPillVisible.value = false;
  removalRequested.value = false;
  await nextTick();
  removalResetButton.value?.$el?.focus();
}
function resetRemovalExample () {
  removalRequested.value = false;
  removalSelection.value = ['email'];
  removalPillVisible.value = true;
}
</script>

<template>
  <dt-stack direction="row" gap="100">
    <dt-filter-pill
      v-if="removalPillVisible"
      v-model:selected="removalSelection"
      :options="[{ value: 'email', label: 'Email' }, { value: 'phone', label: 'Phone' }]"
      label="Channel"
      end-tooltip-text="Clear"
      @opened="onRemovalOpened"
    >
      <template #footerContent="{ close }">
        <dt-button :size="200" @click="removalRequested = true; close()">Remove after closing</dt-button>
      </template>
    </dt-filter-pill>
    <dt-button ref="removalResetButton" kind="muted" importance="outlined" :size="200" @click="resetRemovalExample">Reset example</dt-button>
  </dt-stack>
</template>
```

## Labels and counts

Use `anchorEnd` and `optionEnd` to add counts while keeping the built-in labels and selection behavior. Hide the decorative badge from screen readers and provide its meaning as text. Translate count text with your application’s plural rules.

<!-- @example {"exclude":{"reason":"Named application handler, reactive options and computed count setup exceed bounded lookup extraction; the current Dialtone 10.5.1 consumer pin also predates options/selected.","owner":"DLT-3736 / Dialtone component and lookup maintainers"}} -->

```vue demo
<dt-stack gap="200">
  <dt-filter-pill
    :selected="currentMessage"
    :options="messageOptions"
    label="Filter by"
    neutral-value="all"
    end-tooltip-text="Clear"
    use-dropdown
    @selection-change="applyMessageFilter"
  >
    <template #headerContent>Filter by</template>
    <template #anchorEnd="{ selected }">
      <template v-if="selected === 'unread' && unreadCount > 0">
        <dt-badge type="bulletin" kind="count" aria-hidden="true">{{ countText }}</dt-badge>
        <span class="d-vi-visible-sr">, {{ messageCountText }}</span>
      </template>
    </template>
    <template #optionEnd="{ option }">
      <template v-if="option.value === 'unread' && unreadCount > 0">
        <dt-badge type="bulletin" kind="count" aria-hidden="true">{{ countText }}</dt-badge>
        <span class="d-vi-visible-sr">, {{ messageCountText }}</span>
      </template>
    </template>
  </dt-filter-pill>
  <dt-stack direction="row" gap="100">
    <dt-button kind="muted" importance="outlined" :size="200" @click="unreadCount = unreadCount === 12 ? 100 : unreadCount === 100 ? 0 : 12">Change count</dt-button>
    <dt-button kind="muted" importance="outlined" :size="200" @click="currentMessage = 'mentions'">Set Mentions externally</dt-button>
  </dt-stack>
  <dt-text variant="code-sm">Application commands: {{ messageCommands }}</dt-text>
</dt-stack>

<!-- @code -->
<script setup>
import { ref, computed } from 'vue';
import { DtBadge, DtButton, DtFilterPill, DtStack, DtText } from '@dialpad/dialtone/vue';

const currentMessage = ref('all');
const unreadCount = ref(12);
const messageCommands = ref(0);
const messageOptions = ref([
  { value: 'all', label: 'All Messages', shortLabel: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'starred', label: 'Starred' },
  { value: 'mentions', label: 'Mentions & Reactions', shortLabel: 'Mentions' },
]);
const countText = computed(() => unreadCount.value > 99 ? '99+' : String(unreadCount.value));
const messageCountText = computed(() => `${unreadCount.value} unread ${unreadCount.value === 1 ? 'message' : 'messages'}`);
function applyMessageFilter (action) {
  currentMessage.value = action.value;
  messageCommands.value++;
}
</script>

<template>
  <dt-stack gap="200">
    <dt-filter-pill
      :selected="currentMessage"
      :options="messageOptions"
      label="Filter by"
      neutral-value="all"
      end-tooltip-text="Clear"
      use-dropdown
      @selection-change="applyMessageFilter"
    >
      <template #headerContent>Filter by</template>
      <template #anchorEnd="{ selected }">
        <template v-if="selected === 'unread' && unreadCount > 0">
          <dt-badge type="bulletin" kind="count" aria-hidden="true">{{ countText }}</dt-badge>
          <span class="d-vi-visible-sr">, {{ messageCountText }}</span>
        </template>
      </template>
      <template #optionEnd="{ option }">
        <template v-if="option.value === 'unread' && unreadCount > 0">
          <dt-badge type="bulletin" kind="count" aria-hidden="true">{{ countText }}</dt-badge>
          <span class="d-vi-visible-sr">, {{ messageCountText }}</span>
        </template>
      </template>
    </dt-filter-pill>
    <dt-stack direction="row" gap="100">
      <dt-button kind="muted" importance="outlined" :size="200" @click="unreadCount = unreadCount === 12 ? 100 : unreadCount === 100 ? 0 : 12">Change count</dt-button>
      <dt-button kind="muted" importance="outlined" :size="200" @click="currentMessage = 'mentions'">Set Mentions externally</dt-button>
    </dt-stack>
    <dt-text variant="code-sm">Application commands: {{ messageCommands }}</dt-text>
  </dt-stack>
</template>
```

Use `selection-change` when choosing a filter also runs an application command. It provides `value`, `previousValue`, `reason` and `changed`. Update selection in this handler or through `v-model:selected`, using one write path. Don’t write it again from `clear`.

Choosing the current radio item still emits `selection-change` with `changed: false`. Updating props or counts does not emit it or close the menu.

The badge shows `99+` above 99 and hides at zero. Screen readers receive the full count.

## Combined filters

These examples use `v-model`. Reset updates the items in the existing arrays.

```vue demo-only
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    v-model="momentCount"
    label="Moment"
    end-tooltip-text="Remove"
  >
    <template #default="{ label, filters, activeFilters }">
      {{ label }}<template v-if="activeFilters.length">:
      <strong>
        {{ activeFilters.length === filters.length ? 'All' : activeFilters.length }}
      </strong></template>
    </template>
  </dt-filter-pill>
  <dt-filter-pill
    v-model="heroConversationTypes"
    label="Conversation type"
    :start-tooltip-text="selectedHeroConversationType !== 'All Conversations'
      ? 'Conversation type'
      : ''"
    end-tooltip-text="Remove"
    use-dropdown
    @clear="resetHeroConversationType"
  >
    <template #default="{ label }">
      <span
        v-if="selectedHeroConversationType !== 'All Conversations'"
        class="sr-only"
      >{{ label }}: </span>
      {{ selectedHeroConversationType === 'All Conversations'
        ? label
        : selectedHeroConversationType }}
    </template>
    <template #content="{ close }">
      <dt-list-item
        v-for="filter in heroConversationTypes"
        :key="filter.name"
        role="menuitemradio"
        navigation-type="arrow-keys"
        :selected="filter.name === selectedHeroConversationType"
        @click="selectHeroConversationType(filter.name, close)"
      >
        {{ filter.name }}
        <template #selected>
          <dt-icon-check
            size="200"
            :class="{ 'd-vi-hidden': filter.name !== selectedHeroConversationType }"
            aria-hidden="true"
          />
        </template>
      </dt-list-item>
    </template>
  </dt-filter-pill>
  <dt-filter-pill
    v-model="deferredFilters"
    label="Channel"
    end-tooltip-text="Remove"
    popover-footer-class="d-pie-200 d-py-150"
    defer-selection
  >
  </dt-filter-pill>
  <dt-button :size="200" kind="muted" importance="outlined" :disabled="!heroHasActiveFilters" @click="resetHeroFilters">
    Reset
  </dt-button>
</dt-stack>
```

## Variants

### Base

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    :model-value="[{name: 'Email'}, {name: 'Phone'}, {name: 'Chat'}, {name: 'Social'}, {name: 'SMS'}]"
    label="Channel"
  >
  </dt-filter-pill>
</dt-stack>
```

### Active

For single selection, the neutral choice keeps the pill inactive. Any other selected value, including a value missing from `options`, makes it active and clearable.

For multiple choices, the summary shows “All” only when every option is selected, more than one option exists and no selected values are unknown. Otherwise, it shows the first matching label in selection order, or “Unavailable” if none match.

With `v-model`, `active: true` makes an item active.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    :model-value="[{name: 'Headquarters', active: true}, {name: 'Westside'}, {name: 'Downtown'}]"
    label="Contact centers"
  >
  </dt-filter-pill>
</dt-stack>
```

### Disabled

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-filter-pill label="Conversation type" disabled></dt-filter-pill>
</dt-stack>
```

### Read only

Its value is reflected in the filter set but cannot be opened, cleared, or modified. Functionally and visually distinct from disabled.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    :model-value="[{name: 'Headquarters', active: true}, {name: 'Westside', active: true}, {name: 'Downtown'}]"
    label="Contact centers"
    read-only
  ></dt-filter-pill>
</dt-stack>
```

### Size

`200` (small) is the default.

```vue demo
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    v-for="size in sizes"
    :key="size"
    :label="size"
    :size="size"
  ></dt-filter-pill>
</dt-stack>
<!-- @code -->
<dt-filter-pill label="{size}" size="{size}" />
```

## Interaction patterns

Both overlays default to a minimum inline size matching the entire FilterPill, including its Clear button.
Longer content can make the overlay wider. Set `overlay-min-inline-size="300"` to use `--dt-layout-300`,
following DtBox's fixed layout scale; percentage values are not supported. Use `overlay-min-inline-size="0"` for natural content sizing.
The default is `anchor`; `popover-max-width` still caps the overlay.

Popover content defaults to block spacing `100` and inline spacing `150`. Padding utilities passed through
`popover-content-class` override these defaults. Set `popover-padding` to `none`, `small`, `medium`, or `large`
for a uniform padding preset; `large` restores the previous `d-p-200` content padding. For custom padding,
use `popover-padding="none"` with `popover-content-class`, for example `popover-content-class="d-py-150 d-px-200"`.
Header/footer spacing and dropdown padding are unchanged.

### Clearable

A clear button appears when any filter is active. It emits the `clear` event when clicked.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    label="Channel"
    :model-value="[{ name: 'Option 1' }, { name: 'Option 2', active: true }, { name: 'Option 3' }]"
    end-tooltip-text="Remove"
  >
  </dt-filter-pill>
</dt-stack>
```

### Non clearable

Setting the `:show-clear="false"` prop hides the clear button.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    :model-value="[{name: '0–5 min', active: true}, {name: '5–15 min'}, {name: '15–30 min'}, {name: '30+ min'}]"
    label="Duration"
    :show-clear="false"
  >
  </dt-filter-pill>
</dt-stack>
```

### Defer selection

Setting `defer-selection` holds checkbox changes in a pending state until Apply is clicked.
Cancel, Escape, or clicking outside discards pending changes.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    :model-value="[{name: 'Email'}, {name: 'Phone', active: true}, {name: 'Chat'}, {name: 'Social'}, {name: 'SMS'}]"
    label="Channel"
    end-tooltip-text="Remove"
    defer-selection
    popover-footer-class="d-pie-200 d-py-150"
  >
  </dt-filter-pill>
</dt-stack>
```

### Dropdown

Setting `use-dropdown` switches the overlay from a popover to a dropdown with keyboard-navigable
list items. This provides arrow key navigation, highlight management, and Enter/Space selection
out of the box — ideal for single-select filter patterns. Use `role="menuitemradio"` with `:selected` for persistent, mutually exclusive choices; use `menuitem` for actions. The radio role exposes `aria-checked` independently of keyboard highlight. Built-in dropdown rows reserve space for the selected checkmark. For custom content, keep a decorative checkmark in each row and use `d-vi-hidden` on unselected markers, as shown below, to retain its layout space.

```vue demo
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    v-model="dropdownTypes"
    label="Conversation type"
    :start-tooltip-text="selectedDropdownType !== 'All Conversations'
      ? 'Conversation type'
      : ''"
    end-tooltip-text="Remove"
    use-dropdown
    @clear="resetDropdownType"
  >
    <template #default="{ label }">
      <span
        v-if="selectedDropdownType !== 'All Conversations'"
        class="sr-only"
      >{{ label }}: </span>
      {{ selectedDropdownType === 'All Conversations'
        ? label
        : selectedDropdownType }}
    </template>
    <template #content="{ close }">
      <dt-list-item
        v-for="filter in dropdownTypes"
        :key="filter.name"
        role="menuitemradio"
        navigation-type="arrow-keys"
        :selected="filter.name === selectedDropdownType"
        @click="selectDropdownType(filter.name, close)"
      >
        {{ filter.name }}
        <template #selected>
          <dt-icon-check
            size="200"
            :class="{ 'd-vi-hidden': filter.name !== selectedDropdownType }"
            aria-hidden="true"
          />
        </template>
      </dt-list-item>
    </template>
  </dt-filter-pill>
</dt-stack>
<!-- @code -->
<dt-filter-pill
  :model-value="[{name: &apos;All Conversations&apos;}, {name: &apos;Only Calls&apos;}, {name: &apos;Only Meetings&apos;}, {name: &apos;Only Digital&apos;}]"
  label="Conversation type"
  :start-tooltip-text="selectedType !== &apos;All Conversations&apos;
    ? &apos;Conversation type&apos;
    : &apos;&apos;"
  end-tooltip-text="Remove"
  use-dropdown
  @clear="resetType"
>
  <template #default="{ label }">
    <span
      v-if="selectedType !== &apos;All Conversations&apos;"
      class="sr-only"
    >{{ label }}: </span>
    {{ selectedType === &apos;All Conversations&apos;
      ? label
      : selectedType }}
  </template>
  <template #content="{ close }">
    <dt-list-item
      v-for="filter in conversationTypes"
      :key="filter.name"
      role="menuitemradio"
      navigation-type="arrow-keys"
      :selected="filter.name === selectedType"
      @click="selectType(filter.name, close)"
    >
      {{ filter.name }}
      <template #selected>
        <dt-icon-check
          size="200"
          :class="{ 'd-vi-hidden': filter.name !== selectedType }"
          aria-hidden="true"
        />
      </template>
    </dt-list-item>
  </template>
</dt-filter-pill>
```

## Slots

### Default

The `default` slot replaces the built-in anchor-label content. Preserve the filter dimension and current selection in its accessible name; the `label` prop alone does not add that context after you replace the content. See [Labelling guidelines](#labelling-guidelines).

#### Example: Count

Using the `default` scoped slot, you can display a count of active filters alongside the label.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    :model-value="[{name: 'Address', active: true}, {name: 'Call Purpose', active: true}, {name: 'Action Item'}, {name: 'Negative Sentiment'}, {name: 'Warranty Inquiry', active: true}]"
    label="Contact centers"
    end-tooltip-text="Remove"
  >
    <template #default="{ label, filters, activeFilters }">
      {{ label }}<template v-if="activeFilters.length">:
      <strong>
        {{ activeFilters.length === filters.length ? 'All' : activeFilters.length }}
      </strong></template>
    </template>
  </dt-filter-pill>
</dt-stack>
```

#### Example: Active filter list

`activeFilterList` returns the first active label, or the literal `'All'` when every item in a multi-item list is active. `activeFilterOverflow` returns text such as `'+2'`. Translate text you render through these slots; built-in controlled summaries use Dialtone translations.

<!-- @example {"key":"overflow"} -->

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    :model-value="[{name: 'Email', active: true}, {name: 'Phone', active: true}, {name: 'Chat', active: true}, {name: 'Social'}, {name: 'SMS'}]"
    label="Channel"
    end-tooltip-text="Remove"
  >
    <template #default="{ label, filters, activeFilters, activeFilterList, activeFilterOverflow }">
      {{ label }}<template v-if="activeFilters.length">:
      <strong>
        {{ activeFilters.length === filters.length ? 'All' : activeFilterList }}
      </strong>
      <template v-if="activeFilterOverflow"> {{ activeFilterOverflow }}</template></template>
    </template>
  </dt-filter-pill>
</dt-stack>
```

#### Example: Radio selection

Combining the `default` and `content` slots with a radio group creates a single-select filter.
The label updates to show the selected option, and a clear button resets to the default.

<!-- @example {"key":"conversation-type"} -->

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    v-model="conversationTypes"
    label="Conversation type"
    :start-tooltip-text="selectedConversationType !== 'All Conversations'
      ? 'Conversation type'
      : ''"
    end-tooltip-text="Remove"
    @clear="selectedConversationType = 'All Conversations'"
  >
    <template #default="{ label }">
      <span
        v-if="selectedConversationType !== 'All Conversations'"
        class="sr-only"
      >{{ label }}: </span>
      {{ selectedConversationType === 'All Conversations'
        ? label
        : selectedConversationType }}
    </template>
    <template #content>
      <dt-radio-group
        v-model="selectedConversationType"
        aria-label="Conversation type"
        name="conversation-type-doc-filter"
      >
        <dt-radio
          v-for="filter in conversationTypes"
          :key="filter.name"
          :label="filter.name"
          :value="filter.name"
          @update:model-value="$event => selectedConversationType = $event"
        />
      </dt-radio-group>
    </template>
  </dt-filter-pill>
</dt-stack>
```

### Content

Using the `content` slot, you can override the popover content with custom markup.

In a controlled dropdown, `headerContent` adds a heading. If you replace `content`, provide your own headings, accessible name, roles and keyboard handling. The built-in dropdown heading is omitted. Popover headers keep their existing behavior.

```vue demo
<!-- @wrapper -->
<dt-stack direction="row" gap="100">
  <dt-filter-pill
    :model-value="[{name: 'Contains'}, {name: 'Starts with'}]"
    label="Keyword"
  >
    <template #content>
      Enter a keyword to filter results
    </template>
  </dt-filter-pill>
</dt-stack>
```

## Content Mode

Filter Pill popover and dropdown content renders outside the DOM tree. Use the `contentMode` prop to apply color mode (invert, light, dark) to the positioned content. See [Positioned Components](/components/mode-island.html#positioned-components) for details.

```vue demo
<dt-filter-pill content-mode="invert" use-dropdown label="Inverted" :model-value="[{ name: 'Orange', active: true }, { name: 'Apple' }]" end-tooltip-text="Remove" />
<!-- @code -->
<dt-filter-pill content-mode="invert" use-dropdown>...</dt-filter-pill>
<dt-filter-pill content-mode="dark" use-dropdown>...</dt-filter-pill>
<dt-filter-pill content-mode="light" use-dropdown>...</dt-filter-pill>
```

## Accessibility

The filter pill is built on `DtButton` and `DtPopover`/`DtDropdown`, inheriting their keyboard and screen reader support.

### Keyboard interaction

| Key | Action |
| ----- | -------- |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | Opens the popover or dropdown; toggles checkboxes inside |
| <kbd>Arrow Up</kbd> / <kbd>Arrow Down</kbd> | Opens the popover; navigates list items in dropdown mode |
| <kbd>Escape</kbd> | Closes the popover or dropdown, discarding pending changes in deferred mode |
| <kbd>Tab</kbd> | Moves focus between the primary button, checkboxes, footer actions, and the clear button |

### ARIA attributes

- The primary button uses `aria-disabled="true"` in read-only mode instead of `disabled`, preserving focusability while indicating the control is not interactive.
- The checkbox group inside the popover receives `aria-label` set to the pill's `label` prop, giving screen readers context for the list of options.
- The clear button uses `aria-label` set to `endTooltipText` (or a localized default), ensuring the icon-only button has an accessible name.

### Labelling guidelines

- Provide a meaningful dimension `label`, such as `Conversation type`. Built-in controlled labels include the dimension and current selection in the accessible name even when only the selection is visible. A separate external visual label is not required.
- When replacing the `default` slot, include both the dimension and current selection in its accessible content. A screen-reader-only prefix, as shown in the custom-label examples, preserves context while keeping the visible label compact. Use `anchorEnd` or `optionEnd` when adding counts without replacing the built-in label.
- Use `start-tooltip-text` to repeat the dimension on hover when helpful. The tooltip does not replace a contextual accessible name; users should still understand the filter when they return focus after selecting a value.
- Provide `end-tooltip-text` for the clear button to give it a meaningful accessible name (e.g., "Remove filter").

## Vue API

An `options` array at mount enables controlled selection. Omitted, `undefined`, `null` or other non-array values use the existing `v-model` API. Invalid inputs disable a controlled pill until corrected; they do not switch it back to `v-model`. FilterPill does not change your option or selection data.

<component-vue-api component-name="filterPill"></component-vue-api>

## Classes

<component-class-table component-name="filter-pill"></component-class-table>

<script setup>
import { ref, computed, inject, nextTick } from 'vue';
import { DtIconCheck } from '@dialpad/dialtone-icons/vue';

const removalPillVisible = ref(true);
const removalRequested = ref(false);
const removalSelection = ref(['email']);
const removalResetButton = ref(null);
async function onRemovalOpened (isOpen) {
  if (isOpen || !removalRequested.value) return;
  removalPillVisible.value = false;
  removalRequested.value = false;
  await nextTick();
  removalResetButton.value?.$el?.focus();
}
function resetRemovalExample () {
  removalRequested.value = false;
  removalSelection.value = ['email'];
  removalPillVisible.value = true;
}

const heroSelected = ref('all');
const selectedMessage = ref('all');
const selectedChannels = ref([]);
const currentMessage = ref('all');
const unreadCount = ref(12);
const messageCommands = ref(0);
const messageOptions = ref([
  { value: 'all', label: 'All Messages', shortLabel: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'starred', label: 'Starred' },
  { value: 'mentions', label: 'Mentions & Reactions', shortLabel: 'Mentions' },
]);
const countText = computed(() => unreadCount.value > 99 ? '99+' : String(unreadCount.value));
const messageCountText = computed(() => `${unreadCount.value} unread ${unreadCount.value === 1 ? 'message' : 'messages'}`);
function applyMessageFilter (action) {
  currentMessage.value = action.value;
  messageCommands.value++;
}

const heroConversationTypes = ref([
  {name: 'All Conversations'},
  {name: 'Only Calls'},
  {name: 'Only Meetings'},
  {name: 'Only Digital'},
]);
const selectedHeroConversationType = computed(() => {
  return heroConversationTypes.value.find(f => f.active)?.name || 'All Conversations';
});
function selectHeroConversationType (name, close) {
  heroConversationTypes.value.forEach(f => {
    f.active = name !== 'All Conversations' && f.name === name;
  });
  close();
}
function resetHeroConversationType () {
  heroConversationTypes.value.forEach(f => { f.active = false; });
}
const heroHasActiveFilters = computed(() => {
  return momentCount.value.some(f => f.active) ||
    selectedHeroConversationType.value !== 'All Conversations' ||
    deferredFilters.value.some(f => f.active);
});
function resetHeroFilters () {
  momentCount.value.forEach(f => { delete f.active; });
  heroConversationTypes.value.forEach(f => { f.active = false; });
  deferredFilters.value.forEach(f => { delete f.active; });
}
const deferredFilters = ref([
  {name: 'Email'},
  {name: 'Phone', active: true },
  {name: 'Chat'},
  {name: 'Social'},
  {name: 'SMS'},
]);
const momentCount = ref([
  {name: 'Address', active: true},
  {name: 'Call Purpose', active: true},
  {name: 'Action Item'},
  {name: 'Negative Sentiment'},
  {name: 'Warranty Inquiry', active: true },
]);
const conversationTypes = ref([
  {name: 'All Conversations'},
  {name: 'Only Calls'},
  {name: 'Only Meetings'},
  {name: 'Only Digital'},
]);
const dropdownTypes = ref([
  {name: 'All Conversations'},
  {name: 'Only Calls'},
  {name: 'Only Meetings'},
  {name: 'Only Digital'},
]);
const selectedConversationType = computed({
  get () {
    return conversationTypes.value.find(f => f.active)?.name || 'All Conversations';
  },
  set (newValue) {
    conversationTypes.value.forEach(f => {
      f.active = f.name === newValue && newValue !== 'All Conversations';
    });
  },
});
const selectedDropdownType = computed(() => {
  return dropdownTypes.value.find(f => f.active)?.name || 'All Conversations';
});
function selectDropdownType (name, close) {
  dropdownTypes.value.forEach(f => {
    f.active = name !== 'All Conversations' && f.name === name;
  });
  close();
}
function resetDropdownType () {
  dropdownTypes.value.forEach(f => { f.active = false; });
}
const dialtoneConstants = inject('dialtoneConstants', {});
const sizes = Object.keys(dialtoneConstants.BUTTON_SIZE_MODIFIERS ?? {}).filter(k => /^\d+$/.test(k));
</script>
