<template>
  <span class="d-recipe-emoji-row">
    <span
      v-for="reaction in reactions"
      :key="reaction.unicodeOutput"
    >
      <dt-tooltip
        class="d-recipe-emoji-row__tooltip"
        content-class="d-recipe-emoji-row__tooltip-content"
        sticky="popper"
        @shown="(shown) => emojiHovered(reaction, shown)"
      >
        <span aria-hidden="true">
          <dt-emoji-text-wrapper size="200">
            {{ reactionLabel(reaction) }}
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
            :aria-label="reactionLabel(reaction)"
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
    <!-- TODO: Replace picker slot with a button with localized text and emit any event needed -->
    <!-- @slot Slot for emoji picker component, including the anchor. -->
    <slot name="picker" />
  </span>
</template>

<script>
import { REACTIONS_ATTRIBUTES } from './emoji_row_constants.js';
import { DtButton } from '@/components/button';
import { DtTooltip } from '@/components/tooltip';
import { DtEmoji } from '@/components/emoji';
import { DtEmojiTextWrapper } from '@/components/emoji_text_wrapper';
import { DtLocalizationMixin } from '@/common/mixins';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtRecipeEmojiRow',

  components: { DtTooltip, DtButton, DtEmoji, DtEmojiTextWrapper },

  mixins: [DtLocalizationMixin],

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

    reactionLabel (reaction) {
      return this.i18n.$t('DIALTONE_EMOJI_ROW_REACTION_LABEL', {
        reactionCount: reaction.num,
        name: reaction.name || 'A person',
        selected: reaction.isSelected.toString(),
        reaction: reaction.emojiUnicodeOrShortname,
      });
    },
  },
};
</script>
