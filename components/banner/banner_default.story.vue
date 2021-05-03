<template>
  <div>
    <button @click="displayBanner = true">
      Click to show!
    </button>
    <hs-banner
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
    </hs-banner>
  </div>
</template>

<script>
import HsBanner from '../banner/banner';
import HsButton from '../button/button';
import icon from '../mixins/icon';

export default {
  name: 'BannerDefault',
  components: { HsBanner, HsButton },
  mixins: [icon],
  data () {
    return {
      displayBanner: false,
    };
  },
};
</script>
