<template>
  <ul class="d-mb4">
    <dt-recipe-feed-item-row
      v-for="data in $attrs.cardData"
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
          <template #anchor>
            <dt-avatar
              :full-name="data.name"
              :image-src="data.src"
              avatar-class="d-c-pointer"
            />
          </template>
          <template #content>
            <div>
              <dt-recipe-contact-row
                :name="data.name"
                avatar-presence="active"
                avatar-seed="JN"
                avatar-alt="Avatar person"
                :avatar-src="data.src"
                user-status="Good Morning! :smile:"
                call-button-tooltip="Call"
                selected
                :has-call-button="false"
              />
              <br>
              <p>
                Vice President of Sales Enablement
                Aerolabs
              </p>
              <p>
                <b>Work:</b> (415) 555-1234
              </p>
              <p>
                <b>Local Time:</b> 12:32 PM
              </p>
            </div>
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
import DtRecipeContactRow from '@/recipes/leftbar/contact_row/contact_row.vue';
import { DtAvatar } from '@/components/avatar';
import { DtIcon } from '@/components/icon';
import { DtButton } from '@/components/button';
</script>
