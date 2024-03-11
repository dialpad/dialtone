<template>
  <ul class="d-mb4">
    <dt-recipe-feed-item-row
      v-for="data in cardData"
      :key="data.name"
      :show-header="true"
      :avatar-image-url="data.src"
      :display-name="data.name"
      :time="data.time"
      :is-active="true"
      :state="$attrs.state"
      @hover="$attrs.onHover"
      @focus="$attrs.onFocus"
    >
      <template #avatar>
        <dt-hovercard
          :id="$attrs.id"
          :placement="$attrs.placement"
          :content-class="$attrs.contentClass"
          :fallback-placements="$attrs.fallbackPlacements"
          :padding="$attrs.padding"
          :transition="$attrs.transition"
          :offset="$attrs.offset"
          initial-focus-element="none"
          :header-class="$attrs.headerClass"
          :footer-class="$attrs.footerClass"
          :append-to="$attrs.appendTo"
          @opened="$attrs.onOpened"
        >
          <template #anchor="slotProps">
            <dt-avatar
              :full-name="data.name"
              :image-src="data.src"
              avatar-class="d-c-pointer"
              v-bind="slotProps"
            />
          </template>
          <template #content>
            <dt-stack
              direction="column"
              gap="400"
            >
              <dt-stack
                direction="row"
                gap="300"
              >
                <dt-avatar
                  :full-name="data.name"
                  :image-src="data.src"
                  image-alt="Person avatar"
                  seed="JN"
                  size="md"
                  presence="active"
                />
                <dt-stack
                  direction="column"
                  gap="0"
                >
                  <p class="d-headline--md-compact">
                    {{ data.name }}
                  </p>
                  <p class="d-body--sm d-fc-tertiary">
                    Good Morning! :smile:
                  </p>
                </dt-stack>
              </dt-stack>
              <dt-stack
                direction="column"
                gap="300"
                class="d-fc-secondary"
              >
                <p>
                  Vice President of Sales Enablement Aerolabs
                </p>
                <dt-stack
                  direction="row"
                  gap="300"
                >
                  <dt-icon
                    name="clock-4"
                    size="200"
                  />
                  <p class="d-body--sm">
                    <b>Local Time:</b> 12:32 PM
                  </p>
                </dt-stack>
              </dt-stack>
              <dt-stack
                direction="row"
                gap="400"
              >
                <dt-button
                  width="var(--dt-size-100-percent)"
                  importance="outlined"
                  kind="muted"
                >
                  Call
                </dt-button>
                <dt-button
                  width="var(--dt-size-100-percent)"
                  importance="outlined"
                  kind="muted"
                >
                  Message
                </dt-button>
              </dt-stack>
            </dt-stack>
          </template>
        </dt-hovercard>
      </template>
      <template v-if="data.default">
        <span v-html="data.default" />
      </template>
      <dt-recipe-emoji-row>
        <template #picker>
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
        </template>
      </dt-recipe-emoji-row>
    </dt-recipe-feed-item-row>
  </ul>
</template>

<script setup>
import DtHovercard from './hovercard.vue';
import DtRecipeFeedItemRow from '@/recipes/conversation_view/feed_item_row/feed_item_row.vue';
import DtRecipeEmojiRow from '@/recipes/conversation_view/emoji_row/emoji_row.vue';
import avatar1 from '@/common/assets/avatar1.png';
import avatar2 from '@/common/assets/avatar2.png';
import DtStack from '../stack/stack.vue';
import DtIcon from '../icon/icon.vue';
import DtButton from '../button/button.vue';
import DtAvatar from '../avatar/avatar.vue';

const cardData = [{
  name: 'Jaqueline Nackos', src: avatar2, time: '4:54 PM', default: `<p class="d-fs-200 d-lh-400 d-wmx90ch">
  Elementum fames nullam elementum velit proin vitae aliquet.
  Platea nulla consectetur consequat sagittis nullam et ultricies nisl rhoncus
  aliquet elementum venenatis quisque.</p>`,
},
{
  name: 'Joseph Lumaban', src: avatar1, time: '5:05 PM', default: `<p class="d-fs-200 d-lh-400 d-wmx90ch">
  Elementum fames nullam elementum velit proin vitae aliquet.
  Platea nulla consectetur consequat sagittis nullam et ultricies nisl rhoncus
  aliquet elementum venenatis quisque.</p>`,
},
{
  name: 'Purdie Afra', time: '5:16 PM', default: `<p class="d-fs-200 d-lh-400 d-wmx90ch">
  Elementum fames nullam elementum velit proin vitae aliquet.
  Platea nulla consectetur consequat sagittis nullam et ultricies nisl rhoncus
  aliquet elementum venenatis quisque.</p>`,
}];
</script>
