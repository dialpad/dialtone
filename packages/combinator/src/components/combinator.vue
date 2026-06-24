<template>
  <div :class="['dialtone-playground', { 'dialtone-playground--fullscreen': isFullScreen }]">
    <dt-stack
      direction="row"
      gap="500"
      justify="between"
      class="
        d-p-100
        d-pie-200
        d-bb
        d-bc-subtle
      "
      :class="variantOptions.length > 1 ? 'd-g-cols3' : 'd-g-cols2'"
    >
      <dt-text
        v-if="variantOptions.length < 2"
        kind="code"
        tone="primary"
        strength="semibold"
        :size="300"
        as="div"
        class="d-px-150 d-py-100"
      >
        {{ component.name }}
      </dt-text>
      <dt-stack
        v-else
        direction="row"
        gap="100"
        class="d-ai-center"
      >
        <dt-dropdown
          v-if="viewMode === 'single'"
          navigation-type="arrow-keys"
          placement="bottom-start"
          content-class="d-wmn-500"
        >
          <template #anchor="{ attrs }">
            <dt-button
              v-dt-tooltip="'Presets'"
              v-bind="attrs"
              importance="clear"
              kind="muted"
              :size="isFullScreen ? 'lg' : 'md'"
              leading-class="d-pbs-1 d-pis-150 d-mie-n25"
            >
              <template #leading>
                <dt-text
                  kind="code"
                  tone="primary"
                  strength="semibold"
                  class="d-fs-inherit"
                >
                  {{ component.name }}:
                </dt-text>
              </template>
              {{ selectedVariant || 'custom' }}
              <template #endIcon="{ iconSize }">
                <dt-icon-chevrons-up-down
                  class="d-fc-muted"
                  :size="iconSize"
                />
              </template>
            </dt-button>
          </template>
          <template #list="{ close }">
            <dt-list-item
              v-for="option in variantOptions"
              :key="option.value"
              role="menuitem"
              navigation-type="arrow-keys"
              @click="updateVariant(option.value); close()"
            >
              {{ option.label }}
              <template #end>
                <dt-icon-check
                  size="200"
                  :class="option.value === selectedVariant ? 'd-o100' : 'd-o0'"
                />
              </template>
            </dt-list-item>
          </template>
        </dt-dropdown>
        <dt-text
          v-else
          kind="code"
          tone="primary"
          strength="semibold"
          :size="300"
          as="div"
          class="d-px-150 d-py-100"
        >
          {{ component.name }}
        </dt-text>
        <dt-button
          v-dt-tooltip="viewMode === 'grid' ? 'Single view' : 'Spec sheet'"
          kind="muted"
          importance="clear"
          :size="200"
          :active="viewMode === 'grid'"
          @click="toggleViewMode"
        >
          <template #icon="{ iconSize }">
            <dt-icon-layout-grid
              :size="iconSize"
            />
          </template>
        </dt-button>
      </dt-stack>
      <dt-stack
        gap="100"
        direction="row"
      >
        <dt-button
          v-if="hasChanges"
          v-dt-tooltip="`Reset`"
          kind="muted"
          importance="clear"
          :size="200"
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
          :size="200"
          @click="toggleFullScreen"
        >
          <template #icon="{ iconSize }">
            <dt-icon-minimize
              v-if="isFullScreen"
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
    <div class="dialtone-playground__start">
      <dtc-renderer
        v-if="viewMode === 'single'"
        v-model:settings="settings"
        class="dialtone-playground__component"
        :component="component"
        :info="info"
        :options="options"
        :library="library"
        :disabled-members="disabledMembers"
        @event="onComponentEvent"
      />
      <dtc-renderer-spec-sheet
        v-else
        :component="component"
        :documentation="documentation"
        :variants="variants"
        :library="library"
        :settings="settings"
        @select="onSelectVariant"
      />
      <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
      <div
        v-if="viewMode === 'single'"
        class="dialtone-playground__resizer"
        @pointerdown="startResize"
        @dblclick="optionBarWidth = null"
      />
      <dtc-option-bar
        v-if="!blueprint && viewMode === 'single'"
        v-model:options="options"
        :component="component"
        :info="info"
        :style="optionBarWidth ? { 'inline-size': optionBarWidth } : {}"
      />
    </div>
    <div
      v-if="viewMode === 'single'"
      class="dialtone-playground__end"
    >
      <dtc-code-panel
        :info="info"
        :options="options"
        :settings="settings"
        :disabled-members="disabledMembers"
        :dev-mode="devMode"
        :has-changes="hasChanges"
        :full-screen="isFullScreen"
        @update:options="e => e(options)"
      />
    </div>
  </div>
</template>

<script setup>
import DtcOptionBar from './option_bar/option_bar.vue';
import DtcRenderer from './renderer/renderer.vue';
import DtcRendererSpecSheet from './renderer/renderer_spec_sheet.vue';
import { enumerateGroups } from '@/src/lib/utils';
import { shouldExclude } from '@/src/lib/exclusion_rules';
import { buildDependencyMap, shouldHideProp } from '@/src/lib/prop_dependencies';
import { computed, nextTick, onErrorCaptured, reactive, ref, watch } from 'vue';
import { cachedRef, computedModel } from '@/src/lib/utils_vue';
import { clearTokenCache } from '@/src/lib/tokens';
import { getComponentInfo } from '@/src/lib/info';
import { cloneInfoMembers, getInitialValues, mergeVariantData } from '@/src/lib/variant_state';
import {
  SETTINGS_BACKGROUND_KEY,
  SETTINGS_INDENT_KEY,
  SETTINGS_POSITIONING_KEY,
  SETTINGS_SCHEME_KEY,
  SETTINGS_SIDEBAR_KEY,
  SETTINGS_THEME_KEY,
  SETTINGS_VERBOSE_KEY,
} from '@/src/lib/constants';
import defaultSettings from '@/src/settings.json';
import DtcCodePanel from './code_panel/code_panel.vue';
import DtIconMinimize from '@dialpad/dialtone-icons/vue/minimize';
import DtIconExpand from '@dialpad/dialtone-icons/vue/expand';
import DtIconRefresh from '@dialpad/dialtone-icons/vue/refresh';
import DtIconChevronsUpDown from '@dialpad/dialtone-icons/vue/chevrons-up-down';
import DtIconCheck from '@dialpad/dialtone-icons/vue/check';
import DtIconLayoutGrid from '@dialpad/dialtone-icons/vue/layout-grid';

const props = defineProps({
  /**
   * Target component.
   */
  component: {
    type: Object,
    required: true,
  },
  /**
   * The dialtone-vue component documentation.
   */
  documentation: {
    type: Object,
    required: true,
  },
  /**
   * Library of components that can be displayed in the renderer through slots.
   */
  library: {
    type: Object,
    default: () => ({}),
  },
  /**
   * The variants to select.
   * All keys will be displayed to choose from in the variant picker.
   * Pass a variant with the key 'default' to override the default variant.
   */
  variants: {
    type: Object,
    default: () => ({}),
  },
  /**
   * Activate 'blueprint' mode, to use a simple version of the combinator.
   * Used to display the component but provided limited options for interaction.
   */
  blueprint: {
    type: Boolean,
    default: false,
  },
  devMode: {
    type: Boolean,
    default: false,
  },
});

const selectedVariant = ref('default');
const activeVariant = ref('default');
const isFullScreen = ref(false);
const optionBarWidth = ref(null);
const viewMode = ref('single');
let _presetChanging = false;
const _forceReset = ref(0);

const variantOptions = computed(() => {
  return Object.keys(props.variants ?? {})
    .filter(key => key !== 'exclusions' && key !== 'defaults')
    .map(key => ({ value: key, label: key }));
});

/**
 * Container for all extended component information for the target component.
 * Immutable.
 *
 * @type {ComputedRef<object>}
 */
const info = computed(() => {
  return Object.freeze({
    ...initializeInfo(),
    members: {
      enumerate (handler) {
        enumerateGroups(handler, {
          slots: info.value.slots,
          props: info.value.props,
          attributes: info.value.attributes,
          events: info.value.events,
        });
      },
    },
    bindings: {
      get () {
        const bindings = [];
        this.enumerate((_, binding) => bindings.push(binding));
        return bindings;
      },
      enumerate (handler) {
        enumerateGroups(handler, {
          props: info.value.props,
          attributes: info.value.attributes?.filter(attribute => attribute),
        });
      },
    },
  });
});

/**
 * The options data object is the main reactive object that allows interactivity with the target component.
 * Reactive.
 *
 * @type {WritableComputedRef<object>}
 */
const options = computedModel(
  computed(() => {
    _forceReset.value; // force recompute on reset
    return reactive({
      ...getInitialValues(info.value),
      bindings: {
        get () {
          const bindings = [];
          this.enumerate((_, binding) => bindings.push(binding));
          return Object.fromEntries(bindings);
        },
        enumerate (handler) {
          enumerateGroups(handler, {
            props: options.value.props ? Object.entries(options.value.props) : null,
            attributes: options.value.attributes ? Object.entries(options.value.attributes) : null,
          });
        },
      },
    });
  }),
  /**
   * Catch errors when updating member values,
   * else vue can block the value from ever being changed,
   * keeping the value permanently in an invalid state
   *
   * @param e
   * @param model
   */
  (e, model) => {
    try {
      e(model);
      if (!_presetChanging) {
        selectedVariant.value = '';
      }
    } catch (exception) {
      console.warn('Update options warning: \n', exception);
    }
  },
);

/**
 * The settings data object used to read and write cached settings used throughout the combinator.
 *
 * @type {WritableComputedRef<object>}
 */
const settings = computedModel(
  computed(() => {
    return reactive({
      root: {
        theme: cachedRef(SETTINGS_THEME_KEY, defaultSettings.root['default-theme']),
        sidebar: cachedRef(SETTINGS_SIDEBAR_KEY, defaultSettings.root['default-sidebar']),
      },
      renderer: {
        positioning: cachedRef(SETTINGS_POSITIONING_KEY, defaultSettings.renderer['default-positioning']),
        background: cachedRef(SETTINGS_BACKGROUND_KEY, defaultSettings.renderer['default-background']),
      },
      code: {
        scheme: cachedRef(SETTINGS_SCHEME_KEY, defaultSettings.code['default-scheme']),
        indent: cachedRef(SETTINGS_INDENT_KEY, defaultSettings.code['default-indent-spaces']),
        verbose: props.blueprint
          ? false
          : cachedRef(SETTINGS_VERBOSE_KEY, defaultSettings.code['default-verbose']),
      },
    });
  }),
  (e, model) => {
    try {
      e(model);
    } catch (exception) {
      console.warn('Update settings warning: \n', exception);
    }
  },
);

watch(() => settings.value.root.theme, clearTokenCache);

/**
 * Handles events emitted by the rendered target component.
 * For v-model events (`update:<prop>`), writes the new value back into the
 * reactive options model so the preview and the generated code stay in sync.
 *
 * @param {string} name - The emitted event name (e.g. 'update:modelValue').
 * @param {*} value - The emitted value.
 */
function onComponentEvent (name, value) {
  if (!name?.startsWith('update:')) return;
  const prop = name.slice('update:'.length);
  options.value = (model) => {
    if (model.props && prop in model.props) model.props[prop] = value;
    else if (model.attributes && prop in model.attributes) model.attributes[prop] = value;
  };
}

function updateVariant (e) {
  _presetChanging = true;
  selectedVariant.value = e;
  if (e !== '') {
    activeVariant.value = e;
    _forceReset.value++;
  }
  nextTick(() => { _presetChanging = false; });
}

function toggleViewMode () {
  viewMode.value = viewMode.value === 'grid' ? 'single' : 'grid';
}

/**
 * Loads a variant from the spec sheet into the editable single view.
 *
 * @param {string} name - The variant to load.
 */
function onSelectVariant (name) {
  updateVariant(name);
  viewMode.value = 'single';
}

const defaultInfo = computed(() => {
  const info = cloneInfoMembers(
    getComponentInfo(props.component, props.documentation),
  );
  mergeVariantData(info, props.variants?.defaults);
  mergeVariantData(info, props.variants?.default);
  return info;
});

/**
 * Gets a new instantiation of an info object.
 * Merges info from selected variant to the info object.
 *
 * @returns {object} The newly instantiated info object.
 */
function initializeInfo () {
  const info = cloneInfoMembers(
    getComponentInfo(props.component, props.documentation),
  );

  mergeVariantData(info, props.variants?.defaults);
  mergeVariantData(info, props.variants?.[activeVariant.value]);

  info.exclusions = props.variants?.exclusions ?? [];

  return info;
}

const hasChanges = computed(() => {
  const referenceInfo = defaultInfo.value ?? info.value;
  const memberGroups = ['props', 'slots', 'attributes'];
  for (const group of memberGroups) {
    const members = referenceInfo[group];
    if (!members) continue;
    for (const member of members) {
      if (options.value[group]?.[member.name] !== member.initialValue) return true;
    }
  }
  return false;
});

function resetOptions () {
  updateVariant('default');
}

function startResize (e) {
  e.preventDefault();
  const startX = e.clientX;
  const startWidth = document.querySelector('.dialtone-playground__controls')?.offsetWidth ?? 0;

  function onMove (e) {
    const delta = startX - e.clientX;
    optionBarWidth.value = Math.max(200, startWidth + delta) + 'px';
  }

  function onUp () {
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup', onUp);
  }

  document.addEventListener('pointermove', onMove);
  document.addEventListener('pointerup', onUp);
}

function toggleFullScreen () {
  isFullScreen.value = !isFullScreen.value;
  if (isFullScreen.value) {
    document.body.classList.add('d-of-hidden', 'd-h100vh');
  } else {
    document.body.classList.remove('d-of-hidden', 'd-h100vh');
  }
}

/**
 * Set of member names that are currently disabled via exclusion rules or prop dependencies.
 * Passed to the code panel so disabled members are suppressed from the code snippet.
 *
 * @type {ComputedRef<Set<string>>}
 */
const disabledMembers = computed(() => {
  const disabled = new Set();
  const exclusions = info.value.exclusions;
  const propValues = options.value.props;
  const depMap = buildDependencyMap(info.value.props ?? []);

  for (const member of (info.value.props ?? [])) {
    if (member.required) continue;
    if (shouldExclude(member.name, 'props', exclusions, propValues) ||
      shouldHideProp(member.name, depMap, propValues)) {
      disabled.add(member.name);
    }
  }
  for (const member of (info.value.slots ?? [])) {
    if (member.required) continue;
    if (shouldExclude(member.name, 'slots', exclusions, propValues)) {
      disabled.add(member.name);
    }
  }
  return disabled;
});

onErrorCaptured((exception) => {
  console.error('Internal vue error: \n', exception);
  return false;
});
</script>

<script>
/**
 * The root component that facilitates input and output with its child components.
 * Holds the two central data objects 'info' and 'options'.
 */
export default {
  name: 'DtcCombinator',
};
</script>

<style lang="less">
.dialtone-playground {
  & {
    display:none;
    flex-direction: column;
    margin-block: var(--dt-spacing-200);
    background-color: var(--dt-color-surface-secondary);
    border-radius: var(--dt-size-radius-400);

    @media screen and (min-width: 640px) {
      display: flex;
    }
  }

  &--fullscreen {
    margin-block: 0;
    position: fixed;
    inset: 0;
    z-index: var(--zi-popover);
    background-color: var(--dt-color-surface-secondary);
  }

  &__start {
    flex-grow: 1;

    @media screen and (min-width: 640px) {
      display: flex;
      overflow: hidden;
      flex-direction: row;
    }

    :where(.dialtone-playground--fullscreen) & {
      border-block-end: var(--dt-size-border-100) solid var(--dt-color-border-subtle)
    }
  }

  &__end {
    border-block-start: var(--dt-size-border-100) solid var(--dt-color-border-subtle);

    :where(.dialtone-playground--fullscreen) & {
      block-size: 33vh;
      max-block-size: none;
    }
  }

  &__component {
    padding: var(--dt-spacing-200);
    padding-inline-end: 0;
    padding-inline-start: var(--dt-spacing-400);
    display: grid;
    flex: 1;
    place-items: center;

    @media screen and (min-width: 640px) {
      min-block-size: var(--dt-size-925);
    }
  }

  &__component-content {
    display: contents;
  }

  &__resizer {
    inline-size: 32px;
    cursor: col-resize;
    flex-shrink: 0;
    position: relative;

    &::before {
      inline-size: 3px;
      content: '';
      position: absolute;
      inset-block: 0;
      inset-inline-start: 50%;
      background-color: transparent;
      transition: background-color 0.25s ease-in;
    }
    &:hover::before,
    &:active::before {
      background-color: var(--dt-color-border-focus);
    }
  }

  &__controls {
    inline-size: var(--dt-size-900);
    max-inline-size: var(--dt-size-1000);
    flex-shrink: 0;
    max-block-size: var(--dt-size-950);
    font: var(--dt-text-body-sm);

    :where(.dialtone-playground--fullscreen) & {
      @media screen and (min-width: 640px) {
        inline-size: var(--dt-size-950);
        max-block-size: 100%;
      }
    }

  }
}
</style>
