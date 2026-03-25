<template>
  <div>
    <template
      v-for="[category, icons] in Object.entries(categories)"
      :key="category"
    >
      <h2
        class="d-tt-capitalize d-my-200"
        v-text="category"
      />
      <dt-stack
        direction="row"
        class="d-fw-wrap"
        gap="500"
      >
        <dt-stack
          v-for="icon in Object.keys(icons).slice(0, $attrs.limit)"
          :key="`${category}-${icon}`"
          :title="icon"
        >
          <dt-icon
            :name="icon"
            size="300"
          />
        </dt-stack>
      </dt-stack>
    </template>
  </div>
</template>

<script>
import { DtIcon } from './';
import { categories } from '@dialpad/dialtone-icons/keywords-icons.json';
import { DtStack } from '../stack';

export default {
  name: 'IconDefault',
  components: { DtIcon, DtStack },
  data () {
    return {
      categories,
    };
  },
};
</script>
