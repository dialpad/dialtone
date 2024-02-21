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
  </dt-stack>
</template>

<script>
import DtStack from '@/components/stack/stack.vue';
import DtButton from '@/components/button/button.vue';
import DtIcon from '@/components/icon/icon.vue';
export default {
  name: 'DtTooltipDirectiveDefault',
  components: { DtIcon, DtButton, DtStack },
};
</script>
