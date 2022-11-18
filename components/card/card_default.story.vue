<template>
  <dt-card
    class="d-w264"
    :container-class="$attrs.containerClass"
    :header-class="$attrs.headerClass"
    :content-class="$attrs.contentClass"
    :footer-class="$attrs.footerClass"
    :max-height="maxHeight"
  >
    <template
      v-if="showHeader && variants"
      #header
    >
      <p>Header</p>
      <dt-button
        size="xs"
        importance="clear"
        aria-label="Menu button"
      >
        <template #icon>
          <dt-icon
            name="more-vertical"
            size="100"
          />
        </template>
      </dt-button>
    </template>
    <template
      v-else-if="$attrs.header"
      #header
    >
      <span v-html="$attrs.header" />
    </template>
    <template #content>
      <div v-if="$attrs.content">
        <span v-html="$attrs.content" />
      </div>
      <div
        v-else
        tabindex="0"
      >
        <p class="d-fs-200 d-fw-bold d-fc-black-800">
          Lorem ipsum
        </p>
        <p class="d-fs-100">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.
        </p>
      </div>
    </template>
    <template
      v-if="showFooter & variants"
      #footer
    >
      <dt-button>
        Button 1
      </dt-button>
      <dt-button class="d-ml8">
        Button 2
      </dt-button>
    </template>
    <template
      v-else-if="$attrs.footer"
      #footer
    >
      <span v-html="$attrs.footer" />
    </template>
  </dt-card>
</template>

<script>
import DtCard from './card';
import { DtIcon } from '@/components/icon';
import { DtButton } from '@/components/button';

export default {
  name: 'DtCardDefault',
  components: {
    DtCard,
    DtButton,
    DtIcon,
  },

  props: {
    showHeader: {
      type: Boolean,
      default: false,
    },

    showFooter: {
      type: Boolean,
      default: false,
    },

    variants: {
      type: Boolean,
      default: false,
    },

    maxHeight: {
      type: String,
      default: null,
    },
  },
};
</script>
