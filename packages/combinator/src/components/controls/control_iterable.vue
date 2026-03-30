<template>
  <dt-text
    as="div"
    kind="label"
    :size="100"
    tone="secondary"
  >
    <slot />
  </dt-text>
  <dt-text
    kind="code"
    tone="muted"
    :size="100"
  >
    <slot name="prefix" />
  </dt-text>
  <div>
    <template
      v-for="(item, index) in value"
      :key="getId(index)"
    >
      <dt-stack direction="row">
        <div class="d-fl-grow1">
          <slot
            name="item"
            :item="item"
            :update="(e) => updateItem(index, e)"
          />
        </div>
        <dt-button
          class="dtc-icon"
          importance="clear"
          kind="muted"
          :size="100"
          :disabled="disabled"
          @click="() => removeItem(index)"
        >
          <template #icon="{ iconSize }">
            <dt-icon-close :size="iconSize" />
          </template>
        </dt-button>
      </dt-stack>
    </template>
    <dt-button
      class="dtc-icon"
      :size="100"
      importance="clear"
      kind="muted"
      :disabled="disabled"
      @click="addItem"
    >
      <template #icon="{ iconSize }">
        <dt-icon-plus :size="iconSize" />
      </template>
    </dt-button>
  </div>
  <dt-text
    kind="code"
    tone="muted"
    :size="100"
  >
    <slot name="suffix" />
  </dt-text>
</template>

<script setup>
import { DtIconPlus, DtIconClose } from '@dialpad/dialtone-icons/vue';
import { DtButton } from '@dialpad/dialtone-vue';
import { DEFAULT_PREFIX, VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { idMap } from '@/src/lib/utils_vue';
import { getUniqueString } from '@/src/lib/utils';

const props = defineProps({
  value: {
    type: Array,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * Function that returns an item to append to list.
   */
  generateItem: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits([VALUE_UPDATE_EVENT]);

const prefix = getUniqueString(`${DEFAULT_PREFIX}-control-iterable`);

/**
 * Id map is used to keep v-for keys in order when adding and removing new items.
 */
const { addId, removeId, getId } = idMap(`${prefix}-item`);

function updateItem (index, item) {
  const items = [...props.value];

  items.splice(index, 1, item);

  updateValue(items);
}

function addItem () {
  const items = [
    ...props.value,
    props.generateItem(),
  ];

  addId();

  updateValue(items);
}

function removeItem (index) {
  const items = [...props.value];

  items.splice(index, 1);

  removeId(index);

  updateValue(items);
}

function updateValue (e) {
  emit(VALUE_UPDATE_EVENT, e);
}
</script>

<script>
/**
 * Control that is used to provide an interface to modify generic iterable values.
 * The important parts of the functionality are abstracted to the parent to allow
 * reuse of this control for any iterable value type.
 */
export default {
  name: 'DtcControlIterable',
};
</script>
