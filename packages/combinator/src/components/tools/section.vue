<template>
  <li>
    <dt-list-item
      role="listitem"
      element-type="div"
      navigation-type="tab"
      @click="toggle"
    >
      <template #default>
        <h2>
          {{ heading }}
        </h2>
      </template>
      <template #right="{ iconSize }">
        <component
          :is="show ? DtIconChevronDown : DtIconChevronRight"
          :size="iconSize"
        />
      </template>
    </dt-list-item>
    <div
      v-if="show"
      :class="contentClass"
    >
      <slot />
    </div>
  </li>
</template>

<script setup>
import { DtListItem } from '@dialpad/dialtone-vue';
import { DtIconChevronDown, DtIconChevronRight } from '@dialpad/dialtone-icons/vue3';

import { ref } from 'vue';

const props = defineProps({
  heading: {
    type: String,
    required: true,
  },
  open: {
    type: Boolean,
    default: true,
  },
  contentClass: {
    type: String,
    default: '',
  },
});

const show = ref(props.open);

function toggle () {
  show.value = !show.value;
}

</script>

<script>
export default {
  name: 'DtcSection',
};
</script>
