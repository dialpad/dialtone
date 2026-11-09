<template>
  <dtc-combinator
    :component="component"
    :library="library"
    :documentation="componentDocumentation"
    :variants="componentVariants"
    :preset="preset"
    :dev-mode="isDev"
    :full-screen="fullScreen"
    @update:full-screen="$emit('update:fullScreen', $event)"
    @update:preset="updatePreset"
  />
</template>

<script>
import { variantBank } from '@dialpad/dialtone-combinator';
import { markRaw } from 'vue';
import { getCombinatorPresetName, getCombinatorPresetSlugs } from '../theme/utils/componentCombinator.js';
import { getCurrentBrowserHash, suppressRouteHashScroll } from '../theme/utils/pageToc.js';

function getNavigationOrigin (route) {
  return route?.redirectedFrom ?? route;
}

function hasSamePresetQuery (to, from) {
  const first = to.query.preset;
  const second = from.query.preset;
  if (first === second) return true;
  // Repeated query values are arrays recreated for each navigation.
  return Array.isArray(first) && Array.isArray(second)
    && first.length === second.length
    && first.every((value, index) => value === second[index]);
}

export default {
  name: 'ComponentCombinator',

  inject: [
    'dialtoneComponents',
    'dialtoneComponentsDocumentation',
    'dialtoneIcons',
    'dialtoneIllustrations',
  ],

  props: {
    componentName: {
      type: String,
      required: true,
    },

    fullScreen: {
      type: Boolean,
      default: undefined,
    },
  },

  emits: ['update:fullScreen'],

  data () {
    return {
      preset: 'default',
      presetNavigationId: 0,
      pendingPresetNavigation: null,
      externalNavigation: null,
      historyPop: null,
      deferredPreset: null,
      navigationStops: [],
    };
  },

  computed: {
    component () {
      return this.dialtoneComponents[this.componentName];
    },

    componentDocumentation () {
      return this.dialtoneComponentsDocumentation.find(
        componentInfo => componentInfo.displayName === this.componentName,
      );
    },

    componentVariants () {
      return variantBank()[this.componentName] ?? {};
    },

    library () {
      return {
        ...this.dialtoneComponents,
        ...this.dialtoneIcons,
        ...this.dialtoneIllustrations,
      };
    },

    isDev () {
      return typeof __VUEPRESS_DEV__ !== 'undefined'
        && (__VUEPRESS_DEV__ || __DIALTONE_DEPLOY_PREVIEW__);
    },
  },

  watch: {
    componentName: {
      immediate: true,
      handler () {
        this.readPresetRoute(this.$route);
      },
    },
  },

  mounted () {
    this.navigationStops.push(
      this.$router.options.history.listen(this.onHistoryNavigation),
      this.$router.beforeEach(to => {
        const isPop = this.historyPop === to.fullPath;
        this.historyPop = null;
        if (!isPop && to.fullPath === this.pendingPresetNavigation?.fullPath) {
          suppressRouteHashScroll(to);
        } else {
          const keepsPreset = to.path === this.$route.path && hasSamePresetQuery(to, this.$route);
          if (this.pendingPresetNavigation && keepsPreset) {
            // Same-preset navigation can cancel our replacement while carrying its old query.
            this.deferredPreset = { preset: this.preset, path: this.$route.path };
          }
          this.externalNavigation = markRaw({ route: to });
        }
      }),
      this.$router.afterEach(this.onPresetNavigationSettled),
      this.$router.onError((error, to) => {
        // Registering an error hook replaces Vue Router's default error logging.
        console.error(error);
        if (this.preset !== '' && !this.externalNavigation && to.fullPath === this.pendingPresetNavigation?.fullPath) {
          // A failed preset selection can revert; a failed edit write must keep the user's values.
          this.readPresetRoute(this.$route);
        }
        this.onPresetNavigationSettled(to, null, error);
      }),
    );
  },

  beforeUnmount () {
    this.navigationStops.forEach(stop => stop());
  },

  methods: {
    onHistoryNavigation (to, from, info) {
      // Old native-anchor entries may have no direction because their positions match.
      if (info.type === 'pop') {
        this.historyPop = this.$router.resolve(to).fullPath;
      }
    },

    onPresetNavigationSettled (to, from, failure) {
      const externalOrigin = getNavigationOrigin(this.externalNavigation?.route);
      if (externalOrigin === getNavigationOrigin(to)) {
        this.externalNavigation = null;
        if (!failure) this.applyNavigationPreset(to, from);
        this.flushDeferredPreset();
      } else if (!failure && to.fullPath !== this.pendingPresetNavigation?.fullPath) {
        this.applyNavigationPreset(to, from);
      }
    },

    applyNavigationPreset (to, from) {
      if (to.path !== from.path || !hasSamePresetQuery(to, from)) this.readPresetRoute(to);
    },

    readPresetRoute (route) {
      this.preset = getCombinatorPresetName(this.componentVariants, route.query.preset);
    },

    flushDeferredPreset () {
      const deferred = this.deferredPreset;
      this.deferredPreset = null;
      if (deferred?.path === this.$route.path) this.updatePreset(deferred.preset);
    },

    updatePreset (preset) {
      this.preset = preset;
      if (this.externalNavigation) {
        // A preset click on the departing page must not supersede its page navigation.
        this.deferredPreset = { preset, path: this.$route.path };
        return;
      }
      const query = { ...this.$route.query };
      if (preset && preset !== 'default') query.preset = getCombinatorPresetSlugs(this.componentVariants)[preset];
      else delete query.preset;

      if (!this.pendingPresetNavigation && query.preset === this.$route.query.preset) return;
      const location = { path: this.$route.path, query, hash: getCurrentBrowserHash() };
      const id = ++this.presetNavigationId;
      this.pendingPresetNavigation = { id, fullPath: this.$router.resolve(location).fullPath };
      // A newer write must still navigate when it matches the current URL: it cancels an older pending replace.
      // Navigation error hooks restore state; DOM event handlers cannot handle a rejection.
      return this.$router.replace(location).catch(() => {}).finally(() => {
        if (this.pendingPresetNavigation?.id === id) this.pendingPresetNavigation = null;
      });
    },
  },
};
</script>
