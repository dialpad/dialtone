<template>
  <section
    class="dialtone-playground__controls"
  >
    <dt-stack class="d-h100p">
      <dt-stack
        gap="500"
        direction="row"
        class="d-ps-sticky d-t0 d-bgc-secondary d-zi-base1 d-p16 d-pb4"
      >
        <dt-text
          as="h2"
          kind="headline"
          text-box-trim="both"
          :size="isFullscreen ? 'lg' : 'md'"
          class="d-fl1"
        >
          {{ component.name }}
        </dt-text>
        <dt-stack
          direction="row"
          gap="200"
        >
          <dt-button
            v-if="hasChanges"
            v-dt-tooltip="`Reset`"
            kind="muted"
            importance="clear"
            size="xs"
            @click="resetOptions"
          >
            <template #icon="{ iconSize }">
              <dt-icon-refresh
                :size="iconSize"
              />
            </template>
          </dt-button>
          <dt-button
            v-dt-tooltip="`Fullscreen`"
            kind="muted"
            importance="clear"
            size="xs"
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
      </dt-stack>
      <dt-stack
        v-dt-scrollbar
        class="d-fl1 d-px16 d-pb16"
      >
        <dt-stack
          gap="500"
          :direction="isFullscreen ? 'row' : ''"
          :align="isFullscreen ? 'start' : ''"
        >
          <dt-stack
            v-if="info.props?.length"
            gap="300"
          >
            <dt-text
              tone="secondary"
              as="h3"
              kind="headline"
              size="sm"
              class="d-ps-sticky d-t0 d-bgc-secondary d-zi-base1 d-pt0 d-pb2"
            >
              Props
            </dt-text>
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
          <dt-stack
            v-if="info.slots?.length"
            gap="300"
          >
            <dt-text
              tone="secondary"
              as="h3"
              kind="headline"
              size="sm"
              class="d-ps-sticky d-t0 d-bgc-secondary d-zi-base1 d-pt0 d-pb2"
            >
              Slots
            </dt-text>
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
          <!-- Events -->
          <!--<dtc-option-bar-member-group
            :component="component"
            :members="info.events"
            :values="options.events"
            :control-selector="getEventControls"
          />-->
        </dt-stack>
      </dt-stack>
    </dt-stack>
  </section>
</template>

<script setup>
import DtcOptionBarMemberGroup from './option_bar_member_group.vue';
import { ref, computed } from 'vue';
import { OPTIONS_UPDATE_EVENT } from '@/src/lib/constants';
import { getControlByMemberType, getControlByValue } from '@/src/lib/control';
import { isIconSlot } from '@/src/lib/icons';
import { DtButton, DtStack, DtText } from '@dialpad/dialtone-vue';
import DtIconMinimize from '@dialpad/dialtone-icons/vue3/minimize';
import DtIconExpand from '@dialpad/dialtone-icons/vue3/expand';
import DtIconRefresh from '@dialpad/dialtone-icons/vue3/refresh';

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

const emit = defineEmits([OPTIONS_UPDATE_EVENT, 'toggle-full-screen']);

const isFullscreen = ref(false);

const hasChanges = computed(() => {
  const memberGroups = ['props', 'slots', 'attributes'];
  for (const group of memberGroups) {
    const members = props.info[group];
    if (!members) continue;
    for (const member of members) {
      if (props.options[group]?.[member.name] !== member.initialValue) return true;
    }
  }
  return false;
});

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

function resetOptions () {
  const memberGroups = ['props', 'slots', 'attributes'];
  emit(OPTIONS_UPDATE_EVENT, (options) => {
    for (const group of memberGroups) {
      const members = props.info[group];
      if (!members) continue;
      for (const member of members) {
        options[group][member.name] = member.initialValue;
      }
    }
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
