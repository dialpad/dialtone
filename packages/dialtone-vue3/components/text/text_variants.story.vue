<template>
  <dt-stack class="d-stack d-stack--gap-500">
    <section>
      <dt-text
        as="h3"
        kind="label"
        size="md"
        class="d-bb"
        tone="muted"
      >
        Headline
      </dt-text>
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
      <dt-text
        as="h3"
        kind="label"
        size="md"
        class="d-bb"
        tone="muted"
      >
        Body
      </dt-text>
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
      <dt-text
        as="h3"
        kind="label"
        size="md"
        class="d-bb"
        tone="muted"
      >
        Label / Helper / Code
      </dt-text>
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
  </dt-stack>
</template>

<script>
import { DtStack } from '../stack';
import { DtText } from './index';
import { TEXT_SIZE_MODIFIERS } from './text_constants';

export default {
  name: 'DtTextVariants',
  components: { DtStack, DtText },

  computed: {
    headlineSizes () {
      return TEXT_SIZE_MODIFIERS.headline;
    },
  },
};
</script>
