<template>
  <dt-stack
    direction="row"
    gap="600"
    class="d-m64"
  >
    <span v-dt-tooltip="tooltipText">Span with tooltip</span>
    <dt-button
      v-dt-tooltip:bottom="tooltipText"
      importance="clear"
      kind="danger"
      circle
      aria-label="example button"
    >
      <template #icon>
        <dt-icon name="phone-hang-up" />
      </template>
    </dt-button>
    <dt-button v-dt-tooltip:top-end="tooltipText">
      Button with tooltip
    </dt-button>
    <dt-button
      @click="updateTooltipText('Updated placement')"
    >
      Update Tooltip Text
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
      tooltipText: 'Default placement',
    };
  },

  methods: {
    updateTooltipText (text) {
      this.tooltipText = text;
    },
  },
};
</script>
