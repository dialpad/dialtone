<!-- eslint-disable max-lines -->
<template>
  <main
    :aria-label="frameTitle"
    class="d-mis-200"
  >
    <h1 class="d-headline--md d-mbe-100">
      Popover in an iframe
    </h1>
    <dt-popover
      :open="$attrs.open"
      :modal="true"
      width-content="anchor"
      :placement="$attrs.placement"
      initial-focus-element="first"
      append-to="root"
    >
      <template #anchor="{ attrs }">
        <dt-button
          v-bind="attrs"
        >
          popover anchor
        </dt-button>
      </template>
      <template #content="{ close }">
        <div>
          <p class="d-mbe-50">
            I will be displayed in the popover!
          </p>
          <dt-button
            @click="close"
          >
            Click to close
          </dt-button>
        </div>
      </template>
    </dt-popover>
  </main>
</template>

<script>
import { DtPopover } from '.';
import { DtButton } from '@/components/Button';

export default {
  name: 'PopoverVariantsStory',

  components: {
    DtPopover,
    DtButton,
  },

  data () {
    return { frameTitle: window.frameElement?.title || 'Popover iframe example' };
  },

};
</script>
