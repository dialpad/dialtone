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
        <dtc-option-bar-control
          :value="values[key]"
          :label="member.label"
          :control-data="getControlData(member)"
          :valid-controls="member.validControls"
          :description="member.description"
          :v-model="isVModel(member)"
          :required="member.required"
          :locked="member.lockControl"
          :disabled="member.disableControl"
          :args="{
            defaultValue: member.defaultValue,
            validValues: member.values,
            validTypes: member.types,
            tags: member.tags,
            bindings: member.bindings,
          }"
          @update:value="e => updateMember(e, key)"
          @update:control="e => updateControl(e, key)"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import DtcOptionBarControl from './option_bar_control.vue';
import { MEMBER_UPDATE_EVENT } from '@/src/lib/constants';
import { computed, reactive } from 'vue';
import { convert } from '@/src/lib/convert';
import { controlMap } from '@/src/lib/control';
import { buildDependencyMap, shouldHideProp } from '@/src/lib/prop_dependencies';
import { shouldExclude } from '@/src/lib/exclusion_rules';
import { isIconSlot } from '@/src/lib/icons';

const ICON_SLOT_ORDER = ['startIcon', 'endIcon', 'blockStartIcon', 'blockEndIcon', 'icon'];

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
  /**
   * Exclusion rules from the variant file.
   */
  exclusionRules: {
    type: Array,
    default: () => [],
  },
  /**
   * Current prop values, used to evaluate exclusion rule conditions.
   */
  propValues: {
    type: Object,
    default: () => ({}),
  },
  /**
   * The member group identifier ('props' or 'slots').
   */
  memberGroup: {
    type: String,
    default: 'props',
  },
});

const emit = defineEmits([MEMBER_UPDATE_EVENT]);

const dependencyMap = computed(() => buildDependencyMap(props.members));

/**
 * The member map is a reactive data object that wraps each member and
 * provides additional data that the 'option bar control' component
 * needs without affecting the original member data object.
 *
 * @type {object}
 */
const memberMap = computed(() => {
  const depMap = dependencyMap.value;
  const childSet = new Set(depMap.keys());

  const sortFn = (a, b) => {
    if (a.name === 'default') return -1;
    if (b.name === 'default') return 1;
    if (a.required !== b.required) return a.required ? -1 : 1;

    const aIcon = isIconSlot(a);
    const bIcon = isIconSlot(b);
    if (aIcon && bIcon) {
      return ICON_SLOT_ORDER.indexOf(a.name) - ICON_SLOT_ORDER.indexOf(b.name);
    }
    if (aIcon !== bIcon) return aIcon ? -1 : 1;

    return (a.name ?? '').localeCompare(b.name ?? '');
  };

  // Sort non-child members normally
  const parents = [...props.members]
    .filter(m => !childSet.has(m.name))
    .sort(sortFn);

  // Build parent → children map, sorted alphabetically
  const childrenByParent = new Map();
  for (const [child, parent] of depMap) {
    if (!childrenByParent.has(parent)) childrenByParent.set(parent, []);
    childrenByParent.get(parent).push(
      props.members.find(m => m.name === child),
    );
  }
  childrenByParent.forEach(arr => arr.sort(sortFn));

  // Flatten: each parent followed by its children
  const sorted = parents.flatMap(m => [m, ...(childrenByParent.get(m.name) || [])]);
  return reactive({
    ...Object.fromEntries(
      sorted.map(member => {
        return [getMemberKey(member), extendMember(member)];
      }),
    ),
  });
});

/**
 * Used to match members in the 'member map' to their respective values.
 *
 * @param member
 * @returns {*}
 */
function getMemberKey (member) {
  return member.name;
}

/**
 * Determines if the member has a default value.
 *
 * @param member
 * @returns {boolean} If the member has default value.
 */
function hasDefaultValue (member) {
  return 'defaultValue' in member;
}

/**
 * Attempts to get the control data for a given control.
 * If the control does not exist, gets the 'base' control data.
 *
 * @param member
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
 * @param member
 * @returns {object}
 */
function extendMember (member) {
  const key = getMemberKey(member);
  const value = props.values[key];

  const [validControls, control] = props.controlSelector(member, value);

  const dynamicHide = !member.required
    && shouldHideProp(key, dependencyMap.value, props.values);

  const isDeprecated = !!member.tags?.deprecated
    || member.description?.startsWith('@deprecated');

  const isExcluded = !member.required
    && shouldExclude(key, props.memberGroup, props.exclusionRules, props.propValues);

  return {
    ...member,
    control,
    validControls,
    hideControl: member.hideControl || isDeprecated,
    disableControl: dynamicHide || isExcluded,
  };
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
