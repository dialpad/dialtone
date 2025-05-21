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
      :presence="presence"
      size="xs"
    />
    <!-- eslint-disable-next-line vue/no-restricted-class -->
    <span class="d-mention-suggestion__name">
      {{ name }}
    </span>
    <div v-if="showDetails">
      <span
        v-if="presenceText"
        :class="[presenceFontColorClass]"
      >
        {{ presenceText }}
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

export default {
  compatConfig: { MODE: 3 },
  name: 'MentionSuggestion',
  components: {
    DtAvatar,
    DtStack,
  },

  props: {
    item: {
      type: Object,
      required: true,
    },
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

    presenceText () {
      return this.item.presenceText;
    },

    presenceFontColorClass () {
      const presenceFontColors = {
        active: 'd-recipe-contact-row--active',
        busy: 'd-recipe-contact-row--busy',
        away: 'd-recipe-contact-row--away',
        offline: 'd-recipe-contact-row--busy'
      };

      return presenceFontColors[this.presence];
    },

    showDetails () {
      return this.item.showDetails;
    },
  },
};
</script>
