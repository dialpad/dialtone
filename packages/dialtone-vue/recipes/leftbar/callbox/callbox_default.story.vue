<template>
  <dt-recipe-callbox
    :badge-text="$attrs.badgeText"
    :badge-color="$attrs.badgeColor"
    :avatar-src="$attrs.avatarSrc"
    :avatar-full-name="$attrs.avatarFullName"
    :avatar-seed="$attrs.avatarSeed"
    :title="$attrs.title"
    :border-color="$attrs.borderColor"
    :clickable="$attrs.clickable"
    :is-on-hold="$attrs.isOnHold"
    @click="$attrs.onClick"
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
    <template
      v-if="$attrs.subtitle"
      #subtitle
    >
      <span
        v-html="$attrs.subtitle"
      />
    </template>
    <template
      v-if="$attrs.end"
      #end
    >
      <div
        v-html="$attrs.end"
      />
    </template>
    <template
      v-if="$attrs.blockEnd"
      #blockEnd
    >
      <div v-html="$attrs.blockEnd" />
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
