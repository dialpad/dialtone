<template>
  <hs-notice
    :kind="kind"
    :title="title"
    :title-id="titleId"
    :content-id="contentId"
    :important="important"
    :hide-close="hideClose"
  >
    <span v-html="defaultSlot" />
    <template
      v-if="action"
      #action
    >
      <span v-html="action" />
    </template>
    <template
      v-if="icon"
      #icon
    >
      <component :is="icon" />
    </template>
    <template
      v-if="titleOverride"
      #titleOverride
    >
      <span v-html="titleOverride" />
    </template>
  </hs-notice>
</template>

<script>
import HsNotice from './notice';
import icon from '../mixins/icon';

export default {
  name: 'NoticeDefault',
  components: { HsNotice },
  mixins: [icon],
};
</script>
