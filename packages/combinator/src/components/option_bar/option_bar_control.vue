<template>
  <div>
    <component
      :is="controlComponent"
      v-bind="controlBindings"
      @update:value="updateValue"
    >
      <span>
        <span
          class="d-pr4"
          data-qa="dtc-option-bar-control-label"
        >
          {{ label }}
        </span>
        <icon-lock
          v-if="locked"
          class="d-pr4 d-fs10 d-ps-relative d-t1"
        />
        <span
          v-if="required"
          class="d-pl2 d-ps-relative d-b2"
        >
          <dt-badge
            text="required"
            color="black-700"
          />
        </span>
        <span
          v-if="vModel"
          class="d-pl2 d-ps-relative d-b2"
        >
          <dt-badge
            text="v-model"
            color="black-700"
          />
        </span>
      </span>
    </component>
    <div
      class="d-description d-p1"
      data-qa="dtc-option-bar-control-description"
    >
      {{ description }}
    </div>
  </div>
</template>

<script setup>
import IconLock from 'dialtone-icons/IconLock';
import { DtBadge } from '@dialpad/dialtone-vue';
import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { computed } from 'vue';
import { serializeControlValue, deserializeControlValue } from '@/src/lib/control';

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
  return {
    value: controlValue.value,
    disabled: props.locked,
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
    Object.entries(controlArgs.value).filter(([arg, _]) => {
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
