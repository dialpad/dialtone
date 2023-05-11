<template>
  <span class="d-d-flex d-fw-wrap">
    <span
      v-for="reaction in reactions"
      :key="reaction.unicodeOutput"
      :reaction="reaction"
      class="d-mr4 d-mb4"
    >
      <dt-tooltip
        class="d-d-inline-block"
        content-class="d-wmx464"
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
              'd-h24 d-bar16 d-py0 d-fs-200 d-mb0 d-t',
              !!reaction.isSelected
                ? `d-fc-purple-500 d-bgc-purple-400 d-bgo10 d-bc-purple-400 d-bco50 ' +
                  'h:d-bgc-purple-400 h:d-bco25 a:d-bgc-purple-400 a:d-bco25`
                : 'd-fc-black-600 d-bgc-black-100 h:d-bgc-white h:d-bc-black-600 a:d-bgc-white a:d-bc-black-600',
            ]"
            :aria-label="reaction.ariaLabel"
            :attrs="attrs"
            @click="emojiClicked(reaction)"
          >
            <span class="d-mr4">
              <dt-emoji
                size="200"
                :code="reaction.emojiUnicodeOrShortname"
              />
            </span>
            <span class="d-fw-bold d-fs-100">
              {{ reaction.num }}
            </span>
          </dt-button>
        </template>
      </dt-tooltip>
    </span>
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

<style lang="less">

</style>
