<!-- eslint-disable max-lines -->
<template>
  <div class="d-d-flex d-jc-space-between d-fw-wrap d-w100p d-flg12 d-fl-col2">
    <dt-button
      id="anchor"
      @click="toggleOpen(!internalOpen)"
    >
      popover anchor
    </dt-button>
    <dt-popover
      :open="internalOpen"
      :modal="true"
      width-content="anchor"
      :placement="$attrs.placement"
      initial-focus-element="first"
      class="d-mb128"
      external-anchor="anchor"
      :append-to="$attrs.appendTo"
      sticky="popper"
      @update:open="toggleOpen"
    >
      <template
        slot="content"
        slot-scope="{ close }"
      >
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

  data () {
    return {
      internalOpen: this.$attrs.open,
    };
  },

  methods: {
    toggleOpen (value) {
      this.internalOpen = value;
    },
  },
};
</script>
