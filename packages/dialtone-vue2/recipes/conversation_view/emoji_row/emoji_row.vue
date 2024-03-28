<template>
  <span class="dt-emoji-row">
    <span
      v-for="reaction in reactions"
      :key="reaction.unicodeOutput"
      :reaction="reaction"
    >
      <dt-tooltip
        class="dt-emoji-row__tooltip"
        content-class="d-wmx464"
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
            :class="['dt-emoji-row__reaction', reaction.isSelected ? 'dt-emoji-row__reaction--selected' : '']"
            :aria-label="reaction.ariaLabel"
            :attrs="attrs"
            @click="emojiClicked(reaction)"
          >
            <span class="dt-emoji-row__emoji">
              <dt-emoji
                size="200"
                :code="reaction.emojiUnicodeOrShortname"
              />
            </span>
            <span class="dt-emoji-row__reaction-number">
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

<style lang="less">
.dt-emoji-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-300);

  &__tooltip {
    display: inline-block;
  }

  &__reaction {
    --emoji-item-color-inset-shadow: transparent;
    --emoji-item-color-foreground: var(--dt-action-color-foreground-muted-default);
    --emoji-item-color-background: var(--dt-action-color-background-muted-hover);

    padding: var(--dt-space-300) var(--dt-space-400);
    border-radius: var(--dt-size-radius-pill);
    border: 0;
    color: var(--emoji-item-color-foreground);
    background-color: var(--emoji-item-color-background);
    box-shadow: inset 0 0 0 var(--dt-size-border-150) var(--emoji-item-color-inset-shadow);
    height: var(--dt-size-550);

    &.dt-emoji-row__picker {
      padding: var(--dt-space-200) var(--dt-space-350);
    }

    &:hover {
      --emoji-item-color-inset-shadow: var(--dt-color-border-subtle);
      --emoji-item-color-foreground: var(--dt-action-color-foreground-muted-hover);
    }

    &:active {
      --emoji-item-color-background: var(--dt-action-color-background-muted-active);
      --emoji-item-color-foreground: var(--dt-action-color-foreground-muted-active);

      transform: scale(.98);
    }

    &--selected {
      --emoji-item-color-inset-shadow: var(--dt-color-border-brand);
      --emoji-item-color-foreground: var(--dt-color-link-primary);
      --emoji-item-color-background: var(--dt-action-color-background-base-hover);

      .dt-emoji-row__reaction-number {
        font-weight: var(--dt-font-weight-bold);
      }

      &:hover {
        --emoji-item-color-inset-shadow: var(--dt-color-border-brand-strong);
        --emoji-item-color-foreground: var(--dt-color-link-primary-hover);
      }

      &:active {
        --emoji-item-color-background: var(--dt-action-color-background-base-active);
      }
    }
  }

  &__emoji {
    margin-right: var(--dt-space-300);
    display: inline-flex;
  }

  &__reaction-number {
    font: var(--dt-typography-body-sm);
    font-variant: tabular-nums;
  }
}
</style>
