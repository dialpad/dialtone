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
      <template #right>
        <icon-collapse v-if="show" />
        <icon-expand v-else />
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
import IconExpand from 'dialtone-icons/IconArrowKeyboardDown';
import IconCollapse from 'dialtone-icons/IconArrowKeyboardUp';
import { DtListItem } from '@dialpad/dialtone-vue';

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
