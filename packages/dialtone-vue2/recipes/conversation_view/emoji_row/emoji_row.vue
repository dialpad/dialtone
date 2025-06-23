<template>
  <span class="d-recipe-emoji-row">
    <span
      v-for="reaction in reactions"
      :key="reaction.unicodeOutput"
      :reaction="reaction"
    >
      <dt-tooltip
        class="d-recipe-emoji-row__tooltip"
        content-class="d-recipe-emoji-row__tooltip-content"
        sticky="popper"
        @shown="(shown) => emojiHovered(reaction, shown)"
      >
        <span aria-hidden="true">
          <dt-emoji-text-wrapper size="200">
            {{ reaction.tooltip }}
          </dt-emoji-text-wrapper>
        </span>
        <template #anchor="{ attrs }">
          <dt-button
            importance="clear"
            size="sm"
            data-qa="feed-item-reaction-button"
            :class="[
              'd-recipe-emoji-row__reaction',
              reaction.isSelected ? 'd-recipe-emoji-row__reaction--selected' : '',
            ]"
            :aria-label="reaction.ariaLabel"
            :attrs="attrs"
            @click="emojiClicked(reaction)"
          >
            <span class="d-recipe-emoji-row__emoji">
              <dt-emoji
                size="200"
                :code="reaction.emojiUnicodeOrShortname"
              />
            </span>
            <span class="d-recipe-emoji-row__reaction-number">
              {{ reaction.num }}
            </span>
          </dt-button>
        </template>
      </dt-tooltip>
    </span>
    <!-- @slot Slot for emoji picker component, including the anchor. -->
    <slot name="picker" />
  </span>
</template>

<script>
import { REACTIONS_ATTRIBUTES } from './emoji_row_constants.js';
import { DtButton } from '../../../components/button';
import { DtTooltip } from '../../../components/tooltip';
import { DtEmoji } from '../../../components/emoji';
import { DtEmojiTextWrapper } from '../../../components/emoji_text_wrapper';

export default {
  name: 'DtRecipeEmojiRow',

  components: { DtTooltip, DtButton, DtEmoji, DtEmojiTextWrapper },

  mixins: [],

  props: {
    /**
     * Provide an array of reaction objects to be shown.
     */
    reactions: {
      type: Array,
      default: () => [],
      validator: (reactions) => {
        for (const reaction of reactions) {
          const validInput = REACTIONS_ATTRIBUTES.every((attribute) => reaction[attribute] !== undefined ?? false);
          if (!validInput) return false;
        }
        return true;
      },
    },
  },

  emits: [
    'emoji-clicked',
    'emoji-hovered',
  ],

  methods: {
    emojiClicked (reaction) {
      this.$emit('emoji-clicked', reaction.emojiUnicodeOrShortname);
    },

    emojiHovered (reaction, state) {
      this.$emit('emoji-hovered', {
        reaction: reaction.emojiUnicodeOrShortname,
        state,
      });
    },
  },
};
</script>
