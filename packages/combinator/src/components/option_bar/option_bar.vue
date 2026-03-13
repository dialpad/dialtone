<template>
  <section
    class="dialtone-playground__controls d-ps-relative"
  >
    <dt-tab-group
      size="xs"
      borderless
      outlined
      activation-mode="auto"
      class="d-d-flex d-fd-column d-h100p"
      tab-list-class="d-ps-sticky d-t0 d-zi-base1 d-pr16 d-pt16 d-pb4"
    >
      <template #tabs>
        <dt-tab
          v-if="info.props?.length"
          id="tab-props"
          panel-id="panel-props"
          selected
        >
          Props
        </dt-tab>
        <dt-tab
          v-if="info.slots?.length"
          id="tab-slots"
          panel-id="panel-slots"
        >
          Slots
        </dt-tab>
      </template>
      <div
        v-dt-scrollbar
        class="d-fl1 d-pt8"
      >
        <dt-stack
          class="d-fl1 d-pr16 d-pb16"
        >
          <dt-tab-panel
            v-if="info.props?.length"
            id="panel-props"
            tab-id="tab-props"
          >
            <dt-stack
              v-if="info.props?.length"
              gap="300"
            >
              <dt-stack gap="450">
                <dtc-option-bar-member-group
                  :component="component"
                  :control-selector="(prop, value) => getBindingControls(prop, value, 'null')"
                  :members="info.props"
                  :values="options.props"
                  :exclusion-rules="info.exclusions"
                  :prop-values="options.props"
                  member-group="props"
                  @update:member="updateProps"
                />
              </dt-stack>
            </dt-stack>
          </dt-tab-panel>
          <dt-tab-panel
            v-if="info.slots?.length"
            id="panel-slots"
            tab-id="tab-slots"
          >
            <dt-stack
              v-if="info.slots?.length"
              gap="300"
            >
              <dt-stack gap="450">
                <dtc-option-bar-member-group
                  :component="component"
                  :control-selector="getSlotControls"
                  :members="info.slots"
                  :values="options.slots"
                  :exclusion-rules="info.exclusions"
                  :prop-values="options.props"
                  member-group="slots"
                  @update:member="updateSlots"
                />
              </dt-stack>
            </dt-stack>
          </dt-tab-panel>
          <!-- Events -->
          <dtc-option-bar-member-group
            :component="component"
            :members="info.events"
            :values="options.events"
            :control-selector="getEventControls"
          />
        </dt-stack>
      </div>
    </dt-tab-group>
  </section>
</template>

<script setup>
import DtcOptionBarMemberGroup from './option_bar_member_group.vue';
import { computed } from 'vue';
import { OPTIONS_UPDATE_EVENT } from '@/src/lib/constants';
import { getControlByMemberType, getControlByValue } from '@/src/lib/control';
import { isIconSlot } from '@/src/lib/icons';
import { DtStack, DtTabGroup, DtTab, DtTabPanel } from '@dialpad/dialtone-vue';

const props = defineProps({
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
  const typeControls = binding.types?.map(type => getControlByMemberType(type, binding)) ?? [];
  const validControls = [
    ...typeControls,
    ...controls,
  ];

  const valueControl = getControlByValue(value);
  const defaultControl = valueControl === 'null' && typeControls.length > 0
    ? typeControls[0]
    : validControls.find(control => control === valueControl) ?? validControls[0];

  return [
    validControls,
    defaultControl,
  ];
}

function getSlotControls (member) {
  if (isIconSlot(member)) {
    return getStaticControl('icon-slot');
  }
  return getStaticControl('slot');
}

// function getEventControls () {
//   return getStaticControl('event');
// }

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

// function updateAttributes (e) {
//   updateMember('attributes', e);
// }
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
