---
layout: Blank
---

<dt-stack class="d-p-400 d-bgc-primary" gap="400">
  <dt-box padding="300">
    <dt-stack gap="300" direction="row">
      <dt-stack direction="row" align="center" gap="100">
        <dt-presence presence="active" />
        <dt-presence presence="busy" />
        <dt-presence presence="away" />
        <dt-presence presence="offline" />
      </dt-stack>
      <dt-stack direction="row" align="center" gap="100">
        <dt-avatar :size="100" presence="active" image-src="/assets/images/person.png" image-alt="Person Avatar" />
        <dt-avatar :size="100" presence="busy" image-src="/assets/images/person.png" image-alt="Person Avatar" />
        <dt-avatar :size="100" presence="away" image-src="/assets/images/person.png" image-alt="Person Avatar" />
        <dt-avatar :size="100" presence="offline" image-src="/assets/images/person.png" image-alt="Person Avatar" />
      </dt-stack>
      <dt-stack direction="row" align="center" gap="100">
        <dt-avatar :size="200" presence="active" image-src="/assets/images/person.png" image-alt="Person Avatar" />
        <dt-avatar :size="200" presence="busy" image-src="/assets/images/person.png" image-alt="Person Avatar" />
        <dt-avatar :size="200" presence="away" image-src="/assets/images/person.png" image-alt="Person Avatar" />
        <dt-avatar :size="200" presence="offline" image-src="/assets/images/person.png" image-alt="Person Avatar" />
      </dt-stack>
      <dt-stack direction="row" align="center" gap="100">
        <dt-avatar :size="300" presence="active" image-src="/assets/images/person.png" image-alt="Person Avatar" />
        <dt-avatar :size="300" presence="busy" image-src="/assets/images/person.png" image-alt="Person Avatar" />
        <dt-avatar :size="300" presence="away" image-src="/assets/images/person.png" image-alt="Person Avatar" />
        <dt-avatar :size="300" presence="offline" image-src="/assets/images/person.png" image-alt="Person Avatar" />
      </dt-stack>
      <dt-stack direction="row" align="center" gap="100">
        <dt-avatar :size="400" presence="active" image-src="/assets/images/person.png" image-alt="Person Avatar" />
        <dt-avatar :size="400" presence="busy" image-src="/assets/images/person.png" image-alt="Person Avatar" />
        <dt-avatar :size="400" presence="away" image-src="/assets/images/person.png" image-alt="Person Avatar" />
        <dt-avatar :size="400" presence="offline" image-src="/assets/images/person.png" image-alt="Person Avatar" />
      </dt-stack>
      <dt-stack direction="row" align="center" gap="100">
        <dt-avatar :size="500" presence="active" image-src="/assets/images/person.png" image-alt="Person Avatar" />
        <dt-avatar :size="500" presence="busy" image-src="/assets/images/person.png" image-alt="Person Avatar" />
        <dt-avatar :size="500" presence="away" image-src="/assets/images/person.png" image-alt="Person Avatar" />
        <dt-avatar :size="500" presence="offline" image-src="/assets/images/person.png" image-alt="Person Avatar" />
      </dt-stack>
    </dt-stack>
  </dt-box>
  <dt-stack direction="row" gap="100">
    <dt-text as="h1" kind="headline" :size="600">
      Scratchpad
    </dt-text>
    <dt-dropdown navigation-type="arrow-keys" placement="bottom-start">
      <template #anchor>
        <dt-button
          v-dt-tooltip:bottom="`Mode: ${capitalize(currentMode)}`"
          importance="outlined"
          :size="200"
          kind="muted"
          icon-position="right"
          class="dialtone-shell-btn"
        >
          <template #startIcon="{ iconSize }">
            <dt-icon :name="currentModeIconName" :size="iconSize" />
          </template>
        </dt-button>
      </template>
      <template #list>
        <dt-list-item-group
          heading-class="d-py-50 d-px-100 d-c-default d-fc-tertiary d-label--sm"
          heading="Mode"
        >
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setMode('system')"
          >
            System
            <template #right>
              <dt-icon :class="{ 'd-o0': currentMode !== 'system' }" name="check" size="200" />
            </template>
          </dt-list-item>
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setMode('light')"
          >
            Light
            <template #right>
              <dt-icon :class="{ 'd-o0': currentMode !== 'light' }" name="check" size="200" />
            </template>
          </dt-list-item>
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setMode('dark')"
          >
            Dark
            <template #right>
              <dt-icon :class="{ 'd-o0': currentMode !== 'dark' }" name="check" size="200" />
            </template>
          </dt-list-item>
        </dt-list-item-group>
        <dt-dropdown-separator />
        <dt-list-item-group
          heading-class="d-py-50 d-px-100 d-c-default d-fc-tertiary d-label--sm"
          heading="Contrast"
        >
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setContrast('default')"
          >
            Default
            <template #right>
              <dt-icon :class="{ 'd-o0': currentContrast !== 'default' }" name="check" size="200" />
            </template>
          </dt-list-item>
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="setContrast('high')"
          >
            High
            <template #right>
              <dt-icon :class="{ 'd-o0': currentContrast !== 'high' }" name="check" size="200" />
            </template>
          </dt-list-item>
        </dt-list-item-group>
      </template>
    </dt-dropdown>
  </dt-stack>
<!-- ============================================================ -->
<!-- DtBox V1 Demos                                                -->
<!-- ============================================================ -->

<dt-stack gap="400">
  <dt-text as="h1" kind="headline" :size="600">
    DtBox V1
  </dt-text>

  <!-- Basic padding + surface combos -->
  <dt-stack gap="200">
    <dt-text as="h2" kind="headline" :size="500">
      Padding + Surface Combos
    </dt-text>

```vue demo
<dt-stack gap="200">
  <dt-box padding="200" surface="secondary">Box demo</dt-box>
  <dt-box padding="400" surface="moderate">Box demo</dt-box>
  <dt-box padding="100" surface="positive-subtle">Box demo</dt-box>
  <dt-box padding="100" surface="critical-subtle">Box demo</dt-box>
  <dt-box padding="200" surface="brand">Box demo</dt-box>
</dt-stack>
```

  </dt-stack>

  <!-- as prop variants -->
  <dt-stack gap="200">
    <dt-text as="h2" kind="headline" :size="500">
      <code>as</code> Prop Variants
    </dt-text>
    <dt-text as="p" kind="body" :size="200" tone="secondary">
      DtBox renders as different HTML elements via the <code>as</code> prop.
      Inspect elements to verify the rendered tag.
    </dt-text>

```vue demo
<dt-stack gap="200">
  <dt-box as="div" padding="100" surface="secondary">Box demo</dt-box>
  <dt-box as="section" padding="100" surface="secondary">Box demo</dt-box>
  <dt-box as="header" padding="100" surface="secondary">Box demo</dt-box>
  <dt-box as="nav" padding="100" surface="secondary">Box demo</dt-box>
  <dt-box as="article" padding="100" surface="secondary">Box demo</dt-box>
</dt-stack>
```

  </dt-stack>

  <!-- Padding cascade demo -->
  <dt-stack gap="200">
    <dt-text as="h2" kind="headline" :size="500">
      Padding Cascade
    </dt-text>
    <dt-text as="p" kind="body" :size="200" tone="secondary">
      Specific axes override shorthand: <code>paddingInline</code> overrides <code>padding</code> for left/right,
      <code>paddingBlockStart</code> overrides <code>paddingBlock</code> for top.
    </dt-text>

```vue demo
<dt-stack gap="200">
  <dt-box padding="100" surface="moderate">Box demo</dt-box>
  <dt-box padding="100" padding-inline="400" surface="moderate">Box demo</dt-box>
  <dt-box padding="100" padding-block="400" surface="moderate">Box demo</dt-box>
  <dt-box padding="100" padding-inline="200" padding-inline-start="500" surface="moderate">Box demo</dt-box>
  <dt-box padding="100" padding-block="200" padding-block-start="500" surface="moderate">Box demo</dt-box>
</dt-stack>
```

  </dt-stack>

  <!-- Nested DtBox inheritance isolation -->
  <dt-stack gap="200">
    <dt-text as="h2" kind="headline" :size="500">
      Nested Inheritance Isolation
    </dt-text>
    <dt-text as="p" kind="body" :size="200" tone="secondary">
      <code>@property</code> registrations prevent custom property inheritance.
      Inner boxes should NOT inherit outer padding or surface.
    </dt-text>

```vue demo
<dt-box padding="400" surface="brand">
  <dt-stack gap="100">
    <div>Outer box</div>
    <dt-box padding="100" surface="secondary">Inner box (should not inherit outer)</dt-box>
    <dt-box>Inner box, no props (should have 0 padding, transparent surface)</dt-box>
  </dt-stack>
</dt-box>
```

  </dt-stack>

  <!-- Surface opaque variants -->
  <dt-stack gap="200">
    <dt-text as="h2" kind="headline" :size="500">
      Surface Opaque Variants
    </dt-text>
    <dt-text as="p" kind="body" :size="200" tone="secondary">
      Opaque surfaces use solid colors instead of alpha transparency,
      preventing bleed-through on layered backgrounds.
    </dt-text>

```vue demo
<dt-box padding="200" surface="brand">
  <dt-stack gap="100">
    <div>Parent surface="brand"</div>
    <dt-stack direction="row" gap="100">
      <dt-box padding="100" surface="primary">Box demo</dt-box>
      <dt-box padding="100" surface="primary-opaque">Box demo</dt-box>
      <dt-box padding="100" surface="secondary">Box demo</dt-box>
      <dt-box padding="100" surface="secondary-opaque">Box demo</dt-box>
    </dt-stack>
  </dt-stack>
</dt-box>
```

  </dt-stack>

  <!-- Utility class escape hatch -->
  <dt-stack gap="200">
    <dt-text as="h2" kind="headline" :size="500">
      Utility Class Escape Hatch
    </dt-text>
    <dt-text as="p" kind="body" :size="200" tone="secondary">
      DtBox accepts standard class attributes for one-off styling that falls
      outside its prop API. Utility classes compose naturally with the component.
    </dt-text>

```vue demo
<dt-box padding="200" surface="moderate" class="d-bar-400 d-bs-sm">
  Box demo
</dt-box>
```

```vue demo
<div style="position: relative; height: 120px; overflow: auto; border: 1px solid var(--dt-color-border-default);">
  <dt-box
    padding="100"
    surface="secondary"
    class="d-ps-sticky d-t-0"
  >
    <dt-text kind="body" :size="200">Box demo</dt-text>
  </dt-box>
  <dt-box padding="200">
    <dt-text kind="body" :size="200">Scroll content below the sticky box...</dt-text>
    <div class="d-h-400"></div>
    <dt-text kind="body" :size="200">...end of scroll content.</dt-text>
  </dt-box>
</div>
```

  </dt-stack>
</dt-stack>
<!-- ============================================================ -->
<!-- DtBox demos (V1–V4)                                          -->
<!-- ============================================================ -->

<dt-stack gap="400">
  <dt-text as="h2" kind="headline" size="lg">DtBox</dt-text>

  <dt-text kind="headline" size="md">Basic padding + surface</dt-text>

```vue demo
<dt-stack direction="row" gap="200">
  <dt-box padding="200" surface="primary" border-width="100">Box demo</dt-box>
  <dt-box padding="300" surface="moderate" border-width="100">Box demo</dt-box>
  <dt-box padding="400" surface="brand-subtle" border-width="100">Box demo</dt-box>
</dt-stack>
```

  <dt-text kind="headline" size="md">Padding cascade</dt-text>

```vue demo
<dt-stack direction="row" gap="200">
  <dt-box padding="400" surface="secondary" border-width="100">Box demo</dt-box>
  <dt-box padding="400" padding-inline="100" surface="secondary" border-width="100">Box demo</dt-box>
  <dt-box padding="400" padding-inline="100" padding-inline-start="0" surface="secondary" border-width="100">Box demo</dt-box>
</dt-stack>
```

  <dt-text kind="headline" size="md">Polymorphic as</dt-text>

```vue demo
<dt-stack gap="100">
  <dt-box as="section" padding="200" surface="info-subtle" border-width="100">Box demo</dt-box>
  <dt-box as="nav" padding="200" surface="warning-subtle" border-width="100">Box demo</dt-box>
  <dt-box as="header" padding="200" surface="positive-subtle" border-width="100">Box demo</dt-box>
</dt-stack>
```

  <dt-text kind="headline" size="md">Nested inheritance isolation</dt-text>

```vue demo
<dt-box padding="500" surface="brand-subtle" border-width="100">
  <dt-stack gap="200">
    <div>Outer box</div>
    <dt-box padding="200" surface="primary" border-width="100">Inner box (independent)</dt-box>
    <dt-box surface="critical-subtle" border-width="100">Inner box, no padding (should be 0)</dt-box>
  </dt-stack>
</dt-box>
```

  <dt-text kind="headline" size="md">Utility class escape hatch</dt-text>

```vue demo
<dt-box padding="200" surface="primary" border-width="100" border-radius="200" class="d-ps-sticky d-t-0">
  Box demo
</dt-box>
```

  <dt-text kind="headline" size="md">Card compositions</dt-text>

```vue demo
<dt-stack direction="row" gap="200">
  <dt-box padding="300" surface="primary" border-width="100" border-radius="300" shadow="card">Box demo</dt-box>
  <dt-box padding="300" surface="primary" border-width="100" border-radius="400" shadow="medium">Box demo</dt-box>
  <dt-box padding="300" surface="brand-subtle" border-color="brand" border-width="100" border-radius="200">Box demo</dt-box>
</dt-stack>
```

  <dt-text kind="headline" size="md">Shadow scale</dt-text>

```vue demo
<dt-stack direction="row" gap="300">
  <dt-box padding="200" surface="primary" border-radius="200" shadow="small">Box demo</dt-box>
  <dt-box padding="200" surface="primary" border-radius="200" shadow="medium">Box demo</dt-box>
  <dt-box padding="200" surface="primary" border-radius="200" shadow="large">Box demo</dt-box>
  <dt-box padding="200" surface="primary" border-radius="200" shadow="extra-large">Box demo</dt-box>
  <dt-box padding="200" surface="primary" border-radius="200" shadow="card">Box demo</dt-box>
</dt-stack>
```

  <dt-text kind="headline" size="md">Border radius variants</dt-text>

```vue demo
<dt-stack direction="row" gap="200" align="center">
  <dt-box padding="100" surface="moderate" border-width="100" border-radius="0">0 long label lorem <br> second line</dt-box>
  <dt-box padding="100" surface="moderate" border-width="100" border-radius="200">200 long label lorem <br> second line</dt-box>
  <dt-box padding="100" surface="moderate" border-width="100" border-radius="400">400 long label lorem <br> second line</dt-box>
  <dt-box padding="100" surface="moderate" border-width="100" border-radius="600">600 long label lorem <br> second line</dt-box>
  <dt-box padding="100" surface="moderate" border-width="100" border-radius="pill">pill long label lorem</dt-box>
  <dt-box padding="100" surface="moderate" border-width="100" border-radius="circle">circle</dt-box>
</dt-stack>
```

  <dt-text kind="headline" size="md">No border props = invisible border</dt-text>

```vue demo
<dt-stack direction="row" gap="200">
  <dt-box padding="200" surface="secondary">Box demo (no border props)</dt-box>
  <dt-box padding="200" surface="secondary" border-width="100">Box demo (with border props)</dt-box>
</dt-stack>
```

  <dt-text kind="headline" size="md">Layout token sizing</dt-text>

```vue demo
<dt-stack direction="row" gap="200">
  <dt-box padding="200" surface="secondary" border-width="100" inline-size="300">Box demo</dt-box>
  <dt-box padding="200" surface="secondary" border-width="100" inline-size="500">Box demo</dt-box>
</dt-stack>
```

  <dt-text kind="headline" size="md">Class escape hatch for arbitrary sizing</dt-text>

```vue demo
<dt-stack gap="200">
  <dt-box padding="200" surface="secondary" border-width="100" class="d-wmx-464">Box demo</dt-box>
  <dt-box padding="200" surface="secondary" border-width="100" class="d-hmn-164">Box demo</dt-box>
</dt-stack>
```

  <dt-text kind="headline" size="md">Overflow + borderRadius clipping</dt-text>

```vue demo
<dt-box surface="secondary" border-width="100" border-radius="400" overflow="hidden" inline-size="500" max-block-size="200">
  <div class="d-p-200 d-bgc-brand-subtle d-h-400">
    Tall content clipped by overflow="hidden" and borderRadius="400"
  </div>
</dt-box>
```

  <dt-text kind="headline" size="md">Scrollbar integration</dt-text>

```vue demo
<dt-box padding="200" surface="secondary" border-width="100" border-radius="200" scrollbar="always" max-block-size="300">
  <dt-stack gap="100">
    <div v-for="i in 20" :key="i">Scrollable item {{ i }}</div>
  </dt-stack>
</dt-box>
```

```vue demo
<dt-box padding="200" surface="secondary" border-width="100" border-radius="200" scrollbar="leave" max-block-size="300">
  <dt-stack gap="100">
    <div v-for="i in 20" :key="i">Scrollable item {{ i }}</div>
  </dt-stack>
</dt-box>
```

```vue demo
<dt-box padding="200" surface="secondary" border-width="100" border-radius="200" overflow="auto" max-block-size="300">
  <dt-stack gap="100">
    <div v-for="i in 20" :key="i">Scrollable item {{ i }} (native scrollbar)</div>
  </dt-stack>
</dt-box>
```

</dt-stack>

</dt-stack>

<div class="d-h-1200"></div>

<script setup>
import { ref, computed } from 'vue';
import ExampleTabs from '@exampleComponents/ExampleTabs.vue';
import { DtTabGroup, DtTab, DtTabPanel } from '@dialpad/dialtone-vue';
import { useThemeManager } from '@composables/useThemeManager';
import ExampleProfileCard from '@exampleComponents/ExampleProfileCard.vue';

const {
  currentMode,
  currentContrast,
  currentModeIconName,
  setMode,
  setContrast,
} = useThemeManager();

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const proseSize = ref('300');
const proseDensity = ref('200');
const proseClasses = computed(() => {
  const classes = [];
  if (proseSize.value !== '300') classes.push(`d-prose--size-${proseSize.value}`);
  if (proseDensity.value !== '200') classes.push(`d-prose--density-${proseDensity.value}`);
  return classes;
});

const borderless = ref(false);
const outlined = ref(false);
const muted = ref(false);
const showIcon = ref(false);
const showTabEndIcon = ref(false);
const showLeading = ref(false);
const showTrailing = ref(false);
const size = ref('md');
const selectOnFocus = ref(false);
const isDisabled = ref(false);
const labelSizeSelection = ref('default');
const resolvedLabelSize = computed(() => labelSizeSelection.value === 'default' ? undefined : labelSizeSelection.value);
const labelStrengthSelection = ref('default');
const resolvedLabelStrength = computed(() => labelStrengthSelection.value === 'default' ? undefined : labelStrengthSelection.value);
const showLabelClass = ref(false);
const resolvedLabelClass = computed(() => showLabelClass.value ? 'd-bgc-warning' : undefined);
const checkRadioLabelSize = ref('default');
const resolvedCheckRadioLabelSize = computed(() => checkRadioLabelSize.value === 'default' ? undefined : checkRadioLabelSize.value);
const checkRadioLabelStrength = ref('default');
const resolvedCheckRadioLabelStrength = computed(() => checkRadioLabelStrength.value === 'default' ? undefined : checkRadioLabelStrength.value);
const showBtnLeading = ref(false);
const showBtnTrailing = ref(false);
const showBtnStartIcon = ref(false);
const showBtnEndIcon = ref(false);
const removeBtnSlotClass = ref(false);
const highlightBtnSlotClass = ref(false);
const showBtnLabelClass = ref(false);
const resolvedBtnLabelClass = computed(() => showBtnLabelClass.value ? 'd-bgc-warning' : undefined);
const showTabLabelClass = ref(false);
const resolvedTabLabelClass = computed(() => showTabLabelClass.value ? 'd-bgc-warning' : undefined);
const showInputDescription = ref(false);
const showInputMessages = ref(false);
const inputMessages = computed(() => showInputMessages.value ? [{ message: 'Critical validation message', type: 'critical' }] : []);
const showInputMessagesClass = ref(false);
const resolvedInputMessagesClass = computed(() => showInputMessagesClass.value ? 'd-bgc-critical' : undefined);
const showInputDescriptionClass = ref(false);
const resolvedInputDescriptionClass = computed(() => showInputDescriptionClass.value ? 'd-bgc-positive' : undefined);
const showDescription = ref(false);
const showCheckRadioMessages = ref(false);
const checkRadioMessages = computed(() => showCheckRadioMessages.value ? [{ message: 'Critical validation message', type: 'critical' }] : []);
const showCheckRadioMessagesClass = ref(false);
const resolvedCheckRadioMessagesClass = computed(() => showCheckRadioMessagesClass.value ? 'd-bgc-critical' : undefined);
const showCheckRadioDescriptionClass = ref(false);
const resolvedCheckRadioDescriptionClass = computed(() => showCheckRadioDescriptionClass.value ? 'd-bgc-positive' : undefined);
const checkRadioDisabled = ref(false);
</script>
