<template>
  <ul class="d-pt16 feed-item-row__default-story">
    <dt-recipe-feed-item-row
      :show-header="showHeader"
      :avatar-image-url="avatarImageUrl"
      :display-name="displayName"
      :time="time"
      :short-time="shortTime"
      :is-active="isActive"
      :state="state"
      @hover="onHover"
      @focus="onFocus"
    >
      <template v-if="defaultSlot">
        <span v-html="defaultSlot" />
      </template>
      <template 
        v-if="avatar"
        #avatar
      >
        <span
          v-html="avatar"
        />
      </template>
      <template
        v-if="threading"
        #threading
      >
        <dt-stack
          class="feed-item-row__thread d-d-flex d-ai-center"
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
        />
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
  </ul>
</template>

<script>
import DtRecipeFeedItemRow from './feed_item_row.vue';
import { DtRecipeEmojiRow } from '../emoji_row';
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

<style lang="less" scoped>
  .feed-item-row {
    &__default-story {
      p {
        color: var(--dt-color-foreground-primary);
        font-size: 15px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
      }
    }
    &__thread{
      height: 32px;
    }
    &__reply{
      color: var(--dt-color-foreground-tertiary);
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px;
      letter-spacing: -0.12px;
    }
  }
</style>
