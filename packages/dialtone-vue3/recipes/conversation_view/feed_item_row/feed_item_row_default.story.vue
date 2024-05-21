<template>
  <dt-recipe-feed-item-row
    :show-header="$attrs.showHeader"
    :avatar-image-url="$attrs.avatarImageUrl"
    :display-name="$attrs.displayName"
    :time="$attrs.time"
    :no-initials="$attrs.noInitials"
    :short-time="$attrs.shortTime"
    :is-active="$attrs.isActive"
    :state="$attrs.state"
    @hover="$attrs.onHover"
    @focus="$attrs.onFocus"
  >
    <template v-if="$attrs.default">
      <dt-emoji-text-wrapper
        element-type="span"
        size="400"
      >
        {{ $attrs.default }}
      </dt-emoji-text-wrapper>
    </template>
    <template
      v-if="$attrs.avatar"
      #avatar
    >
      <span
        v-html="$attrs.avatar"
      />
    </template>
    <template
      v-if="$attrs.attachment"
      #attachment
    >
      <span
        v-html="$attrs.attachment"
      />
    </template>
    <template
      v-if="$attrs.threading"
      #threading
    >
      <dt-stack
        class="feed-item-row__thread d-p4 d-d-flex d-ai-center"
        direction="row"
        gap="400"
      >
        <dt-stack
          direction="row"
          gap="300"
        >
          <dt-avatar
            v-for="person of persons"
            :key="person"
            :full-name="person"
            seed="seed"
            size="sm"
          />
        </dt-stack>
        <dt-stack
          direction="row"
          gap="400"
        >
          <div class="d-fs-100 d-lh200 d-d-flex d-ai-center">
            <a class="d-link d-pr4">3 replies</a>
            <span class="feed-item-row__reply">Last reply an hour ago</span>
          </div>
        </dt-stack>
      </dt-stack>
    </template>
    <template
      #reactions
    >
      <dt-recipe-emoji-row
        :reactions="mockReactions"
      >
        <template #picker>
          <span>
            <dt-button
              importance="clear"
              size="sm"
              aria-label="Add reaction"
              data-qa="feed-item-reaction-button"
              class="dt-emoji-row__reaction dt-emoji-row__picker"
            >
              <span class="d-d-inline-flex">
                <dt-icon
                  size="300"
                  name="satisfied"
                />
              </span>
            </dt-button>
          </span>
        </template>
      </dt-recipe-emoji-row>
    </template>
    <template #menu>
      <!-- TODO replace this with DT menu -->
      <div
        class="d-d-flex d-bgc-primary d-bar-pill d-bc-default d-ba"
        role="group"
      >
        <dt-button
          v-for="button of hoverButtons"
          :key="button"
          kind="muted"
          importance="clear"
          size="xs"
          aria-label="button"
        >
          <template #icon>
            <slot name="icon">
              <dt-icon
                :name="button"
                size="300"
              />
            </slot>
          </template>
        </dt-button>
      </div>
    </template>
  </dt-recipe-feed-item-row>
</template>

<script>
import DtRecipeFeedItemRow from './feed_item_row.vue';
import { DtRecipeEmojiRow } from '../emoji_row';
import { DtEmojiTextWrapper } from '@/components/emoji_text_wrapper';
import { DtAvatar } from '@/components/avatar';
import { DtIcon } from '@/components/icon';
import { DtButton } from '@/components/button';
import { DtStack } from '@/components/stack';

export default {
  name: 'DtRecipeFeedItemRowDefault',
  components: {
    DtAvatar,
    DtRecipeFeedItemRow,
    DtRecipeEmojiRow,
    DtEmojiTextWrapper,
    DtIcon,
    DtButton,
    DtStack,
  },

  data () {
    return {
      mockReactions: [
        {
          emojiUnicodeOrShortname: '😀',
          isSelected: true,
          ariaLabel: 'Emoji aria label',
          tooltip: 'You reacted with 😀',
          num: 1,
        },
        {
          emojiUnicodeOrShortname: '😒',
          isSelected: false,
          ariaLabel: 'Emoji aria label',
          tooltip: 'You reacted with 😒',
          num: 1,
        },
        {
          emojiUnicodeOrShortname: '🙃',
          isSelected: false,
          ariaLabel: 'Emoji aria label',
          tooltip: 'You reacted with 🙃',
          num: 99,
        },
      ],

      hoverButtons: ['bell', 'living-thing', 'map-pin'],

      persons: ['Jim Halpert', 'Michael Scott', 'Pam'],
    };
  },
};
</script>
