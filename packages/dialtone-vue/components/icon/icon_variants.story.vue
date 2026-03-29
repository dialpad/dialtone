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
      >
        <dt-button
          v-for="icon in Object.keys(icons).slice(0, $attrs.limit)"
          :key="`${category}-${icon}`"
          v-dt-tooltip="{ message: copiedIcon === icon ? '✅ Copied!' : icon, delay: false }"
          importance="clear"
          kind="muted"
          size="lg"
          @click="copyIconName(icon)"
        >
          <template #startIcon="{ iconSize }">
            <dt-icon
              :name="icon"
              :size="iconSize"
            />
          </template>
        </dt-button>
      </dt-stack>
    </template>
  </div>
</template>

<script>
import { DtIcon } from './';
import { categories } from '@dialpad/dialtone-icons/keywords-icons.json';
import { DtButton } from '../button';
import { DtStack } from '../stack';

export default {
  name: 'IconDefault',
  components: { DtButton, DtIcon, DtStack },
  data () {
    return {
      categories,
      copiedIcon: null,
    };
  },

  methods: {
    copyIconName (icon) {
      navigator.clipboard.writeText(icon);
      this.copiedIcon = icon;
      setTimeout(() => { this.copiedIcon = null; }, 1200);
    },
  },
};
</script>
