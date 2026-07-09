<template>
  <!-- DtNotice restyle across ALL kinds, with identical copy per row on both
       branches. Kind names are branch-adaptive where they were renamed
       (error→critical, success→positive — component-props guide, "Severity
       vocabulary"); base/info/warning are shared. Last row shows the
       title-less single-line anatomy. Cross-branch props: show-close/
       hide-close, title/header-text. -->
  <div
    class="vg-scene"
    style="width:560px;"
  >
    <p class="vg-heading">
      Notice — all kinds
    </p>
    <div style="display:flex;flex-direction:column;gap:14px;">
      <dt-notice
        v-for="kind in kinds"
        :key="kind"
        :kind="kind"
        :title="`${capitalize(kind)} title`"
        :header-text="`${capitalize(kind)} title`"
        :show-close="false"
        :hide-close="true"
      >
        Message body copy.
      </dt-notice>
      <dt-notice
        kind="base"
        :show-close="false"
        :hide-close="true"
      >
        A single-line notice without a title.
      </dt-notice>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Each branch's canonical kind vocabulary.
const BEFORE_KINDS = ['base', 'error', 'info', 'success', 'warning'];
const AFTER_KINDS = ['base', 'critical', 'info', 'positive', 'warning'];

const kinds = ref(BEFORE_KINDS);

function capitalize (word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

onMounted(() => {
  // --dt-color-surface-overlay only exists on Next.
  const probe = getComputedStyle(document.documentElement).getPropertyValue('--dt-color-surface-overlay');
  if (probe && probe.trim()) kinds.value = AFTER_KINDS;
});
</script>
