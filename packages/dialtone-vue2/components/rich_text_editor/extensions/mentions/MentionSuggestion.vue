<template>
  <dt-stack
    direction="row"
    gap="400"
  >
    <dt-avatar
      :full-name="name"
      :image-src="avatarSrc"
      :image-alt="name"
      :show-presence="showDetails"
      size="xs"
    />
    <!-- eslint-disable-next-line vue/no-restricted-class -->
    <span class="d-mention-suggestion__name">
      {{ name }}
    </span>

   <div v-if="showDetails">
        <span
          v-if="presence"
          data-qa="dt-recipe-leftbar-row-presence-text"
          :class="['d-recipe-leftbar-row__meta-context', presenceFontColorClass]"
        >
          {{ presence }}
        </span>
        <dt-emoji-text-wrapper
          v-if="status"
          size="100"
          element-type="span"
        >
          {{ status }}
        </dt-emoji-text-wrapper>
      </div>
  </dt-stack>
</template>

<script>
import { DtAvatar } from '@/components/avatar';
import { DtStack } from '@/components/stack';
import DtEmojiTextWrapper from '@/components/emoji_text_wrapper/emoji_text_wrapper.vue';

export default {
  name: 'MentionSuggestion',
  components: {
    DtAvatar,
    DtStack,
    DtEmojiTextWrapper
  },

  props: {
    item: {
      type: Object,
      required: true,
    },

    showDetails: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    name () {
      return this.item.name;
    },

    avatarSrc () {
      return this.item.avatarSrc;
    },

    presence () {
      return this.item.presence;
    },

    status () {
      return this.item.status;
    },

    presenceFontColorClass () {
      const presenceFontColors = {
        active: 'd-recipe-contact-row--active',
        busy: 'd-recipe-contact-row--busy',
        away: 'd-recipe-contact-row--away',
      };

      return presenceFontColors[this.avatarPresence];
    },
  },
};
</script>
