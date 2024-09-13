<template>
  <div>
    <template
      v-for="(member, key) in memberMap"
      :key="key"
    >
      <div
        v-if="!member.hideControl"
        class="d-py6"
        data-qa="dtc-option-bar-member-group-control"
      >
        <div class="d-d-flex d-ai-center d-jc-space-between d-pb2">
          <dtc-option-bar-control-selector
            :selected="member.control"
            :controls="member.validControls"
            :types="member.types"
            :disabled="member.lockControl"
            @update:control="(e) => updateControl(e, key)"
          />
          <dt-button
            v-if="hasDefaultValue(member)"
            class="dtc-icon d-p4"
            importance="clear"
            size="sm"
            :disabled="member.lockControl"
            @click="() => resetMember(key)"
          >
            <template #icon>
              <icon-reset />
            </template>
          </dt-button>
        </div>
        <dtc-option-bar-control
          :value="values[key]"
          :label="member.label"
          :control-data="getControlData(member)"
          :valid-controls="member.validControls"
          :description="member.description"
          :v-model="isVModel(member)"
          :required="member.required"
          :locked="member.lockControl"
          :args="{
            defaultValue: member.defaultValue,
            validValues: member.values,
            validTypes: member.types,
            tags: member.tags,
          }"
          @update:value="e => updateMember(e, key)"
          @update:control="e => updateControl(e, key)"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import DtcOptionBarControlSelector from '@/src/components/option_bar/option_bar_control_selector';
import DtcOptionBarControl from './option_bar_control';
import IconReset from 'dialtone-icons/IconRefresh';
import { DtButton } from '@dialpad/dialtone-vue';
import { MEMBER_UPDATE_EVENT } from '@/src/lib/constants';
import { computed, reactive } from 'vue';
import { convert } from '@/src/lib/convert';
import { controlMap } from '@/src/lib/control';

const props = defineProps({
  /**
   * Target component.
   */
  component: {
    type: Object,
    required: true,
  },
  /**
   * Array of members to generate controls for.
   */
  members: {
    type: Array,
    required: true,
  },
  /**
   * Map of key-value pairs for each member.
   */
  values: {
    type: Object,
    required: true,
  },
  /**
   * Function that determines the control selections for
   * a given member by returning an array of valid controls.
   */
  controlSelector: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits([MEMBER_UPDATE_EVENT]);

/**
 * The member map is a reactive data object that wraps each member and
 * provides additional data that the 'option bar control' component
 * needs without affecting the original member data object.
 *
 * @type {object}
 */
const memberMap = computed(() => {
  return reactive({
    ...Object.fromEntries(
      props.members.map(member => {
        return [getMemberKey(member), extendMember(member)];
      }),
    ),
  });
});

/**
 * Used to match members in the 'member map' to their respective values.
 *
 * @returns {*}
 */
function getMemberKey (member) {
  return member.name;
}

/**
 * Determines if the member has a default value.
 *
 * @returns {boolean} If the member has default value.
 */
function hasDefaultValue (member) {
  return 'defaultValue' in member;
}

/**
 * Attempts to get the control data for a given control.
 * If the control does not exist, gets the 'base' control data.
 *
 * @returns {object} The control data from the 'control map'.
 */
function getControlData (member) {
  return controlMap[member.control] ?? controlMap.base;
}

function isVModel (member) {
  const tags = member.tags;
  return tags
    ? 'model' in tags
    : false;
}

/**
 * Wraps a member with an object containing additional data about the member.
 * This is used by the 'member map' to hold data about controls.
 *
 * @returns {object}
 */
function extendMember (member) {
  const key = getMemberKey(member);
  const value = props.values[key];

  const [validControls, control] = props.controlSelector(member, value);

  return {
    ...member,
    control,
    validControls,
  };
}

/**
 * Resets the control to default value.
 */
function resetMember (key) {
  const member = memberMap.value[key];

  updateMember(member.defaultValue, key);
}

/**
 * Emits an update to a member.
 *
 * @param key - The member key
 * @param e - The updated value
 */
function updateMember (e, key) {
  emit(MEMBER_UPDATE_EVENT, {
    member: key,
    value: e,
  });
}

/**
 * Updates the member's control in the 'member map'.
 *
 * @param e - The updated control
 * @param key - The member key
 */
function updateControl (e, key) {
  const member = memberMap.value[key];

  let value;
  try {
    value = convert(member.control, e, props.values[key]);
  } catch {
    console.warn(`${member.name}: Unable to convert ${member.control} to ${e}`);
  }

  member.control = e;
  updateMember(value ?? getControlData(member).default(member), key);
}
</script>

<script>
/**
 * The member group receives a group of members and their respective values.
 * It is responsible for rendering 'option bar control' components for each member.
 */
export default {
  name: 'DtcOptionBarMemberGroup',
};
</script>
