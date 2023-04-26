<template>
  <button
    :class="['dt-leftbar-unread-pill', `dt-leftbar-unread-pill--${kind}`]"
    type="button"
    data-qa="dt-leftbar-unread-pill"
    v-on="$listeners"
  >
    <dt-icon
      :name="`arrow-${direction}`"
      size="300"
    />
    <span data-qa="dt-leftbar-unread-pill__label">
      <slot />
    </span>
  </button>
</template>

<script>
import { DtIcon } from '@/components/icon';
import { UNREAD_PILL_DIRECTIONS, UNREAD_PILL_KINDS } from './unread_pill_constants';
export default {
  name: 'DtRecipeUnreadPill',

  components: {
    DtIcon,
  },

  props: {
    /**
     * The kind of unread pill which determines the styling
     * @values 'mentions', 'messages'
     **/
    kind: {
      type: String,
      required: true,
      validator: (kind) => UNREAD_PILL_KINDS.includes(kind),
    },

    /**
     * The direction of the arrow icon
     * @values 'up', 'down'
     **/
    direction: {
      type: String,
      required: true,
      validator: (dir) => UNREAD_PILL_DIRECTIONS.includes(dir),
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
.dt-leftbar-unread-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-200) var(--space-500) var(--space-200) var(--space-400);
  gap: var(--space-300);
  font-size: var(--fs-100);
  box-shadow: var(--bs-md);
  border-radius: var(--br-pill);
  border: none;
  line-height: var(--lh-600);
  cursor: pointer;

  &--mentions {
    font-weight: var(--fw-bold);
    background-color: var(--theme-mention-color-background);
    color: var(--theme-mention-color-foreground);
  }

  &--messages {
    background-color: var(--bgc-primary);
    color: var(--fc-primary);
  }
}
</style>
