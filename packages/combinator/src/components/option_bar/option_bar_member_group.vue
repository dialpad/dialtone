<template>
  <template
    v-for="(member, key) in memberMap"
    :key="key"
  >
    <div
      v-if="!member.hideControl"
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
        :deprecated="member.deprecated"
        :locked="member.lockControl"
        :disabled="member.disableControl"
        :args="{
          defaultValue: member.defaultValue ?? member.initialValue,
          validValues: member.values,
          validTypes: member.types,
          tags: member.tags,
          bindings: member.bindings,
          tokenCategory: member.tokenCategory,
          propValues,
          disabledValues: getDisabledValues(key, props.exclusionRules, props.propValues, props.slotValues),
          clearable: member.clearable,
        }"
        @update:value="e => updateMember(e, key)"
        @update:control="e => updateControl(e, key)"
      />
    </div>
  </template>
</template>

<script setup>
import DtcOptionBarControl from './option_bar_control.vue';
import { MEMBER_UPDATE_EVENT } from '@/src/lib/constants';
import { computed, reactive, watch } from 'vue';
import { convert } from '@/src/lib/convert';
import { controlMap } from '@/src/lib/control';
import { buildDependencyMap, shouldHideProp } from '@/src/lib/prop_dependencies';
import { shouldDisable, shouldClear, getDisabledValues } from '@/src/lib/exclusion_rules';
import { isIconSlot } from '@/src/lib/icons';
import { isClassProp } from '@/src/lib/utils';

const ICON_SLOT_ORDER = ['startIcon', 'endIcon', 'blockStartIcon', 'blockEndIcon', 'icon'];

const PROP_PRIORITY = [
  'title', 'as', 'variant', 'kind', 'size', 'family', 'label', 'importance', 'presence',
  'placement', 'tone', 'density', 'strength', 'align',
  'type', 'underline', 'selected', 'active', 'disabled',
  'deferSelection', 'readOnly', 'showClear', 'useDropdown',
  'showDivider', 'color', 'description',
  'scrollbar', 'surface',
  'borderRadius', 'borderColor',
  'borderWidth', 'borderWidthInline', 'borderWidthInlineEnd', 'borderWidthInlineStart',
  'borderWidthBlock', 'borderWidthBlockEnd', 'borderWidthBlockStart',
  'padding', 'paddingInline', 'paddingInlineEnd', 'paddingInlineStart',
  'paddingBlock', 'paddingBlockEnd', 'paddingBlockStart',
  'inlineSize', 'minInlineSize', 'maxInlineSize', 'blockSize', 'maxBlockSize', 'minBlockSize',
  'shadow', 'overflow',
];

const CLASS_PROP_PRIORITY = [
  'scrollbarContentClass',
  'dropdownListClass', 'popoverContentClass', 'popoverDialogClass', 'popoverFooterClass', 'popoverHeaderClass',
  'labelClass',
  'startIconClass', 'endIconClass', 'iconClass', 'leadingClass', 'trailingClass',
];

const SLOT_PRIORITY = ['start', 'end', 'inlineStart', 'inlineEnd', 'blockStart', 'blockEnd', 'leading', 'trailing'];

function getPropTier (member) {
  if (isClassProp(member)) {
    const priorityIdx = CLASS_PROP_PRIORITY.indexOf(member.name);
    return [4, priorityIdx === -1 ? CLASS_PROP_PRIORITY.length : priorityIdx];
  }

  const priorityIdx = PROP_PRIORITY.indexOf(member.name);
  if (priorityIdx !== -1) return [0, priorityIdx];
  if (member.name?.startsWith('aria')) return [1, 0];
  if (member.types?.includes('boolean')) return [2, 0];
  return [3, 0];
}

function getSlotTier (member) {
  if (member.name === 'default') return [0, 0];
  if (isIconSlot(member)) return [1, ICON_SLOT_ORDER.indexOf(member.name)];
  const priorityIdx = SLOT_PRIORITY.indexOf(member.name);
  if (priorityIdx !== -1) return [2, priorityIdx];
  return [3, 0];
}

// Class props always sort into the trailing class tier, even when a description
// ("Only applies when…") would otherwise nest them under a parent prop. Detaching
// them from the ordering dependency map keeps grouping from pulling them forward.
// The full dependency map is still passed to shouldHideProp, so a class control is
// still hidden when its parent is off — only its sort position is decoupled here.
function getOrderingDependencyMap (depMap, membersByName) {
  return new Map(
    [...depMap].filter(([child]) => !isClassProp(membersByName.get(child))),
  );
}

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
   * Current slot values, used only by exclusion rules that opt into
   * `whenSlots` conditions.
   */
  slotValues: {
    type: Object,
    default: undefined,
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
  if (!props.members?.length) return reactive({});
  const depMap = dependencyMap.value;
  const membersByName = new Map(props.members.map(m => [m.name, m]));
  const orderingDepMap = getOrderingDependencyMap(depMap, membersByName);
  const childSet = new Set(orderingDepMap.keys());

  const getTier = props.memberGroup === 'slots' ? getSlotTier : getPropTier;
  const sortFn = (a, b) => {
    const [aTier, aIdx] = getTier(a);
    const [bTier, bIdx] = getTier(b);
    if (aTier !== bTier) return aTier - bTier;
    if (aIdx !== bIdx) return aIdx - bIdx;
    return (a.name ?? '').localeCompare(b.name ?? '');
  };

  // Sort non-child members normally
  const parents = [...props.members]
    .filter(m => !childSet.has(m.name))
    .sort(sortFn);

  // Build parent → children map, sorted alphabetically
  const childrenByParent = new Map();
  for (const [child, parent] of orderingDepMap) {
    if (!childrenByParent.has(parent)) childrenByParent.set(parent, []);
    childrenByParent.get(parent).push(
      membersByName.get(child),
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

  const isDocDeprecated = !!member.tags?.deprecated
    || member.description?.startsWith('@deprecated');

  const isDisabled = !member.required
    && shouldDisable(key, props.memberGroup, props.exclusionRules, props.propValues, props.slotValues);

  const clearValue = !member.required
    && shouldClear(key, props.memberGroup, props.exclusionRules, props.propValues, props.slotValues);
  // clearable = true when the member has no concrete default (prop is optional, user explicitly set it)
  const clearable = member.clearable ?? (member.defaultValue == null || member.defaultValue === '');

  return {
    ...member,
    control,
    validControls,
    hideControl: member.hideControl || isDocDeprecated,
    clearValue,
    clearable,
    deprecated: !!member.deprecated || isDocDeprecated,
    disableControl: dynamicHide || isDisabled,
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

watch(memberMap, (members) => {
  Object.entries(members).forEach(([key, member]) => {
    if (!member.clearValue) return;
    if (props.values[key] === null || props.values[key] === undefined) return;
    updateMember(null, key);
  });
}, { immediate: true });

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
