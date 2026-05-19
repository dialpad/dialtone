<template>
  <div
    :class="['d-notice__content', contentClass]"
    data-qa="notice-content"
  >
    <dt-text
      v-if="headerText || hasSlotContent($slots.header)"
      :id="headerId"
      kind="headline"
      :size="300"
      density="200"
      as="p"
      :class="['d-notice__title', headerClass]"
      data-qa="notice-content-title"
    >
      <!-- @slot Slot for the header -->
      <slot name="header">
        {{ headerText }}
      </slot>
    </dt-text>
    <dt-text
      :id="contentId"
      kind="body"
      :size="200"
      wrap="pretty"
      as="p"
      class="d-notice__message"
      data-qa="notice-content-message"
    >
      <!-- @slot Slot for main content -->
      <slot />
    </dt-text>
  </div>
</template>

<script>
import { hasSlotContent } from '@/common/utils';
import { DtText } from '@/components/Text';

export default {
  name: 'DtNoticeContent',

  components: { DtText },

  props: {
    /**
     * Header text of the notice. This can be left blank to remove the header from the notice entirely.
     * Can also be overridden with the header slot.
     */
    headerText: {
      type: String,
      default: undefined,
    },

    /**
     * ID for the header element of the component. Useful for aria-describedby
     * or aria-labelledby or any other reason you may need an id to refer to the header.
     */
    headerId: {
      type: String,
      default: undefined,
    },

    /**
     * ID for the content element of the component. Useful for aria-describedby
     * or aria-labelledby or any other reason you may need an id to refer to the content.
     */
    contentId: {
      type: String,
      default: undefined,
    },

    /**
     * Additional class name for the header wrapper element.
     */
    headerClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional class name for the content wrapper element.
     */
    contentClass: {
      type: [String, Array, Object],
      default: '',
    },
  },

  data () {
    return {
      hasSlotContent,
    };
  },
};
</script>
