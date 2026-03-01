---
layout: Blank
---

<!-- Just an empty utilitarian page to explore some in a completely blank context -->

<script setup>
import { ref, computed } from 'vue';
import { useThemeManager } from '@composables/useThemeManager';

const {
  currentMode,
  currentContrast,
  currentModeIconName,
  setMode,
  setContrast,
} = useThemeManager();

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const borderless = ref(false);
const outlined = ref(false);
const muted = ref(false);
const showIcon = ref(true);
const showLeading = ref(true);
const showTrailing = ref(true);
const size = ref('md');
const selectOnFocus = ref(false);
const isDisabled = ref(false);
const labelSizeSelection = ref('default');
const resolvedLabelSize = computed(() => labelSizeSelection.value === 'default' ? undefined : labelSizeSelection.value);
</script>

<dt-stack class="d-p32" gap="600">
  <dt-stack direction="row" gap="400">
    <dt-text as="h1" kind="headline" size="2xl">
      Scratchpad
    </dt-text>
    <dt-dropdown navigation-type="arrow-keys" placement="bottom-start">
      <template #anchor>
        <dt-button
          v-dt-tooltip:bottom="`Mode: ${capitalize(currentMode)}`"
          importance="outlined"
          size="sm"
          kind="muted"
          icon-position="right"
          class="dialtone-shell-btn"
        >
          <template #icon="{ iconSize }">
            <dt-icon :name="currentModeIconName" :size="iconSize" />
          </template>
        </dt-button>
      </template>
      <template #list>
        <dt-list-item-group
          heading-class="d-py4 d-px8 d-c-default d-fc-tertiary d-label--sm"
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
          heading-class="d-py4 d-px8 d-c-default d-fc-tertiary d-label--sm"
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
  <dt-stack gap="500">
    <dt-text as="h1" kind="headline" size="xl">
      Disabled Button
    </dt-text>
    <dt-text as="p" kind="body" size="lg">
      Not just a matter of applying opacity to whole button, but w/ combination of `color-mix()` and tweaking existing DtButton css variables via `oklch()` of specific properties – separate opacity and saturation for border, bgc, fc, etc.
    </dt-text>
    <dt-stack class="d-bgc-moderate-opaque d-p12 d-bar8">
      <dt-checkbox v-model="isDisabled">Disabled</dt-checkbox>
    </dt-stack>
    <dt-stack gap="400" ref="disabledAll">
      <dt-stack gap="400" :direction="{ 'default': 'column', 'md': 'row' }">
        <dt-button :disabled="isDisabled"> Place Call <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" importance="outlined"> Place Call <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" importance="clear"> Place Call <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template></dt-button>
      </dt-stack>
      <dt-stack gap="400" :direction="{ 'default': 'column', 'md': 'row' }">
        <dt-button :disabled="isDisabled" kind="danger"> Place Call <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" kind="danger" importance="outlined"> Place Call <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" kind="danger" importance="clear"> Place Call <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template></dt-button>
      </dt-stack>
      <dt-stack gap="400" :direction="{ 'default': 'column', 'md': 'row' }">
        <dt-button :disabled="isDisabled" kind="positive">Place Call<template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" kind="positive" importance="outlined">Place Call<template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" kind="positive" importance="clear">Place Call<template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template></dt-button>
      </dt-stack>
      <dt-stack gap="400" :direction="{ 'default': 'column', 'md': 'row' }">
        <dt-button :disabled="isDisabled" kind="muted" importance="clear"> Place Call <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" kind="muted" importance="outlined"> Place Call <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template></dt-button>
      </dt-stack>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="500">
    <dt-text as="h1" kind="headline" size="xl">
      Button: Leading/Trailing
    </dt-text>
    <dt-text as="p" kind="body" size="lg">
      Freeform elements that are rendered before/after the button content.
    </dt-text>
    <dt-stack gap="400" :direction="{ 'default': 'column', 'md': 'row' }">
      <dt-button kind="muted" importance="outlined" size="xs" trailing-class="d-pr1">
        Place Call
        <template #trailing>
          <dt-badge text="Label" />
        </template>
        <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template>
      </dt-button>
      <dt-button kind="muted" importance="outlined" size="sm" trailing-class="d-pr4">
        Place Call
        <template #trailing>
          <dt-badge text="Label" />
        </template>
        <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template>
      </dt-button>
      <dt-button kind="muted" importance="outlined" size="md" trailing-class="d-pr8">
        Place Call
        <template #trailing>
          <dt-badge text="Label" />
        </template>
        <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template>
      </dt-button>
      <dt-button kind="muted" importance="outlined" size="lg" trailing-class="d-pr10">
        Place Call
        <template #trailing>
          <dt-badge text="Label" />
        </template>
        <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template>
      </dt-button>
      <dt-button kind="muted" importance="outlined" size="xl" trailing-class="d-pr12">
        Place Call
        <template #trailing>
          <dt-badge text="Label" />
        </template>
        <template #icon="{ iconSize }"> <dt-icon name="sun" :size="iconSize" /> </template>
      </dt-button>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="500">
    <dt-text as="h1" kind="headline" size="xl">
      Sizing update: Button/Input/Select
    </dt-text>
    <dt-stack direction="row">
      <dt-select-menu
        size="xs"
        :options="[
              { value: ``, label: `Please select one` },
              { value: `1`, label: `Option 1` },
              { value: `2`, label: `Option 2` },
              { value: `3`, label: `Option 3` },
            ]"
        :model-value="modelValue"
        @input="onInput"
        @change="onChange"
      />
      <dt-input type="text" placeholder="Placeholder" size="xs" />
      <dt-button
        icon-position="left"
        kind="default"
        importance="primary"
        size="xs"
      >
        <template #icon="{ iconSize }">
          <dt-icon name="sun" :size="iconSize" />
        </template>
        Button
      </dt-button>
    </dt-stack>
    <dt-stack direction="row">
      <dt-select-menu
        size="sm"
        :options="[
              { value: ``, label: `Please select one` },
              { value: `1`, label: `Option 1` },
              { value: `2`, label: `Option 2` },
              { value: `3`, label: `Option 3` },
            ]"
        :model-value="modelValue"
        @input="onInput"
        @change="onChange"
      />
      <dt-input type="text" placeholder="Placeholder" size="sm" />
      <dt-button
        icon-position="left"
        kind="default"
        importance="primary"
        size="sm"
      >
        <template #icon="{ iconSize }">
          <dt-icon name="sun" :size="iconSize" />
        </template>
        Button
      </dt-button>
    </dt-stack>
    <dt-stack direction="row">
      <dt-select-menu
        size="md"
        :options="[
              { value: ``, label: `Please select one` },
              { value: `1`, label: `Option 1` },
              { value: `2`, label: `Option 2` },
              { value: `3`, label: `Option 3` },
            ]"
        :model-value="modelValue"
        @input="onInput"
        @change="onChange"
      />
      <dt-input type="text" placeholder="Placeholder" size="md" />
      <dt-button
        icon-position="left"
        kind="default"
        importance="primary"
        size="md"
      >
        <template #icon="{ iconSize }">
          <dt-icon name="sun" :size="iconSize" />
        </template>
        Button
      </dt-button>
    </dt-stack>
    <dt-stack direction="row">
      <dt-select-menu
        size="lg"
        :options="[
              { value: ``, label: `Please select one` },
              { value: `1`, label: `Option 1` },
              { value: `2`, label: `Option 2` },
              { value: `3`, label: `Option 3` },
            ]"
        :model-value="modelValue"
        @input="onInput"
        @change="onChange"
      />
      <dt-input type="text" placeholder="Placeholder" size="lg" />
      <dt-button
        icon-position="left"
        kind="default"
        importance="primary"
        size="lg"
      >
        <template #icon="{ iconSize }">
          <dt-icon name="sun" :size="iconSize" />
        </template>
        Button
      </dt-button>
    </dt-stack>
    <dt-stack direction="row">
      <dt-select-menu
        size="xl"
        :options="[
              { value: ``, label: `Please select one` },
              { value: `1`, label: `Option 1` },
              { value: `2`, label: `Option 2` },
              { value: `3`, label: `Option 3` },
            ]"
        :model-value="modelValue"
        @input="onInput"
        @change="onChange"
      />
      <dt-input type="text" placeholder="Placeholder" size="xl" />
      <dt-button
        icon-position="left"
        kind="default"
        importance="primary"
        size="xl"
      >
        <template #icon="{ iconSize }">
          <dt-icon name="sun" :size="iconSize" />
        </template>
        Button
      </dt-button>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="500">
    <dt-text as="h1" kind="headline" size="xl">
      Input/Select Label Size
    </dt-text>
    <dt-stack gap="500" direction="row" class="d-bgc-moderate-opaque d-p12 d-bar8">
      <dt-select-menu
        :options="[
          { value: 'default', label: 'Default' },
          { value: 'xs', label: 'xs' },
          { value: 'sm', label: 'sm' },
          { value: 'md', label: 'md' },
          { value: 'lg', label: 'lg' },
        ]"
        :model-value="labelSizeSelection"
        @change="labelSizeSelection = $event"
      />
    </dt-stack>
    <dt-stack direction="row">
      <dt-stack gap="400" class="d-fl1">
        <dt-input label="Extra Small" type="text" placeholder="Placeholder" size="xs" :label-size="resolvedLabelSize" />
        <dt-input label="Small" type="text" placeholder="Placeholder" size="sm" :label-size="resolvedLabelSize" />
        <dt-input label="Medium" type="text" placeholder="Placeholder" size="md" :label-size="resolvedLabelSize" />
        <dt-input label="Large" type="text" placeholder="Placeholder" size="lg" :label-size="resolvedLabelSize" />
        <dt-input label="Extra large" type="text" placeholder="Placeholder" size="xl" :label-size="resolvedLabelSize" />
      </dt-stack>
      <dt-stack gap="400" class="d-fl1">
        <!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
        <dt-select-menu
          :options="[
            { value: ``, label: `Please select one` },
            { value: `1`, label: `Option 1` },
            { value: `2`, label: `Option 2` },
            { value: `3`, label: `Option 3` },
          ]"
          label="Label"
          size="xs"
          :label-size="resolvedLabelSize"
          :model-value="modelValue"
          @input="onInput"
          @change="onChange"
        />
        <dt-select-menu
          :options="[
            { value: ``, label: `Please select one` },
            { value: `1`, label: `Option 1` },
            { value: `2`, label: `Option 2` },
            { value: `3`, label: `Option 3` },
          ]"
          label="Label"
          size="sm"
          :label-size="resolvedLabelSize"
          :model-value="modelValue"
          @input="onInput"
          @change="onChange"
        />
        <dt-select-menu
          :options="[
            { value: ``, label: `Please select one` },
            { value: `1`, label: `Option 1` },
            { value: `2`, label: `Option 2` },
            { value: `3`, label: `Option 3` },
          ]"
          label="Label"
          size="md"
          :label-size="resolvedLabelSize"
          :model-value="modelValue"
          @input="onInput"
          @change="onChange"
        />
        <dt-select-menu
          :options="[
            { value: ``, label: `Please select one` },
            { value: `1`, label: `Option 1` },
            { value: `2`, label: `Option 2` },
            { value: `3`, label: `Option 3` },
          ]"
          label="Label"
          size="lg"
          :label-size="resolvedLabelSize"
          :model-value="modelValue"
          @input="onInput"
          @change="onChange"
        />
        <dt-select-menu
          :options="[
            { value: ``, label: `Please select one` },
            { value: `1`, label: `Option 1` },
            { value: `2`, label: `Option 2` },
            { value: `3`, label: `Option 3` },
          ]"
          label="Label"
          size="xl"
          :label-size="resolvedLabelSize"
          :model-value="modelValue"
          @input="onInput"
          @change="onChange"
        />
      </dt-stack>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="500">
    <dt-text as="h1" kind="headline" size="xl">
      Tabs
    </dt-text>
    <dt-text as="p" kind="body" size="lg">
      Just straight up refactor to use DtButton instead of custom markup/style. Use mix of DtButton variants depending on `active`. Uses all DtButton sizes (currently at least).
    </dt-text>
    <dt-stack gap="500" direction="row" align="baseline" class="d-bgc-moderate-opaque d-p12 d-bar8">
      <dt-checkbox v-model="borderless">
        Borderless
      </dt-checkbox>
      <dt-checkbox v-model="outlined">
        Outlined
      </dt-checkbox>
      <dt-checkbox v-model="muted">
        Muted
      </dt-checkbox>
      <dt-checkbox v-model="showIcon">
        Show Icon
      </dt-checkbox>
      <dt-checkbox v-model="showLeading">
        Show Leading
      </dt-checkbox>
      <dt-checkbox v-model="showTrailing">
        Show Trailing
      </dt-checkbox>
      <dt-checkbox v-model="selectOnFocus">
        Select on focus
      </dt-checkbox>
      <dt-select-menu
        :options="[
          { value: 'xs', label: 'xs' },
          { value: 'sm', label: 'sm' },
          { value: 'md', label: 'md (default)' },
          { value: 'lg', label: 'lg' },
          { value: 'xl', label: 'xl' },
        ]"
        :model-value="size"
        @change="size = $event"
      />
    </dt-stack>
    <dt-tab-group :borderless="borderless" :kind="muted ? 'muted' : 'default'" :outlined="outlined" :size="size" :activation-mode="selectOnFocus ? 'auto' : 'manual'">
      <template #tabs>
        <dt-tab id="1" panel-id="2" selected leading-class="d-pl8" trailing-class="d-pr8">
          <template v-if="showIcon" #icon="{ iconSize }">
            <dt-icon name="sun" :size="iconSize" />
          </template>
          Argentina
          <template v-if="showLeading" #leading>
            <dt-badge kind="count" text="1" />
          </template>
          <template v-if="showTrailing" #trailing>
            <dt-badge kind="count" text="1" />
          </template>
        </dt-tab>
        <dt-tab id="3" panel-id="4" leading-class="d-pl8" trailing-class="d-pr8">
          <template v-if="showIcon" #icon="{ iconSize }">
            <dt-icon name="keypad" :size="iconSize" />
          </template>
          United States
          <template v-if="showLeading" #leading>
            <dt-badge kind="count" text="1" />
          </template>
          <template v-if="showTrailing" #trailing>
            <dt-badge kind="count" text="1" />
          </template>
        </dt-tab>
        <dt-tab id="5" panel-id="6">
          <template v-if="showIcon" #icon="{ iconSize }">
            <dt-icon name="moon" :size="iconSize" />
          </template>
          United Kingdom
        </dt-tab>
        <dt-tab id="7" panel-id="8">
          <template v-if="showIcon" #icon="{ iconSize }">
            <dt-icon name="mic" :size="iconSize" />
          </template>
          India
        </dt-tab>
        <dt-tab id="9" panel-id="10" disabled>
          <template v-if="showIcon" #icon="{ iconSize }">
            <dt-icon name="grid" :size="iconSize" />
          </template>
          Canada
        </dt-tab>
      </template>
      <div class="d-py8">
        <dt-tab-panel id="2" tab-id="1">
          <dt-stack gap="400">
            <dt-text as="p" kind="body" size="md">Argentina stretches from subtropical forests in the north to glacial landscapes in the south, encompassing the towering Andes mountains and the vast Pampas grasslands in between.</dt-text>
            <dt-text as="p" kind="body" size="md">Its cities blend European architectural influences with a vibrant local character, while rural traditions of horsemanship and cattle ranching continue to shape the national identity.</dt-text>
            <dt-text as="p" kind="body" size="md">The country is celebrated for its contributions to tango, wine production, and a culinary culture built around shared meals and regional flavors.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="4" tab-id="3">
          <dt-stack gap="400">
            <dt-text as="p" kind="body" size="md">The United States spans a broad continental range, from Atlantic coastlines and Appalachian ridges to Great Plains, Rocky Mountain summits, and Pacific shores beyond.</dt-text>
            <dt-text as="p" kind="body" size="md">Major metropolitan areas serve as centers for finance, technology, and the arts, while smaller communities maintain distinct regional customs, dialects, and culinary traditions.</dt-text>
            <dt-text as="p" kind="body" size="md">The nation's history of immigration has produced a diverse cultural fabric, with influences from virtually every corner of the globe woven into daily life.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="6" tab-id="5">
          <dt-stack gap="400">
            <dt-text as="p" kind="body" size="md">The United Kingdom comprises England, Scotland, Wales, and Northern Ireland, each with distinct landscapes ranging from chalk cliffs and moors to highland lochs and green valleys.</dt-text>
            <dt-text as="p" kind="body" size="md">Its cities layer centuries of history alongside modern architecture, with institutions in education, finance, and governance that have influenced systems around the world.</dt-text>
            <dt-text as="p" kind="body" size="md">A strong tradition in literature, theater, and music continues to thrive, supported by public institutions and a widespread culture of creative expression.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="8" tab-id="7">
          <dt-stack gap="400">
            <dt-text as="p" kind="body" size="md">India extends from the Himalayan ranges in the north through fertile river plains to tropical coastlines in the south, supporting an extraordinary range of ecosystems and climates.</dt-text>
            <dt-text as="p" kind="body" size="md">Hundreds of languages and traditions coexist across its states and territories, producing one of the most culturally varied societies on earth with deep historical roots.</dt-text>
            <dt-text as="p" kind="body" size="md">A growing technology sector and expanding urban centers complement longstanding agricultural and artisan economies that continue to sustain millions of people.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="10" tab-id="9">
          <dt-stack gap="400">
            <dt-text as="p" kind="body" size="md">Canada stretches from the Atlantic to the Pacific and northward into the Arctic, encompassing boreal forests, prairies, mountain ranges, and thousands of lakes and waterways.</dt-text>
            <dt-text as="p" kind="body" size="md">Its cities are known for cultural diversity and livability, while vast rural and wilderness areas support forestry, mining, and agriculture across multiple climate zones.</dt-text>
            <dt-text as="p" kind="body" size="md">Official bilingualism in English and French reflects a history shaped by Indigenous peoples, European settlement, and ongoing immigration from around the world.</dt-text>
          </dt-stack>
        </dt-tab-panel>
      </div>
    </dt-tab-group>
  </dt-stack>
  <dt-stack gap="500">
    <dt-text as="h1" kind="headline" size="xl">
      Notice / Banner / Toast
    </dt-text>
    <dt-text as="p" kind="body" size="lg">
      Updated typography sizing and intelligent icon alignment. Icon margin adjusts based on content layout: title-only, message-only, or title+message.
    </dt-text>
    <dt-stack gap="500">
      <dt-text as="h2" kind="headline" size="lg">
        Notice
      </dt-text>
      <div class="d-d-grid d-g32 d-g-cols2">
        <dt-stack gap="400">
          <dt-text as="h3" kind="headline" size="md">Default</dt-text>
          <dt-notice kind="success" title="Success" hide-action>
            Action completed successfully.
          </dt-notice>
          <dt-notice kind="warning" title="Warning" hide-action>
            Please review before proceeding.
          </dt-notice>
          <dt-notice kind="error" title="Error" hide-action>
            Something went wrong. Please try again.
          </dt-notice>
          <dt-notice kind="base" title="Base" hide-action>
            A neutral notice for general information.
          </dt-notice>
        </dt-stack>
        <dt-stack gap="400">
          <dt-text as="h3" kind="headline" size="md">Important</dt-text>
          <dt-notice kind="info" title="Important info" :important="true" hide-action>
            Visually prominent variant with filled background.
          </dt-notice>
          <dt-notice kind="success" title="Important success" :important="true" hide-action>
            Visually prominent variant with filled background.
          </dt-notice>
          <dt-notice kind="warning" title="Important warning" :important="true" hide-action>
            Visually prominent variant with filled background.
          </dt-notice>
          <dt-notice kind="error" title="Important error" :important="true" hide-action>
            Visually prominent variant with filled background.
          </dt-notice>
        </dt-stack>
        <dt-stack gap="400">
          <dt-text as="h3" kind="headline" size="md">Alignment per internal parts</dt-text>
          <dt-notice kind="info" title="Title only" hide-action />
          <dt-notice kind="info" hide-action>
            Message only — icon aligns to center when there is a single line of content.
          </dt-notice>
          <dt-notice kind="info" title="Title and message" hide-action>
            When both title and message are present, the icon aligns to the top of the content stack.
          </dt-notice>
        </dt-stack>
      </div>
    </dt-stack>
    <dt-stack gap="500">
      <dt-text as="h2" kind="headline" size="lg">
        Banner
      </dt-text>
      <dt-stack gap="400">
        <dt-banner kind="info" title="Info banner" class="d-ps-relative d-zi-base">
          Banners are more prominent than notices.
        </dt-banner>
        <dt-banner kind="success" title="Success banner" class="d-ps-relative d-zi-base">
          Action completed successfully.
        </dt-banner>
        <dt-banner kind="warning" title="Warning banner" class="d-ps-relative d-zi-base">
          Please review before proceeding.
        </dt-banner>
        <dt-banner kind="error" title="Error banner" class="d-ps-relative d-zi-base">
          Something went wrong.
        </dt-banner>
      </dt-stack>
      <dt-stack gap="400">
        <dt-text as="h3" kind="headline" size="md">Important</dt-text>
        <dt-banner kind="info" title="Info banner" :important="true" class="d-ps-relative d-zi-base">
          Banners are more prominent than notices.
        </dt-banner>
        <dt-banner kind="success" title="Success banner" :important="true" class="d-ps-relative d-zi-base">
          Action completed successfully.
        </dt-banner>
        <dt-banner kind="warning" title="Warning banner" :important="true" class="d-ps-relative d-zi-base">
          Please review before proceeding.
        </dt-banner>
        <dt-banner kind="error" title="Error banner" :important="true" class="d-ps-relative d-zi-base">
          Something went wrong.
        </dt-banner>
      </dt-stack>
    </dt-stack>
    <dt-stack gap="500">
      <dt-text as="h2" kind="headline" size="lg">
        Toast
      </dt-text>
      <div class="d-d-grid d-g32 d-g-cols2">
        <dt-stack gap="400">
          <dt-text as="h3" kind="headline" size="md">Default</dt-text>
          <dt-toast :show="true" kind="info" title="Info toast" message="Informational message." :duration="null" />
          <dt-toast :show="true" kind="success" title="Success toast" message="Action completed." :duration="null" />
          <dt-toast :show="true" kind="warning" title="Warning toast" message="Review before proceeding." :duration="null" />
          <dt-toast :show="true" kind="error" title="Error toast" message="Something went wrong." :duration="null" />
          <dt-toast :show="true" kind="base" title="Base toast" message="Neutral notification." :duration="null" />
        </dt-stack>
        <dt-stack gap="400">
          <dt-text as="h3" kind="headline" size="md">Important</dt-text>
          <dt-toast :show="true" kind="info" title="Info toast" message="Informational message." :important="true" :duration="null" />
          <dt-toast :show="true" kind="success" title="Success toast" message="Action completed." :important="true" :duration="null" />
          <dt-toast :show="true" kind="warning" title="Warning toast" message="Review before proceeding." :important="true" :duration="null" />
          <dt-toast :show="true" kind="error" title="Error toast" message="Something went wrong." :important="true" :duration="null" />
          <dt-toast :show="true" kind="base" title="Base toast" message="Neutral notification." :important="true" :duration="null" />
        </dt-stack>
        <dt-stack gap="400">
          <dt-text as="h3" kind="headline" size="md">Alignment per internal parts</dt-text>
          <dt-toast :show="true" kind="info" title="Title only" :duration="null" />
          <dt-toast :show="true" kind="info" message="Action completed." :duration="null" />
          <dt-toast :show="true" kind="info" title="Title and message" message="Review before proceeding." :duration="null" />
        </dt-stack>
      </div>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="500">
    <dt-text as="h1" kind="headline" size="xl">
      Radio / Checkbox Label Sizes
    </dt-text>
    <dt-text as="p" kind="body" size="lg">
      Label size prop controls typography size via DtText. Alignment stays consistent across sizes.
    </dt-text>
    <dt-stack gap="500" direction="row">
      <dt-stack gap="400" class="d-fl1">
        <dt-text as="h2" kind="headline" size="lg">Checkbox</dt-text>
        <dt-checkbox label="Extra small label" label-size="xs" />
        <dt-checkbox label="Small label" label-size="sm" />
        <dt-checkbox label="Medium label (default)" />
        <dt-checkbox label="Large label" label-size="lg" />
      </dt-stack>
      <dt-stack gap="400" class="d-fl1">
        <dt-text as="h2" kind="headline" size="lg">Radio</dt-text>
        <dt-radio label="Extra small label" value="1" label-size="xs" />
        <dt-radio label="Small label" value="2" label-size="sm" />
        <dt-radio label="Medium label (default)" value="3" />
        <dt-radio label="Large label" value="4" label-size="lg" />
      </dt-stack>
    </dt-stack>
    <dt-stack gap="500">
      <dt-text as="h2" kind="headline" size="lg">With descriptions</dt-text>
      <dt-stack gap="500" direction="row">
        <dt-stack gap="400" class="d-fl1">
          <dt-checkbox label="Small label" label-size="sm">
            <template #description>Description text alongside small label</template>
          </dt-checkbox>
          <dt-checkbox label="Medium label">
            <template #description>Description text alongside medium label</template>
          </dt-checkbox>
          <dt-checkbox label="Large label" label-size="lg">
            <template #description>Description text alongside large label</template>
          </dt-checkbox>
        </dt-stack>
        <dt-stack gap="400" class="d-fl1">
          <dt-radio label="Small label" value="5" label-size="sm">
            <template #description>Description text alongside small label</template>
          </dt-radio>
          <dt-radio label="Medium label" value="6">
            <template #description>Description text alongside medium label</template>
          </dt-radio>
          <dt-radio label="Large label" value="7" label-size="lg">
            <template #description>Description text alongside large label</template>
          </dt-radio>
        </dt-stack>
      </dt-stack>
    </dt-stack>
    <dt-stack gap="500">
      <dt-text as="h2" kind="headline" size="lg">Disabled</dt-text>
      <dt-stack gap="500" direction="row">
        <dt-stack gap="400" class="d-fl1">
          <dt-checkbox label="Disabled small" label-size="sm" disabled />
          <dt-checkbox label="Disabled medium" disabled />
          <dt-checkbox label="Disabled large" label-size="lg" disabled />
        </dt-stack>
        <dt-stack gap="400" class="d-fl1">
          <dt-radio label="Disabled small" value="8" label-size="sm" disabled />
          <dt-radio label="Disabled medium" value="9" disabled />
          <dt-radio label="Disabled large" value="10" label-size="lg" disabled />
        </dt-stack>
      </dt-stack>
    </dt-stack>
  </dt-stack>
</dt-stack>
<div class="d-h768"></div>
