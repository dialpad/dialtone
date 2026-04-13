<template>
  <div
    class="d-notice__content"
    data-qa="notice-content"
  >
    <dt-text
      v-if="title || hasSlotContent($slots.title)"
      :id="titleId"
      kind="headline"
      :size="300"
      density="200"
      as="p"
      class="d-notice__title"
      data-qa="notice-content-title"
    >
      <!-- @slot Slot for the title. Can also be used as a slot. -->
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
