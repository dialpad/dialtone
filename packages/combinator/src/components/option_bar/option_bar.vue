<template>
  <div class="dtc-option-bar d-as-stretch d-of-y-auto d-w100p">
    <ul class="d-ls-reset">
      <dtc-section
        v-if="info.slots"
        heading="Slots"
        content-class="d-px12"
      >
        <dtc-option-bar-member-group
          :component="component"
          :members="info.slots"
          :values="options.slots"
          :control-selector="getSlotControls"
          @update:member="updateSlots"
        />
      </dtc-section>
      <dtc-section
        v-if="info.props"
        heading="Props"
        content-class="d-px12"
      >
        <dtc-option-bar-member-group
          :component="component"
          :members="info.props"
          :values="options.props"
          :control-selector="(prop, value) => getBindingControls(prop, value, 'null')"
          @update:member="updateProps"
        />
      </dtc-section>
      <dtc-section
        v-if="info.attributes"
        heading="Native HTML Attributes"
        content-class="d-px12"
      >
        <dtc-option-bar-member-group
          :component="component"
          :members="info.attributes"
          :values="options.attributes"
          :control-selector="(attribute, value) => getBindingControls(attribute, value)"
          @update:member="updateAttributes"
        />
      </dtc-section>
      <dtc-section
        v-if="info.events"
        heading="Events"
        content-class="d-px12"
      >
        <dtc-option-bar-member-group
          :component="component"
          :members="info.events"
          :values="options.events"
          :control-selector="getEventControls"
        />
      </dtc-section>
    </ul>
  </div>
</template>

<script setup>
import DtcOptionBarMemberGroup from './option_bar_member_group';
import DtcSection from '../tools/section';

import { OPTIONS_UPDATE_EVENT } from '@/src/lib/constants';
import { getControlByMemberType, getControlByValue } from '@/src/lib/control';

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

const emit = defineEmits([OPTIONS_UPDATE_EVENT]);

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
 * @param member - The member
 * @param value - The updated value
 */
function updateMember (memberGroup, { member, value }) {
  emit(OPTIONS_UPDATE_EVENT, (options) => {
    options[memberGroup][member] = value;
  });
}

function updateSlots (e) { updateMember('slots', e); }
function updateProps (e) { updateMember('props', e); }
function updateAttributes (e) { updateMember('attributes', e); }
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

<style>
  .dtc-option-bar {
    background-color: #FCFCFC;
    color-scheme: light;
  }
</style>
