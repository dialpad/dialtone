<template>
  <dt-recipe-callbox
    :badge-text="badgeText"
    :badge-color="badgeColor"
    :avatar-src="avatarSrc"
    :avatar-full-name="avatarFullName"
    :title="title"
    :border-color="borderColor"
  >
    <template #video>
      <div
        v-if="video"
        v-html="video"
      />
    </template>
    <template #badge>
      <span
        v-if="badge"
        v-html="badge"
      />
    </template>
    <template #subtitle>
      <span
        v-if="subtitle"
        v-html="subtitle"
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
        v-if="right"
        v-html="right"
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
