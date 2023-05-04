<template>
  <ul>
    <dt-recipe-feed-item-row
      :show-header="$attrs.showHeader"
      :avatar-image-url="$attrs.avatarImageUrl"
      :display-name="$attrs.displayName"
      :time="$attrs.time"
      :short-time="$attrs.shortTime"
      :is-active="$attrs.isActive"
      @hover="$attrs.onHover"
      @focus="$attrs.onFocus"
    >
      <template v-if="$attrs.default">
        <span v-html="$attrs.default" />
      </template>
      <template
        v-if="$attrs.threading"
        #threading
      >
        <div class="d-d-flex d-flow1 d-my6">
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
        v-if="$attrs.reactions"
        #reactions
      >
        <dt-emoji-text-wrapper
          class="d-btn d-btn--outlined d-btn--xs"
          element-type="button"
          size="200"
        >
          <span v-html="$attrs.reactions" /> :smile:
        </dt-emoji-text-wrapper>
      </template>
      <template
        v-if="menu"
        #menu
      >
        <dt-icon :name="$attrs.menu" />
      </template>
    </dt-recipe-feed-item-row>
  </ul>
</template>

<script>
import DtRecipeFeedItemRow from './feed_item_row.vue';
import { DtEmojiTextWrapper } from '@/components/emoji_text_wrapper';
import { DtAvatar } from '@/components/avatar';
import { DtIcon } from '@/components/icon';

export default {
  name: 'DtRecipeFeedItemRowDefault',
  components: {
    DtAvatar,
    DtRecipeFeedItemRow,
    DtEmojiTextWrapper,
    DtIcon,
  },
};
</script>
