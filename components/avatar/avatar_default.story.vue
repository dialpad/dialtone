<template>
  <dt-avatar
    :kind="kind"
    :size="size"
    :color="color"
    :src="src"
    :alt="alt"
  >
    <template
      v-if="defaultSlot"
      #default
    >
      <component
        :is="defaultSlot"
        v-if="kind === 'icon'"
      />
      <span
        v-else
        v-html="defaultSlot"
      />
    </template>
  </dt-avatar>
</template>

<script>
import DtAvatar from './avatar';
import icon from '../mixins/icon';

export default {
  name: 'DtAvatarDefault',
  components: { DtAvatar },
  mixins: [icon],
};
</script>
