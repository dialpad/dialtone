<template>
  <dt-button-group
    class="d-d-flex d-bgc-black-025 d-bar4"
  >
    <template
      v-for="(_, slot) in slots"
      :key="slot"
    >
      <dt-button
        class="d-px24"
        importance="clear"
        :active="slot === value"
        @click="() => emit('click', slot)"
      >
        <template #icon>
          <slot :name="slot" />
        </template>
      </dt-button>
    </template>
  </dt-button-group>
</template>

<script setup>
import { DtButtonGroup, DtButton } from '@dialpad/dialtone-vue';
import { useSlots } from 'vue';

defineProps({
  value: {
    type: String,
    required: true,
  },
});

const slots = useSlots();

const emit = defineEmits(['click']);
</script>

<script>
export default {
  name: 'DtcRenderButtonBar',
};
</script>
