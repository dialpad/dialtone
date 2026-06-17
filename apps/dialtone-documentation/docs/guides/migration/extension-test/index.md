---
title: "dt-migration-helper Extension Test"
description: "Visual test fixture for the dt-migration-helper Chrome extension."
---

## Tokens

### Base color palette

```vue demo-only
<div>
  <div v-for="family in baseColorFamilies" :key="family" style="margin-bottom:12px;">
    <div style="font-size:11px;font-weight:600;margin-bottom:4px;opacity:0.7;">{{ family }}</div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;">
      <div v-for="stop in colorStops" :key="stop" :class="`d-bgc-${family}-${stop}`" style="width:40px;height:40px;border-radius:4px;border:1px solid rgba(0,0,0,0.1);" :title="`d-bgc-${family}-${stop}`"></div>
    </div>
  </div>
  <div style="margin-bottom:12px;">
    <div style="font-size:11px;font-weight:600;margin-bottom:4px;opacity:0.7;">black</div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;">
      <div v-for="stop in blackStops" :key="stop" :class="`d-bgc-black-${stop}`" style="width:40px;height:40px;border-radius:4px;border:1px solid rgba(0,0,0,0.1);" :title="`d-bgc-black-${stop}`"></div>
    </div>
  </div>
</div>
```

### Semantic surfaces

```vue demo-only
<div>
  <div v-for="group in semanticSurfaceGroups" :key="group.name" style="margin-bottom:12px;">
    <div style="font-size:11px;font-weight:600;margin-bottom:4px;opacity:0.7;">{{ group.name }}</div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;">
      <dt-box v-for="s in group.values" :key="s" :surface="s" style="width:40px;height:40px;border-radius:4px;border:1px solid rgba(0,0,0,0.1);" :title="s"></dt-box>
    </div>
  </div>
</div>
```

### Semantic background colors

```vue demo-only
<div>
  <div v-for="group in semanticBgcGroups" :key="group.name" style="margin-bottom:12px;">
    <div style="font-size:11px;font-weight:600;margin-bottom:4px;opacity:0.7;">{{ group.name }}</div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;">
      <div v-for="c in group.values" :key="c" :class="`d-bgc-${c}`" style="width:40px;height:40px;border-radius:4px;border:1px solid rgba(0,0,0,0.1);" :title="`d-bgc-${c}`"></div>
    </div>
  </div>
</div>
```

### Semantic foreground colors

```vue demo-only
<div>
  <div v-for="group in semanticFcGroups" :key="group.name" style="margin-bottom:12px;">
    <div style="font-size:11px;font-weight:600;margin-bottom:4px;opacity:0.7;">{{ group.name }}</div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;">
      <div v-for="c in group.values" :key="c" :class="`d-fc-${c} d-bgc-secondary`" style="width:40px;height:40px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;" :title="`d-fc-${c}`">Aa</div>
    </div>
  </div>
</div>
```

### Semantic border colors

```vue demo-only
<div>
  <div v-for="group in semanticBcGroups" :key="group.name" style="margin-bottom:12px;">
    <div style="font-size:11px;font-weight:600;margin-bottom:4px;opacity:0.7;">{{ group.name }}</div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;">
      <div v-for="c in group.values" :key="c" :class="`d-bc-${c}`" style="width:40px;height:40px;border-radius:4px;border:3px solid;" :title="`d-bc-${c}`"></div>
    </div>
  </div>
</div>
```

### Spacing

```vue demo-only
<div>
  <div style="font-size:11px;font-weight:600;margin-bottom:6px;opacity:0.7;">spacing scale</div>
  <div style="display:flex;flex-wrap:wrap;gap:4px;align-items:flex-end;">
    <div v-for="s in spacingStops" :key="s" style="display:flex;flex-direction:column;align-items:center;gap:4px;">
      <div :class="`d-p-${s} d-bgc-brand d-bar-200`" style="min-width:2px;min-height:2px;" :title="`d-p-${s}`"></div>
      <span style="font-size:9px;opacity:0.5;">{{ s }}</span>
    </div>
  </div>
</div>
```

### Shadows

```vue demo-only
<div>
  <div style="font-size:11px;font-weight:600;margin-bottom:6px;opacity:0.7;">shadow scale</div>
  <div style="display:flex;gap:24px;flex-wrap:wrap;">
    <div v-for="s in ['sm','md','lg','xl']" :key="s" style="display:flex;flex-direction:column;align-items:center;gap:6px;">
      <div :class="`d-bs-${s} d-bar-200`" style="width:48px;height:48px;background:var(--dt-color-surface-primary);" :title="`d-bs-${s}`"></div>
      <span style="font-size:9px;opacity:0.5;">{{ s }}</span>
    </div>
  </div>
</div>
```

### Border radius

```vue demo-only
<div>
  <div style="font-size:11px;font-weight:600;margin-bottom:6px;opacity:0.7;">radius scale</div>
  <div style="display:flex;gap:8px;flex-wrap:wrap;">
    <div v-for="r in ['100','200','300','400','500','600','full']" :key="r" style="display:flex;flex-direction:column;align-items:center;gap:6px;">
      <div :class="`d-bgc-secondary d-bar-${r}`" style="width:48px;height:48px;border:1px solid rgba(128,128,128,0.3);" :title="`d-bar-${r}`"></div>
      <span style="font-size:9px;opacity:0.5;">{{ r }}</span>
    </div>
  </div>
</div>
```

### Typography

```vue demo-only
<div>
  <div v-for="group in typographyGroups" :key="group.kind" style="margin-bottom:16px;">
    <div style="font-size:11px;font-weight:600;margin-bottom:6px;opacity:0.7;">{{ group.kind }}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;">
      <div v-for="size in group.sizes" :key="size" style="display:flex;flex-direction:column;align-items:flex-start;gap:4px;border:1px solid rgba(128,128,128,0.2);border-radius:4px;padding:8px 12px;min-width:64px;">
        <dt-text :kind="group.kind" :size="size">Aa</dt-text>
        <span style="font-size:10px;opacity:0.5;">{{ size }}</span>
      </div>
    </div>
  </div>
  <div>
    <div style="font-size:11px;font-weight:600;margin-bottom:6px;opacity:0.7;">code</div>
    <div style="border:1px solid rgba(128,128,128,0.2);border-radius:4px;padding:8px 12px;display:inline-block;">
      <dt-text kind="code">const answer = 42</dt-text>
    </div>
  </div>
</div>
```

## Utility Classes

### Foreground — d-fc-*

```vue demo-only
<div>
  <div v-for="group in semanticFcGroups" :key="group.name" style="margin-bottom:12px;">
    <div style="font-size:11px;font-weight:600;margin-bottom:4px;opacity:0.7;">{{ group.name }}</div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;">
      <div v-for="c in group.values" :key="c" :class="`d-fc-${c} d-bgc-secondary`" style="width:40px;height:40px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;" :title="`d-fc-${c}`">Aa</div>
    </div>
  </div>
  <div v-for="family in baseColorFamilies" :key="family" style="margin-bottom:12px;">
    <div style="font-size:11px;font-weight:600;margin-bottom:4px;opacity:0.7;">{{ family }}</div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;">
      <div v-for="stop in colorStops" :key="stop" :class="`d-fc-${family}-${stop} d-bgc-secondary`" style="width:40px;height:40px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;" :title="`d-fc-${family}-${stop}`">Aa</div>
    </div>
  </div>
  <div style="margin-bottom:12px;">
    <div style="font-size:11px;font-weight:600;margin-bottom:4px;opacity:0.7;">black</div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;">
      <div v-for="stop in blackStops" :key="stop" :class="`d-fc-black-${stop} d-bgc-secondary`" style="width:40px;height:40px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;" :title="`d-fc-black-${stop}`">Aa</div>
    </div>
  </div>
</div>
```

### Background — d-bgc-*

```vue demo-only
<div>
  <div v-for="group in semanticBgcGroups" :key="group.name" style="margin-bottom:12px;">
    <div style="font-size:11px;font-weight:600;margin-bottom:4px;opacity:0.7;">{{ group.name }}</div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;">
      <div v-for="c in group.values" :key="c" :class="`d-bgc-${c}`" style="width:40px;height:40px;border-radius:4px;border:1px solid rgba(0,0,0,0.1);" :title="`d-bgc-${c}`"></div>
    </div>
  </div>
  <div v-for="family in baseColorFamilies" :key="family" style="margin-bottom:12px;">
    <div style="font-size:11px;font-weight:600;margin-bottom:4px;opacity:0.7;">{{ family }}</div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;">
      <div v-for="stop in colorStops" :key="stop" :class="`d-bgc-${family}-${stop}`" style="width:40px;height:40px;border-radius:4px;border:1px solid rgba(0,0,0,0.1);" :title="`d-bgc-${family}-${stop}`"></div>
    </div>
  </div>
  <div style="margin-bottom:12px;">
    <div style="font-size:11px;font-weight:600;margin-bottom:4px;opacity:0.7;">black</div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;">
      <div v-for="stop in blackStops" :key="stop" :class="`d-bgc-black-${stop}`" style="width:40px;height:40px;border-radius:4px;border:1px solid rgba(0,0,0,0.1);" :title="`d-bgc-black-${stop}`"></div>
    </div>
  </div>
</div>
```

### Border — d-bc-*

```vue demo-only
<div>
  <div v-for="group in semanticBcGroups" :key="group.name" style="margin-bottom:12px;">
    <div style="font-size:11px;font-weight:600;margin-bottom:4px;opacity:0.7;">{{ group.name }}</div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;">
      <div v-for="c in group.values" :key="c" :class="`d-bc-${c}`" style="width:40px;height:40px;border-radius:4px;border:3px solid;" :title="`d-bc-${c}`"></div>
    </div>
  </div>
  <div v-for="family in baseColorFamilies" :key="family" style="margin-bottom:12px;">
    <div style="font-size:11px;font-weight:600;margin-bottom:4px;opacity:0.7;">{{ family }}</div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;">
      <div v-for="stop in colorStops" :key="stop" :class="`d-bc-${family}-${stop}`" style="width:40px;height:40px;border-radius:4px;border:3px solid;" :title="`d-bc-${family}-${stop}`"></div>
    </div>
  </div>
  <div style="margin-bottom:12px;">
    <div style="font-size:11px;font-weight:600;margin-bottom:4px;opacity:0.7;">black</div>
    <div style="display:flex;gap:4px;flex-wrap:wrap;">
      <div v-for="stop in blackStops" :key="stop" :class="`d-bc-black-${stop}`" style="width:40px;height:40px;border-radius:4px;border:3px solid;" :title="`d-bc-black-${stop}`"></div>
    </div>
  </div>
</div>
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
<div style="display:flex;flex-wrap:wrap;gap:12px;">
  <dt-chip>Non-interactive (span.d-chip)</dt-chip>
  <dt-chip :interactive="true">Interactive (button.d-chip)</dt-chip>
  <dt-chip @close="() => {}">With close</dt-chip>
  <dt-chip :interactive="true" @close="() => {}">Interactive + close</dt-chip>
</div>
```

### DtModal

```vue demo-only
<div>
  <dt-button @click="isOpen = !isOpen">Open Modal (dialog.d-modal)</dt-button>
  <dt-modal :open="isOpen" header-text="Test Modal" @update:open="isOpen = $event">
    <p>This is a <code>dialog.d-modal</code> in Dialtone next.</p>
  </dt-modal>
</div>
```

### DtAvatar

```vue demo-only
<div style="display:flex;flex-wrap:wrap;gap:16px;align-items:flex-end;">
  <div v-for="size in avatarSizes" :key="size" style="display:flex;flex-direction:column;align-items:center;gap:4px;">
    <dt-avatar :size="size" full-name="Test User" />
    <dt-text kind="code" :size="100">{{ size }}</dt-text>
  </div>
  <dt-avatar-group>
    <dt-avatar :size="300" full-name="Alpha User" />
    <dt-avatar :size="300" full-name="Beta User" />
    <dt-avatar :size="300" full-name="Gamma User" />
    <dt-avatar :size="300" full-name="Delta User" />
  </dt-avatar-group>
</div>
```

### DtBadge

```vue demo-only
<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
  <dt-badge>default</dt-badge>
  <dt-badge kind="count">1</dt-badge>
  <dt-badge kind="count">99+</dt-badge>
  <dt-badge kind="label">label</dt-badge>
  <dt-badge type="info">info</dt-badge>
  <dt-badge type="positive">positive</dt-badge>
  <dt-badge type="warning">warning</dt-badge>
  <dt-badge type="critical">critical</dt-badge>
</div>
```

### DtButton

```vue demo-only
<div style="display:flex;flex-wrap:wrap;gap:8px;">
  <dt-button>Default</dt-button>
  <dt-button importance="outlined">Outlined</dt-button>
  <dt-button importance="clear">Clear</dt-button>
  <dt-button kind="critical">Critical</dt-button>
  <dt-button kind="critical" importance="outlined">Critical outlined</dt-button>
  <dt-button kind="muted" importance="clear">Muted clear</dt-button>
  <dt-button href="#dtchip">Href button</dt-button>
  <dt-button :disabled="true">Disabled</dt-button>
</div>
```

### DtLink

```vue demo-only
<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:baseline;">
  <dt-link href="#dtchip">Default link</dt-link>
  <dt-link href="#dtchip" :underline="false">No underline</dt-link>
  <dt-link href="#dtchip" tone="critical">Critical</dt-link>
  <dt-link href="#dtchip" tone="muted">Muted</dt-link>
  <dt-link href="#dtchip" tone="positive">Positive</dt-link>
  <dt-link href="#dtchip" tone="warning">Warning</dt-link>
  <dt-link href="#dtchip" tone="info">Info</dt-link>
</div>
```

### DtBox

```vue demo-only
<div style="display:flex;flex-wrap:wrap;gap:8px;">
  <dt-box v-for="s in ['primary','secondary','moderate','bold','strong','contrast']" :key="s" :surface="s" class="d-p-300 d-bar-200"><dt-text kind="code" :size="100">{{ s }}</dt-text></dt-box>
</div>
```

### DtText

```vue demo-only
<div>
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
</div>
```

### DtBanner

```vue demo-only
<div style="display:flex;flex-direction:column;gap:8px;">
  <dt-banner kind="base" header-text="Base" />
  <dt-banner kind="info" header-text="Info" />
  <dt-banner kind="positive" header-text="Positive" />
  <dt-banner kind="warning" header-text="Warning" />
  <dt-banner kind="critical" header-text="Critical" />
</div>
```

### DtStack

```vue demo-only
<div style="display:flex;flex-direction:column;gap:16px;">
  <dt-stack direction="row" gap="300">
    <dt-box v-for="n in 5" :key="n" surface="secondary" class="d-p-200 d-bar-200">row {{ n }}</dt-box>
  </dt-stack>
  <dt-stack direction="column" gap="200">
    <dt-box v-for="n in 3" :key="n" surface="secondary" class="d-p-200 d-bar-200">col {{ n }}</dt-box>
  </dt-stack>
</div>
```

### DtInput

```vue demo-only
<div style="display:flex;flex-wrap:wrap;gap:16px;">
  <dt-input label="Default input" placeholder="Placeholder" />
  <dt-input label="Disabled" placeholder="Placeholder" :disabled="true" />
  <dt-input label="With error" model-value="Value" :messages="[{message:'Error message',type:'critical'}]" />
  <dt-input label="With success" model-value="Value" :messages="[{message:'Success message',type:'positive'}]" />
</div>
```

### DtSelectMenu

```vue demo-only
<div style="display:flex;flex-wrap:wrap;gap:16px;">
  <dt-select-menu label="Default select">
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
  </dt-select-menu>
  <dt-select-menu label="Disabled select" :disabled="true">
    <option value="1">Option 1</option>
  </dt-select-menu>
</div>
```

### DtNotice

```vue demo-only
<div style="display:flex;flex-direction:column;gap:8px;">
  <dt-notice kind="base" header-text="Base notice" />
  <dt-notice kind="info" header-text="Info notice" />
  <dt-notice kind="positive" header-text="Positive notice" />
  <dt-notice kind="warning" header-text="Warning notice" />
  <dt-notice kind="critical" header-text="Critical notice" />
</div>
```

### DtToast

```vue demo-only
<div style="display:flex;flex-direction:column;gap:8px;">
  <dt-toast kind="base" header-text="Base toast" message="Toast message" />
  <dt-toast kind="info" header-text="Info toast" message="Toast message" />
  <dt-toast kind="positive" header-text="Positive toast" message="Toast message" />
  <dt-toast kind="warning" header-text="Warning toast" message="Toast message" />
  <dt-toast kind="critical" header-text="Critical toast" message="Toast message" />
</div>
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
