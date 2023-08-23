<template>
  <dt-recipe-callbox
    :badge-text="$attrs.badgeText"
    :badge-color="$attrs.badgeColor"
    :avatar-src="$attrs.avatarSrc"
    :avatar-full-name="$attrs.avatarFullName"
    :title="$attrs.title"
    :border-color="$attrs.borderColor"
  >
    <template
      v-if="$attrs.video"
      #video
    >
      <div
        v-html="$attrs.video"
      />
    </template>
    <template
      v-if="$attrs.badge"
      #badge
    >
      <span
        v-html="$attrs.badge"
      />
    </template>
    <template #subtitle>
      <span
        v-if="$attrs.subtitle"
        v-html="$attrs.subtitle"
      />
      <div
        v-else
        class="d-d-flex d-ai-center d-flow4"
      >
        <dt-icon
          name="share-screen"
          size="200"
        />
        <span>06:01</span>
      </div>
    </template>
    <template #right>
      <div
        v-if="$attrs.right"
        v-html="$attrs.right"
      />
      <div v-else>
        <dt-button
          circle
          importance="clear"
        >
          <template #icon>
            <dt-icon
              name="dialpad-ai-color"
              size="400"
            />
          </template>
        </dt-button>
        <dt-button
          circle
          importance="clear"
        >
          <template #icon>
            <dt-icon
              name="phone-hang-up"
              class="d-fc-critical"
              size="400"
            />
          </template>
        </dt-button>
      </div>
    </template>
    <template #bottom>
      <dt-item-layout>
        <template #left>
          <dt-button
            circle
            importance="clear"
          >
            <template #icon>
              <dt-icon
                name="share-screen"
                size="400"
              />
            </template>
          </dt-button>
        </template>
        <template #default>
          <span class="d-fs-100">Sharing screen</span>
        </template>
        <template #right>
          <dt-button
            importance="clear"
            class="d-fc-critical"
          >
            <template #icon>
              <dt-icon
                name="stop-filled"
                size="200"
              />
            </template>
            Stop
          </dt-button>
        </template>
      </dt-item-layout>
    </template>
  </dt-recipe-callbox>
</template>

<script>
import DtRecipeCallbox from './callbox.vue';
import DtIcon from '@/components/icon/icon.vue';
import DtButton from '@/components/button/button.vue';
import DtItemLayout from '@/components/item_layout/item_layout.vue';

export default {
  name: 'DtRecipeCallboxDefault',
  components: { DtItemLayout, DtButton, DtIcon, DtRecipeCallbox },
};
</script>
