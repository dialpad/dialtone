<template>
  <dt-card
    class="d-w264"
    :container-class="containerClass"
    :header-class="headerClass"
    :content-class="contentClass"
    :footer-class="footerClass"
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
          <icon-menu-vertical />
        </template>
      </dt-button>
    </template>
    <template
      v-else-if="header"
      #header
    >
      <span v-html="header" />
    </template>
    <template #content>
      <div v-if="content">
        <span v-html="content" />
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
      v-else-if="footer"
      #footer
    >
      <span v-html="footer" />
    </template>
  </dt-card>
</template>

<script>
import DtCard from './card';
import IconMenuVertical from '@dialpad/dialtone/lib/dist/vue/icons/IconMenuVertical';
import { DtButton } from '../button';

export default {
  name: 'DtCardDefault',
  components: {
    DtCard,
    DtButton,
    IconMenuVertical,
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
