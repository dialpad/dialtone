<template>
  <div>
    <template
      v-for="[category, icons] in Object.entries(categories)"
      :key="category"
    >
      <h2
        class="d-tt-capitalize d-my8"
        v-text="category"
      />
      <dt-icon
        v-for="icon in Object.keys(icons).slice(0, $attrs.limit)"
        :key="`${category}-${icon}`"
        :name="icon"
        class="d-m8"
      />
    </template>
  </div>
</template>

<script>
import { DtIcon } from './';
import { categories } from '@dialpad/dialtone-icons/keywords-icons.json';

export default {
  name: 'IconDefault',
  components: { DtIcon },
  data () {
    return {
      categories,
    };
  },
};
</script>
