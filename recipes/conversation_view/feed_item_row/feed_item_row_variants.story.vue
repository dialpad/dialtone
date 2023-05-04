<!-- Use this template story to allow the user control the component's props and slots -->
<template>
  <dt-stack gap="600">
    <div>
      <h3>Feed item with showHeader as False and isActive true</h3>
      <ul>
        <dt-recipe-feed-item-row
          :show-header="false"
          :avatar-image-url="avatarImageUrl"
          :display-name="displayName"
          :time="time"
          :short-time="shortTime"
          :is-active="true"
          @hover="onHover"
          @focus="onFocus"
        >
          <template v-if="defaultSlot">
            <span v-html="defaultSlot" />
          </template>
          <template
            #threading
          >
            <div class="d-d-flex d-d-flow1 d-my6">
              <dt-avatar
                presence="busy"
                seed="seed"
                size="sm"
              >
                <img
                  data-qa="dt-avatar-image"
                  src="@/common/assets/person.png"
                  alt="Person Avatar"
                >
              </dt-avatar>
              <dt-avatar
                presence="active"
                seed="seed"
                size="sm"
              >
                <img
                  data-qa="dt-avatar-image"
                  src="@/common/assets/person.png"
                  alt="Person Avatar"
                >
              </dt-avatar>
              <dt-avatar
                seed="seed"
                size="sm"
              >
                <img
                  data-qa="dt-avatar-image"
                  src="@/common/assets/person.png"
                  alt="Person Avatar"
                >
              </dt-avatar>
              <div
                class="d-mx4 d-my-auto d-fs-100"
              >
                3 replies
              </div>
            </div>
          </template>
          <template
            #reactions
          >
            <dt-emoji-text-wrapper
              class="d-btn d-btn--outlined d-btn--xs"
              element-type="button"
              size="200"
            >
              emoji reactions :smile:
            </dt-emoji-text-wrapper>
          </template>
          <template
            #menu
          >
            <dt-icon :name="menu" />
          </template>
        </dt-recipe-feed-item-row>
      </ul>
    </div>
    <div>
      <h3>Feed item with rich media</h3>
      <ul>
        <dt-recipe-feed-item-row
          :show-header="true"
          :avatar-image-url="avatarImageUrl"
          :display-name="displayName"
          :time="time"
          :short-time="shortTime"
          :is-active="true"
          @hover="onHover"
          @focus="onFocus"
        >
          <dt-image-viewer
            :image-src="require('@/common/assets/fry.gif')"
            image-alt="Alt Text"
            close-aria-label="Close"
            image-button-class="d-wmn64 d-hmn64 w-wmx332 d-hmx332"
            aria-label="Click to open image"
          />
          <template
            #threading
          >
            <div class="d-d-flex d-d-flow1 d-my6">
              <dt-avatar
                presence="busy"
                seed="seed"
                size="sm"
              >
                <img
                  data-qa="dt-avatar-image"
                  src="@/common/assets/person.png"
                  alt="Person Avatar"
                >
              </dt-avatar>
              <dt-avatar
                presence="active"
                seed="seed"
                size="sm"
              >
                <img
                  data-qa="dt-avatar-image"
                  src="@/common/assets/person.png"
                  alt="Person Avatar"
                >
              </dt-avatar>
              <dt-avatar
                seed="seed"
                size="sm"
              >
                <img
                  data-qa="dt-avatar-image"
                  src="@/common/assets/person.png"
                  alt="Person Avatar"
                >
              </dt-avatar>
              <div
                class="d-mx4 d-my-auto d-fs-100"
              >
                3 replies
              </div>
            </div>
          </template>
          <template
            #reactions
          >
            <dt-emoji-text-wrapper
              class="d-btn d-btn--outlined d-btn--xs"
              element-type="button"
              size="200"
            >
              emoji reactions :smile:
            </dt-emoji-text-wrapper>
          </template>
          <template
            v-if="menu"
            #menu
          >
            <dt-icon :name="menu" />
          </template>
        </dt-recipe-feed-item-row>
      </ul>
    </div>
  </dt-stack>
</template>

<script>
import DtRecipeFeedItemRow from './feed_item_row.vue';

import { DtEmojiTextWrapper } from '@/components/emoji_text_wrapper';
import { DtStack } from '@/components/stack';
import { DtAvatar } from '@/components/avatar';
import { DtIcon } from '@/components/icon';
import { DtImageViewer } from '@/components/image_viewer';

export default {
  name: 'DtRecipeFeedItemRowVariants',
  components: {
    DtEmojiTextWrapper,
    DtRecipeFeedItemRow,
    DtStack,
    DtAvatar,
    DtIcon,
    DtImageViewer,
  },
};
</script>
