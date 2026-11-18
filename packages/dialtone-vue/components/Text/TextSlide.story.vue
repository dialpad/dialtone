<template>
  <dt-stack
    gap="400"
    class="d-p-400"
  >
    <dt-text
      as="p"
      tone="secondary"
    >
      Hover a row or Tab to it to slide its label; leave or press Esc to snap it back. Pick the mode in
      the slide control. With reduced motion on, the label jumps to the end and stays.
    </dt-text>
    <div
      v-for="group in groups"
      :key="group.qa"
      :dir="group.dir"
      class="d-ba d-bc-default d-bar-300 d-p-100 d-w224"
      :data-qa="group.qa"
    >
      <button
        v-for="label in group.labels"
        :key="label"
        type="button"
        class="slide-row d-d-flex d-w100p d-p-200 d-bar-200"
      >
        <dt-text
          as="div"
          variant="label-md"
          :slide="$attrs.slide"
          class="slide-label"
        >
          {{ label }}
        </dt-text>
      </button>
    </div>
  </dt-stack>
</template>

<script>
import { DtText } from './index';
import { DtStack } from '../stack';

export default {
  name: 'DtTextSlide',
  components: { DtText, DtStack },
  inheritAttrs: false,

  data() {
    return {
      groups: [
        {
          qa: 'slide-menu',
          labels: [
            'Front desk reception phone, second floor east wing',
            'Conference room Aurora with ceiling microphone array',
            'Short label',
          ],
        },
        {
          qa: 'slide-rtl',
          dir: 'rtl',
          labels: ['قائمة انتظار دعم العملاء لمنطقة الشمال الغربي للمحيط الهادئ والمناطق المجاورة'],
        },
      ],
    };
  },
};
</script>

<style scoped>
.slide-label {
  min-inline-size: 0;
}

.slide-row {
  border: 0;
  background: transparent;
  color: inherit;
  text-align: start;
  cursor: pointer;
}

.slide-row:hover,
.slide-row:focus-visible {
  background: var(--dt-color-surface-secondary);
}
</style>
