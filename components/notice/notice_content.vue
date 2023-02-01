<template>
  <div
    class="d-notice__content"
    data-qa="notice-content"
  >
    <p
      v-if="title || hasSlotContent($slots.titleOverride)"
      :id="titleId"
      class="d-notice__title"
      data-qa="notice-content-title"
    >
      <!-- @slot Slot for the title  -->
      <slot name="titleOverride">
        {{ title }}
      </slot>
    </p>
    <p
      :id="contentId"
      class="d-notice__message"
      data-qa="notice-content-message"
    >
      <!-- @slot Slot for main content -->
      <slot />
    </p>
  </div>
</template>

<script>
import { hasSlotContent } from '@/common/utils';

export default {
  name: 'DtNoticeContent',

  props: {
    /**
     * Title header of the notice. This can be left blank to remove the title from the notice entirely.
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
  },

  data () {
    return {
      hasSlotContent,
    };
  },
};
</script>
