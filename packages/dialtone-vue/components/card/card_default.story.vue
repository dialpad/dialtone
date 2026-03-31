<template>
  <dt-card
    class="d-w-400"
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
      <dt-text
        kind="headline"
        :size="300"
        as="h3"
      >
        Header
      </dt-text>
      <dt-button
        :size="100"
        importance="clear"
        kind="muted"
        aria-label="Menu button"
      >
        <template #startIcon>
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
        Default content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.
      </div>
    </template>
    <template
      v-if="showFooter & variants"
      #footer
    >
      <dt-button>
        Button 1
      </dt-button>
      <dt-button>
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
import DtCard from './card.vue';
import { DtIcon } from '@/components/icon';
import { DtButton } from '@/components/button';
import { DtText } from '@/components/text';

export default {
  name: 'DtCardDefault',
  components: {
    DtCard,
    DtButton,
    DtIcon,
    DtText,
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
