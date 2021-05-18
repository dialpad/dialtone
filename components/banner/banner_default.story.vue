<template>
  <div>
    <button @click="displayBanner = true">
      Click to show!
    </button>
    <dt-banner
      v-if="displayBanner"
      :kind="kind"
      :title="title"
      :title-id="titleId"
      :content-id="contentId"
      :important="important"
      :pinned="pinned"
      :hide-close="hideClose"
      @close="displayBanner = false"
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
    </dt-banner>
  </div>
</template>

<script>
import DtBanner from '../banner/banner';
import DtButton from '../button/button';
import icon from '../mixins/icon';

export default {
  name: 'BannerDefault',
  components: { DtBanner, DtButton },
  mixins: [icon],
  data () {
    return {
      displayBanner: false,
    };
  },
};
</script>
