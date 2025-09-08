<template>
  <button
    :class="['d-recipe-leftbar-unread-pill', `d-recipe-leftbar-unread-pill-${kind}`]"
    type="button"
    data-qa="dt-recipe-leftbar-unread-pill"
    v-on="unreadChipListeners"
  >
    <dt-icon-arrow-up
      v-if="direction === 'up'"
      size="300"
    />
    <dt-icon-arrow-down
      v-else
      size="300"
    />
    <span data-qa="dt-recipe-leftbar-unread-pill__label">
      <slot>
        {{ text }}
      </slot>
    </span>
  </button>
</template>

<script>
import { DtIconArrowUp, DtIconArrowDown } from '@dialpad/dialtone-icons/vue3';
import { UNREAD_PILL_DIRECTIONS, UNREAD_PILL_KINDS } from './unread_pill_constants';
import { DialtoneLocalization } from '@/localization';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtRecipeUnreadPill',

  components: {
    DtIconArrowUp,
    DtIconArrowDown,
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

  data () {
    return {
      i18n: new DialtoneLocalization(),
    };
  },

  computed: {
    text () {
      return this.kind === 'mentions'
        ? this.i18n.$t('DIALTONE_UNREAD_PILL_MENTIONS_TEXT')
        : this.i18n.$t('DIALTONE_UNREAD_PILL_MESSAGES_TEXT');
    },

    unreadChipListeners () {
      return {
        click: event => this.$emit('click', event),
      };
    },
  },
};
</script>
