<template>
  <dt-stack gap="500">
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
      <dt-stack gap="300">
        <dt-text
          v-for="size in headlineSizes"
          :key="`headline-${size}`"
          kind="headline"
          :size="size"
        >
          {{ `Headline ${size}` }}
        </dt-text>
        <dt-text
          v-for="size in headlineSizes"
          :key="`headline-${size}`"
          kind="headline"
          :size="size"
          density="compact"
          strength="soft"
        >
          {{ `Headline ${size}` }} compact soft
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
        <dt-text
          kind="headline"
          size="lg"
          density="compact"
          strength="soft"
        >
          Headline compact soft
        </dt-text>
      </dt-stack>
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
      <dt-stack gap="300">
        <dt-text
          kind="body"
          size="sm"
        >
          Body sm
        </dt-text>
        <dt-text
          kind="body"
          size="sm"
          density="compact"
        >
          Body sm compact
        </dt-text>
        <dt-text
          kind="body"
          size="md"
        >
          Body md
        </dt-text>
        <dt-text
          kind="body"
          size="md"
          density="compact"
        >
          Body md compact
        </dt-text>
      </dt-stack>
    </section>
    <section>
      <dt-text
        as="h3"
        kind="label"
        size="md"
        class="d-bb"
        tone="muted"
      >
        Label
      </dt-text>
      <dt-stack gap="300">
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
          kind="label"
          size="md"
          density="compact"
        >
          Label md compact
        </dt-text>
        <dt-text
          kind="label"
          size="sm"
          density="compact"
        >
          Label sm compact
        </dt-text>
      </dt-stack>
    </section>
    <section>
      <dt-text
        as="h3"
        kind="label"
        size="md"
        class="d-bb"
        tone="muted"
      >
        Helper
      </dt-text>
      <dt-stack gap="300">
        <dt-text
          kind="helper"
          size="sm"
        >
          Helper sm
        </dt-text>
        <dt-text
          kind="helper"
          size="md"
        >
          Helper md
        </dt-text>
        <dt-text
          kind="helper"
          size="sm"
          density="compact"
        >
          Helper sm compact
        </dt-text>
        <dt-text
          kind="helper"
          size="md"
          density="compact"
        >
          Helper md compact
        </dt-text>
      </dt-stack>
    </section>
    <section>
      <dt-text
        as="h3"
        kind="label"
        size="md"
        class="d-bb"
        tone="muted"
      >
        Code
      </dt-text>
      <dt-stack gap="300">
        <dt-text
          kind="code"
          size="sm"
        >
          Code sm
        </dt-text>
        <dt-text
          kind="code"
          size="md"
        >
          Code md
        </dt-text>
      </dt-stack>
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
