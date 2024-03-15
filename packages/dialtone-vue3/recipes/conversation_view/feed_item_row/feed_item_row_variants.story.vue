<!-- Use this template story to allow the user control the component's props and slots -->
<template>
  <dt-stack gap="600">
    <div>
      <h3>Feed item with showHeader as False and isActive true</h3>
      <ul class="d-py8">
        <dt-recipe-feed-item-row
          :show-header="false"
          :avatar-image-url="$attrs.avatarImageUrl"
          :display-name="$attrs.displayName"
          :time="$attrs.time"
          :short-time="$attrs.shortTime"
          :is-active="true"
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
            #threading
          >
            <dt-stack
              class="feed-item-row__thread d-pl4 d-d-flex d-ai-center"
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
          <template
            #menu
          >
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
    </div>
    <div>
      <h3>Feed item with image attachment</h3>
      <ul class="d-py8">
        <dt-recipe-feed-item-row
          :show-header="true"
          :avatar-image-url="$attrs.avatarImageUrl"
          :display-name="$attrs.displayName"
          :time="$attrs.time"
          :short-time="$attrs.shortTime"
          :is-active="true"
          @hover="$attrs.onHover"
          @focus="$attrs.onFocus"
        >
          Some text alongside a gif
          <template #attachment>
            <dt-image-viewer
              :image-src="fryImage"
              image-alt="Alt Text"
              close-aria-label="Close"
              image-button-class="dt-feed-item-row__image d-wmn64 d-hmn64 w-wmx332 d-hmx332"
              aria-label="Click to open image"
            />
          </template>
          <template
            #reactions
          >
            <dt-recipe-emoji-row
              :reactions="mockReactions"
            />
          </template>
        </dt-recipe-feed-item-row>
      </ul>
    </div>
    <div>
      <h3>With video attachment</h3>
      <ul class="d-py8">
        <dt-recipe-feed-item-row
          ref="feedItemRowFade"
          :show-header="false"
          :avatar-image-url="$attrs.avatarImageUrl"
          :display-name="$attrs.displayName"
          :time="$attrs.time"
          :short-time="$attrs.shortTime"
          :is-active="true"
        >
          <template v-if="$attrs.default">
            <dt-emoji-text-wrapper
              element-type="span"
              size="400"
            >
              {{ $attrs.default }}
            </dt-emoji-text-wrapper>
          </template>
          <template #attachment>
            <!-- eslint-disable-next-line vuejs-accessibility/media-has-caption -->
            <video
              class="dt-feed-item-row__video"
              controls
              src="https://www.w3schools.com/html/mov_bbb.mp4"
            />
          </template>
        </dt-recipe-feed-item-row>
      </ul>
    </div>
    <div>
      <h3>Feed item state "error"</h3>
      <ul class="d-py8">
        <dt-recipe-feed-item-row
          :show-header="false"
          :avatar-image-url="$attrs.avatarImageUrl"
          :display-name="$attrs.displayName"
          :time="$attrs.time"
          :short-time="$attrs.shortTime"
          :is-active="true"
          state="ERROR"
          @hover="$attrs.onHover"
          @focus="$attrs.onFocus"
        >
          <template v-if="defaultSlot">
            <dt-emoji-text-wrapper
              element-type="span"
              size="400"
            >
              {{ defaultSlot }}
            </dt-emoji-text-wrapper>
          </template>
        </dt-recipe-feed-item-row>
      </ul>
    </div>
    <div>
      <h3>Feed item state "searched"</h3>
      <dt-button
        @click="fadeState = fadeState === 'NORMAL' ? 'SEARCHED' : 'NORMAL'"
      >
        Click to fade
      </dt-button>
      <ul class="d-py8">
        <dt-recipe-feed-item-row
          ref="feedItemRowFade"
          :show-header="false"
          :avatar-image-url="$attrs.avatarImageUrl"
          :display-name="$attrs.displayName"
          :time="$attrs.time"
          :short-time="$attrs.shortTime"
          :is-active="true"
          :state="fadeState"
          @hover="$attrs.onHover"
          @focus="$attrs.onFocus"
        >
          <template v-if="defaultSlot">
            <dt-emoji-text-wrapper
              element-type="span"
              size="400"
            >
              {{ defaultSlot }}
            </dt-emoji-text-wrapper>
          </template>
        </dt-recipe-feed-item-row>
      </ul>
    </div>
    <div class="d-h332">
      <h3>Feed item pill within</h3>
      <ul class="d-py8">
        <dt-recipe-feed-item-row
          ref="feedItemRowFade"
          :show-header="false"
          :avatar-image-url="$attrs.avatarImageUrl"
          :display-name="$attrs.displayName"
          :time="$attrs.time"
          :short-time="$attrs.shortTime"
          :is-active="true"
        >
          <template #attachment>
            <dt-recipe-feed-item-pill
              default-toggled
              title="Ben called you"
              icon-name="phone-outgoing"
              wrapper-class="d-w628"
              border-color="ai"
            >
              <template #subtitle>
                Lasted 8 min • Ended at 11:56 AM
              </template>
              <template #right>
                <div>
                  <dt-button
                    aria-label="Open external link"
                    kind="muted"
                    importance="clear"
                    :circle="true"
                    @click.stop=""
                  >
                    <template #icon>
                      <dt-icon
                        name="external-link"
                        size="300"
                      />
                    </template>
                  </dt-button>
                </div>
              </template>
              <template #content>
                <div class="d-p16">
                  <p>
                    The agent from Dialpad called to follow up on a support ticket
                    that Jeff was handling for them regarding Dialpad CTI. They apologized
                    for calling outside of the requested time and expressed that they had
                    asked the team to look into the issue and would email them after the call.
                  </p>
                  <p class="d-fs-100 d-mt12">
                    <strong>Actions items</strong>
                  </p>
                  <p class="d-d-flex">
                    <strong class="d-mr4">1. </strong>
                    The agent needs to inform the team to check on Vijay's request or ticket regarding Dialpad CTI.
                  </p>
                </div>
              </template>
            </dt-recipe-feed-item-pill>
          </template>
        </dt-recipe-feed-item-row>
      </ul>
    </div>
  </dt-stack>
</template>

<script>
import DtRecipeFeedItemRow from './feed_item_row.vue';

import { DtRecipeEmojiRow } from '../emoji_row';
import { DtRecipeFeedItemPill } from '../feed_pill';
import { DtStack } from '@/components/stack';
import { DtEmojiTextWrapper } from '@/components/emoji_text_wrapper';
import { DtAvatar } from '@/components/avatar';
import { DtIcon } from '@/components/icon';
import { DtImageViewer } from '@/components/image_viewer';
import { DtButton } from '@/components/button';

import fryImage from '@/common/assets/fry.gif';

export default {
  name: 'DtRecipeFeedItemRowVariants',

  components: {
    DtEmojiTextWrapper,
    DtRecipeEmojiRow,
    DtRecipeFeedItemRow,
    DtRecipeFeedItemPill,
    DtStack,
    DtAvatar,
    DtIcon,
    DtImageViewer,
    DtButton,
  },

  data () {
    return {
      fadeState: 'SEARCHED',
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
      fryImage,
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
