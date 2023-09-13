<template>
  <dt-recipe-contact-info
    :show-avatar="showAvatar"
    :avatar-src="avatarSrc"
    :avatar-full-name="avatarFullName"
    :avatar-icon="avatarIcon"
    :avatar-size="avatarSize"
    :avatar-seed="avatarSeed"
    :presence="presence"
    @avatar-click="onAvatarClick"
  >
    <template
      v-if="header"
      #header
    >
      <span v-html="header" />
    </template>

    <template
      v-if="subtitle"
      #subtitle
    >
      <span v-html="subtitle" />
    </template>

    <template
      v-if="right"
      #right
    >
      <span v-html="right" />
    </template>

    <template
      v-if="bottom"
      #bottom
    >
      <span v-html="bottom" />
    </template>
  </dt-recipe-contact-info>
</template>

<script>
import DtRecipeContactInfo from './contact_info.vue';

export default {
  name: 'DtRecipeContactInfoDefault',
  components: { DtRecipeContactInfo },
};
</script>
