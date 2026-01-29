<!-- eslint-disable max-lines -->
<template>
  <div class="d-ml128">
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
          <p class="d-mb4">
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
  </div>
</template>

<script>
import { DtPopover } from '.';
import { DtButton } from '@/components/button';

export default {
  name: 'PopoverVariantsStory',

  components: {
    DtPopover,
    DtButton,
  },
};
</script>
