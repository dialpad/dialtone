<template>
  <div
    class="dtc-combinator d-d-flex d-fd-column d-w100p"
    :class="`dtc-theme--${settings.root.theme}`"
  >
    <div
      v-if="!blueprint"
      class="d-mb6"
    >
      <div
        :class="headerClass"
        class="d-of-hidden d-ba d-bar4"
      >
        <dtc-header
          :component="component"
          :variants="variants"
          :selected-variant="selectedVariant"
          @update:variant="updateVariant"
        />
      </div>
    </div>
    <dt-notice
      v-if="showUnsupportedWarning"
      class="d-wmx-unset"
      title="Unsupported component"
      kind="warning"
      :close-button-props="{ ariaLabel: 'Close warning' }"
      @close="hideUnsupportedMessage"
    >
      May have unexpected behaviour.
    </dt-notice>
    <div class="d-d-flex d-fl-grow1 d-hmn0">
      <div
        class="dtc-root d-d-grid d-of-hidden d-ba d-bar4 d-w100p"
        :class="{
          [rootClass]: true,
          [`dtc-root--sidebar-${settings.root.sidebar}`]: true,
          'dtc-root--blueprint': blueprint,
        }"
      >
        <div class="dtc-root__top">
          <dtc-renderer
            v-model:settings="settings"
            :component="component"
            :info="info"
            :options="options"
            :library="library"
            @event="(event, value) => triggerEvent(event, value)"
          />
        </div>
        <div class="dtc-root__bottom d-bt">
          <dtc-code-panel
            ref="codePanel"
            v-model:options="options"
            :info="info"
            :settings="settings"
          >
            <template
              v-if="!blueprint"
              #overlay
            >
              <dtc-settings-menu v-model:settings="settings" />
            </template>
          </dtc-code-panel>
        </div>
        <div
          v-if="!blueprint"
          class="dtc-root__sidebar"
        >
          <dtc-option-bar
            v-model:options="options"
            :component="component"
            :info="info"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import DtcOptionBar from './option_bar/option_bar';
import DtcRenderer from './renderer/renderer';
import DtcCodePanel from './code_panel/code_panel';
import DtcSettingsMenu from './settings_menu/settings_menu';
import DtcHeader from '@/src/components/header/header';
import { DtNotice } from '@dialpad/dialtone-vue';

import { enumerateGroups } from '@/src/lib/utils';
import { computed, onErrorCaptured, reactive, ref } from 'vue';
import { cachedRef, computedModel } from '@/src/lib/utils_vue';
import { getComponentInfo } from '@/src/lib/info';
import {
  SETTINGS_SCHEME_KEY,
  SETTINGS_THEME_KEY,
  SETTINGS_VERBOSE_KEY,
  SETTINGS_BACKGROUND_KEY,
  SETTINGS_POSITIONING_KEY,
  SETTINGS_SIDEBAR_KEY,
  SETTINGS_INDENT_KEY,
} from '@/src/lib/constants';
import defaultSettings from '@/src/settings.json';
import supportedComponents from '@/src/supported_components.json';

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
    default: () => {},
  },
  /**
   * The variants to select.
   * All keys will be displayed to choose from in the variant picker.
   * Pass a variant with the key 'default' to override the default variant.
   */
  variants: {
    type: Object,
    default: () => {},
  },
  /**
   * Activate 'blueprint' mode, to use a simple version of the combinator.
   * Used to display the component but provided limited options for interaction.
   */
  blueprint: {
    type: Boolean,
    default: false,
  },
  rootClass: {
    type: String,
    default: '',
  },
  headerClass: {
    type: String,
    default: '',
  },
});

const selectedVariant = ref('default');

function updateVariant (e) {
  selectedVariant.value = e;
}

/**
 * Gets a new instantiation of an info object.
 * Merges info from selected variant to the info object.
 *
 * @returns {object} The newly instantiated info object.
 */
function initializeInfo () {
  const info = getComponentInfo(props.component, props.documentation);

  const variantInfo = props.variants[selectedVariant.value];

  if (variantInfo) {
    Object.entries(variantInfo).forEach(([memberGroup, members]) => {
      Object.entries(members).forEach(([memberName, member]) => {
        const infoMember = info[memberGroup].find(infoMember => infoMember.name === memberName);
        if (infoMember) {
          Object.assign(infoMember, member);
        }
      });
    });
  }

  return info;
}

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
 * Gets the values for a given 'options' member group with the provided defaults.
 */
function getInitialValues (info) {
  const options = {};
  info.members.enumerate((memberGroup, member) => {
    options[memberGroup] = options[memberGroup] || {};
    options[memberGroup][member.name] = member.initialValue;
  });
  return options;
}

/**
 * The options data object is the main reactive object that allows interactivity with the target component.
 * Reactive.
 *
 * @type {WritableComputedRef<object>}
 */
const options = computedModel(
  computed(() => {
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
   */
  (e, model) => {
    try {
      e(model);
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

const showUnsupportedWarning = ref(!supportedComponents.includes(props.component.name));

function hideUnsupportedMessage () {
  showUnsupportedWarning.value = false;
}

const codePanel = ref();

function triggerEvent (event, value) {
  codePanel.value.trigger(event, value);
}

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
@import "@/src/assets/themes/base.less";
.dtc-theme--light { @import "@/src/assets/themes/light.less"; }
.dtc-theme--dark { @import "@/src/assets/themes/dark.less"; }

.dtc-root {
  grid-template-rows: repeat(2, 1fr);
}

.dtc-root--blueprint {
  grid-template-columns: 1fr !important;

  .dtc-root__top {
    grid-column-start: 1 !important;
  }

  .dtc-root__bottom {
    grid-column-start: 1 !important;
  }
}

.dtc-root--sidebar-right {
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);

  .dtc-root__bottom {
    grid-row-start: 2;
  }

  .dtc-root__sidebar {
    grid-row: span 2 / span 2;
    border-left: var(--su1) solid currentColor;
  }
}

.dtc-root--sidebar-left {
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);

  .dtc-root__top {
    grid-row-start: 1;
    grid-column-start: 2;
  }

  .dtc-root__bottom {
    grid-row-start: 2;
    grid-column-start: 2;
  }

  .dtc-root__sidebar {
    grid-column-start: 1;
    grid-row: span 2 / span 2;
    border-right: var(--su1) solid currentColor;
  }
}

.dtc-root > * {
  display: flex;
  overflow: hidden;
}

.dtc-icon[disabled] {
  background-color: transparent !important;
}
</style>
