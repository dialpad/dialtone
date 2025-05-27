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
      size="sm"
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
        class="d-label--sm-plain"
      >
        <span
          v-if="presenceText"
          class="d-mention-suggestion__presence"
          :class="[presenceFontColorClass]"
        >
          {{ presenceText }}
        </span>
        <div
          v-if="status && presenceText"
          class="d-mention-suggestion__divider"
        >
          •
        </div>
        <div
          v-if="status"
          class="d-mention-suggestion__status"
        >
          {{ status }}
        </div>
      </dt-stack>
    </dt-stack>
  </dt-stack>
</template>

<script>
import { DtAvatar } from '@/components/avatar';
import { DtStack } from '@/components/stack';

export default {
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

<style lang="less" scoped>
.d-mention-suggestion__container {
  width: 100%;
}
.d-mention-suggestion__details-container {
  width: 90%;
}

.d-mention-suggestion__presence {
  min-width: fit-content;
  margin-left: var(--dt-space-200);
}

.d-mention-suggestion__status {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--dt-color-foreground-tertiary);
  margin-left: var(--dt-space-100);
}

.d-mention-suggestion__divider {
  color: var(--dt-color-foreground-tertiary);
}
</style>
