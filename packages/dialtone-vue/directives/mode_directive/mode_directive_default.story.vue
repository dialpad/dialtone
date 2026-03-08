<template>
  <dt-stack
    gap="600"
    class="d-m64"
  >
    <dt-text
      as="h3"
      kind="headline"
      size="sm"
    >
      Explicit modes
    </dt-text>
    <dt-stack
      gap="400"
      direction="row"
    >
      <section
        v-dt-mode:light
        class="d-p16 d-ba d-bc-subtle d-bar8 d-w264"
      >
        <dt-stack gap="400">
          <dt-text
            kind="body"
            tone="primary"
          >
            Light mode (v-dt-mode:light)
          </dt-text>
          <dt-stack
            gap="400"
            direction="row"
          >
            <span class="d-fc-primary">Primary</span>
            <span class="d-fc-tertiary">Tertiary</span>
            <span class="d-fc-success">Success</span>
            <span class="d-fc-critical">Critical</span>
          </dt-stack>
        </dt-stack>
      </section>
      <section
        v-dt-mode:dark
        class="d-p16 d-ba d-bc-subtle d-bar8 d-w264"
      >
        <dt-stack gap="400">
          <dt-text
            kind="body"
            tone="primary"
          >
            Dark mode (v-dt-mode:dark)
          </dt-text>
          <dt-stack
            gap="400"
            direction="row"
          >
            <span class="d-fc-primary">Primary</span>
            <span class="d-fc-tertiary">Tertiary</span>
            <span class="d-fc-success">Success</span>
            <span class="d-fc-critical">Critical</span>
          </dt-stack>
        </dt-stack>
      </section>
    </dt-stack>

    <dt-text
      as="h3"
      kind="headline"
      size="sm"
    >
      Invert mode (default)
    </dt-text>
    <section
      v-dt-mode
      class="d-p16 d-ba d-bc-subtle d-bar8 d-w264"
    >
      <dt-text
        kind="body"
        tone="primary"
      >
        Inverted from root (v-dt-mode)
      </dt-text>
    </section>

    <dt-text
      as="h3"
      kind="headline"
      size="sm"
    >
      Nested directives
    </dt-text>
    <div
      v-dt-mode:dark
      class="d-p16 d-ba d-bc-subtle d-bar8"
    >
      <dt-stack gap="400">
        <dt-text
          kind="body"
          tone="primary"
        >
          Dark (outer)
        </dt-text>
        <div
          v-dt-mode:invert
          class="d-p16 d-ba d-bc-subtle d-bar8"
        >
          <dt-stack gap="400">
            <dt-text
              kind="body"
              tone="primary"
            >
              Light — inverted from dark (inner)
            </dt-text>
            <div
              v-dt-mode:invert
              class="d-p16 d-ba d-bc-subtle d-bar8"
            >
              <dt-text
                kind="body"
                tone="primary"
              >
                Dark — inverted again (deepest)
              </dt-text>
            </div>
          </dt-stack>
        </div>
      </dt-stack>
    </div>

    <dt-text
      as="h3"
      kind="headline"
      size="sm"
    >
      Dynamic arg
    </dt-text>
    <dt-stack
      gap="400"
      direction="row"
      class="d-ai-center"
    >
      <label
        for="mode-select"
        class="d-label"
      >Mode</label>
      <select
        id="mode-select"
        v-model="dynamicMode"
        class="d-select d-w128"
      >
        <option value="light">
          light
        </option>
        <option value="dark">
          dark
        </option>
        <option value="invert">
          invert
        </option>
      </select>
      <section
        v-dt-mode:[dynamicMode]
        class="d-p16 d-ba d-bc-subtle d-bar8 d-w264"
      >
        <dt-text
          kind="body"
          tone="primary"
        >
          v-dt-mode:{{ dynamicMode }}
        </dt-text>
      </section>
    </dt-stack>
  </dt-stack>
</template>

<script>
import DtStack from '@/components/stack/stack.vue';
import DtText from '@/components/text/text.vue';

export default {
  name: 'DtModeDirectiveDefault',
  components: { DtStack, DtText },
  data () {
    return {
      dynamicMode: 'invert',
    };
  },
};
</script>
