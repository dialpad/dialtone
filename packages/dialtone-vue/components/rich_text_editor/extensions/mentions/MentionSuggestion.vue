<template>
  <dt-stack
    direction="row"
    class="d-mention-suggestion__container"
    gap="400"
  >
    <dt-avatar
      :full-name="name"
      :image-src="avatarSrc"
      :image-alt="name"
      :show-presence="showDetails"
      :presence="presence"
      :size="200"
    />
    <dt-stack
      class="d-mention-suggestion__details-container"
      gap="100"
    >
      <!-- eslint-disable-next-line vue/no-restricted-class -->
      <span class="d-mention-suggestion__name">
        {{ name }}
      </span>
      <dt-stack
        v-if="showDetails"
        direction="row"
        gap="300"
      >
        <dt-text
          v-if="presenceText"
          kind="label"
          :size="200"
          strength="normal"
          class="d-mention-suggestion__presence"
          :class="[presenceFontColorClass]"
        >
          {{ presenceText }}
        </dt-text>
        <dt-text
          v-if="status && presenceText"
          kind="label"
          :size="200"
          strength="normal"
          as="div"
          class="d-mention-suggestion__divider"
        >
          •
        </dt-text>
        <dt-text
          v-if="status"
          kind="label"
          :size="200"
          strength="normal"
          as="div"
          class="d-mention-suggestion__status"
        >
          {{ status }}
        </dt-text>
      </dt-stack>
    </dt-stack>
  </dt-stack>
</template>

<script>
import { DtAvatar } from '@/components/avatar';
import { DtStack } from '@/components/stack';
import { DtText } from '@/components/text';

export default {
  compatConfig: { MODE: 3 },
  name: 'MentionSuggestion',
  components: {
    DtAvatar,
    DtStack,
    DtText,
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
        offline: 'd-recipe-contact-row--busy',
      };

      return presenceFontColors[this.presence];
    },

    showDetails () {
      return this.item.showDetails;
    },
  },
};
</script>
