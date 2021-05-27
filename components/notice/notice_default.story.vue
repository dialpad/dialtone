<template>
  <dt-notice
    :kind="kind"
    :title="title"
    :title-id="titleId"
    :content-id="contentId"
    :important="important"
    :hide-close="hideClose"
    :closeButtonProps="computedCloseButtonProps"
  >
    <span v-html="defaultSlot" />
    <template #action>
      <dt-button
        size="sm"
        importance="outlined"
        :kind="actionKind"
      >
        Action
      </dt-button>
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
  </dt-notice>
</template>

<script>
import { DtButton } from '../button';
import DtNotice from './notice';
import icon from '../mixins/icon';

export default {
  name: 'NoticeDefault',

  mixins: [icon],

  components: { DtButton, DtNotice },

  computed: {
    actionKind () {
      if (this.important && (this.kind === 'base' || this.kind === 'info' || this.kind === 'error')) {
        return 'inverted';
      }

      return 'muted';
    },

    computedCloseButtonProps () {
      return {
        kind: this.actionKind,
      };
    },
  },
};
</script>
