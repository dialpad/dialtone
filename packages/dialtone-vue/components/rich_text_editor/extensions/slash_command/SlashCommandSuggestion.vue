<template>
  <div>
    <dt-text
      kind="body"
      size="md"
      :density="300"
      as="div"
    >
      <span>/{{ command }}</span><span v-if="parametersExample"> {{ parametersExample }}</span>
    </dt-text>
    <dt-text
      kind="body"
      size="sm"
      tone="tertiary"
      as="div"
    >
      {{ description }}
    </dt-text>
  </div>
</template>

<script>
import { DtText } from '@/components/text';

export default {
  compatConfig: { MODE: 3 },
  name: 'SlashCommandSuggestion',
  components: { DtText },

  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  computed: {
    command () {
      return this.item.command;
    },

    description () {
      return this.item.description;
    },

    parametersExample () {
      return this.item.parametersExample;
    },
  },
};
</script>
