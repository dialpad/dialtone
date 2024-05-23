<template>
  <component
    :is="illustration"
    v-if="illustration"
    :data-qa="$attrs['data-qa'] ?? 'dt-illustration'"
  />
</template>

<script>
import { illustrations } from '@dialpad/dialtone-icons/vue2';
import { ILLUSTRATION_NAMES } from './illustration_constants';

export default {
  name: 'DtIllustration',

  props: {
    /**
     * The illustration name in kebab-case
     */
    name: {
      type: String,
      required: true,
      validator: (name) => ILLUSTRATION_NAMES.includes(name),
    },
  },

  computed: {
    illustration () {
      return illustrations[`./src/illustrations/${this.name}.vue`];
    },
  },
};
</script>
