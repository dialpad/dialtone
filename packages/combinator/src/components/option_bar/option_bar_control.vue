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
          gap="100"
          align="baseline"
        >
          <dt-text
            v-dt-tooltip="{ message: description, placement: 'left' }"
            kind="label"
            :size="100"
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
            variant="label-xs"
            :size="50"
            strength="normal"
            tone="critical"
            class="d-fs-50"
          >
            Required
          </dt-text>
          <dt-text
            v-if="vModel"
            :size="100"
            kind="label"
            strength="normal"
            tone="disabled"
            class="d-fs-50"
          >
            v-model
          </dt-text>
          <dt-text
            v-if="deprecated"
            variant="label-xs"
            :size="50"
            strength="normal"
            tone="warning"
          >
            Deprecated
          </dt-text>
        </dt-stack>
        <dt-button
          v-if="showRawToggle"
          v-dt-tooltip="'Edit as JSON'"
          link
          :link-underline="false"
          class="d-mis-auto d-fw-normal d-fs-50 d-px-25 d-bar-200 h:d-td-none d-w-50 d-mie-25"
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
        :size="100"
        spellcheck="false"
        class="d-mbs-75"
      />
    </component>
  </div>
</template>

<script setup>
import DtIconLock from '@dialpad/dialtone-icons/vue/lock';
import { DtButton, DtInput, DtText } from '@dialpad/dialtone-vue';
import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { computed, ref, watch } from 'vue';
import { deserializeControlValue, getControlByValue, serializeControlValue } from '@/src/lib/control';
import { parseDocValue } from '@/src/lib/parse';
import JSON5 from 'json5-with-undefined';

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
   * If the member is deprecated.
   */
  deprecated: {
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
    default: () => ({}),
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
  const rawDefault = props.controlData.component.props?.value?.default;
  const defaultValue = typeof rawDefault === 'function' ? rawDefault() : rawDefault;
  const displayValue = isInactive
    ? defaultValue ?? controlValue.value
    : controlValue.value;

  return {
    value: displayValue,
    disabled: props.locked || props.disabled,
    tags: props.tags,
    label: controlLabel.value,
    ...props.args,
    required: props.required,
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
  if (name === 'DtcControlArray' || name === 'DtcControlObject') return true;
  // Also show for props that accept array/object in addition to other types (e.g. Number | Number[]).
  // Excludes anything that also accepts 'string' — every *Class prop is typed
  // string|array|object, so without this exclusion the toggle would show up
  // on virtually every class-override control in the library, not just the
  // genuinely array/object-shaped props (like Slider's modelValue) it's meant for.
  return !props.validControls.includes('string') && props.validControls.some(c => c === 'array' || c === 'object');
});

const rawMode = ref(false);
const rawText = ref('');
let rawEditInProgress = false;
// Set right before rawText is assigned programmatically (entering raw mode,
// or the props.value watcher below reformatting it) — the rawText watcher
// checks and clears it to skip emitting for that one seeded change, so
// opening/reformatting raw mode never re-emits the value it just displayed.
let suppressNextEmit = false;

function formatRawValue (val) {
  return JSON5.stringify(val, null, 2);
}

// Only set suppressNextEmit when the seeded text actually differs from what
// rawText already holds — Vue's watch() only invokes its callback on a real
// change, so seeding with an UNCHANGED value (e.g. reopening raw mode
// without having edited anything) would otherwise set the flag with no
// watcher run left to consume and clear it. That stale `true` then silently
// discarded the user's next genuine edit — the callback saw a leftover flag
// from a seed that never actually reached it.
function seedRawText (formatted) {
  if (formatted !== rawText.value) suppressNextEmit = true;
  rawText.value = formatted;
}

watch(() => props.value, (val) => {
  if (rawMode.value && !rawEditInProgress) {
    seedRawText(formatRawValue(val));
  }
}, { deep: true });

function toggleRawMode () {
  rawMode.value = !rawMode.value;
  if (rawMode.value) {
    seedRawText(formatRawValue(props.value));
  }
}

watch(rawText, (val) => {
  if (suppressNextEmit) {
    suppressNextEmit = false;
    return;
  }
  try {
    rawEditInProgress = true;
    const parsed = parseDocValue(val);
    // A control only accepts certain value shapes (validControls) — RAW mode
    // lets a consumer type arbitrary JSON5, so without this check a string
    // typed for a number|array control (e.g. Slider's modelValue) would
    // reach the component unchanged and break it. 'null' is always allowed:
    // it's how a control's value gets cleared, and it isn't itself a member
    // of validControls the way a shape like 'number' or 'array' is.
    const parsedControl = getControlByValue(parsed);
    if (parsedControl !== 'null' && !props.validControls.includes(parsedControl)) return;
    // validControls only checks the value's coarse shape (e.g. 'array') — a shape
    // can still be internally invalid (e.g. Slider's modelValue accepts an array
    // only when it has exactly 2 elements). Reuse the live component's own prop
    // validator when one was threaded through via args, so RAW mode can't emit
    // a value the component itself would reject.
    if (parsedControl !== 'null' && props.args.validator && !props.args.validator(parsed)) return;
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
