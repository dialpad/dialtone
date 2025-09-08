<template>
  <dt-recipe-contact-info
    :show-avatar="$attrs.showAvatar"
    :avatar-src="$attrs.avatarSrc"
    :avatar-full-name="$attrs.avatarFullName"
    :avatar-labelledby="$attrs.avatarLabelledby"
    :avatar-size="$attrs.avatarSize"
    :avatar-seed="$attrs.avatarSeed"
    :avatar-color="$attrs.avatarColor"
    :presence="$attrs.presence"
    @avatar-click="$attrs.onAvatarClick"
  >
    <template
      v-if="$attrs.header"
      #header
    >
      <span v-html="$attrs.header" />
    </template>

    <template
      #avatarIcon="{ iconSize }"
    >
      <dt-icon
        v-if="$attrs.avatarIcon"
        :name="$attrs.avatarIcon"
        :size="iconSize"
      />
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
import DtRecipeContactInfo from './contact_info.vue';
import { DtIcon } from '@/components/icon';

export default {
  name: 'DtRecipeContactInfoDefault',
  components: { DtRecipeContactInfo, DtIcon },
};
</script>
