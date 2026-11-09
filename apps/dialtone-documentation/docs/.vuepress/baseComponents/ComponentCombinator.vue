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

function hasSamePresetRoute (to, from) {
  return to.path === from.path && hasSamePresetQuery(to, from);
}

function getPresetNavigationFrom (to, navigation, fallback) {
  // Redirects continue the original navigation's comparison, including its pending intent.
  return getNavigationOrigin(navigation?.route) === getNavigationOrigin(to) ? navigation.presetFrom : fallback;
}

function getDeferredPreset (to, from, intent, preset) {
  if (!intent || intent.path !== to.path || !hasSamePresetRoute(to, from)) return null;
  if (hasSamePresetQuery(to, intent)) return null;
  return { preset, path: intent.path, query: intent.query };
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
          const intent = this.deferredPreset ?? this.pendingPresetNavigation;
          // History restores relative to the latest UI intent, even before its URL write commits.
          const presetFrom = getPresetNavigationFrom(
            to, this.externalNavigation, isPop && intent ? intent : this.$route,
          );
          // TOC/query pushes can carry the old query. A different preset discards that deferral.
          this.deferredPreset = getDeferredPreset(to, presetFrom, intent, this.preset);
          this.externalNavigation = markRaw({ route: to, presetFrom, pendingId: this.pendingPresetNavigation?.id });
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
        const { presetFrom, pendingId } = this.externalNavigation;
        this.externalNavigation = null;
        if (!failure) this.applyNavigationPreset(to, presetFrom, pendingId);
        this.flushDeferredPreset();
      } else if (!failure && to.fullPath !== this.pendingPresetNavigation?.fullPath) {
        this.applyNavigationPreset(to, from);
      }
    },

    applyNavigationPreset (to, from, pendingId) {
      // A successful external navigation supersedes this write, even if its guard is still held.
      if (this.pendingPresetNavigation?.id === pendingId) this.pendingPresetNavigation = null;
      if (!hasSamePresetRoute(to, from)) this.readPresetRoute(to);
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
      const query = { ...this.$route.query };
      if (preset && preset !== 'default') query.preset = getCombinatorPresetSlugs(this.componentVariants)[preset];
      else delete query.preset;

      if (this.externalNavigation) {
        // A preset click on the departing page must not supersede its page navigation.
        this.deferredPreset = { preset, path: this.$route.path, query };
        return;
      }

      if (!this.pendingPresetNavigation && query.preset === this.$route.query.preset) return;
      const location = { path: this.$route.path, query, hash: getCurrentBrowserHash() };
      const id = ++this.presetNavigationId;
      this.pendingPresetNavigation = {
        id, fullPath: this.$router.resolve(location).fullPath, path: location.path, query,
      };
      // A newer write must still navigate when it matches the current URL: it cancels an older pending replace.
      // Navigation error hooks restore state; DOM event handlers cannot handle a rejection.
      return this.$router.replace(location).catch(() => {}).finally(() => {
        if (this.pendingPresetNavigation?.id === id) this.pendingPresetNavigation = null;
      });
    },
  },
};
</script>
