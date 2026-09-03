---
title: "dt-migration-helper Extension Test"
description: "Visual test fixture for the dt-migration-helper Chrome extension."
---

## Tokens

### Base color palette

```vue demo-only
<dt-stack gap="300">
  <dt-stack v-for="family in baseColorFamilies" :key="family" gap="100">
    <dt-text kind="label" :size="100" class="d-fc-tertiary">{{ family }}</dt-text>
    <div class="d-d-flex d-fw-wrap d-g-100">
      <div v-for="stop in colorStops" :key="stop" :class="`d-bgc-${family}-${stop} d-p-500 d-bar-200 d-baw1 d-bas-solid d-bc-subtle`" :title="`d-bgc-${family}-${stop}`"></div>
    </div>
  </dt-stack>
  <dt-stack gap="100">
    <dt-text kind="label" :size="100" class="d-fc-tertiary">black</dt-text>
    <div class="d-d-flex d-fw-wrap d-g-100">
      <div v-for="stop in blackStops" :key="stop" :class="`d-bgc-black-${stop} d-p-500 d-bar-200 d-baw1 d-bas-solid d-bc-subtle`" :title="`d-bgc-black-${stop}`"></div>
    </div>
  </dt-stack>
</dt-stack>
```

### Semantic surfaces

```vue demo-only
<dt-stack gap="300">
  <dt-stack v-for="group in semanticSurfaceGroups" :key="group.name" gap="100">
    <dt-text kind="label" :size="100" class="d-fc-tertiary">{{ group.name }}</dt-text>
    <div class="d-d-flex d-fw-wrap d-g-100">
      <dt-box v-for="s in group.values" :key="s" padding="500" border-radius="200" border-color="subtle" border-width="50" :surface="s" :title="s" />
    </div>
  </dt-stack>
</dt-stack>
```

### Semantic background colors

```vue demo-only
<dt-stack gap="300">
  <dt-stack v-for="group in semanticBgcGroups" :key="group.name" gap="100">
    <dt-text kind="label" :size="100" class="d-fc-tertiary">{{ group.name }}</dt-text>
    <div class="d-d-flex d-fw-wrap d-g-100">
      <div v-for="c in group.values" :key="c" :class="`d-bgc-${c} d-p-500 d-bar-200 d-baw1 d-bas-solid d-bc-subtle`" :title="`d-bgc-${c}`"></div>
    </div>
  </dt-stack>
</dt-stack>
```

### Semantic foreground colors

```vue demo-only
<dt-stack gap="300">
  <dt-stack v-for="group in semanticFcGroups" :key="group.name" gap="100">
    <dt-text kind="label" :size="100" class="d-fc-tertiary">{{ group.name }}</dt-text>
    <div class="d-d-flex d-fw-wrap d-g-100">
      <div v-for="c in group.values" :key="c" :class="`d-fc-${c} d-bgc-secondary d-p-500 d-bar-200 d-d-flex d-ai-center d-jc-center`" :title="`d-fc-${c}`">
        <dt-text kind="label" :size="200" strength="bold" as="span">Aa</dt-text>
      </div>
    </div>
  </dt-stack>
</dt-stack>
```

### Semantic border colors

```vue demo-only
<dt-stack gap="300">
  <dt-stack v-for="group in semanticBcGroups" :key="group.name" gap="100">
    <dt-text kind="label" :size="100" class="d-fc-tertiary">{{ group.name }}</dt-text>
    <div class="d-d-flex d-fw-wrap d-g-100">
      <dt-box v-for="c in group.values" :key="c" :class="`d-bc-${c}`" border-width="200" padding="500" border-radius="200" :title="`d-bc-${c}`" />
    </div>
  </dt-stack>
</dt-stack>
```

### Spacing

```vue demo-only
<dt-stack gap="100">
  <dt-text kind="label" :size="100" class="d-fc-tertiary">spacing scale</dt-text>
  <div class="d-d-flex d-fw-wrap d-g-100 d-ai-flex-end">
    <dt-stack v-for="s in spacingStops" :key="s" gap="50" class="d-ai-center">
      <div :class="`d-p-${s} d-bgc-brand d-bar-200 d-baw1 d-bas-solid d-bc-brand`" :title="`d-p-${s}`"></div>
      <dt-text kind="code" :size="100" class="d-fc-tertiary">{{ s }}</dt-text>
    </dt-stack>
  </div>
</dt-stack>
```

### Shadows

```vue demo-only
<dt-stack gap="100">
  <dt-text kind="label" :size="100" class="d-fc-tertiary">shadow scale</dt-text>
  <div class="d-d-flex d-g-500">
    <dt-stack v-for="s in ['sm','md','lg','xl']" :key="s" gap="100" class="d-ai-center">
      <dt-box padding="500" border-radius="200" :class="`d-bs-${s}`" surface="primary" :title="`d-bs-${s}`" />
      <dt-text kind="code" :size="100" class="d-fc-tertiary">{{ s }}</dt-text>
    </dt-stack>
  </div>
</dt-stack>
```

### Border radius

```vue demo-only
<dt-stack gap="100">
  <dt-text kind="label" :size="100" class="d-fc-tertiary">radius scale</dt-text>
  <div class="d-d-flex d-g-200">
    <dt-stack v-for="r in ['100','200','300','400','500','600','full']" :key="r" gap="100" class="d-ai-center">
      <dt-box padding="500" :border-radius="r" border-color="subtle" border-width="100" surface="secondary" :title="`d-bar-${r}`" />
      <dt-text kind="code" :size="100" class="d-fc-tertiary">{{ r }}</dt-text>
    </dt-stack>
  </div>
</dt-stack>
```

### Typography

```vue demo-only
<dt-stack gap="300">
  <dt-stack v-for="group in typographyGroups" :key="group.kind" gap="100">
    <dt-text kind="label" :size="100" class="d-fc-tertiary">{{ group.kind }}</dt-text>
    <div class="d-d-flex d-fw-wrap d-g-200 d-ai-flex-end">
      <dt-stack v-for="size in group.sizes" :key="size" gap="50" class="d-ai-center d-baw1 d-bas-solid d-bc-subtle d-bar-200 d-p-200">
        <dt-text :kind="group.kind" :size="size">Aa</dt-text>
        <dt-text kind="code" :size="100" class="d-fc-tertiary">{{ size }}</dt-text>
      </dt-stack>
    </div>
  </dt-stack>
  <dt-stack gap="100">
    <dt-text kind="label" :size="100" class="d-fc-tertiary">code</dt-text>
    <dt-stack class="d-d-inline-flex d-baw1 d-bas-solid d-bc-subtle d-bar-200 d-p-200" gap="50">
      <dt-text kind="code">const answer = 42</dt-text>
    </dt-stack>
  </dt-stack>
</dt-stack>
```

## Utility Classes

### Foreground — d-fc-*

```vue demo-only
<dt-stack gap="300">
  <dt-stack v-for="group in semanticFcGroups" :key="group.name" gap="100">
    <dt-text kind="label" :size="100" class="d-fc-tertiary">{{ group.name }}</dt-text>
    <div class="d-d-flex d-fw-wrap d-g-100">
      <div v-for="c in group.values" :key="c" :class="`d-fc-${c} d-bgc-secondary d-p-500 d-bar-200 d-d-flex d-ai-center d-jc-center`" :title="`d-fc-${c}`">
        <dt-text kind="label" :size="200" strength="bold" as="span">Aa</dt-text>
      </div>
    </div>
  </dt-stack>
  <dt-stack v-for="family in baseColorFamilies" :key="family" gap="100">
    <dt-text kind="label" :size="100" class="d-fc-tertiary">{{ family }}</dt-text>
    <div class="d-d-flex d-fw-wrap d-g-100">
      <div v-for="stop in colorStops" :key="stop" :class="`d-fc-${family}-${stop} d-bgc-secondary d-p-500 d-bar-200 d-d-flex d-ai-center d-jc-center`" :title="`d-fc-${family}-${stop}`">
        <dt-text kind="label" :size="200" strength="bold" as="span">Aa</dt-text>
      </div>
    </div>
  </dt-stack>
  <dt-stack gap="100">
    <dt-text kind="label" :size="100" class="d-fc-tertiary">black</dt-text>
    <div class="d-d-flex d-fw-wrap d-g-100">
      <div v-for="stop in blackStops" :key="stop" :class="`d-fc-black-${stop} d-bgc-secondary d-p-500 d-bar-200 d-d-flex d-ai-center d-jc-center`" :title="`d-fc-black-${stop}`">
        <dt-text kind="label" :size="200" strength="bold" as="span">Aa</dt-text>
      </div>
    </div>
  </dt-stack>
</dt-stack>
```

### Background — d-bgc-*

```vue demo-only
<dt-stack gap="300">
  <dt-stack v-for="group in semanticBgcGroups" :key="group.name" gap="100">
    <dt-text kind="label" :size="100" class="d-fc-tertiary">{{ group.name }}</dt-text>
    <div class="d-d-flex d-fw-wrap d-g-100">
      <div v-for="c in group.values" :key="c" :class="`d-bgc-${c} d-p-500 d-bar-200 d-baw1 d-bas-solid d-bc-subtle`" :title="`d-bgc-${c}`"></div>
    </div>
  </dt-stack>
  <dt-stack v-for="family in baseColorFamilies" :key="family" gap="100">
    <dt-text kind="label" :size="100" class="d-fc-tertiary">{{ family }}</dt-text>
    <div class="d-d-flex d-fw-wrap d-g-100">
      <div v-for="stop in colorStops" :key="stop" :class="`d-bgc-${family}-${stop} d-p-500 d-bar-200 d-baw1 d-bas-solid d-bc-subtle`" :title="`d-bgc-${family}-${stop}`"></div>
    </div>
  </dt-stack>
  <dt-stack gap="100">
    <dt-text kind="label" :size="100" class="d-fc-tertiary">black</dt-text>
    <div class="d-d-flex d-fw-wrap d-g-100">
      <div v-for="stop in blackStops" :key="stop" :class="`d-bgc-black-${stop} d-p-500 d-bar-200 d-baw1 d-bas-solid d-bc-subtle`" :title="`d-bgc-black-${stop}`"></div>
    </div>
  </dt-stack>
</dt-stack>
```

### Border — d-bc-*

```vue demo-only
<dt-stack gap="300">
  <dt-stack v-for="group in semanticBcGroups" :key="group.name" gap="100">
    <dt-text kind="label" :size="100" class="d-fc-tertiary">{{ group.name }}</dt-text>
    <div class="d-d-flex d-fw-wrap d-g-100">
      <dt-box v-for="c in group.values" :key="c" :class="`d-bc-${c}`" border-width="200" padding="500" border-radius="200" :title="`d-bc-${c}`" />
    </div>
  </dt-stack>
  <dt-stack v-for="family in baseColorFamilies" :key="family" gap="100">
    <dt-text kind="label" :size="100" class="d-fc-tertiary">{{ family }}</dt-text>
    <div class="d-d-flex d-fw-wrap d-g-100">
      <dt-box v-for="stop in colorStops" :key="stop" :class="`d-bc-${family}-${stop}`" border-width="200" padding="500" border-radius="200" :title="`d-bc-${family}-${stop}`" />
    </div>
  </dt-stack>
  <dt-stack gap="100">
    <dt-text kind="label" :size="100" class="d-fc-tertiary">black</dt-text>
    <div class="d-d-flex d-fw-wrap d-g-100">
      <dt-box v-for="stop in blackStops" :key="stop" :class="`d-bc-black-${stop}`" border-width="200" padding="500" border-radius="200" :title="`d-bc-black-${stop}`" />
    </div>
  </dt-stack>
</dt-stack>
```

### Scrollbar directive

```vue demo-only
<div v-dt-scrollbar:always class="d-hmx-200 d-of-y-auto d-baw1 d-bas-solid d-bc-default d-p-300 d-bar-200">
  <p v-for="n in 15" :key="n">Line {{ n }} — v-dt-scrollbar:always</p>
</div>
```

## Components

### DtChip

```vue demo-only
<dt-stack direction="row" gap="300" class="d-fw-wrap">
  <dt-chip>Non-interactive (span.d-chip)</dt-chip>
  <dt-chip :interactive="true">Interactive (button.d-chip)</dt-chip>
  <dt-chip @close="() => {}">With close</dt-chip>
  <dt-chip :interactive="true" @close="() => {}">Interactive + close</dt-chip>
</dt-stack>
```

### DtModal

```vue demo-only
<dt-stack gap="200">
  <div>
    <dt-button @click="isOpen = !isOpen">Open Modal (dialog.d-modal)</dt-button>
  </div>
  <dt-modal :open="isOpen" header-text="Test Modal" @update:open="isOpen = $event">
    <p>Renders as <code>dialog.d-modal</code> in Dialtone next.</p>
  </dt-modal>
</dt-stack>
```

### DtAvatar

```vue demo-only
<dt-stack gap="300">
  <dt-stack direction="row" gap="400" class="d-ai-flex-end">
    <dt-stack v-for="size in avatarSizes" :key="size" gap="100" class="d-ai-center">
      <dt-avatar :size="size" full-name="Test User" />
      <dt-text kind="code" :size="100" class="d-fc-tertiary">{{ size }}</dt-text>
    </dt-stack>
  </dt-stack>
  <dt-avatar-group>
    <dt-avatar :size="300" full-name="Alpha User" />
    <dt-avatar :size="300" full-name="Beta User" />
    <dt-avatar :size="300" full-name="Gamma User" />
    <dt-avatar :size="300" full-name="Delta User" />
  </dt-avatar-group>
</dt-stack>
```

### DtBadge

```vue demo-only
<dt-stack direction="row" gap="200" class="d-fw-wrap d-ai-center">
  <dt-badge kind="label">label</dt-badge>
  <dt-badge kind="count">42</dt-badge>
  <dt-badge kind="label" type="info">info</dt-badge>
  <dt-badge kind="label" type="positive">positive</dt-badge>
  <dt-badge kind="label" type="warning">warning</dt-badge>
  <dt-badge kind="label" type="critical">critical</dt-badge>
  <dt-badge kind="label" type="bulletin">bulletin</dt-badge>
  <dt-badge kind="label" type="ai">ai</dt-badge>
</dt-stack>
```

### DtBanner

```vue demo-only
<dt-stack gap="200">
  <dt-banner kind="base" header-text="Base" />
  <dt-banner kind="info" header-text="Info" />
  <dt-banner kind="positive" header-text="Positive" />
  <dt-banner kind="warning" header-text="Warning" />
  <dt-banner kind="critical" header-text="Critical" />
</dt-stack>
```

### DtButton / DtSplitButton

```vue demo-only
<dt-stack gap="200">
  <dt-stack direction="row" gap="200" class="d-fw-wrap">
    <dt-button>Default</dt-button>
    <dt-button importance="outlined">Outlined</dt-button>
    <dt-button importance="clear">Clear</dt-button>
    <dt-button kind="critical">Critical</dt-button>
    <dt-button kind="critical" importance="outlined">Critical outlined</dt-button>
    <dt-button kind="muted" importance="clear">Muted</dt-button>
    <dt-button :disabled="true">Disabled</dt-button>
  </dt-stack>
  <dt-split-button importance="outlined">
    Split button
    <template #dropdown>
      <dt-list-item role="menuitem">Option 1</dt-list-item>
      <dt-list-item role="menuitem">Option 2</dt-list-item>
    </template>
  </dt-split-button>
</dt-stack>
```

### DtButtonGroup

```vue demo-only
<dt-button-group>
  <dt-button importance="outlined">One</dt-button>
  <dt-button importance="outlined">Two</dt-button>
  <dt-button importance="outlined">Three</dt-button>
</dt-button-group>
```

### DtLink

```vue demo-only
<dt-stack direction="row" gap="300" class="d-fw-wrap d-ai-baseline">
  <dt-link href="#">Default</dt-link>
  <dt-link href="#" :underline="false">No underline</dt-link>
  <dt-link href="#" tone="critical">Critical</dt-link>
  <dt-link href="#" tone="muted">Muted</dt-link>
  <dt-link href="#" tone="positive">Positive</dt-link>
  <dt-link href="#" tone="warning">Warning</dt-link>
  <dt-link href="#" tone="info">Info</dt-link>
</dt-stack>
```

### DtBreadcrumbs

```vue demo-only
<dt-breadcrumbs>
  <dt-breadcrumbs-item href="#">Home</dt-breadcrumbs-item>
  <dt-breadcrumbs-item href="#">Components</dt-breadcrumbs-item>
  <dt-breadcrumbs-item>Current Page</dt-breadcrumbs-item>
</dt-breadcrumbs>
```

### DtBox

```vue demo-only
<dt-stack gap="200">
  <dt-stack direction="row" gap="200" class="d-fw-wrap">
    <dt-box v-for="s in ['primary','secondary','moderate','bold','strong','contrast']" :key="s" :surface="s" padding="300" border-radius="200"><dt-text kind="code" :size="100">{{ s }}</dt-text></dt-box>
  </dt-stack>
  <dt-box surface="primary" scrollbar="always" class="d-hmx-200 d-of-y-auto" padding="200" border-radius="200">
    <p v-for="n in 8" :key="n">Line {{ n }} — scrollbar="always"</p>
  </dt-box>
</dt-stack>
```

### DtCard

```vue demo-only
<dt-stack direction="row" gap="200">
  <dt-card>
    <template #header>Card header</template>
    Card content
  </dt-card>
  <dt-card>
    <template #header>Another card</template>
    More content here
  </dt-card>
</dt-stack>
```

### DtText

```vue demo-only
<dt-stack gap="100">
  <dt-text kind="headline" :size="600">Headline 600</dt-text>
  <dt-text kind="headline" :size="500">Headline 500</dt-text>
  <dt-text kind="headline" :size="400">Headline 400</dt-text>
  <dt-text kind="body" :size="300">Body 300</dt-text>
  <dt-text kind="body" :size="200">Body 200</dt-text>
  <dt-text kind="body" :size="100">Body 100</dt-text>
  <dt-text kind="label" :size="300">Label 300</dt-text>
  <dt-text kind="label" :size="200">Label 200</dt-text>
  <dt-text kind="label" :size="100">Label 100</dt-text>
  <dt-text kind="code">Code text</dt-text>
</dt-stack>
```

### DtStack

```vue demo-only
<dt-stack gap="200">
  <dt-stack direction="row" gap="200">
    <dt-box v-for="n in 4" :key="n" surface="secondary" padding="200" border-radius="200">row {{ n }}</dt-box>
  </dt-stack>
  <dt-stack gap="200">
    <dt-box v-for="n in 3" :key="n" surface="secondary" padding="200" border-radius="200">col {{ n }}</dt-box>
  </dt-stack>
</dt-stack>
```

### DtInput / DtInputGroup

```vue demo-only
<dt-stack gap="300">
  <dt-stack direction="row" gap="200" class="d-fw-wrap">
    <dt-input label="Default" placeholder="Placeholder" />
    <dt-input label="Disabled" placeholder="Placeholder" :disabled="true" />
    <dt-input label="Error" model-value="Value" :messages="[{message:'Error',type:'critical'}]" />
    <dt-input label="Success" model-value="Value" :messages="[{message:'Success',type:'positive'}]" />
  </dt-stack>
  <dt-input-group legend="Input group">
    <dt-input label="First" placeholder="First" />
    <dt-input label="Last" placeholder="Last" />
  </dt-input-group>
</dt-stack>
```

### DtSelectMenu

```vue demo-only
<dt-stack direction="row" gap="200">
  <dt-select-menu label="Select">
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
  </dt-select-menu>
  <dt-select-menu label="Disabled" :disabled="true">
    <option value="1">Option 1</option>
  </dt-select-menu>
</dt-stack>
```

### DtCheckbox / DtRadio / DtToggle

```vue demo-only
<dt-stack gap="200">
  <dt-stack direction="row" gap="300">
    <dt-checkbox label="Checkbox" :checked="true" />
    <dt-checkbox label="Unchecked" />
    <dt-checkbox label="Disabled" :disabled="true" />
  </dt-stack>
  <dt-stack direction="row" gap="300">
    <dt-radio label="Radio A" value="a" name="demo" />
    <dt-radio label="Radio B" value="b" name="demo" />
  </dt-stack>
  <dt-stack direction="row" gap="300">
    <dt-toggle label="Toggle on" :checked="true" />
    <dt-toggle label="Toggle off" />
  </dt-stack>
</dt-stack>
```

### DtSegmentedControl

```vue demo-only
<dt-segmented-control :options="[{label:'One',value:'1'},{label:'Two',value:'2'},{label:'Three',value:'3'}]" value="1" />
```

### DtFilterPill

```vue demo-only
<dt-stack direction="row" gap="200">
  <dt-filter-pill>Filter</dt-filter-pill>
  <dt-filter-pill :selected="true">Selected</dt-filter-pill>
  <dt-filter-pill :disabled="true">Disabled</dt-filter-pill>
</dt-stack>
```

### DtPresence

```vue demo-only
<dt-stack direction="row" gap="200" class="d-ai-center">
  <dt-presence v-for="p in ['active','away','busy','offline']" :key="p" :presence="p" />
</dt-stack>
```

### DtLoader / DtSkeleton

```vue demo-only
<dt-stack direction="row" gap="400" class="d-ai-center">
  <dt-loader />
  <dt-skeleton :paragraphOption="{rows: 2}" />
</dt-stack>
```

### DtProgressCircle

```vue demo-only
<dt-stack direction="row" gap="300" class="d-ai-center">
  <dt-progress-circle v-for="k in ['default','brand','positive','warning','critical','info','ai']" :key="k" :kind="k" :progress="66" :aria-label="`${k}`" />
</dt-stack>
```

### DtCollapsible

```vue demo-only
<dt-collapsible>
  <template #anchor="{ attrs }">
    <dt-button importance="outlined" v-bind="attrs">Toggle collapsible</dt-button>
  </template>
  <dt-box surface="secondary" padding="300" border-radius="200">Collapsible content</dt-box>
</dt-collapsible>
```

### DtDropdown

```vue demo-only
<dt-dropdown>
  <template #anchor>
    <dt-button importance="outlined">Open dropdown</dt-button>
  </template>
  <template #list>
    <dt-list-item role="menuitem">Item one</dt-list-item>
    <dt-list-item role="menuitem">Item two</dt-list-item>
    <dt-dropdown-separator />
    <dt-list-item role="menuitem">Item three</dt-list-item>
  </template>
</dt-dropdown>
```

### DtNotice

```vue demo-only
<dt-stack gap="200">
  <dt-notice kind="base" header-text="Base" />
  <dt-notice kind="info" header-text="Info" />
  <dt-notice kind="positive" header-text="Positive" />
  <dt-notice kind="warning" header-text="Warning" />
  <dt-notice kind="critical" header-text="Critical" />
</dt-stack>
```

### DtToast

```vue demo-only
<dt-stack gap="200">
  <dt-toast kind="base" header-text="Base" message="Toast message" />
  <dt-toast kind="info" header-text="Info" message="Toast message" />
  <dt-toast kind="positive" header-text="Positive" message="Toast message" />
  <dt-toast kind="warning" header-text="Warning" message="Toast message" />
  <dt-toast kind="critical" header-text="Critical" message="Toast message" />
</dt-stack>
```

### DtTab / DtTabGroup / DtTabPanel

```vue demo-only
<dt-tab-group activation-mode="auto">
  <template #tabs>
    <dt-tab id="t1" panel-id="p1" selected>First</dt-tab>
    <dt-tab id="t2" panel-id="p2">Second</dt-tab>
    <dt-tab id="t3" panel-id="p3">Third</dt-tab>
  </template>
  <dt-tab-panel id="p1" tab-id="t1"><dt-box surface="secondary" padding="300" border-radius="200">Panel one</dt-box></dt-tab-panel>
  <dt-tab-panel id="p2" tab-id="t2"><dt-box surface="secondary" padding="300" border-radius="200">Panel two</dt-box></dt-tab-panel>
  <dt-tab-panel id="p3" tab-id="t3"><dt-box surface="secondary" padding="300" border-radius="200">Panel three</dt-box></dt-tab-panel>
</dt-tab-group>
```

### DtPagination

```vue demo-only
<dt-pagination :total-pages="10" :current-page="5" />
```

### DtKeyboardShortcut

```vue demo-only
<dt-stack direction="row" gap="200" class="d-ai-center">
  <dt-keyboard-shortcut shortcut="⌘K" />
  <dt-keyboard-shortcut shortcut="⌘⇧P" />
  <dt-keyboard-shortcut shortcut="Ctrl+C" />
</dt-stack>
```

### DtEmptyState

```vue demo-only
<dt-empty-state header-text="Nothing here" body-text="Try adding something to get started." />
```

### DtCodeblock

```vue demo-only
<dt-codeblock code="const greeting = 'Hello, Dialtone';" language="javascript" />
```

<script setup>
import { ref } from 'vue';
const isOpen = ref(false);

const baseColorFamilies = ['red','coral','gold','olive','green','teal','blue','indigo','purple','magenta','berry','tan'];
const colorStops = ['50','100','200','300','400','500','600','700','800','900','950','1000'];
const blackStops = ['50','100','150','200','250','300','350','400','450','500','550','600','650','700','750','800','850','900','950','1000'];

const semanticSurfaceGroups = [
  { name: 'neutral', values: ['primary','secondary','moderate','bold','strong','contrast','backdrop','overlay'] },
  { name: 'neutral opaque', values: ['primary-opaque','secondary-opaque','moderate-opaque','bold-opaque','strong-opaque','contrast-opaque'] },
  { name: 'brand', values: ['brand','brand-subtle','brand-strong'] },
  { name: 'info', values: ['info','info-subtle','info-strong'] },
  { name: 'positive', values: ['positive','positive-subtle','positive-strong'] },
  { name: 'warning', values: ['warning','warning-subtle','warning-strong'] },
  { name: 'critical', values: ['critical','critical-subtle','critical-strong'] },
];

const semanticBgcGroups = [
  { name: 'neutral', values: ['primary','secondary','moderate','bold','strong','contrast','overlay','backdrop'] },
  { name: 'neutral inverted', values: ['primary-inverted','secondary-inverted','moderate-inverted','bold-inverted','strong-inverted','contrast-inverted'] },
  { name: 'neutral opaque', values: ['primary-opaque','secondary-opaque','moderate-opaque','bold-opaque','strong-opaque','contrast-opaque'] },
  { name: 'brand', values: ['brand','brand-subtle','brand-strong','brand-inverted','brand-opaque','brand-subtle-opaque'] },
  { name: 'info', values: ['info','info-subtle','info-strong','info-inverted','info-opaque','info-subtle-opaque'] },
  { name: 'positive', values: ['positive','positive-subtle','positive-strong','positive-inverted','positive-opaque','positive-subtle-opaque'] },
  { name: 'warning', values: ['warning','warning-subtle','warning-strong','warning-inverted','warning-opaque','warning-subtle-opaque'] },
  { name: 'critical', values: ['critical','critical-subtle','critical-strong','critical-inverted','critical-opaque','critical-subtle-opaque'] },
];

const semanticFcGroups = [
  { name: 'neutral', values: ['primary','secondary','tertiary','muted','disabled','placeholder'] },
  { name: 'neutral inverted', values: ['primary-inverted','secondary-inverted','tertiary-inverted','muted-inverted','disabled-inverted','placeholder-inverted'] },
  { name: 'positive', values: ['positive','positive-strong','positive-inverted','positive-strong-inverted'] },
  { name: 'warning', values: ['warning','warning-inverted'] },
  { name: 'critical', values: ['critical','critical-strong','critical-inverted','critical-strong-inverted'] },
  { name: 'info', values: ['info','info-strong','info-inverted','info-strong-inverted'] },
];

const semanticBcGroups = [
  { name: 'neutral', values: ['subtle','default','moderate','bold','accent','focus'] },
  { name: 'brand', values: ['brand','brand-subtle','brand-strong'] },
  { name: 'info', values: ['info','info-subtle','info-strong'] },
  { name: 'positive', values: ['positive','positive-subtle','positive-strong'] },
  { name: 'warning', values: ['warning','warning-subtle','warning-strong'] },
  { name: 'critical', values: ['critical','critical-subtle','critical-strong'] },
];

const typographyGroups = [
  { kind: 'headline', sizes: [300, 400, 500, 600, 700] },
  { kind: 'body', sizes: [100, 200, 300, 400] },
  { kind: 'label', sizes: [100, 200, 300] },
];

const spacingStops = ['50','100','150','200','250','300','350','400','450','500','550','600','650','700','750','800'];
const avatarSizes = [100, 200, 300, 400, 500, 600, 700, 800];
</script>
