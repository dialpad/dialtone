<template>
  <div class="d-stack d-stack--gap-500">
    <section>
      <h3 class="d-label--md">
        Headline
      </h3>
      <div class="d-stack d-stack--gap-300">
        <dt-text
          v-for="size in headlineSizes"
          :key="`headline-${size}`"
          kind="headline"
          :size="size"
        >
          {{ `Headline ${size}` }}
        </dt-text>
        <dt-text
          kind="headline"
          size="lg"
          strength="soft"
        >
          Headline soft
        </dt-text>
        <dt-text
          kind="headline"
          size="lg"
          density="compact"
        >
          Headline compact
        </dt-text>
      </div>
    </section>

    <section>
      <h3 class="d-label--md">
        Body
      </h3>
      <div class="d-stack d-stack--gap-300">
        <dt-text
          kind="body"
          size="md"
        >
          Body md
        </dt-text>
        <dt-text
          kind="body"
          size="sm"
        >
          Body sm
        </dt-text>
        <dt-text
          kind="body"
          size="md"
          density="compact"
        >
          Body md compact
        </dt-text>
      </div>
    </section>

    <section>
      <h3 class="d-label--md">
        Label / Helper / Code
      </h3>
      <div class="d-stack d-stack--gap-300">
        <dt-text
          kind="label"
          size="md"
          strength="plain"
        >
          Label md plain
        </dt-text>
        <dt-text
          kind="label"
          size="sm"
        >
          Label sm
        </dt-text>
        <dt-text
          kind="helper"
          size="sm"
        >
          Helper sm
        </dt-text>
        <dt-text
          kind="code"
          size="sm"
          numeric
        >
          Code sm numeric
        </dt-text>
      </div>
    </section>
  </div>
</template>

<script>
import { DtText } from './index';
import { TEXT_SIZE_MODIFIERS } from './text_constants';

export default {
  name: 'DtTextVariants',
  components: { DtText },

  computed: {
    headlineSizes () {
      return TEXT_SIZE_MODIFIERS.headline;
    },
  },
};
</script>
