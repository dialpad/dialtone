<template>
  <dt-recipe-contact-info
    :avatar-src="avatarSrc"
    :avatar-initials="avatarInitials"
    :avatar-size="avatarSize"
    :avatar-color="avatarColor"
    :avatar-seed="avatarSeed"
    :presence="presence"
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
