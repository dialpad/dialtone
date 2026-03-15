<template>
  <div>
    <component
      :is="rawMode ? 'dt-text' : controlComponent"
      v-bind="rawMode ? { as: 'div', kind: 'label', size: 'xs', tone: 'secondary' } : controlBindings"
      @update:value="updateValue"
    >
      <dt-stack
        as="div"
        direction="row"
        gap="300"
        justify="space-between"
        align="baseline"
      >
        <dt-stack
          direction="row"
          gap="300"
          align="baseline"
        >
          <dt-text
            v-dt-tooltip="{ message: description, placement: 'left' }"
            as="span"
            class="d-tt-capitalize"
            :tone="disabled ? 'muted' : undefined"
            data-qa="dtc-option-bar-control-label"
          >
            {{ controlLabel }}
          </dt-text>
          <dt-icon-lock
            v-if="locked"
            size="100"
          />
          <dt-text
            v-if="required"
            size="xs"
            kind="label"
            strength="normal"
            tone="critical"
            class="d-fs-50"
          >
            Required
          </dt-text>
          <dt-text
            v-if="vModel"
            size="xs"
            kind="label"
            strength="normal"
            tone="muted"
            class="d-fs-50"
          >
            v-model
          </dt-text>
        </dt-stack>
        <dt-button
          v-if="showRawToggle"
          v-dt-tooltip="'Edit as JSON'"
          link
          :link-underline="false"
          class="d-ml-auto d-fw-normal d-fs-50 d-px2 d-bar2 h:d-td-none "
          :class="{ 'd-bgc-bold d-fc-secondary h:d-fc-primary': rawMode }"
          @click="toggleRawMode"
        >
          RAW
        </dt-button>
      </dt-stack>
      <dt-input
        v-if="rawMode"
        v-model="rawText"
        type="textarea"
        size="xs"
        spellcheck="false"
        root-class="d-mt6"
      />
    </component>
  </div>
</template>

<script setup>
import DtIconLock from '@dialpad/dialtone-icons/vue/lock';
import { DtBadge, DtButton, DtInput, DtText } from '@dialpad/dialtone-vue';
import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { computed, ref, watch } from 'vue';
import { deserializeControlValue, serializeControlValue } from '@/src/lib/control';
import { stringifyDocValue, parseDocValue } from '@/src/lib/parse';

const props = defineProps({
  /**
   * Data of an entry in the 'control map'.
   */
  controlData: {
    type: Object,
    required: true,
  },
  /**
   * Array of valid controls that are keys in the 'control map'.
   */
  validControls: {
    type: Array,
    required: true,
  },
  /**
   * The member value.
   */
  value: {
    type: undefined,
    required: true,
  },
  /**
   * The member label.
   */
  label: {
    type: String,
    required: true,
  },
  /**
   * The member description.
   */
  description: {
    type: String,
    default: undefined,
  },
  /**
   * If the member is a part of the v-model.
   */
  vModel: {
    type: Boolean,
    default: false,
  },
  /**
   * If the member is considered required.
   */
  required: {
    type: Boolean,
    default: false,
  },
  /**
   * Prevent the control from being modified.
   */
  locked: {
    type: Boolean,
    default: false,
  },
  /**
   * Disable the control due to exclusion rules.
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * Optional args to bind directly to the control.
   */
  args: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits([VALUE_UPDATE_EVENT]);

const controlValue = computed(() => {
  return props.controlData.serialize
    ? serializeControlValue(props.value)
    : props.value;
});

const controlLabel = computed(() => props.label.replaceAll('-', ' '))

const controlComponent = computed(() => {
  return props.controlData.component;
});

/**
 * Args that are conditionally passed to the
 * underlying control props if the prop is present on the control.
 *
 * @type {ComputedRef<object>}
 */
const controlArgs = computed(() => {
  const isInactive = props.disabled && !props.locked;
  const displayValue = isInactive
    ? props.controlData.component.props?.value?.default?.() ?? controlValue.value
    : controlValue.value;

  return {
    value: displayValue,
    disabled: props.locked || props.disabled,
    tags: props.tags,
    ...props.args,
  };
});

/**
 * Object containing only the args that are
 * present on the control component props.
 *
 * @type {ComputedRef<object>}
 */
const controlBindings = computed(() => {
  const component = controlComponent.value;
  if (!component.props) { return null; }
  return Object.fromEntries(
    Object.entries(controlArgs.value).filter(([arg]) => {
      const controlProps = Object.keys(component.props);
      return controlProps.includes(arg);
    }),
  );
});

/**
 * Emits an update to the member value.
 * The value is deserialized if needed.
 *
 * @param e - The updated member value
 */
function updateValue (e) {
  const value = props.controlData.serialize
    ? deserializeControlValue(e)
    : e;
  emit(VALUE_UPDATE_EVENT, value);
}

const showRawToggle = computed(() => {
  const name = props.controlData.component?.name;
  return name === 'DtcControlArray' || name === 'DtcControlObject';
});

const rawMode = ref(false);
const rawText = ref('');
let rawEditInProgress = false;

watch(() => props.value, (val) => {
  if (rawMode.value && !rawEditInProgress) {
    rawText.value = stringifyDocValue(val);
  }
}, { deep: true });

function toggleRawMode () {
  rawMode.value = !rawMode.value;
  if (rawMode.value) {
    rawText.value = stringifyDocValue(props.value);
  }
}

watch(rawText, (val) => {
  try {
    rawEditInProgress = true;
    const parsed = parseDocValue(val);
    emit(VALUE_UPDATE_EVENT, parsed);
  } catch {
    // Invalid JSON5 — don't emit until syntax is valid
  } finally {
    rawEditInProgress = false;
  }
});
</script>

<script>
/**
 * The 'option bar control' component wraps an underlying 'control' component to provide extended functionality
 * and decouple the reliance on the option bar and members from individual 'control' components.
 */
export default {
  name: 'DtcOptionBarControl',
};
</script>
