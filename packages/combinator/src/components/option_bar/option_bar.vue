<template>
  <section
    class="dialtone-playground__controls d-ps-relative"
  >
    <dt-tab-group
      :size="100"
      borderless
      kind="muted"
      activation-mode="auto"
      :selected="selectedPanel"
      class="d-d-flex d-fd-column d-h100p"
      tabs-class="d-pis-50"
      tab-list-class="
        d-ps-sticky
        d-ibs-0
        d-zi-base1
        d-pis-50
        d-pie-200
        d-pbs-200
        d-pbe-50
      "
    >
      <template #tabs>
        <dt-tab
          v-if="filteredMainProps.length"
          id="tab-props"
          panel-id="panel-props"
          :selected="initialTab === 'props'"
        >
          Props
        </dt-tab>
        <dt-tab
          v-if="filteredSlots.length"
          id="tab-slots"
          panel-id="panel-slots"
          :selected="initialTab === 'slots'"
        >
          Slots
        </dt-tab>
        <dt-tab
          v-if="hasClassControls"
          id="tab-class"
          panel-id="panel-class"
          :selected="initialTab === 'class'"
        >
          Class
        </dt-tab>
        <dt-button
          v-dt-tooltip="'Search'"
          class="d-mis-auto"
          kind="muted"
          importance="clear"
          :size="100"
          :active="showSearch"
          @click="toggleSearch"
        >
          <template #icon="{ iconSize }">
            <dt-icon-search :size="iconSize" />
          </template>
        </dt-button>
        <dt-input
          v-if="showSearch"
          ref="searchInput"
          v-model="searchQuery"
          type="search"
          placeholder="Search"
          :size="100"
          class="d-w100p d-mbs-25"
        >
          <template #startIcon="{ iconSize }">
            <dt-icon
              name="search"
              :size="iconSize"
            />
          </template>
          <template #endIcon="{ clear }">
            <dt-button
              kind="muted"
              importance="clear"
              :size="100"
              class="d-p-25"
              aria-label="Clear search"
              @click="clear"
            >
              <template #startIcon>
                <dt-icon
                  name="close"
                  size="100"
                />
              </template>
            </dt-button>
          </template>
        </dt-input>
      </template>
      <div
        v-dt-scrollbar
        class="d-fl1 d-pbs-100"
      >
        <dt-stack
          class="d-fl1 d-pis-50 d-pie-100 d-pbe-200"
        >
          <dt-tab-panel
            v-if="filteredMainProps.length"
            id="panel-props"
            tab-id="tab-props"
          >
            <dt-stack gap="300">
              <dt-stack gap="150">
                <dtc-option-bar-member-group
                  :component="component"
                  :control-selector="(prop, value) => getBindingControls(prop, value, 'null')"
                  :members="filteredMainProps"
                  :values="options.props"
                  :exclusion-rules="info.exclusions"
                  :prop-values="options.props"
                  :slot-values="options.slots"
                  member-group="props"
                  @update:member="updateProps"
                />
              </dt-stack>
            </dt-stack>
          </dt-tab-panel>
          <dt-tab-panel
            v-if="filteredSlots.length"
            id="panel-slots"
            tab-id="tab-slots"
          >
            <dt-stack gap="300">
              <dt-stack gap="150">
                <dtc-option-bar-member-group
                  :component="component"
                  :control-selector="getSlotControls"
                  :members="filteredSlots"
                  :values="options.slots"
                  :exclusion-rules="info.exclusions"
                  :prop-values="options.props"
                  :slot-values="options.slots"
                  member-group="slots"
                  @update:member="updateSlots"
                />
              </dt-stack>
            </dt-stack>
          </dt-tab-panel>
          <dt-tab-panel
            v-if="hasClassControls"
            id="panel-class"
            tab-id="tab-class"
          >
            <dt-stack gap="300">
              <dt-stack gap="150">
                <dtc-option-bar-member-group
                  v-if="filteredNativeClassAttributes.length"
                  :component="component"
                  :control-selector="(attribute, value) => getBindingControls(attribute, value, 'null')"
                  :members="filteredNativeClassAttributes"
                  :values="options.attributes"
                  :exclusion-rules="info.exclusions"
                  :prop-values="options.props"
                  :slot-values="options.slots"
                  member-group="attributes"
                  @update:member="updateAttributes"
                />
                <dtc-option-bar-member-group
                  v-if="filteredClassProps.length"
                  :component="component"
                  :control-selector="(prop, value) => getBindingControls(prop, value, 'null')"
                  :members="filteredClassProps"
                  :values="options.props"
                  :exclusion-rules="info.exclusions"
                  :prop-values="options.props"
                  :slot-values="options.slots"
                  member-group="props"
                  @update:member="updateProps"
                />
              </dt-stack>
            </dt-stack>
          </dt-tab-panel>
          <!-- Events suppressed — not interactive in the playground -->
        </dt-stack>
      </div>
    </dt-tab-group>
  </section>
</template>

<script setup>
import DtcOptionBarMemberGroup from './option_bar_member_group.vue';
import { computed, ref, nextTick } from 'vue';
import { OPTIONS_UPDATE_EVENT } from '@/src/lib/constants';
import { getControlByMemberType, getControlByValue } from '@/src/lib/control';
import { isIconSlot } from '@/src/lib/icons';
import { isClassProp } from '@/src/lib/utils';
import { LOGICAL_ALIASES } from '@/src/lib/logical_aliases';
import { DtStack, DtTabGroup, DtTab, DtTabPanel } from '@dialpad/dialtone-vue';
import { DtIconSearch } from '@dialpad/dialtone-icons/vue';

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

const showSearch = ref(false);
const searchInput = ref(null);
const searchQuery = ref('');

async function toggleSearch () {
  showSearch.value = !showSearch.value;
  if (showSearch.value) {
    await nextTick();
    searchInput.value?.$el?.querySelector('input')?.focus();
  } else {
    searchQuery.value = '';
  }
}

function normalizeForSearch (str) {
  return str.toLowerCase().replace(/[\s\-_]/g, '');
}

// Derived from LOGICAL_ALIASES keys so tokenizeName stays in sync automatically.
const COMPOUND_TOKENS = new Set(Object.keys(LOGICAL_ALIASES).filter(k => k.includes('-')));

function tokenizeName (name) {
  const parts = name.replace(/([A-Z])/g, ' $1').trim().toLowerCase().split(/\s+/);
  const tokens = [];
  for (let i = 0; i < parts.length; i++) {
    const compound = parts[i + 1] ? `${parts[i]}-${parts[i + 1]}` : null;
    if (compound && COMPOUND_TOKENS.has(compound)) {
      tokens.push(compound);
      i++;
    } else {
      tokens.push(parts[i]);
    }
  }
  return tokens;
}

function getSearchCorpus (name) {
  const tokens = tokenizeName(name);
  const aliases = tokens.flatMap(t => LOGICAL_ALIASES[t] ?? []);
  return [name, ...tokens, ...aliases].map(normalizeForSearch).join(' ');
}

// Pre-compute corpora once per member list so per-keystroke filtering is just a substring scan.
const mainPropCorpora = computed(() => (props.info.props ?? [])
  .filter(member => !isClassProp(member))
  .map(member => ({ member, corpus: getSearchCorpus(member.name) })));

const classPropCorpora = computed(() => (props.info.props ?? [])
  .filter(isClassProp)
  .map(member => ({ member, corpus: getSearchCorpus(member.name) })));

const nativeClassAttributeCorpora = computed(() => (props.info.attributes ?? [])
  .filter(member => member.name === 'class')
  .map(member => ({ member, corpus: getSearchCorpus(member.name) })));

const slotCorpora = computed(() => (props.info.slots ?? [])
  .map(member => ({ member, corpus: getSearchCorpus(member.name) })));

function filterCorpora (corpora) {
  const q = normalizeForSearch(searchQuery.value);
  if (q.length < 2) return corpora.map(({ member }) => member);
  return corpora.filter(({ corpus }) => corpus.includes(q)).map(({ member }) => member);
}

const filteredMainProps = computed(() => filterCorpora(mainPropCorpora.value));
const filteredClassProps = computed(() => filterCorpora(classPropCorpora.value));
const filteredNativeClassAttributes = computed(() => filterCorpora(nativeClassAttributeCorpora.value));
const filteredSlots = computed(() => filterCorpora(slotCorpora.value));
const hasClassControls = computed(() => filteredNativeClassAttributes.value.length || filteredClassProps.value.length);

const initialTab = computed(() => {
  if (filteredMainProps.value.length) return 'props';
  if (filteredSlots.value.length) return 'slots';
  if (hasClassControls.value) return 'class';
  return null;
});

const selectedPanel = computed(() => initialTab.value ? `panel-${initialTab.value}` : '');

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
    options[memberGroup] = options[memberGroup] || {};
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
