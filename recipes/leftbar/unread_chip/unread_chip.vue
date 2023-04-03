<template>
  <dt-chip
    :class="['dt-leftbar-unread-chip', `dt-leftbar-unread-chip__${kind}`]"
    data-qa="dt-leftbar-unread-chip"
    :hide-close="true"
    v-on="$listeners"
  >
    <template #icon>
      <dt-icon
        :name="`arrow-${direction}`"
        size="300"
      />
    </template>
    <span data-qa="dt-leftbar-unread-chip__label">
      <slot />
    </span>
  </dt-chip>
</template>

<script>
import { DtIcon } from '@/components/icon';
import { DtChip } from '@/components/chip';
import { UNREAD_BADGE_DIRECTIONS, UNREAD_BADGE_KINDS } from './unread_chip_constants';
export default {
  name: 'DtRecipeUnreadChip',

  components: {
    DtIcon,
    DtChip,
  },

  props: {
    /**
     * The kind of unread chip which determines the styling
     * @values 'mentions', 'messages'
     **/
    kind: {
      type: String,
      required: true,
      validator: (kind) => UNREAD_BADGE_KINDS.includes(kind),
    },

    /**
     * The direction of the arrow icon
     * @values 'up', 'down'
     **/
    direction: {
      type: String,
      required: true,
      validator: (dir) => UNREAD_BADGE_DIRECTIONS.includes(dir),
    },
  },

  emits: [
    /**
     * Native click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',
  ],
};
</script>

<style lang="less">
.dt-leftbar-unread-chip {
  &__mentions {
    .d-chip__label {
      font-weight: var(--fw-medium);
      background-color: var(--theme-mention-color-background);
      color: var(--theme-mention-color-foreground);
    }
  }

  &__messages {
    .d-chip__label {
      background-color: var(--bgc-primary);
    }
  }

  .d-chip__label {
    padding: var(--space-300) var(--space-500) var(--space-300) var(--space-400);
    box-shadow: var(--bs-md);
  }
}
</style>
