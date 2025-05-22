<template>
  <dt-stack
    direction="column"
    class="d-mention-suggestion__container"
    :class="{ 'd-mention-suggestion__container--disabled': disabled }"
    gap="300"
  >
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
    </dt-stack>

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
      <div v-if="status && presenceText">
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

    disabled () {
      return this.presenceText === 'DND';
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

.d-mention-suggestion__presence {
  min-width: fit-content;
}

.d-mention-suggestion__status {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.d-mention-suggestion__container--disabled {
  opacity: 0.5;
}
</style>
