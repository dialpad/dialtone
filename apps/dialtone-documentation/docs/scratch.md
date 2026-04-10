---
layout: Blank
---

<!-- Just an empty utilitarian page to explore some in a completely blank context -->

<script setup>
import { ref, computed } from 'vue';
import ExampleTabs from '@exampleComponents/ExampleTabs.vue';
import { DtTabGroup, DtTab, DtTabPanel } from '@dialpad/dialtone-vue';
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
const inputMessages = computed(() => showInputMessages.value ? [{ message: 'Error validation message', type: 'error' }] : []);
const showInputMessagesClass = ref(false);
const resolvedInputMessagesClass = computed(() => showInputMessagesClass.value ? 'd-bgc-critical' : undefined);
const showInputDescriptionClass = ref(false);
const resolvedInputDescriptionClass = computed(() => showInputDescriptionClass.value ? 'd-bgc-success' : undefined);
const showDescription = ref(false);
const showCheckRadioMessages = ref(false);
const checkRadioMessages = computed(() => showCheckRadioMessages.value ? [{ message: 'Error validation message', type: 'error' }] : []);
const showCheckRadioMessagesClass = ref(false);
const resolvedCheckRadioMessagesClass = computed(() => showCheckRadioMessagesClass.value ? 'd-bgc-critical' : undefined);
const showCheckRadioDescriptionClass = ref(false);
const resolvedCheckRadioDescriptionClass = computed(() => showCheckRadioDescriptionClass.value ? 'd-bgc-success' : undefined);
const checkRadioDisabled = ref(false);
</script>

<dt-stack class="d-p-400" gap="400">
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
  <dt-stack gap="200">
    <dt-text as="h1" kind="headline" :size="500">
      Disabled Button
    </dt-text>
    <dt-text as="p" kind="body" :size="400">
      Not just a matter of applying opacity to whole button, but w/ combination of `color-mix()` and tweaking existing DtButton css variables via `oklch()` of specific properties – separate opacity and saturation for border, bgc, fc, etc.
    </dt-text>
    <dt-stack class="d-bgc-moderate-opaque d-p-150 d-bar8">
      <span>
        <dt-checkbox v-model="isDisabled">Disabled</dt-checkbox>
      </span>
    </dt-stack>
    <dt-stack gap="100" ref="disabledAll">
      <dt-stack gap="100" :direction="{ 'default': 'column', 'md': 'row' }">
        <dt-button :disabled="isDisabled"> Place Call <template #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" importance="outlined"> Place Call <template #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" importance="clear"> Place Call <template #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template></dt-button>
      </dt-stack>
      <dt-stack gap="100" :direction="{ 'default': 'column', 'md': 'row' }">
        <dt-button :disabled="isDisabled" kind="danger"> Place Call <template #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" kind="danger" importance="outlined"> Place Call <template #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" kind="danger" importance="clear"> Place Call <template #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template></dt-button>
      </dt-stack>
      <dt-stack gap="100" :direction="{ 'default': 'column', 'md': 'row' }">
        <dt-button :disabled="isDisabled" kind="positive">Place Call<template #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" kind="positive" importance="outlined">Place Call<template #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" kind="positive" importance="clear">Place Call<template #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template></dt-button>
      </dt-stack>
      <dt-stack gap="100" :direction="{ 'default': 'column', 'md': 'row' }">
        <dt-button :disabled="isDisabled" kind="muted" importance="clear"> Place Call <template #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template></dt-button>
        <dt-button :disabled="isDisabled" kind="muted" importance="outlined"> Place Call <template #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template></dt-button>
      </dt-stack>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="200">
    <dt-text as="h1" kind="headline" :size="500">
      Button: Leading/Trailing
    </dt-text>
    <dt-text as="p" kind="body" :size="400">
      Freeform elements that are rendered before/after the button content.
    </dt-text>
    <dt-stack gap="200" direction="row" align="baseline" class="d-bgc-moderate-opaque d-p-150 d-bar8">
      <dt-checkbox v-model="showBtnLeading">
        Leading
      </dt-checkbox>
      <dt-checkbox v-model="showBtnTrailing">
        Trailing
      </dt-checkbox>
      <dt-checkbox v-model="showBtnStartIcon">
        Start Icon
      </dt-checkbox>
      <dt-checkbox v-model="showBtnEndIcon">
        End Icon
      </dt-checkbox>
      <dt-checkbox v-model="showBtnLabelClass">
        `labelClass`
      </dt-checkbox>
      <dt-checkbox v-model="removeBtnSlotClass">
        Remove leading/trailing class
      </dt-checkbox>
      <dt-checkbox v-model="highlightBtnSlotClass">
        Highlight leading/trailing
      </dt-checkbox>
    </dt-stack>
    <dt-stack gap="100" direction="row">
      <dt-button kind="muted" importance="outlined" :size="100" :leading-class="[removeBtnSlotClass ? undefined : 'd-pis-25', highlightBtnSlotClass ? 'd-bgc-warning' : undefined]" :trailing-class="[removeBtnSlotClass ? undefined : 'd-pie-1', highlightBtnSlotClass ? 'd-bgc-warning' : undefined]" :label-class="resolvedBtnLabelClass">
        Place Call
        <template v-if="showBtnLeading" #leading>
          <dt-badge kind="count" type="bulletin" text="1" />
        </template>
        <template v-if="showBtnTrailing" #trailing>
          <dt-badge text="Label" />
        </template>
        <template v-if="showBtnStartIcon" #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template>
        <template v-if="showBtnEndIcon" #endIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template>
      </dt-button>
      <dt-button kind="muted" importance="outlined" :size="200" :leading-class="[removeBtnSlotClass ? undefined : 'd-pis-25', highlightBtnSlotClass ? 'd-bgc-warning' : undefined]" :trailing-class="[removeBtnSlotClass ? undefined : 'd-pie-50', highlightBtnSlotClass ? 'd-bgc-warning' : undefined]" :label-class="resolvedBtnLabelClass">
        Place Call
        <template v-if="showBtnLeading" #leading>
          <dt-badge kind="count" type="bulletin" text="1" />
        </template>
        <template v-if="showBtnTrailing" #trailing>
          <dt-badge text="Label" />
        </template>
        <template v-if="showBtnStartIcon" #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template>
        <template v-if="showBtnEndIcon" #endIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template>
      </dt-button>
      <dt-button kind="muted" importance="outlined" :size="300" :leading-class="[removeBtnSlotClass ? undefined : 'd-pis-50', highlightBtnSlotClass ? 'd-bgc-warning' : undefined]" :trailing-class="[removeBtnSlotClass ? undefined : 'd-pie-100', highlightBtnSlotClass ? 'd-bgc-warning' : undefined]" :label-class="resolvedBtnLabelClass">
        Place Call
        <template v-if="showBtnLeading" #leading>
          <dt-badge kind="count" type="bulletin" text="1" />
        </template>
        <template v-if="showBtnTrailing" #trailing>
          <dt-badge text="Label" />
        </template>
        <template v-if="showBtnStartIcon" #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template>
        <template v-if="showBtnEndIcon" #endIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template>
      </dt-button>
      <dt-button kind="muted" importance="outlined" :size="400" :leading-class="[removeBtnSlotClass ? undefined : 'd-pis-100', highlightBtnSlotClass ? 'd-bgc-warning' : undefined]" :trailing-class="[removeBtnSlotClass ? undefined : 'd-pie-125', highlightBtnSlotClass ? 'd-bgc-warning' : undefined]" :label-class="resolvedBtnLabelClass">
        Place Call
        <template v-if="showBtnLeading" #leading>
          <dt-badge kind="count" type="bulletin" text="1" />
        </template>
        <template v-if="showBtnTrailing" #trailing>
          <dt-badge text="Label" />
        </template>
        <template v-if="showBtnStartIcon" #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template>
        <template v-if="showBtnEndIcon" #endIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template>
      </dt-button>
      <dt-button kind="muted" importance="outlined" :size="500" :leading-class="[removeBtnSlotClass ? undefined : 'd-pis-100', highlightBtnSlotClass ? 'd-bgc-warning' : undefined]" :trailing-class="[removeBtnSlotClass ? undefined : 'd-pie-150', highlightBtnSlotClass ? 'd-bgc-warning' : undefined]" :label-class="resolvedBtnLabelClass">
        Place Call
        <template v-if="showBtnLeading" #leading>
          <dt-badge kind="count" type="bulletin" text="1" />
        </template>
        <template v-if="showBtnTrailing" #trailing>
          <dt-badge text="Label" />
        </template>
        <template v-if="showBtnStartIcon" #startIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template>
        <template v-if="showBtnEndIcon" #endIcon="{ iconSize }"> <dt-icon name="box-select" :size="iconSize" /> </template>
      </dt-button>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="200">
    <dt-text as="h1" kind="headline" :size="500">
      Sizing update: Button/Input/Select
    </dt-text>
    <dt-stack direction="row" align="end">
      <dt-select-menu
        :size="100"
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
      <dt-input type="text" placeholder="Placeholder" :size="100" />
      <dt-button
        icon-position="left"
        kind="default"
        importance="primary"
        :size="100"
      >
        <template #startIcon="{ iconSize }">
          <dt-icon name="box-select" :size="iconSize" />
        </template>
        Button
      </dt-button>
    </dt-stack>
    <dt-stack direction="row" align="end">
      <dt-select-menu
        :size="200"
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
      <dt-input type="text" placeholder="Placeholder" :size="200" />
      <dt-button
        icon-position="left"
        kind="default"
        importance="primary"
        :size="200"
      >
        <template #startIcon="{ iconSize }">
          <dt-icon name="box-select" :size="iconSize" />
        </template>
        Button
      </dt-button>
    </dt-stack>
    <dt-stack direction="row" align="end">
      <dt-select-menu
        :size="300"
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
      <dt-input type="text" placeholder="Placeholder" :size="300" />
      <dt-button
        icon-position="left"
        kind="default"
        importance="primary"
        :size="300"
      >
        <template #startIcon="{ iconSize }">
          <dt-icon name="box-select" :size="iconSize" />
        </template>
        Button
      </dt-button>
    </dt-stack>
    <dt-stack direction="row" align="end">
      <dt-select-menu
        :size="400"
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
      <dt-input type="text" placeholder="Placeholder" :size="400" />
      <dt-button
        icon-position="left"
        kind="default"
        importance="primary"
        :size="400"
      >
        <template #startIcon="{ iconSize }">
          <dt-icon name="box-select" :size="iconSize" />
        </template>
        Button
      </dt-button>
    </dt-stack>
    <dt-stack direction="row" align="end">
      <dt-select-menu
        :size="500"
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
      <dt-input type="text" placeholder="Placeholder" :size="500" />
      <dt-button
        icon-position="left"
        kind="default"
        importance="primary"
        :size="500"
      >
        <template #startIcon="{ iconSize }">
          <dt-icon name="box-select" :size="iconSize" />
        </template>
        Button
      </dt-button>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="200">
    <dt-text as="h1" kind="headline" :size="500">
      Input / Select
    </dt-text>
    <dt-stack gap="200" direction="row" class="d-bgc-moderate-opaque d-p-150 d-bar8">
      <dt-select-menu
        label="Label Size"
        :label-visible="false"
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
      <dt-select-menu
        label="Label Strength"
        :label-visible="false"
        :options="[
          { value: 'default', label: 'Default' },
          { value: 'bold', label: 'bold' },
          { value: 'semibold', label: 'semibold' },
          { value: 'medium', label: 'medium' },
          { value: 'normal', label: 'normal' },
        ]"
        :model-value="labelStrengthSelection"
        @change="labelStrengthSelection = $event"
      />
      <dt-checkbox v-model="showLabelClass">`labelClass`</dt-checkbox>
      <dt-checkbox v-model="showInputDescription">Description</dt-checkbox>
      <dt-checkbox v-model="showInputMessages">Messages</dt-checkbox>
      <dt-checkbox v-model="showInputMessagesClass">`messagesClass`</dt-checkbox>
      <dt-checkbox v-model="showInputDescriptionClass">`descriptionClass`</dt-checkbox>
    </dt-stack>
    <dt-stack direction="row" gap="400">
      <dt-stack gap="100" class="d-fl1">
        <dt-input label="Extra Small" type="text" placeholder="Placeholder" :size="100" :label-size="resolvedLabelSize" :label-strength="resolvedLabelStrength" :label-class="resolvedLabelClass" :description="showInputDescription ? 'Description text' : undefined" :messages="inputMessages" :messages-class="resolvedInputMessagesClass" :description-class="resolvedInputDescriptionClass" />
        <dt-input label="Small" type="text" placeholder="Placeholder" :size="200" :label-size="resolvedLabelSize" :label-strength="resolvedLabelStrength" :label-class="resolvedLabelClass" :description="showInputDescription ? 'Description text' : undefined" :messages="inputMessages" :messages-class="resolvedInputMessagesClass" :description-class="resolvedInputDescriptionClass" />
        <dt-input label="Medium" type="text" placeholder="Placeholder" :size="300" :label-size="resolvedLabelSize" :label-strength="resolvedLabelStrength" :label-class="resolvedLabelClass" :description="showInputDescription ? 'Description text' : undefined" :messages="inputMessages" :messages-class="resolvedInputMessagesClass" :description-class="resolvedInputDescriptionClass" />
        <dt-input label="Large" type="text" placeholder="Placeholder" :size="400" :label-size="resolvedLabelSize" :label-strength="resolvedLabelStrength" :label-class="resolvedLabelClass" :description="showInputDescription ? 'Description text' : undefined" :messages="inputMessages" :messages-class="resolvedInputMessagesClass" :description-class="resolvedInputDescriptionClass" />
        <dt-input label="Extra large" type="text" placeholder="Placeholder" :size="500" :label-size="resolvedLabelSize" :label-strength="resolvedLabelStrength" :label-class="resolvedLabelClass" :description="showInputDescription ? 'Description text' : undefined" :messages="inputMessages" :messages-class="resolvedInputMessagesClass" :description-class="resolvedInputDescriptionClass" />
      </dt-stack>
      <dt-stack gap="100" class="d-fl1">
        <!-- IMPORTANT NOTE: Change model-value to just value in Vue 2 -->
        <dt-select-menu
          :options="[
            { value: ``, label: `Please select one` },
            { value: `1`, label: `Option 1` },
            { value: `2`, label: `Option 2` },
            { value: `3`, label: `Option 3` },
          ]"
          label="Label"
          :size="100"
          :label-size="resolvedLabelSize"
          :label-strength="resolvedLabelStrength"
          :label-class="resolvedLabelClass"
          :description="showInputDescription ? 'Description text' : undefined"
          :messages="inputMessages"
          :messages-class="resolvedInputMessagesClass"
          :description-class="resolvedInputDescriptionClass"
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
          :size="200"
          :label-size="resolvedLabelSize"
          :label-strength="resolvedLabelStrength"
          :label-class="resolvedLabelClass"
          :description="showInputDescription ? 'Description text' : undefined"
          :messages="inputMessages"
          :messages-class="resolvedInputMessagesClass"
          :description-class="resolvedInputDescriptionClass"
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
          :size="300"
          :label-size="resolvedLabelSize"
          :label-strength="resolvedLabelStrength"
          :label-class="resolvedLabelClass"
          :description="showInputDescription ? 'Description text' : undefined"
          :messages="inputMessages"
          :messages-class="resolvedInputMessagesClass"
          :description-class="resolvedInputDescriptionClass"
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
          :size="400"
          :label-size="resolvedLabelSize"
          :label-strength="resolvedLabelStrength"
          :label-class="resolvedLabelClass"
          :description="showInputDescription ? 'Description text' : undefined"
          :messages="inputMessages"
          :messages-class="resolvedInputMessagesClass"
          :description-class="resolvedInputDescriptionClass"
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
          :size="500"
          :label-size="resolvedLabelSize"
          :label-strength="resolvedLabelStrength"
          :label-class="resolvedLabelClass"
          :description="showInputDescription ? 'Description text' : undefined"
          :messages="inputMessages"
          :messages-class="resolvedInputMessagesClass"
          :description-class="resolvedInputDescriptionClass"
          :model-value="modelValue"
          @input="onInput"
          @change="onChange"
        />
      </dt-stack>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="200">
    <dt-text as="h1" kind="headline" :size="500">
      Tabs
    </dt-text>
    <dt-text as="p" kind="body" :size="400">
      Just straight up refactor to use DtButton instead of custom markup/style. Use mix of DtButton variants depending on `active`. Uses all DtButton sizes (currently at least).
    </dt-text>
    <dt-stack gap="200" direction="row" align="baseline" class="d-bgc-moderate-opaque d-p-150 d-bar8">
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
        Start Icon
      </dt-checkbox>
      <dt-checkbox v-model="showTabEndIcon">
        End Icon
      </dt-checkbox>
      <dt-checkbox v-model="showLeading">
        Leading
      </dt-checkbox>
      <dt-checkbox v-model="showTrailing">
        Trailing
      </dt-checkbox>
      <dt-checkbox v-model="selectOnFocus">
        Select on focus
      </dt-checkbox>
      <dt-checkbox v-model="showTabLabelClass">
        `labelClass`
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
    <dt-stack gap="25" hidden>
      <dt-text as="h3" kind="headline" :size="300">
        Backwards-compatible old tabs html
      </dt-text>
      <div>
        <div class="d-tablist" role="tablist" aria-label=""><button
            class="base-button__button d-btn d-btn--primary d-tab d-tab--selected" data-qa="dt-tab" aria-label=""
            type="button" id="dt-tab-1" role="tab" aria-selected="true" aria-controls="dt-panel-2"
            tabindex="0"><!----><!----><span data-qa="dt-button-label" class="base-button__label d-btn__label">
              <p>
                First tab
              </p>
            </span></button> <button class="base-button__button d-btn d-btn--primary d-tab" data-qa="dt-tab" aria-label=""
            type="button" id="dt-tab-3" role="tab" aria-selected="false" aria-controls="dt-panel-4"
            tabindex="-1"><!----><!----><span data-qa="dt-button-label" class="base-button__label d-btn__label">
              <p>
                Second tab
              </p>
            </span></button> <button class="base-button__button d-btn d-btn--primary d-tab" data-qa="dt-tab"
            aria-label="Third Label" type="button" id="dt-tab-5" role="tab" aria-selected="false" aria-controls="dt-panel-6"
            tabindex="-1"><!----><!----><span data-qa="dt-button-label" class="base-button__label d-btn__label">
              <p>
                Third tab
              </p>
            </span></button></div>
      </div>
    </dt-stack>
    <dt-tab-group :borderless="borderless" :kind="muted ? 'muted' : 'default'" :outlined="outlined" :size="size" :activation-mode="selectOnFocus ? 'auto' : 'manual'">
      <template #tabs>
        <dt-tab id="1" panel-id="2" selected leading-class="d-pis-100" trailing-class="d-pie-100" :label-class="resolvedTabLabelClass">
          <template v-if="showIcon" #startIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          <template v-if="showTabEndIcon" #endIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          Argentina
          <template v-if="showLeading" #leading>
            <dt-badge kind="count" type="bulletin" text="1" />
          </template>
          <template v-if="showTrailing" #trailing>
            <dt-badge kind="count" type="bulletin" text="1" />
          </template>
        </dt-tab>
        <dt-tab id="3" panel-id="4" leading-class="d-pis-100" trailing-class="d-pie-100" :label-class="resolvedTabLabelClass">
          <template v-if="showIcon" #startIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          <template v-if="showTabEndIcon" #endIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          United States
          <template v-if="showLeading" #leading>
            <dt-badge kind="count" type="bulletin" text="1" />
          </template>
          <template v-if="showTrailing" #trailing>
            <dt-badge kind="count" type="bulletin" text="1" />
          </template>
        </dt-tab>
        <dt-tab id="5" panel-id="6" :label-class="resolvedTabLabelClass">
          <template v-if="showIcon" #startIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          <template v-if="showTabEndIcon" #endIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          United Kingdom
        </dt-tab>
        <dt-tab id="7" panel-id="8" :label-class="resolvedTabLabelClass">
          <template v-if="showIcon" #startIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          <template v-if="showTabEndIcon" #endIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          India
        </dt-tab>
        <dt-tab id="9" panel-id="10" disabled :label-class="resolvedTabLabelClass">
          <template v-if="showIcon" #startIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          <template v-if="showTabEndIcon" #endIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          Canada
        </dt-tab>
      </template>
      <div class="d-py-100">
        <dt-tab-panel id="2" tab-id="1">
          <dt-stack gap="100">
            <dt-text as="p" kind="body" :size="300">The <dt-link href="https://en.wikipedia.org/wiki/Argentina" target="_blank">Argentina</dt-link> stretches from subtropical forests in the north to glacial landscapes in the south, encompassing the towering Andes mountains and the vast Pampas grasslands in between.</dt-text>
            <dt-text as="p" kind="body" :size="300">Its cities blend European architectural influences with a vibrant local character, while rural traditions of horsemanship and cattle ranching continue to shape the national identity.</dt-text>
            <dt-text as="p" kind="body" :size="300">The country is celebrated for its contributions to tango, wine production, and a culinary culture built around shared meals and regional flavors.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="4" tab-id="3">
          <dt-stack gap="100">
            <dt-text as="p" kind="body" :size="300">The <dt-link href="https://en.wikipedia.org/wiki/United_States">United States</dt-link> spans a broad continental range, from Atlantic coastlines and Appalachian ridges to Great Plains, Rocky Mountain summits, and Pacific shores beyond.</dt-text>
            <dt-text as="p" kind="body" :size="300">Major metropolitan areas serve as centers for finance, technology, and the arts, while smaller communities maintain distinct regional customs, dialects, and culinary traditions.</dt-text>
            <dt-text as="p" kind="body" :size="300">The nation's history of immigration has produced a diverse cultural fabric, with influences from virtually every corner of the globe woven into daily life.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="6" tab-id="5">
          <dt-stack gap="100">
            <dt-text as="p" kind="body" :size="300">The <dt-link href="https://en.wikipedia.org/wiki/United_Kingdom" target="_blank">United Kingdom</dt-link> comprises England, Scotland, Wales, and Northern Ireland, each with distinct landscapes ranging from chalk cliffs and moors to highland lochs and green valleys.</dt-text>
            <dt-text as="p" kind="body" :size="300">Its cities layer centuries of history alongside modern architecture, with institutions in education, finance, and governance that have influenced systems around the world.</dt-text>
            <dt-text as="p" kind="body" :size="300">A strong tradition in literature, theater, and music continues to thrive, supported by public institutions and a widespread culture of creative expression.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="8" tab-id="7">
          <dt-stack gap="100">
            <dt-text as="p" kind="body" :size="300">The <dt-link href="https://en.wikipedia.org/wiki/India" target="_blank">India</dt-link> extends from the Himalayan ranges in the north through fertile river plains to tropical coastlines in the south, supporting an extraordinary range of ecosystems and climates.</dt-text>
            <dt-text as="p" kind="body" :size="300">Hundreds of languages and traditions coexist across its states and territories, producing one of the most culturally varied societies on earth with deep historical roots.</dt-text>
            <dt-text as="p" kind="body" :size="300">A growing technology sector and expanding urban centers complement longstanding agricultural and artisan economies that continue to sustain millions of people.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="10" tab-id="9">
          <dt-stack gap="100">
            <dt-text as="p" kind="body" :size="300">The <dt-link href="https://en.wikipedia.org/wiki/Canada" target="_blank">Canada</dt-link> stretches from the Atlantic to the Pacific and northward into the Arctic, encompassing boreal forests, prairies, mountain ranges, and thousands of lakes and waterways.</dt-text>
            <dt-text as="p" kind="body" :size="300">Its cities are known for cultural diversity and livability, while vast rural and wilderness areas support forestry, mining, and agriculture across multiple climate zones.</dt-text>
            <dt-text as="p" kind="body" :size="300">Official bilingualism in English and French reflects a history shaped by Indigenous peoples, European settlement, and ongoing immigration from around the world.</dt-text>
          </dt-stack>
        </dt-tab-panel>
      </div>
    </dt-tab-group>
    <dt-tab-group tab-list-class="d-w264" orientation="vertical" :borderless="borderless" :kind="muted ? 'muted' : 'default'" :outlined="outlined" :size="size" :activation-mode="selectOnFocus ? 'auto' : 'manual'">
      <template #tabs>
        <dt-tab id="1" panel-id="2" selected leading-class="d-pis-100" trailing-class="d-pie-100" :label-class="resolvedTabLabelClass">
          <template v-if="showIcon" #startIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          <template v-if="showTabEndIcon" #endIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          Argentina
          <template v-if="showLeading" #leading>
            <dt-badge kind="count" type="bulletin" text="1" />
          </template>
          <template v-if="showTrailing" #trailing>
            <dt-badge kind="count" type="bulletin" text="1" />
          </template>
        </dt-tab>
        <dt-tab id="3" panel-id="4" leading-class="d-pis-100" trailing-class="d-pie-100" :label-class="resolvedTabLabelClass">
          <template v-if="showIcon" #startIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          <template v-if="showTabEndIcon" #endIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          United States
          <template v-if="showLeading" #leading>
            <dt-badge kind="count" type="bulletin" text="1" />
          </template>
          <template v-if="showTrailing" #trailing>
            <dt-badge kind="count" type="bulletin" text="1" />
          </template>
        </dt-tab>
        <dt-tab id="5" panel-id="6" :label-class="resolvedTabLabelClass">
          <template v-if="showIcon" #startIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          <template v-if="showTabEndIcon" #endIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          United Kingdom
        </dt-tab>
        <dt-tab id="7" panel-id="8" :label-class="resolvedTabLabelClass">
          <template v-if="showIcon" #startIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          <template v-if="showTabEndIcon" #endIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          India
        </dt-tab>
        <dt-tab id="9" panel-id="10" disabled :label-class="resolvedTabLabelClass">
          <template v-if="showIcon" #startIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          <template v-if="showTabEndIcon" #endIcon="{ iconSize }">
            <dt-icon name="box-select" :size="iconSize" />
          </template>
          Canada
        </dt-tab>
      </template>
      <div class="d-pis-300 d-w100p d-py-50">
        <dt-tab-panel id="2" tab-id="1">
          <dt-stack gap="100">
            <dt-text as="p" kind="body" :size="300">The <dt-link href="https://en.wikipedia.org/wiki/Argentina" target="_blank">Argentina</dt-link> stretches from subtropical forests in the north to glacial landscapes in the south, encompassing the towering Andes mountains and the vast Pampas grasslands in between.</dt-text>
            <dt-text as="p" kind="body" :size="300">Its cities blend European architectural influences with a vibrant local character, while rural traditions of horsemanship and cattle ranching continue to shape the national identity.</dt-text>
            <dt-text as="p" kind="body" :size="300">The country is celebrated for its contributions to tango, wine production, and a culinary culture built around shared meals and regional flavors.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="4" tab-id="3">
          <dt-stack gap="100">
            <dt-text as="p" kind="body" :size="300">The <dt-link href="https://en.wikipedia.org/wiki/United_States" target="_blank">United States</dt-link> spans a broad continental range, from Atlantic coastlines and Appalachian ridges to Great Plains, Rocky Mountain summits, and Pacific shores beyond.</dt-text>
            <dt-text as="p" kind="body" :size="300">Major metropolitan areas serve as centers for finance, technology, and the arts, while smaller communities maintain distinct regional customs, dialects, and culinary traditions.</dt-text>
            <dt-text as="p" kind="body" :size="300">The nation's history of immigration has produced a diverse cultural fabric, with influences from virtually every corner of the globe woven into daily life.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="6" tab-id="5">
          <dt-stack gap="100">
            <dt-text as="p" kind="body" :size="300">The <dt-link href="https://en.wikipedia.org/wiki/United_Kingdom" target="_blank">United Kingdom</dt-link> comprises England, Scotland, Wales, and Northern Ireland, each with distinct landscapes ranging from chalk cliffs and moors to highland lochs and green valleys.</dt-text>
            <dt-text as="p" kind="body" :size="300">Its cities layer centuries of history alongside modern architecture, with institutions in education, finance, and governance that have influenced systems around the world.</dt-text>
            <dt-text as="p" kind="body" :size="300">A strong tradition in literature, theater, and music continues to thrive, supported by public institutions and a widespread culture of creative expression.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="8" tab-id="7">
          <dt-stack gap="100">
            <dt-text as="p" kind="body" :size="300">The <dt-link href="https://en.wikipedia.org/wiki/India" target="_blank">India</dt-link> extends from the Himalayan ranges in the north through fertile river plains to tropical coastlines in the south, supporting an extraordinary range of ecosystems and climates.</dt-text>
            <dt-text as="p" kind="body" :size="300">Hundreds of languages and traditions coexist across its states and territories, producing one of the most culturally varied societies on earth with deep historical roots.</dt-text>
            <dt-text as="p" kind="body" :size="300">A growing technology sector and expanding urban centers complement longstanding agricultural and artisan economies that continue to sustain millions of people.</dt-text>
            <dt-text as="p" kind="body" :size="300">A growing technology sector and expanding urban centers complement longstanding agricultural and artisan economies that continue to sustain millions of people.</dt-text>
            <dt-text as="p" kind="body" :size="300">A growing technology sector and expanding urban centers complement longstanding agricultural and artisan economies that continue to sustain millions of people.</dt-text>
          </dt-stack>
        </dt-tab-panel>
        <dt-tab-panel id="10" tab-id="9">
          <dt-stack gap="100">
            <dt-text as="p" kind="body" :size="300">Canada stretches from the Atlantic to the Pacific and northward into the Arctic, encompassing boreal forests, prairies, mountain ranges, and thousands of lakes and waterways.</dt-text>
            <dt-text as="p" kind="body" :size="300">Its cities are known for cultural diversity and livability, while vast rural and wilderness areas support forestry, mining, and agriculture across multiple climate zones.</dt-text>
            <dt-text as="p" kind="body" :size="300">Official bilingualism in English and French reflects a history shaped by Indigenous peoples, European settlement, and ongoing immigration from around the world.</dt-text>
          </dt-stack>
        </dt-tab-panel>
      </div>
    </dt-tab-group>
  </dt-stack>
  <dt-stack gap="200">
    <dt-text as="h1" kind="headline" :size="500">
      Notice / Banner / Toast
    </dt-text>
    <dt-text as="p" kind="body" :size="400">
      Updated typography sizing and intelligent icon alignment. Icon margin adjusts based on content layout: title-only, message-only, or title+message.
    </dt-text>
    <dt-stack gap="200">
      <dt-text as="h2" kind="headline" :size="400">
        Notice
      </dt-text>
      <div class="d-d-grid d-g-400 d-g-cols2">
        <dt-stack gap="100">
          <dt-text as="h3" kind="headline" :size="300">Default</dt-text>
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
        <dt-stack gap="100">
          <dt-text as="h3" kind="headline" :size="300">Important</dt-text>
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
        <dt-stack gap="100">
          <dt-text as="h3" kind="headline" :size="300">Alignment per internal parts</dt-text>
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
    <dt-stack gap="200">
      <dt-text as="h2" kind="headline" :size="400">
        Banner
      </dt-text>
      <dt-stack gap="100">
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
      <dt-stack gap="100">
        <dt-text as="h3" kind="headline" :size="300">Important</dt-text>
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
    <dt-stack gap="200">
      <dt-text as="h2" kind="headline" :size="400">
        Toast
      </dt-text>
      <div class="d-d-grid d-g-400 d-g-cols2">
        <dt-stack gap="100">
          <dt-text as="h3" kind="headline" :size="300">Default</dt-text>
          <dt-toast :show="true" kind="info" title="Info toast" message="Informational message." :duration="null" />
          <dt-toast :show="true" kind="success" title="Success toast" message="Action completed." :duration="null" />
          <dt-toast :show="true" kind="warning" title="Warning toast" message="Review before proceeding." :duration="null" />
          <dt-toast :show="true" kind="error" title="Error toast" message="Something went wrong." :duration="null" />
          <dt-toast :show="true" kind="base" title="Base toast" message="Neutral notification." :duration="null" />
        </dt-stack>
        <dt-stack gap="100">
          <dt-text as="h3" kind="headline" :size="300">Important</dt-text>
          <dt-toast :show="true" kind="info" title="Info toast" message="Informational message." :important="true" :duration="null" />
          <dt-toast :show="true" kind="success" title="Success toast" message="Action completed." :important="true" :duration="null" />
          <dt-toast :show="true" kind="warning" title="Warning toast" message="Review before proceeding." :important="true" :duration="null" />
          <dt-toast :show="true" kind="error" title="Error toast" message="Something went wrong." :important="true" :duration="null" />
          <dt-toast :show="true" kind="base" title="Base toast" message="Neutral notification." :important="true" :duration="null" />
        </dt-stack>
        <dt-stack gap="100">
          <dt-text as="h3" kind="headline" :size="300">Alignment per internal parts</dt-text>
          <dt-toast :show="true" kind="info" title="Title only" :duration="null" />
          <dt-toast :show="true" kind="info" message="Action completed." :duration="null" />
          <dt-toast :show="true" kind="info" title="Title and message" message="Review before proceeding." :duration="null" />
        </dt-stack>
      </div>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="200">
    <dt-text as="h1" kind="headline" :size="500">
      Radio / Checkbox
    </dt-text>
    <dt-stack gap="200" direction="row" class="d-bgc-moderate-opaque d-p-150 d-bar8">
      <dt-select-menu
        label="Label Size"
        :label-visible="false"
        :options="[
          { value: 'default', label: 'Default' },
          { value: 'xs', label: 'xs' },
          { value: 'sm', label: 'sm' },
          { value: 'md', label: 'md' },
          { value: 'lg', label: 'lg' },
        ]"
        :model-value="checkRadioLabelSize"
        @change="checkRadioLabelSize = $event"
      />
      <dt-select-menu
        label="Label Strength"
        :label-visible="false"
        :options="[
          { value: 'default', label: 'Default' },
          { value: 'bold', label: 'bold' },
          { value: 'semibold', label: 'semibold' },
          { value: 'medium', label: 'medium' },
          { value: 'normal', label: 'normal' },
        ]"
        :model-value="checkRadioLabelStrength"
        @change="checkRadioLabelStrength = $event"
      />
      <dt-checkbox v-model="showDescription">Description</dt-checkbox>
      <dt-checkbox v-model="checkRadioDisabled">Disabled</dt-checkbox>
      <dt-checkbox v-model="showLabelClass">`labelClass`</dt-checkbox>
      <dt-checkbox v-model="showCheckRadioMessages">Messages</dt-checkbox>
      <dt-checkbox v-model="showCheckRadioMessagesClass">`messagesClass`</dt-checkbox>
      <dt-checkbox v-model="showCheckRadioDescriptionClass">`descriptionClass`</dt-checkbox>
    </dt-stack>
    <dt-stack gap="200" direction="row">
      <dt-stack gap="100" class="d-fl1">
        <dt-text as="h2" kind="headline" :size="400">Checkbox</dt-text>
        <dt-checkbox label="Checkbox label" :label-size="resolvedCheckRadioLabelSize" :label-strength="resolvedCheckRadioLabelStrength" :label-class="resolvedLabelClass" :disabled="checkRadioDisabled" :description="showDescription ? 'Description text for this checkbox' : undefined" :messages="checkRadioMessages" :messages-class="resolvedCheckRadioMessagesClass" :description-class="resolvedCheckRadioDescriptionClass" />
        <dt-checkbox label="Checkbox label" :label-size="resolvedCheckRadioLabelSize" :label-strength="resolvedCheckRadioLabelStrength" :label-class="resolvedLabelClass" :disabled="checkRadioDisabled" :description="showDescription ? 'Description text for this checkbox' : undefined" :messages="checkRadioMessages" :messages-class="resolvedCheckRadioMessagesClass" :description-class="resolvedCheckRadioDescriptionClass" />
        <dt-checkbox label="Checkbox label" :label-size="resolvedCheckRadioLabelSize" :label-strength="resolvedCheckRadioLabelStrength" :label-class="resolvedLabelClass" :disabled="checkRadioDisabled" :description="showDescription ? 'Description text for this checkbox' : undefined" :messages="checkRadioMessages" :messages-class="resolvedCheckRadioMessagesClass" :description-class="resolvedCheckRadioDescriptionClass" />
      </dt-stack>
      <dt-stack gap="100" class="d-fl1">
        <dt-text as="h2" kind="headline" :size="400">Radio</dt-text>
        <dt-radio label="Radio label" value="1" :label-size="resolvedCheckRadioLabelSize" :label-strength="resolvedCheckRadioLabelStrength" :label-class="resolvedLabelClass" :disabled="checkRadioDisabled" :description="showDescription ? 'Description text for this radio' : undefined" :messages="checkRadioMessages" :messages-class="resolvedCheckRadioMessagesClass" :description-class="resolvedCheckRadioDescriptionClass" />
        <dt-radio label="Radio label" value="2" :label-size="resolvedCheckRadioLabelSize" :label-strength="resolvedCheckRadioLabelStrength" :label-class="resolvedLabelClass" :disabled="checkRadioDisabled" :description="showDescription ? 'Description text for this radio' : undefined" :messages="checkRadioMessages" :messages-class="resolvedCheckRadioMessagesClass" :description-class="resolvedCheckRadioDescriptionClass" />
        <dt-radio label="Radio label" value="3" :label-size="resolvedCheckRadioLabelSize" :label-strength="resolvedCheckRadioLabelStrength" :label-class="resolvedLabelClass" :disabled="checkRadioDisabled" :description="showDescription ? 'Description text for this radio' : undefined" :messages="checkRadioMessages" :messages-class="resolvedCheckRadioMessagesClass" :description-class="resolvedCheckRadioDescriptionClass" />
      </dt-stack>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="200">
    <dt-text as="h1" kind="headline" :size="600">Traveling Indicator Stress Test</dt-text>
    <!-- 1. ALL FOUR VARIANTS SIDE BY SIDE -->
    <dt-text as="h2" kind="headline" :size="400">1. All four variants</dt-text>
    <dt-stack gap="400">
      <dt-stack gap="100">
        <dt-text as="p" kind="label" :size="200">Default (::after underline)</dt-text>
        <example-tabs />
      </dt-stack>
      <dt-stack gap="100">
        <dt-text as="p" kind="label" :size="200">Outlined</dt-text>
        <example-tabs outlined />
      </dt-stack>
      <dt-stack gap="100">
        <dt-text as="p" kind="label" :size="200">Muted + Outlined</dt-text>
        <example-tabs kind="muted" outlined />
      </dt-stack>
      <dt-stack gap="100">
        <dt-text as="p" kind="label" :size="200">Muted Active (background)</dt-text>
        <example-tabs kind="muted" />
      </dt-stack>
    </dt-stack>
    <!-- 2. ALL SIZES -->
    <dt-text as="h2" kind="headline" :size="400">2. All sizes (width variance stress)</dt-text>
    <dt-stack gap="400">
      <dt-stack gap="100">
        <dt-text as="p" kind="label" :size="200">Size 100 (xs)</dt-text>
        <example-tabs size="100" />
      </dt-stack>
      <dt-stack gap="100">
        <dt-text as="p" kind="label" :size="200">Size 200 (sm)</dt-text>
        <example-tabs size="200" />
      </dt-stack>
      <dt-stack gap="100">
        <dt-text as="p" kind="label" :size="200">Size 300 (md) — default</dt-text>
        <example-tabs size="300" />
      </dt-stack>
      <dt-stack gap="100">
        <dt-text as="p" kind="label" :size="200">Size 400 (lg)</dt-text>
        <example-tabs size="400" />
      </dt-stack>
      <dt-stack gap="100">
        <dt-text as="p" kind="label" :size="200">Size 500 (xl)</dt-text>
        <example-tabs size="500" />
      </dt-stack>
    </dt-stack>
    <!-- 3. SPREAD MODES -->
    <dt-text as="h2" kind="headline" :size="400">3. Spread modes (indicator width morphing)</dt-text>
    <dt-stack gap="400">
      <dt-stack gap="100">
        <dt-text as="p" kind="label" :size="200">spread="none" (default)</dt-text>
        <example-tabs />
      </dt-stack>
      <dt-stack gap="100">
        <dt-text as="p" kind="label" :size="200">spread="grow"</dt-text>
        <example-tabs spread="grow" />
      </dt-stack>
      <dt-stack gap="100">
        <dt-text as="p" kind="label" :size="200">spread="equal"</dt-text>
        <example-tabs spread="equal" />
      </dt-stack>
    </dt-stack>
    <!-- 4. VERTICAL ORIENTATION -->
    <dt-text as="h2" kind="headline" :size="400">4. Vertical orientation</dt-text>
    <dt-stack gap="400" direction="row">
      <dt-stack gap="100" class="d-fl1">
        <dt-text as="p" kind="label" :size="200">Default vertical</dt-text>
        <example-tabs orientation="vertical" />
      </dt-stack>
      <dt-stack gap="100" class="d-fl1">
        <dt-text as="p" kind="label" :size="200">Outlined vertical</dt-text>
        <example-tabs orientation="vertical" outlined />
      </dt-stack>
      <dt-stack gap="100" class="d-fl1">
        <dt-text as="p" kind="label" :size="200">Muted vertical</dt-text>
        <example-tabs orientation="vertical" kind="muted" />
      </dt-stack>
    </dt-stack>
    <!-- 5. BORDERLESS -->
    <dt-text as="h2" kind="headline" :size="400">5. Borderless</dt-text>
    <dt-stack gap="400">
      <dt-stack gap="100">
        <dt-text as="p" kind="label" :size="200">Borderless default</dt-text>
        <example-tabs borderless />
      </dt-stack>
      <dt-stack gap="100">
        <dt-text as="p" kind="label" :size="200">Borderless outlined</dt-text>
        <example-tabs borderless outlined />
      </dt-stack>
    </dt-stack>
    <!-- 6. AUTO ACTIVATION (keyboard rapid-fire) -->
    <dt-text as="h2" kind="headline" :size="400">6. Auto activation mode (arrow keys should NOT animate)</dt-text>
    <dt-stack gap="400">
      <dt-stack gap="100">
        <dt-text as="p" kind="label" :size="200">Auto mode — click should animate, arrows should snap</dt-text>
        <example-tabs activation-mode="auto" />
      </dt-stack>
      <dt-stack gap="100">
        <dt-text as="p" kind="label" :size="200">Auto mode + outlined</dt-text>
        <example-tabs activation-mode="auto" outlined />
      </dt-stack>
    </dt-stack>
    <!-- 7. DISABLED -->
    <dt-text as="h2" kind="headline" :size="400">7. Disabled (should do nothing)</dt-text>
    <dt-stack gap="100">
      <dt-text as="p" kind="label" :size="200">Whole group disabled</dt-text>
      <example-tabs disabled />
    </dt-stack>
    <!-- 8. showIndicatorTransition=false -->
    <dt-text as="h2" kind="headline" :size="400">8. showIndicatorTransition=false (animation suppressed)</dt-text>
    <dt-stack gap="100">
      <dt-text as="p" kind="label" :size="200">Should switch instantly, no slide</dt-text>
      <dt-tab-group :show-indicator-transition="false">
        <template #tabs>
          <dt-tab id="s1" panel-id="s2" selected>First</dt-tab>
          <dt-tab id="s3" panel-id="s4">Second</dt-tab>
          <dt-tab id="s5" panel-id="s6">Third</dt-tab>
        </template>
        <dt-tab-panel id="s2" tab-id="s1"><dt-text>Panel 1</dt-text></dt-tab-panel>
        <dt-tab-panel id="s4" tab-id="s3"><dt-text>Panel 2</dt-text></dt-tab-panel>
        <dt-tab-panel id="s6" tab-id="s5"><dt-text>Panel 3</dt-text></dt-tab-panel>
      </dt-tab-group>
    </dt-stack>
    <!-- 9. MULTIPLE INSTANCES (conflict test) -->
    <dt-text as="h2" kind="headline" :size="400">9. Multiple instances on same page (no conflicts)</dt-text>
    <dt-text as="p" kind="body" :size="200" tone="muted">Click tabs in one group while another is mid-animation. They should not interfere.</dt-text>
    <dt-stack gap="400" direction="row">
      <dt-stack gap="100" class="d-fl1">
        <dt-text as="p" kind="label" :size="200">Group A</dt-text>
        <example-tabs />
      </dt-stack>
      <dt-stack gap="100" class="d-fl1">
        <dt-text as="p" kind="label" :size="200">Group B</dt-text>
        <example-tabs outlined />
      </dt-stack>
      <dt-stack gap="100" class="d-fl1">
        <dt-text as="p" kind="label" :size="200">Group C</dt-text>
        <example-tabs kind="muted" />
      </dt-stack>
    </dt-stack>
    <!-- 10. EXTREME WIDTH VARIANCE -->
    <dt-text as="h2" kind="headline" :size="400">10. Extreme tab width differences (scale morphing stress)</dt-text>
    <dt-stack gap="100">
      <dt-text as="p" kind="label" :size="200">Short vs very long labels — watch the scale animation</dt-text>
      <dt-tab-group>
        <template #tabs>
          <dt-tab id="w1" panel-id="w2" selected>A</dt-tab>
          <dt-tab id="w3" panel-id="w4">This is an extremely long tab label for stress testing</dt-tab>
          <dt-tab id="w5" panel-id="w6">B</dt-tab>
        </template>
        <dt-tab-panel id="w2" tab-id="w1"><dt-text>Panel A</dt-text></dt-tab-panel>
        <dt-tab-panel id="w4" tab-id="w3"><dt-text>Panel Long</dt-text></dt-tab-panel>
        <dt-tab-panel id="w6" tab-id="w5"><dt-text>Panel B</dt-text></dt-tab-panel>
      </dt-tab-group>
    </dt-stack>
    <!-- 11. MANY TABS (overflow / wrapping) -->
    <dt-text as="h2" kind="headline" :size="400">11. Many tabs (potential wrapping)</dt-text>
    <dt-stack gap="100">
      <dt-text as="p" kind="label" :size="200">Does the animation break when tabs wrap to a second row?</dt-text>
      <dt-tab-group>
        <template #tabs>
          <dt-tab id="m1" panel-id="m2" selected>Alpha</dt-tab>
          <dt-tab id="m3" panel-id="m4">Bravo</dt-tab>
          <dt-tab id="m5" panel-id="m6">Charlie</dt-tab>
          <dt-tab id="m7" panel-id="m8">Delta</dt-tab>
          <dt-tab id="m9" panel-id="m10">Echo</dt-tab>
          <dt-tab id="m11" panel-id="m12">Foxtrot</dt-tab>
          <dt-tab id="m13" panel-id="m14">Golf</dt-tab>
          <dt-tab id="m15" panel-id="m16">Hotel</dt-tab>
          <dt-tab id="m17" panel-id="m18">India</dt-tab>
          <dt-tab id="m19" panel-id="m20">Juliet</dt-tab>
        </template>
        <dt-tab-panel id="m2" tab-id="m1"><dt-text>Panel Alpha</dt-text></dt-tab-panel>
        <dt-tab-panel id="m4" tab-id="m3"><dt-text>Panel Bravo</dt-text></dt-tab-panel>
        <dt-tab-panel id="m6" tab-id="m5"><dt-text>Panel Charlie</dt-text></dt-tab-panel>
        <dt-tab-panel id="m8" tab-id="m7"><dt-text>Panel Delta</dt-text></dt-tab-panel>
        <dt-tab-panel id="m10" tab-id="m9"><dt-text>Panel Echo</dt-text></dt-tab-panel>
        <dt-tab-panel id="m12" tab-id="m11"><dt-text>Panel Foxtrot</dt-text></dt-tab-panel>
        <dt-tab-panel id="m14" tab-id="m13"><dt-text>Panel Golf</dt-text></dt-tab-panel>
        <dt-tab-panel id="m16" tab-id="m15"><dt-text>Panel Hotel</dt-text></dt-tab-panel>
        <dt-tab-panel id="m18" tab-id="m17"><dt-text>Panel India</dt-text></dt-tab-panel>
        <dt-tab-panel id="m20" tab-id="m19"><dt-text>Panel Juliet</dt-text></dt-tab-panel>
      </dt-tab-group>
    </dt-stack>
    <!-- 12. RTL (logical direction) -->
    <dt-text as="h2" kind="headline" :size="400">12. RTL direction</dt-text>
    <dt-stack gap="100">
      <dt-text as="p" kind="label" :size="200">Does the indicator slide the correct direction in RTL?</dt-text>
      <div dir="rtl">
        <example-tabs />
      </div>
    </dt-stack>
    <!-- 13. INVERTED (dark on light) -->
    <dt-text as="h2" kind="headline" :size="400">13. Inverted</dt-text>
    <dt-stack gap="100">
      <div class="d-bgc-contrast d-p16 d-bar8">
        <example-tabs inverted />
      </div>
    </dt-stack>
    <!-- 14. RAPID CLICK STRESS -->
    <dt-text as="h2" kind="headline" :size="400">14. Rapid click test</dt-text>
    <dt-stack gap="100">
      <dt-text as="p" kind="label" :size="200">Click tabs as fast as possible — animation should cancel cleanly, no stuck states</dt-text>
      <example-tabs />
    </dt-stack>
    <!-- 15. COMBINED EXTREMES -->
    <dt-text as="h2" kind="headline" :size="400">15. Combined extremes</dt-text>
    <dt-stack gap="400">
      <dt-stack gap="100">
        <dt-text as="p" kind="label" :size="200">Outlined + spread=equal + size 500</dt-text>
        <example-tabs outlined spread="equal" size="500" />
      </dt-stack>
      <dt-stack gap="100">
        <dt-text as="p" kind="label" :size="200">Muted + vertical + borderless</dt-text>
        <example-tabs kind="muted" orientation="vertical" borderless />
      </dt-stack>
      <dt-stack gap="100">
        <dt-text as="p" kind="label" :size="200">Muted + outlined + spread=grow + size 100</dt-text>
        <example-tabs kind="muted" outlined spread="grow" size="100" />
      </dt-stack>
    </dt-stack>
  </dt-stack>
</dt-stack>
<!-- ================================================================== -->
<!-- TRAVELING INDICATOR STRESS TEST — remove before merging            -->
<!-- ================================================================== -->
