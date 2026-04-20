<template>
  <div
    :class="['d-notice__content', contentClass]"
    data-qa="notice-content"
  >
    <dt-text
      v-if="title || hasSlotContent($slots.title)"
      :id="titleId"
      kind="headline"
      :size="300"
      density="200"
      as="p"
      :class="['d-notice__title', titleClass]"
      data-qa="notice-content-title"
    >
      <!-- @slot Slot for the title -->
      <slot name="title">
        {{ title }}
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
import { DtText } from '@/components/text';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtNoticeContent',

  components: { DtText },

  props: {
    /**
     * Title header of the notice. This can be left blank to remove the title from the notice entirely.
     * Can also be overridden with a slot of the same name.
     */
    title: {
      type: String,
      default: '',
    },

    /**
     * ID for the title element of the component. Useful for aria-describedby
     * or aria-labelledby or any other reason you may need an id to refer to the title.
     */
    titleId: {
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
     * Additional class name for the title wrapper element.
     */
    titleClass: {
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
