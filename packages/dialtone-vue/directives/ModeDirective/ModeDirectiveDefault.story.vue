<template>
  <dt-stack
    gap="200"
    class="d-p-100"
  >
    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      Explicit modes
    </dt-text>
    <dt-stack
      gap="500"
      direction="row"
    >
      <section
        v-dt-mode:light
        class="d-bgc-secondary d-p-200 d-ba d-bc-subtle d-bar-400 d-fl1"
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
            <span class="d-fc-positive">Positive</span>
            <span class="d-fc-critical">Critical</span>
          </dt-stack>
        </dt-stack>
      </section>
      <section
        v-dt-mode:dark
        class="d-bgc-secondary d-p-200 d-ba d-bc-subtle d-bar-400 d-fl1"
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
            <span class="d-fc-positive">Positive</span>
            <span class="d-fc-critical">Critical</span>
          </dt-stack>
        </dt-stack>
      </section>
    </dt-stack>

    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      Invert mode (default)
    </dt-text>
    <section
      v-dt-mode
      class="d-bgc-secondary d-p-200 d-ba d-bc-subtle d-bar-400 d-w264"
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
      :size="400"
    >
      Nested directives
    </dt-text>
    <div
      v-dt-mode:dark
      class="d-bgc-secondary d-p-200 d-ba d-bc-subtle d-bar-400"
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
          class="d-bgc-secondary d-p-200 d-ba d-bc-subtle d-bar-400"
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
              class="d-bgc-secondary d-p-200 d-ba d-bc-subtle d-bar-400"
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
      :size="400"
    >
      Disabled (value = false)
    </dt-text>
    <dt-stack
      gap="400"
      direction="row"
      align="start"
    >
      <section
        v-dt-mode:invert="false"
        class="d-bgc-secondary d-p-200 d-ba d-bc-subtle d-bar-400 d-fl1"
      >
        <dt-text
          kind="body"
          tone="primary"
        >
          v-dt-mode:invert="false" — no mode applied
        </dt-text>
      </section>
      <section
        v-dt-mode:dark="enabled"
        class="d-bgc-secondary d-p-200 d-ba d-bc-subtle d-bar-400 d-fl1"
      >
        <dt-stack gap="400">
          <dt-text
            kind="body"
            tone="primary"
          >
            v-dt-mode:dark="{{ enabled }}" — toggle to compare
          </dt-text>
          <dt-toggle
            :checked="enabled"
            label="Enable mode"
            @update:checked="enabled = $event"
          />
        </dt-stack>
      </section>
    </dt-stack>

    <dt-text
      as="h3"
      kind="headline"
      :size="400"
    >
      Dynamic arg
    </dt-text>
    <dt-stack gap="400">
      <span class="d-w-200">
        <dt-select-menu
          v-model="dynamicMode"
          label="Mode"
          :options="modeOptions"
        />
      </span>
      <section
        v-dt-mode:[dynamicMode]
        class="d-bgc-secondary d-p-200 d-ba d-bc-subtle d-bar-400 d-w264"
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
import DtSelectMenu from '@/components/select_menu/select_menu.vue';
import DtToggle from '@/components/toggle/toggle.vue';

export default {
  name: 'DtModeDirectiveDefault',
  components: { DtStack, DtText, DtSelectMenu, DtToggle },
  data () {
    return {
      enabled: true,
      dynamicMode: 'invert',
      modeOptions: [
        { value: 'invert', label: 'invert' },
        { value: 'light', label: 'light' },
        { value: 'dark', label: 'dark' },
      ],
    };
  },
};
</script>
