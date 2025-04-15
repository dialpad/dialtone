<template>
  <dt-stack
    direction="row"
    gap="600"
    class="d-m64"
  >
    <span v-dt-tooltip="'Default placement'">Span with tooltip</span>
    <dt-button
      v-dt-tooltip:bottom="'Tooltip on bottom'"
      importance="clear"
      kind="danger"
      circle
      aria-label="example button"
    >
      <template #icon>
        <dt-icon name="phone-hang-up" />
      </template>
    </dt-button>
    <dt-button v-dt-tooltip:top-end="'Tooltip on top end'">
      Button with tooltip
    </dt-button>

    <dt-button v-dt-tooltip="empty">
      Empty tooltip
    </dt-button>

    <dt-button
      v-dt-tooltip:top-end="message"
      @click="changeOnClick"
    >
      Change content on click
    </dt-button>
  </dt-stack>
</template>

<script>
import DtStack from '@/components/stack/stack.vue';
import DtButton from '@/components/button/button.vue';
import DtIcon from '@/components/icon/icon.vue';
export default {
  name: 'DtTooltipDirectiveDefault',
  components: { DtIcon, DtButton, DtStack },
  data () {
    return {
      empty: undefined,
      message: 'This is a simple tooltip. You can set the position of the tooltip using the placement prop! Click to change content',
    };
  },

  methods: {
    async changeOnClick () {
      const defaultValue = this.message;
      this.message = 'Changed!';
      await new Promise(resolve => setTimeout(resolve, 750));
      this.message = defaultValue;
    },
  },
};
</script>
