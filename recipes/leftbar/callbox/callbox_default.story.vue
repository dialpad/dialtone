<template>
  <dt-recipe-callbox
    :badge-text="badgeText"
    :badge-color="badgeColor"
    :avatar-src="avatarSrc"
    :avatar-full-name="avatarFullName"
    :avatar-seed="avatarSeed"
    :title="title"
    :border-color="borderColor"
  >
    <template
      v-if="video"
      #video
    >
      <div
        v-html="video"
      />
    </template>
    <template
      v-if="badge"
      #badge
    >
      <span
        v-html="badge"
      />
    </template>
    <template
      v-if="subtitle"
      #subtitle
    >
      <span
        v-html="subtitle"
      />
    </template>
    <template
      v-if="right"
      #right
    >
      <div
        v-html="right"
      />
    </template>
    <template
      v-if="bottom"
      #bottom
    >
      <div v-html="bottom" />
    </template>
  </dt-recipe-callbox>
</template>

<script>
import DtRecipeCallbox from './callbox.vue';

export default {
  name: 'DtRecipeCallboxDefault',
  components: { DtRecipeCallbox },
};
</script>
