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
        <!-- Slots -->
        <dtc-option-bar-member-group
          :component="component"
          :control-selector="getSlotControls"
          :members="info.slots"
          :values="options.slots"
          @update:member="updateSlots"
        />
        <!-- Props -->
        <dtc-option-bar-member-group
          :component="component"
          :control-selector="(prop, value) => getBindingControls(prop, value, 'null')"
          :members="info.props"
          :values="options.props"
          @update:member="updateProps"
        />
        <!-- Events -->
        <!--<dtc-option-bar-member-group
          :component="component"
          :members="info.events"
          :values="options.events"
          :control-selector="getEventControls"
        />-->
      </dt-stack>
    </div>
  </section>
</template>

<script setup>
import DtcOptionBarMemberGroup from './option_bar_member_group.vue';
import { ref } from 'vue';
import { OPTIONS_UPDATE_EVENT } from '@/src/lib/constants';
import { getControlByMemberType, getControlByValue } from '@/src/lib/control';
import { DtButton, DtStack } from '@dialpad/dialtone-vue';
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

const isFullscreen = ref(false);

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
