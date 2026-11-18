<!-- eslint-disable max-lines -->
<template>
  <main
    :aria-labelledby="headingId"
    class="d-mis-200"
  >
    <h1
      :id="headingId"
      class="d-headline--md d-mbe-100"
    >
      {{ heading }}
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
import { getUniqueString } from '@/common/utils';

export default {
  name: 'PopoverVariantsStory',

  components: {
    DtPopover,
    DtButton,
  },

  data () {
    const frame = window.frameElement;
    const title = frame?.hasAttribute('data-is-storybook') ? null : frame?.title;
    return {
      headingId: getUniqueString('popover-iframe-heading'),
      heading: title || 'Popover in an iframe',
    };
  },
};
</script>
