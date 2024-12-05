<template>
  <div
    :class="[
      'dt-recipe-leftbar-row__container',
      { 'dt-recipe-leftbar-row__container--off-duty': $slots.timer },
    ]"
  >
    <div
      :class="leftbarContactCentersRowClasses"
      data-qa="dt-recipe-contact-centers-row"
    >
      <a
        class="dt-recipe-leftbar-row__primary"
        :data-qa="$attrs['data-qa'] ?? 'dt-recipe-leftbar-row-link'"
        :aria-label="getAriaLabel"
        :title="description"
        :href="$attrs.href ?? 'javascript:void(0)'"
        v-bind="$attrs"
        v-on="contactRowListeners"
        @click="$emit('click', $event)"
      >
        <div class="dt-recipe-leftbar-row__alpha">
          <dt-icon-headphones
            size="300"
            data-qa="dt-recipe-leftbar-row-icon"
          />
        </div>
        <div
          class="dt-recipe-leftbar-row__label"
          :style="`flex-basis: ${labelWidth}`"
        >
          <dt-emoji-text-wrapper
            class="dt-recipe-leftbar-row__description"
            data-qa="dt-recipe-leftbar-row-description"
            size="200"
          >
            {{ description }}
          </dt-emoji-text-wrapper>
        </div>
      </a>
      <div
        v-if="!hideActions"
        class="dt-recipe-leftbar-row__omega"
      >
        <slot name="right" />
        <div class="dt-recipe-leftbar-row__action-container">
          <dt-badge
            v-if="showUnreadCount"
            class="dt-recipe-leftbar-row__unread-badge"
            data-qa="dt-recipe-leftbar-row-unread-badge"
            kind="count"
            type="bulletin"
          >
            {{ unreadCount }}
          </dt-badge>
          <dt-button
            class="dt-recipe-leftbar-row__action"
            data-qa="dt-recipe-leftbar-row-action-button"
            :aria-label="menuButtonAriaLabel"
            importance="clear"
            size="xs"
            circle
            @click.stop="$emit('click-menu', $event)"
          >
            <template #icon>
              <dt-icon-chevron-down size="100" />
            </template>
          </dt-button>
        </div>
      </div>
    </div>
    <div class="dt-recipe-leftbar-row__bottom">
      <slot name="timer" />
    </div>
  </div>
</template>

<script>
import { extractVueListeners, safeConcatStrings } from '@/common/utils';
import { DtBadge } from '@/components/badge';
import { DtButton } from '@/components/button';
import DtEmojiTextWrapper from '@/components/emoji_text_wrapper/emoji_text_wrapper.vue';
import DtIconChevronDown from '@dialpad/dialtone-icons/vue3/chevron-down';
import DtIconHeadphones from '@dialpad/dialtone-icons/vue3/headphones';

export default {
  name: 'DtRecipeContactCentersRow',

  components: {
    DtButton,
    DtBadge,
    DtEmojiTextWrapper,
    DtIconHeadphones,
    DtIconChevronDown,
  },

  inheritAttrs: false,

  props: {
    /**
     * Will be read out by a screen reader upon focus of this row. If not defined "description" will be read.
     */
    ariaLabel: {
      type: String,
      default: '',
    },

    /**
     * Text displayed next to the icon. Required.
     */
    description: {
      type: String,
      required: true,
    },

    /**
     * Determines if the row is selected
     */
    selected: {
      type: Boolean,
      default: false,
    },

    /**
     * Making this true will hide the unread count badge, the chevron button, and the right slot
     */
    hideActions: {
      type: Boolean,
      default: false,
    },

    /**
     * Number of unread messages, could be a string to support '99+'
     */
    unreadCount: {
      type: String,
      default: null,
    },

    /**
     * Aria label for the menu button.
     */
    menuButtonAriaLabel: {
      type: String,
      required: true,
    },
  },

  emits: [
    /**
     * Native click event on the row itself
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',

    /**
     * Menu button clicked
     *
     * @event call
     * @type {PointerEvent | KeyboardEvent}
     */
    'click-menu',
  ],

  data () {
    return {
      labelWidth: 'auto',
    };
  },

  computed: {
    leftbarContactCentersRowClasses () {
      return [
        'dt-recipe-leftbar-row',
        'dt-recipe-leftbar-row--contact-centers',
        {
          'dt-recipe-leftbar-row__unread-count': this.showUnreadCount,
          'dt-recipe-leftbar-row--selected': this.selected,
        },
      ];
    },

    getAriaLabel () {
      return this.ariaLabel
        ? this.ariaLabel
        : safeConcatStrings([this.description, this.unreadCountTooltip]);
    },

    contactRowListeners () {
      return extractVueListeners(this.$attrs);
    },

    showUnreadCount () {
      return !!this.unreadCount;
    },
  },

  watch: {
    $props: {
      deep: true,
      async handler () {
        await this.$nextTick();
        this.adjustLabelWidth();
      },
    },
  },

  mounted () {
    this.resizeObserver = new ResizeObserver(this.adjustLabelWidth);
    this.resizeObserver.observe(this.$el);
    this.adjustLabelWidth();
  },

  beforeUnmount: function () {
    this.resizeObserver.disconnect();
  },

  methods: {
    adjustLabelWidth () {
      const labelWidth = this.$el?.querySelector('.dt-recipe-leftbar-row__primary')?.clientWidth || 0;
      const omegaWidth = this.$el?.querySelector('.dt-recipe-leftbar-row__omega')?.clientWidth || 0;
      const alphaWidth = this.$el?.querySelector('.dt-recipe-leftbar-row__alpha')?.clientWidth || 0;
      const paddings = 12;
      this.labelWidth = labelWidth - (omegaWidth + alphaWidth + paddings) + 'px';
    },
  },
};
</script>
