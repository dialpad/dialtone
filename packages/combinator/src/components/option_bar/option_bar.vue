<template>
  <section class="d-divide-y d-divide-default">
    <dt-stack
      gap="500"
      direction="row"
    >
      <h2
        class="d-fl1"
        :class="isFullscreen ? 'd-headline--lg' : 'd-headline--md'"
      >
        Button
      </h2>
      <dt-button
        v-dt-tooltip="`Fullscreen`"
        kind="muted"
        importance="clear"
        size="sm"
        @click="toggleFullScreen"
      >
        <template #icon="{ iconSize }">
          <dt-icon-minimize
            v-if="isFullscreen"
            :size="iconSize"
          />
          <dt-icon-expand
            v-else
            :size="iconSize"
          />
        </template>
      </dt-button>
    </dt-stack>
    <div
      v-dt-scrollbar
      class="dialtone-playground__controls"
    >
      <dt-stack
        gap="500"
      >
        <dt-select-menu
          id="buttonSize"
          v-model="buttonSize"
          :disabled="isLink"
          size="sm"
          :options="[
            { value: `xs`, label: `xs` },
            { value: `sm`, label: `sm` },
            { value: `md`, label: `md` },
            { value: `lg`, label: `lg` },
            { value: `xl`, label: `xl` },
          ]"
          label="Size"
        />
        <dt-select-menu
          v-model="buttonImportance"
          :disabled="isLink"
          size="sm"
          :options="[
            { value: `clear`, label: `clear` },
            { value: `outlined`, label: `outlined` },
            { value: `primary`, label: `primary` },
          ]"
          label="Importance"
        />
        <dt-select-menu
          v-model="buttonKind"
          :disabled="isLink"
          size="sm"
          :options="[
            { value: `default`, label: `default` },
            { value: `muted`, label: `muted` },
            { value: `danger`, label: `danger` },
            { value: `positive`, label: `positive` },
            { value: `inverted`, label: `inverted` },
            { value: `unstyled`, label: `unstyled` },
          ]"
          label="Kind"
        />
        <dt-stack gap="400">
          <dt-toggle
            v-model="hasIcon"
            :disabled="isLink"
            label-class="d-label--sm d-fc-secondary"
            size="sm"
            wrapper-class="d-jc-space-between"
          >
            Icon
          </dt-toggle>
          <dt-select-menu
            v-show="hasIcon"
            v-model="iconName"
            :disabled="isLink"
            size="sm"
            label-class="d-vi-visible-sr"
            :options="[
              { value: `activity`, label: `activity` },
              { value: `add-task`, label: `add-task` },
              { value: `agent-assist`, label: `agent-assist` },
              { value: `ai-notes`, label: `ai-notes` },
              { value: `ai-write`, label: `ai-write` },
              { value: `airplay`, label: `airplay` },
              { value: `airtable`, label: `airtable` },
              { value: `alarm-check`, label: `alarm-check` },
              { value: `alarm-clock-off`, label: `alarm-clock-off` },
              { value: `alarm-minus`, label: `alarm-minus` },
              { value: `alarm-plus`, label: `alarm-plus` },
              { value: `album`, label: `album` },
              { value: `alert-circle`, label: `alert-circle` },
              { value: `alert-triangle`, label: `alert-triangle` },
              { value: `align-center`, label: `align-center` },
              { value: `align-justify`, label: `align-justify` },
              { value: `align-left`, label: `align-left` },
              { value: `align-right`, label: `align-right` },
              { value: `amex`, label: `amex` },
              { value: `app-store-badge`, label: `app-store-badge` },
              { value: `apple`, label: `apple` },
              { value: `archive`, label: `archive` },
              { value: `archive-restore`, label: `archive-restore` },
              { value: `arrow-down`, label: `arrow-down` },
              { value: `arrow-down-left`, label: `arrow-down-left` },
              { value: `arrow-down-right`, label: `arrow-down-right` },
              { value: `arrow-left`, label: `arrow-left` },
              { value: `arrow-left-right`, label: `arrow-left-right` },
              { value: `arrow-right`, label: `arrow-right` },
              { value: `arrow-up`, label: `arrow-up` },
              { value: `...`, label: `...` },
              { value: `zoom-in`, label: `zoom-in` },
              { value: `zoom-out`, label: `zoom-out` },
            ]"
            label="Icon name"
          />
        </dt-stack>
        <dt-select-menu
          v-show="hasIcon"
          v-model="iconPosition"
          :disabled="isLink"
          size="sm"
          :options="[
            { value: `left`, label: `left` },
            { value: `right`, label: `right` },
            { value: `top`, label: `top` },
            { value: `bottom`, label: `bottom` },
          ]"
          label="Icon Position"
        />
        <dt-toggle
          v-show="hasIcon"
          v-model="isIconOnly"
          :disabled="isLink"
          label-class="d-label--sm d-fc-secondary"
          size="sm"
          wrapper-class="d-jc-space-between"
        >
          Icon only
        </dt-toggle>
        <dt-toggle
          v-show="isIconOnly"
          v-model="isCircle"
          :disabled="isLink"
          label-class="d-label--sm d-fc-secondary"
          size="sm"
          wrapper-class="d-jc-space-between"
        >
          Circle
        </dt-toggle>
        <dt-toggle
          v-show="!hasIcon"
          v-model="isLink"
          label-class="d-label--sm d-fc-secondary"
          size="sm"
          wrapper-class="d-jc-space-between"
        >
          Link
        </dt-toggle>
        <dt-select-menu
          v-show="isLink && !hasIcon"
          v-model="linkKind"
          size="sm"
          :options="[
            { value: `default`, label: `default` },
            { value: `warning`, label: `warning` },
            { value: `danger`, label: `danger` },
            { value: `success`, label: `success` },
            { value: `muted`, label: `muted` },
            { value: `mention`, label: `mention` },
          ]"
          label="Link Kind"
        />
        <dt-toggle
          v-show="isLink && !hasIcon"
          v-model="isLinkInverted"
          label-class="d-label--sm d-fc-secondary"
          size="sm"
          wrapper-class="d-jc-space-between"
        >
          Link Inverted
        </dt-toggle>
        <dt-toggle
          v-model="isActive"
          :disabled="isLink"
          label-class="d-label--sm d-fc-secondary"
          size="sm"
          wrapper-class="d-jc-space-between"
        >
          Active
        </dt-toggle>
        <dt-toggle
          v-model="isLoading"
          :disabled="isLink"
          label-class="d-label--sm d-fc-secondary"
          size="sm"
          wrapper-class="d-jc-space-between"
        >
          Loading
        </dt-toggle>
        <dt-toggle
          v-model="isDisabled"
          label-class="d-label--sm d-fc-secondary"
          size="sm"
          wrapper-class="d-jc-space-between"
        >
          Disabled
        </dt-toggle>
        <dt-input
          v-model="buttonLabel"
          label="Label"
          type="text"
          size="sm"
        />
        <dt-input
          v-model="buttonLabelClass"
          label="Label class"
          type="text"
          size="sm"
        />
      </dt-stack>
    </div>
  </section>
</template>

<script setup>
// import DtcOptionBarMemberGroup from './option_bar_member_group.vue';
// import DtcSection from '../tools/section.vue';

import { ref } from 'vue';

import { OPTIONS_UPDATE_EVENT } from '@/src/lib/constants';
import { getControlByMemberType, getControlByValue } from '@/src/lib/control';
import {
  DtStack,
  DtSelectMenu,
  DtToggle,
  DtInput,
  DtButton,
} from '@dialpad/dialtone-vue';
import DtIconMinimize from '@dialpad/dialtone-icons/vue3/minimize';
import DtIconExpand from '@dialpad/dialtone-icons/vue3/expand';

defineProps({
  /**
   * Component to render.
   */
  component: {
    type: Object,
    required: true,
  },
  /**
   * Options data object.
   */
  options: {
    type: Object,
    required: true,
  },
  /**
   * Info data object.
   */
  info: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([OPTIONS_UPDATE_EVENT, 'toggle-full-screen']);

const hasIcon = ref(false);
const isLink = ref(false);
const isFullscreen = ref(false);
const buttonLabel = ref('Place Call');
const buttonLabelClass = ref('');
const buttonSize = ref('xs');
const buttonImportance = ref('primary');
const buttonKind = ref('default');
const iconName = ref('activity');
const iconPosition = ref('left');
const linkKind = ref('default');
const isActive = ref(false);
const isIconOnly = ref(false);
const isCircle = ref(false);
const isLinkInverted = ref(false);
const isLoading = ref(false);
const isDisabled = ref(false);


const toggleFullScreen = () => {
  isFullscreen.value = !isFullscreen.value;
  emit('toggle-full-screen', isFullscreen.value);
}

/**
 * Gets an array of controls for a binding.
 * Calls the utility function `getControlByMemberType(...)` which converts
 * each type for a member to a given control.
 *
 * Extra controls can be passed in as parameters.
 *
 * @param binding - The binding member.
 * @param value - The binding member value.
 * @param controls - The extra controls to allow.
 * @returns {Array} Array of a default control and valid controls.
 */
function getBindingControls (binding, value, ...controls) {
  const validControls = [
    ...(binding.types?.map(type => getControlByMemberType(type, binding)) ?? []),
    ...controls,
  ];

  return [
    validControls,
    validControls.find(control => control === getControlByValue(value)) ?? validControls[0],
  ];
}

function getSlotControls () {
  return getStaticControl('slot');
}

function getEventControls () {
  return getStaticControl('event');
}

/**
 * Forces a singular default control and valid control.
 *
 * @param control - The control to enforce.
 * @returns {Array} Array of a default control and valid control.
 */
function getStaticControl (control) {
  return [
    [control],
    control,
  ];
}

/**
 * Emits an update to a member in the 'options' data object.
 *
 * @param memberGroup - The member group
 * @param member.member
 * @param member - The member
 * @param value - The updated value
 * @param member.value
 */
function updateMember (memberGroup, { member, value }) {
  emit(OPTIONS_UPDATE_EVENT, (options) => {
    options[memberGroup][member] = value;
  });
}

function updateSlots (e) {
  updateMember('slots', e);
}

function updateProps (e) {
  updateMember('props', e);
}

function updateAttributes (e) {
  updateMember('attributes', e);
}
</script>

<script>
/**
 * The option bar is responsible for providing a user interface
 * to interact and change the state of the target component.
 */
export default {
  name: 'DtcOptionBar',
};
</script>
