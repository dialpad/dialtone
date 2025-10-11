<template>
  <dt-stack gap="500">
    <div>
      <h2 class="d-headline--xl">
        Mode Island Examples
      </h2>
      <p class="d-body--md d-fc-tertiary">
        Mode islands allow you to create sections with different color modes independent of the root theme.
      </p>
    </div>
    <div
      class="d-d-grid d-g-cols2 d-g16"
    >
      <dt-stack gap="300">
        <h4 class="d-headline--md">
          Default (Inverted) Mode
        </h4>
        <dt-mode-island class="d-p16 d-ba d-bc-subtle d-bar8 d-bgc-primary">
          <p class="d-body--md">
            This mode island inverts the current mode. If the root is light, this will be dark, and vice versa.
          </p>
          <div class="d-mt8">
            <dt-badge text="Inverted Mode" />
          </div>
        </dt-mode-island>
      </dt-stack>
      <dt-stack gap="300">
        <h4 class="d-headline--md">
          Explicit Light Mode
        </h4>
        <dt-mode-island
          mode="light"
          class="d-p16 d-ba d-bc-subtle d-bar8 d-bgc-primary"
        >
          <p class="d-body--md">
            This mode island is always in light mode, regardless of the root theme.
          </p>
          <div class="d-mt8">
            <dt-badge
              text="Always Light"
              type="info"
            />
          </div>
        </dt-mode-island>
      </dt-stack>
      <dt-stack gap="300">
        <h4 class="d-headline--md">
          Explicit Dark Mode
        </h4>
        <dt-mode-island
          mode="dark"
          class="d-p16 d-ba d-bc-subtle d-bar8 d-bgc-primary"
        >
          <p class="d-body--md">
            This mode island is always in dark mode, regardless of the root theme.
          </p>
          <div class="d-mt8">
            <dt-badge
              text="Always Dark"
              type="warning"
            />
          </div>
        </dt-mode-island>
      </dt-stack>
      <dt-stack gap="300">
        <h4 class="d-headline--md">
          Nested Mode Islands
        </h4>
        <dt-mode-island
          mode="dark"
          class="d-p16 d-ba d-bc-subtle d-bar8 d-bgc-primary"
        >
          <p class="d-body--md d-mb16">
            This is a dark mode island.
          </p>

          <dt-mode-island
            mode="inverted"
            class="d-p16 d-ba d-bc-subtle d-bar8 d-bgc-primary"
          >
            <p class="d-body--md d-mb16">
              This nested island inverts the parent (so it's light).
            </p>

            <dt-mode-island
              mode="inverted"
              class="d-p16 d-ba d-bc-subtle d-bar8 d-bgc-primary"
            >
              <p class="d-body--md d-mb16">
                This deeply nested island inverts again (back to dark).
              </p>
              <dt-mode-island
                mode="inverted"
                class="d-p16 d-ba d-bc-subtle d-bar8 d-bgc-primary"
              >
                <p class="d-body--md">
                  And invert again (back to light).
                </p>
              </dt-mode-island>
            </dt-mode-island>
          </dt-mode-island>
        </dt-mode-island>
      </dt-stack>
      <dt-stack gap="300">
        <h4 class="d-headline--md">
          With Components
        </h4>
        <dt-stack
          gap="500"
        >
          <dt-mode-island
            class="d-fl1 d-p16 d-ba d-bc-subtle d-bar8 d-bgc-primary"
          >
            <dt-stack gap="400">
              <p class="d-body--md d-fw-semibold">
                Inverted Island
              </p>
              <dt-button>Click Me</dt-button>
              <dt-input
                label="Input field"
                placeholder="Type here..."
              />
              <dt-checkbox>Checkbox Option</dt-checkbox>
            </dt-stack>
          </dt-mode-island>

          <dt-mode-island
            mode="light"
            class="d-fl1 d-p16 d-ba d-bc-subtle d-bar8 d-bgc-primary"
          >
            <dt-stack gap="400">
              <p class="d-body--md d-fw-semibold">
                Light Mode Island
              </p>
              <dt-button>Click Me</dt-button>
              <dt-input
                label="Input field"
                placeholder="Type here..."
              />
              <dt-checkbox>Checkbox Option</dt-checkbox>
            </dt-stack>
          </dt-mode-island>

          <dt-mode-island
            mode="dark"
            class="d-fl1 d-p16 d-ba d-bc-subtle d-bar8 d-bgc-primary"
          >
            <dt-stack gap="400">
              <p class="d-body--md d-fw-semibold">
                Dark Mode Island
              </p>
              <dt-button>Click Me</dt-button>
              <dt-input
                label="Input field"
                placeholder="Type here..."
              />
              <dt-checkbox>Checkbox Option</dt-checkbox>
            </dt-stack>
          </dt-mode-island>
        </dt-stack>
      </dt-stack>
      <dt-stack gap="300">
        <h4 class="d-headline--md">
          Custom Element Type
        </h4>
        <dt-mode-island
          as="section"
          mode="inverted"
          class="d-p16 d-ba d-bc-subtle d-bar8 d-bgc-primary"
        >
          <p class="d-body--md">
            This mode island is rendered as a <code>&lt;section&gt;</code> element instead of a &lt;div&gt;.
          </p>
        </dt-mode-island>
      </dt-stack>
    </div>
  </dt-stack>
</template>

<script>
import DtModeIsland from './mode_island.vue';
import DtStack from '@/components/stack/stack.vue';
import DtBadge from '@/components/badge/badge.vue';
import DtButton from '@/components/button/button.vue';
import DtInput from '@/components/input/input.vue';
import DtCheckbox from '@/components/checkbox/checkbox.vue';

export default {
  name: 'ModeIslandDefaultStory',
  components: {
    DtModeIsland,
    DtStack,
    DtBadge,
    DtButton,
    DtInput,
    DtCheckbox,
  },

  data () {
    return {};
  },
};
</script>
