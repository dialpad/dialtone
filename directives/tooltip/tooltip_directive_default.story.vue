<template>
  <dt-stack
    direction="row"
    gap="600"
    class="d-mt64"
  >
    <dt-button
      v-dt-tooltip:top-end="'Tooltip text on top-end'"
      importance="clear"
      kind="danger"
    >
      Trying complex examples
    </dt-button>
    <span v-dt-tooltip="'Text with default placement'">More text</span>
    <dt-button v-dt-tooltip:bottom="'Tooltip text on bottom'">
      Button with tooltip
    </dt-button>
  </dt-stack>
</template>

<script>
import DtStack from '@/components/stack/stack.vue';
import DtButton from '@/components/button/button.vue';
export default {
  name: 'DtTooltipDirectiveDefault',
  components: { DtButton, DtStack },
};
</script>
