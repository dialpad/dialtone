<!-- eslint-disable vue/no-restricted-class -->
<template>
  <div>
    <div class="d-body--md-compact">
      <span>/{{ command }}</span><span v-if="parametersExample"> {{ parametersExample }}</span>
    </div>
    <div class="d-body--sm">
      {{ description }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'SlashCommandSuggestion',

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
