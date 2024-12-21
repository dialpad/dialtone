<template>
  <span class="d-recipe-emoji-row">
    <span
      v-for="reaction in reactions"
      :key="reaction.unicodeOutput"
      :reaction="reaction"
    >
      <!--
        CONSIDERATION: on product side, content-class="d-wmx###"
        can be adjusted to wider if more than X people.
        Or even narrower if fewer.
      -->
      <dt-tooltip
        class="d-recipe-emoji-row__tooltip"
        content-class="d-wmx216"
        sticky="popper"
        :fallback-placements="['top', 'bottom']"
        @shown="(shown) => emojiHovered(reaction, shown)"
      >
        <!-- TODO: move CSS utilitites to emoji_row.less -->
        <div
          aria-hidden="true"
          class="d-bar4 d-bgc-neutral-white d-p4 d-d-inline-block d-mt4 d-mb6"
        >
          <!-- TODO: will ultimately need to work for Custom Emojis, including animated. Presumably same size -->
          <dt-emoji
            :code="reaction.emojiUnicodeOrShortname"
            size="800"
          />
        </div>
        <div>
          Brad Paugh,
          Julio Ortega,
          Ignacio Ropolo,
          Nina Repetto,
          Francis Rupert,
          and
          you
          <span class="d-fc-tertiary-inverted d-fw-normal">
            reacted with :sparkling_heart:
          </span>
        </div>
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

export default {
  name: 'DtRecipeEmojiRow',

  components: { DtTooltip, DtButton, DtEmoji },

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
