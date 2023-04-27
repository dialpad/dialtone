<template>
  <dt-recipe-contact-info
    :avatar-src="$attrs.avatarSrc"
    :avatar-initials="$attrs.avatarInitials"
    :avatar-size="$attrs.avatarSize"
    :avatar-color="$attrs.avatarColor"
    :avatar-seed="$attrs.avatarSeed"
    :presence="$attrs.presence"
  >
    <template
      v-if="$attrs.header"
      #header
    >
      <span v-html="$attrs.header" />
    </template>

    <template
      v-if="$attrs.subtitle"
      #subtitle
    >
      <span v-html="$attrs.subtitle" />
    </template>

    <template
      v-if="$attrs.right"
      #right
    >
      <span v-html="$attrs.right" />
    </template>

    <template
      v-if="$attrs.bottom"
      #bottom
    >
      <span v-html="$attrs.bottom" />
    </template>
  </dt-recipe-contact-info>
</template>

<script>
import DtRecipeContactInfo from './contact_info';

export default {
  name: 'DtRecipeContactInfoDefault',
  components: { DtRecipeContactInfo },
};
</script>
