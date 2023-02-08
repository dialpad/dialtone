<template>
  <dt-avatar
    :id="id"
    :size="size"
    :presence="presence"
    :initials="initials"
    :seed="seed"
    :gradient="gradient"
    :group="group"
  >
    <html-fragment
      :html="defaultSlot"
    />
  </dt-avatar>
</template>

<script>
import { htmlFragment } from '@/common/utils';
import DtAvatar from './avatar';

export default {
  name: 'DtAvatarDefault',
  components: { DtAvatar, htmlFragment },
};
</script>
