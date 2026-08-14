---
layout: Blank
---

<dt-stack class="d-p-400 d-bgc-primary" gap="400">
  <dt-stack gap="100">
    <dt-box>
      <dt-toggle label-class="d-pie-100" size="200">Label</dt-toggle>
    </dt-box>
    <dt-stack direction="row" gap="100" align="start">
      <dt-box>
        <dt-input
          label="Label"
          placeholder="Placeholder"
        />
      </dt-box>
      <dt-box>
        <dt-select-menu
          :options="[
                { value: ``, label: `Please select one` },
                { value: `1`, label: `Option 1` },
                { value: `2`, label: `Option 2` },
                { value: `3`, label: `Option 3` },
              ]"
          label="Label"
          :model-value="modelValue"
          @update:model-value="onInput"
        />
      </dt-box>
    </dt-stack>
    <dt-box>
      <dt-stack gap="100">
        <dt-stack gap="100" :direction="{ 'default': 'column', 'md': 'row' }">
          <dt-button :disabled="isDisabled"> Place Call </dt-button>
          <dt-button :disabled="isDisabled" importance="outlined"> Place Call </dt-button>
          <dt-button :disabled="isDisabled" importance="clear"> Place Call </dt-button>
        </dt-stack>
        <dt-stack gap="100" :direction="{ 'default': 'column', 'md': 'row' }">
          <dt-button :disabled="isDisabled" kind="critical"> Place Call </dt-button>
          <dt-button :disabled="isDisabled" kind="critical" importance="outlined"> Place Call </dt-button>
          <dt-button :disabled="isDisabled" kind="critical" importance="clear"> Place Call </dt-button>
        </dt-stack>
        <dt-stack gap="100" :direction="{ 'default': 'column', 'md': 'row' }">
          <dt-button :disabled="isDisabled" kind="positive">Place Call</dt-button>
          <dt-button :disabled="isDisabled" kind="positive" importance="outlined">Place Call</dt-button>
          <dt-button :disabled="isDisabled" kind="positive" importance="clear">Place Call</dt-button>
        </dt-stack>
        <dt-stack gap="100" :direction="{ 'default': 'column', 'md': 'row' }">
          <dt-button :disabled="isDisabled" kind="muted" importance="clear"> Place Call </dt-button>
          <dt-button :disabled="isDisabled" kind="muted" importance="outlined"> Place Call </dt-button>
        </dt-stack>
      </dt-stack>
    </dt-box>
    <dt-box>
      <dt-checkbox-group
        name="fruits-checkbox-group"
        legend="Fruits"
      >
        <dt-checkbox value="apple"><span>Apple</span></dt-checkbox>
        <dt-checkbox value="banana" checked><span>Banana</span></dt-checkbox>
        <dt-checkbox value="orange"><span>Orange</span></dt-checkbox>
        <dt-checkbox value="other" indeterminate><span>Other</span></dt-checkbox>
      </dt-checkbox-group>
    </dt-box>
    <dt-box>
      <dt-radio-group
        name="fruits-radio-group"
        legend="Fruits"
      >
        <dt-radio checked value="apple"><span>Apple</span></dt-radio>
        <dt-radio value="banana"><span>Banana</span></dt-radio>
        <dt-radio value="other"><span>Other</span></dt-radio>
      </dt-radio-group>
    </dt-box>
  </dt-stack>
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

<dt-stack gap="100">
  <dt-stack direction="row" align="start" gap="100">
    <dt-stack align="center" gap="50">
      <dt-text variant="body-xs" size="50">200</dt-text>
      <dt-avatar :size="200" presence="away" image-src="/assets/images/person.png" image-alt="Person Avatar" />
    </dt-stack>
    <dt-stack align="center" gap="50">
      <dt-text variant="body-xs" size="50">200</dt-text>
      <dt-avatar :size="200" presence="away" seed="user-2" full-name="Marshall Mathers" />
    </dt-stack>
    <dt-stack align="center" gap="50">
      <dt-text variant="body-xs" size="50">250</dt-text>
      <dt-avatar :size="250" presence="away" image-src="/assets/images/person.png" image-alt="Person Avatar" />
    </dt-stack>
    <dt-stack align="center" gap="50">
      <dt-text variant="body-xs" size="50">250</dt-text>
      <dt-avatar :size="250" presence="away" seed="user-2" full-name="Marshall Mathers" />
    </dt-stack>
    <dt-stack align="center" gap="50">
      <dt-text variant="body-xs" size="50">300</dt-text>
      <dt-avatar :size="300" presence="busy" image-src="/assets/images/person.png" image-alt="Person Avatar" />
    </dt-stack>
    <dt-stack align="center" gap="50">
      <dt-text variant="body-xs" size="50">300</dt-text>
      <dt-avatar :size="300" presence="busy" seed="user-3" full-name="Marshall Mathers" />
    </dt-stack>
    <dt-stack align="center" gap="50">
      <dt-text variant="body-xs" size="50">400</dt-text>
      <dt-avatar :size="400" presence="dnd" image-src="/assets/images/person.png" image-alt="Person Avatar" />
    </dt-stack>
    <dt-stack align="center" gap="50">
      <dt-text variant="body-xs" size="50">400</dt-text>
      <dt-avatar :size="400" presence="dnd" seed="user-4" full-name="Marshall Mathers" />
    </dt-stack>
    <dt-stack align="center" gap="50">
      <dt-text variant="body-xs" size="50">500</dt-text>
      <dt-avatar :size="500" presence="offline" image-src="/assets/images/person.png" image-alt="Person Avatar" />
    </dt-stack>
    <dt-stack align="center" gap="50">
      <dt-text variant="body-xs" size="50">500</dt-text>
      <dt-avatar :size="500" presence="offline" seed="user-5" full-name="Marshall Mathers" />
    </dt-stack>
  </dt-stack>
</dt-stack>
<dt-stack gap="200">
  <dt-stack gap="300" direction="row" align="start">
    <dt-stack direction="row" align="center" gap="100">
      <dt-presence presence="active" />
      <dt-presence presence="busy" />
      <dt-presence presence="away" />
      <dt-presence presence="offline" />
    </dt-stack>
    <dt-stack direction="row" align="center" gap="100">
      <dt-avatar :size="200" presence="active" image-src="/assets/images/person.png" image-alt="Person Avatar" />
      <dt-avatar :size="200" presence="busy" image-src="/assets/images/person.png" image-alt="Person Avatar" />
      <dt-avatar :size="200" presence="away" image-src="/assets/images/person.png" image-alt="Person Avatar" />
      <dt-avatar :size="200" presence="offline" image-src="/assets/images/person.png" image-alt="Person Avatar" />
    </dt-stack>
    <dt-stack direction="row" align="center" gap="100">
      <dt-avatar :size="250" presence="active" image-src="/assets/images/person.png" image-alt="Person Avatar" />
      <dt-avatar :size="250" presence="busy" image-src="/assets/images/person.png" image-alt="Person Avatar" />
      <dt-avatar :size="250" presence="away" image-src="/assets/images/person.png" image-alt="Person Avatar" />
      <dt-avatar :size="250" presence="offline" image-src="/assets/images/person.png" image-alt="Person Avatar" />
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
  <dt-stack gap="300" direction="row" align="start">
    <dt-stack direction="row" align="center" gap="100">
      <dt-presence presence="active" />
      <dt-presence presence="busy" />
      <dt-presence presence="away" />
      <dt-presence presence="offline" />
    </dt-stack>
    <dt-stack direction="row" align="center" gap="100">
      <dt-avatar :size="200" presence="active" full-name="Layla El-Sayed" />
      <dt-avatar :size="200" presence="busy" full-name="Luca Ferrari" />
      <dt-avatar :size="200" presence="away" full-name="Nia Griffiths" />
      <dt-avatar :size="200" presence="offline" full-name="Hana Horvat" />
    </dt-stack>
    <dt-stack direction="row" align="center" gap="100">
      <dt-avatar :size="250" presence="active" full-name="Layla El-Sayed" />
      <dt-avatar :size="250" presence="busy" full-name="Luca Ferrari" />
      <dt-avatar :size="250" presence="away" full-name="Nia Griffiths" />
      <dt-avatar :size="250" presence="offline" full-name="Hana Horvat" />
    </dt-stack>
    <dt-stack direction="row" align="center" gap="100">
      <dt-avatar :size="300" presence="active" full-name="Arjun Iyer" />
      <dt-avatar :size="300" presence="busy" full-name="Min-jun Jeong" />
      <dt-avatar :size="300" presence="away" full-name="Zofia Kowalska" />
      <dt-avatar :size="300" presence="offline" full-name="Mateo López" />
    </dt-stack>
    <dt-stack direction="row" align="center" gap="100">
      <dt-avatar :size="400" presence="active" full-name="Zanele Mbeki" />
      <dt-avatar :size="400" presence="busy" full-name="Chidi Nwosu" />
      <dt-avatar :size="400" presence="away" full-name="Aoife O'Sullivan" />
      <dt-avatar :size="400" presence="offline" full-name="Inês Pereira" />
    </dt-stack>
    <dt-stack direction="row" align="center" gap="100">
      <dt-avatar :size="500" presence="active" full-name="Lian Qiao" />
      <dt-avatar :size="500" presence="busy" full-name="Priya Raman" />
      <dt-avatar :size="500" presence="away" full-name="Leila Saleh" />
      <dt-avatar :size="500" presence="offline" full-name="Sione Tui" />
    </dt-stack>
  </dt-stack>
</dt-stack>

<p>
  A sentence goes here
  <dt-chip interactive size="200"> <template #icon> <dt-icon name="box-select" size="200" /> </template> Chip </dt-chip>
  with an inline
  <dt-chip interactive size="100"> <template #icon> <dt-icon name="box-select" size="200" /> </template> Chip </dt-chip>
  and even an inline
  <dt-badge>Badge</dt-badge>
  and a chip without actionable parts
  <dt-chip> Chip </dt-chip>
  and stuff
</p>

<dt-stack gap="100">
  <dt-stack direction="row" gap="200">
    <dt-box class="d-fl1 d-w100p" border-color="subtle" border-width-block-end="50" border-width-block-start="50">
      <dt-stack
        direction="row"
        align="center"
        gap="50"
      >
        <dt-chip interactive size="100">Chip</dt-chip>
        <dt-chip interactive size="100" :show-close="false">Chip</dt-chip>
        <dt-chip interactive size="100">
          <template #icon>
            <dt-icon name="box-select" size="200" />
          </template>
          Chip
        </dt-chip>
        <dt-chip interactive size="100">
          <template #avatar>
            <dt-avatar image-src="/assets/images/person.png" image-alt="Jaqueline Nackos" full-name="Jaqueline Nackos" />
          </template>
          Chip
        </dt-chip>
      </dt-stack>
    </dt-box>
    <dt-box class="d-fl1 d-w100p" border-color="subtle" border-width-block-end="50" border-width-block-start="50">
      <dt-stack
        direction="row"
        align="center"
        gap="50"
      >
        <dt-chip interactive size="200">Chip</dt-chip>
        <dt-chip interactive size="200" :show-close="false">Chip</dt-chip>
        <dt-chip interactive size="200">
          <template #icon>
            <dt-icon name="box-select" />
          </template>
          Chip
        </dt-chip>
        <dt-chip interactive size="200">
          <template #avatar>
            <dt-avatar image-src="/assets/images/person.png" image-alt="Jaqueline Nackos" full-name="Jaqueline Nackos" />
          </template>
          Chip
        </dt-chip>
      </dt-stack>
    </dt-box>
    <dt-box class="d-fl1 d-w100p" border-color="subtle" border-width-block-end="50" border-width-block-start="50">
      <dt-stack
        direction="row"
        align="center"
        gap="50"
      >
        <dt-chip interactive>Chip</dt-chip>
        <dt-chip interactive :show-close="false">Chip</dt-chip>
        <dt-chip interactive>
          <template #icon>
            <dt-icon name="box-select" size="200" />
          </template>
          Chip
        </dt-chip>
        <dt-chip interactive>
          <template #avatar>
            <dt-avatar image-src="/assets/images/person.png" image-alt="Jaqueline Nackos" full-name="Jaqueline Nackos" />
          </template>
          Chip
        </dt-chip>
      </dt-stack>
    </dt-box>
  </dt-stack>
  <dt-box>
    <dt-stack
      direction="row"
      align="start"
      gap="200"
    >
      <div class="d-fl1 d-w100p">
        <dt-combobox-multi-select
          label="First name"
          size="100"
          :selected-items="selectedFirstNames"
          @update:model-value="onFirstNameInput"
          @select="onFirstNameSelect"
          @remove="onFirstNameRemove"
        >
          <template #list>
            <dt-stack as="ul" class="d-ps-relative d-m-50 d-px-0">
              <dt-list-item
                v-for="(item, i) in firstNameItems"
                :key="item.id"
                role="option"
                navigation-type="arrow-keys"
                @click="onFirstNameSelect(i)"
              >
                {{ item.value }}
                <template #right>
                  <dt-text variant="body-sm" tone="tertiary">{{ item.type }}</dt-text>
                </template>
              </dt-list-item>
            </dt-stack>
          </template>
        </dt-combobox-multi-select>
      </div>
      <div class="d-fl1 d-w100p">
        <dt-combobox-multi-select
          label="MLB team"
          size="200"
          :selected-items="selectedMlbTeams"
          @update:model-value="onMlbTeamInput"
          @select="onMlbTeamSelect"
          @remove="onMlbTeamRemove"
        >
          <template #list>
            <dt-stack as="ul" class="d-ps-relative d-m-50 d-px-0">
              <dt-list-item
                v-for="(item, i) in mlbTeamItems"
                :key="item.id"
                role="option"
                navigation-type="arrow-keys"
                @click="onMlbTeamSelect(i)"
              >
                {{ item.value }}
                <template #right>
                  <dt-text variant="body-sm" tone="tertiary">{{ item.type }}</dt-text>
                </template>
              </dt-list-item>
            </dt-stack>
          </template>
        </dt-combobox-multi-select>
      </div>
      <div class="d-fl1 d-w100p">
        <dt-combobox-multi-select
          label="Color"
          size="300"
          :selected-items="selectedColors"
          @update:model-value="onColorInput"
          @select="onColorSelect"
          @remove="onColorRemove"
        >
          <template #list>
            <dt-stack as="ul" class="d-ps-relative d-m-50 d-px-0">
              <dt-list-item
                v-for="(item, i) in colorItems"
                :key="item.id"
                role="option"
                navigation-type="arrow-keys"
                @click="onColorSelect(i)"
              >
                {{ item.value }}
                <template #right>
                  <dt-text variant="body-sm" tone="tertiary">{{ item.type }}</dt-text>
                </template>
              </dt-list-item>
            </dt-stack>
          </template>
        </dt-combobox-multi-select>
      </div>
    </dt-stack>
  </dt-box>
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
    position="sticky"
    inset-block-start="0"
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

  <dt-text kind="headline" size="md">Positioning props</dt-text>

```vue demo
<dt-box padding="200" surface="primary" border-width="100" border-radius="200" position="sticky" inset-block-start="0">
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

const FIRST_NAME_ITEMS_DATA = [
  { id: 'first-name-avery', value: 'Avery', type: 'First name' },
  { id: 'first-name-jordan', value: 'Jordan', type: 'First name' },
  { id: 'first-name-maya', value: 'Maya', type: 'First name' },
  { id: 'first-name-theo', value: 'Theo', type: 'First name' },
  { id: 'first-name-priya', value: 'Priya', type: 'First name' },
  { id: 'first-name-mateo', value: 'Mateo', type: 'First name' },
  { id: 'first-name-amara', value: 'Amara', type: 'First name' },
  { id: 'first-name-benjamin', value: 'Benjamin', type: 'First name' },
  { id: 'first-name-chloe', value: 'Chloe', type: 'First name' },
  { id: 'first-name-diego', value: 'Diego', type: 'First name' },
  { id: 'first-name-elena', value: 'Elena', type: 'First name' },
  { id: 'first-name-finn', value: 'Finn', type: 'First name' },
  { id: 'first-name-grace', value: 'Grace', type: 'First name' },
  { id: 'first-name-hugo', value: 'Hugo', type: 'First name' },
  { id: 'first-name-isla', value: 'Isla', type: 'First name' },
  { id: 'first-name-kai', value: 'Kai', type: 'First name' },
  { id: 'first-name-leila', value: 'Leila', type: 'First name' },
  { id: 'first-name-noah', value: 'Noah', type: 'First name' },
  { id: 'first-name-olivia', value: 'Olivia', type: 'First name' },
  { id: 'first-name-rafael', value: 'Rafael', type: 'First name' },
  { id: 'first-name-samira', value: 'Samira', type: 'First name' },
  { id: 'first-name-wesley', value: 'Wesley', type: 'First name' },
  { id: 'first-name-yara', value: 'Yara', type: 'First name' },
  { id: 'first-name-zane', value: 'Zane', type: 'First name' },
];

const MLB_TEAM_ITEMS_DATA = [
  { id: 'mlb-baltimore-orioles', value: 'Baltimore Orioles', type: 'AL East' },
  { id: 'mlb-boston-red-sox', value: 'Boston Red Sox', type: 'AL East' },
  { id: 'mlb-new-york-yankees', value: 'New York Yankees', type: 'AL East' },
  { id: 'mlb-tampa-bay-rays', value: 'Tampa Bay Rays', type: 'AL East' },
  { id: 'mlb-toronto-blue-jays', value: 'Toronto Blue Jays', type: 'AL East' },
  { id: 'mlb-chicago-white-sox', value: 'Chicago White Sox', type: 'AL Central' },
  { id: 'mlb-cleveland-guardians', value: 'Cleveland Guardians', type: 'AL Central' },
  { id: 'mlb-detroit-tigers', value: 'Detroit Tigers', type: 'AL Central' },
  { id: 'mlb-kansas-city-royals', value: 'Kansas City Royals', type: 'AL Central' },
  { id: 'mlb-minnesota-twins', value: 'Minnesota Twins', type: 'AL Central' },
  { id: 'mlb-athletics', value: 'Athletics', type: 'AL West' },
  { id: 'mlb-houston-astros', value: 'Houston Astros', type: 'AL West' },
  { id: 'mlb-los-angeles-angels', value: 'Los Angeles Angels', type: 'AL West' },
  { id: 'mlb-seattle-mariners', value: 'Seattle Mariners', type: 'AL West' },
  { id: 'mlb-texas-rangers', value: 'Texas Rangers', type: 'AL West' },
  { id: 'mlb-atlanta-braves', value: 'Atlanta Braves', type: 'NL East' },
  { id: 'mlb-miami-marlins', value: 'Miami Marlins', type: 'NL East' },
  { id: 'mlb-new-york-mets', value: 'New York Mets', type: 'NL East' },
  { id: 'mlb-philadelphia-phillies', value: 'Philadelphia Phillies', type: 'NL East' },
  { id: 'mlb-washington-nationals', value: 'Washington Nationals', type: 'NL East' },
  { id: 'mlb-chicago-cubs', value: 'Chicago Cubs', type: 'NL Central' },
  { id: 'mlb-cincinnati-reds', value: 'Cincinnati Reds', type: 'NL Central' },
  { id: 'mlb-milwaukee-brewers', value: 'Milwaukee Brewers', type: 'NL Central' },
  { id: 'mlb-pittsburgh-pirates', value: 'Pittsburgh Pirates', type: 'NL Central' },
  { id: 'mlb-st-louis-cardinals', value: 'St. Louis Cardinals', type: 'NL Central' },
  { id: 'mlb-arizona-diamondbacks', value: 'Arizona Diamondbacks', type: 'NL West' },
  { id: 'mlb-colorado-rockies', value: 'Colorado Rockies', type: 'NL West' },
  { id: 'mlb-los-angeles-dodgers', value: 'Los Angeles Dodgers', type: 'NL West' },
  { id: 'mlb-san-diego-padres', value: 'San Diego Padres', type: 'NL West' },
  { id: 'mlb-san-francisco-giants', value: 'San Francisco Giants', type: 'NL West' },
];

const COLOR_ITEMS_DATA = [
  { id: 'color-crimson', value: 'Crimson', type: 'Warm' },
  { id: 'color-amber', value: 'Amber', type: 'Warm' },
  { id: 'color-emerald', value: 'Emerald', type: 'Cool' },
  { id: 'color-cobalt', value: 'Cobalt', type: 'Cool' },
  { id: 'color-violet', value: 'Violet', type: 'Cool' },
  { id: 'color-slate', value: 'Slate', type: 'Neutral' },
  { id: 'color-indigo', value: 'Indigo', type: 'Cool' },
  { id: 'color-rose', value: 'Rose', type: 'Warm' },
  { id: 'color-tangerine', value: 'Tangerine', type: 'Warm' },
  { id: 'color-lime', value: 'Lime', type: 'Warm' },
  { id: 'color-teal', value: 'Teal', type: 'Cool' },
  { id: 'color-sage', value: 'Sage', type: 'Cool' },
  { id: 'color-azure', value: 'Azure', type: 'Cool' },
  { id: 'color-plum', value: 'Plum', type: 'Cool' },
  { id: 'color-mint', value: 'Mint', type: 'Cool' },
  { id: 'color-coral', value: 'Coral', type: 'Warm' },
  { id: 'color-saffron', value: 'Saffron', type: 'Warm' },
  { id: 'color-pearl', value: 'Pearl', type: 'Neutral' },
  { id: 'color-onyx', value: 'Onyx', type: 'Neutral' },
  { id: 'color-charcoal', value: 'Charcoal', type: 'Neutral' },
  { id: 'color-graphite', value: 'Graphite', type: 'Neutral' },
  { id: 'color-smoke', value: 'Smoke', type: 'Neutral' },
  { id: 'color-ash', value: 'Ash', type: 'Neutral' },
  { id: 'color-sand', value: 'Sand', type: 'Neutral' },
  { id: 'color-dust', value: 'Dust', type: 'Neutral' },
  { id: 'color-mist', value: 'Mist', type: 'Neutral' },
  { id: 'color-fog', value: 'Fog', type: 'Neutral' },
  { id: 'color-moonlight', value: 'Moonlight', type: 'Neutral' },
];

function createComboboxState (itemsData) {
  const items = ref([...itemsData]);
  const selectedItems = ref([]);

  function onInput (value) {
    const normalizedValue = value.toLowerCase();
    items.value = itemsData.filter(item => item.value.toLowerCase().includes(normalizedValue));
  }

  function onSelect (i) {
    if (items.value[i]) {
      const item = items.value[i].value;
      if (!selectedItems.value.includes(item)) {
        selectedItems.value.push(item);
      }
      items.value = [...itemsData];
    }
  }

  function onRemove (item) {
    const index = selectedItems.value.indexOf(item);
    if (index >= 0) {
      selectedItems.value.splice(index, 1);
    }
  }

  return {
    items,
    selectedItems,
    onInput,
    onSelect,
    onRemove,
  };
}

const {
  items: firstNameItems,
  selectedItems: selectedFirstNames,
  onInput: onFirstNameInput,
  onSelect: onFirstNameSelect,
  onRemove: onFirstNameRemove,
} = createComboboxState(FIRST_NAME_ITEMS_DATA);

const {
  items: mlbTeamItems,
  selectedItems: selectedMlbTeams,
  onInput: onMlbTeamInput,
  onSelect: onMlbTeamSelect,
  onRemove: onMlbTeamRemove,
} = createComboboxState(MLB_TEAM_ITEMS_DATA);

const {
  items: colorItems,
  selectedItems: selectedColors,
  onInput: onColorInput,
  onSelect: onColorSelect,
  onRemove: onColorRemove,
} = createComboboxState(COLOR_ITEMS_DATA);

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
