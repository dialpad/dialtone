<template>
  <!-- Underline redraw in Next: thickness border-50 (0.5px) → border-100
       (1px) and offset 3px → 2px (link.less), which changes how the line
       interacts with descenders (g, j, p, y). Shown large so the detail is
       readable; the caption reports the COMPUTED thickness/offset per branch
       rather than hardcoding token math. -->
  <div
    class="vg-scene"
    style="width:560px;"
  >
    <p class="vg-heading">
      Link — underline detail
    </p>
    <p style="margin:0;font-size:28px;">
      <dt-link
        ref="bigLink"
        href="#"
      >
        Manage group paging
      </dt-link>
    </p>
    <p style="margin:20px 0 0;font-size:15px;color:var(--dt-color-foreground-primary);">
      Inline in body copy — you can <dt-link href="#">
        judge typography changes
      </dt-link> at reading size too.
    </p>
    <p
      class="vg-mono"
      style="margin-top:20px;"
    >
      {{ metrics }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const bigLink = ref(null);
const metrics = ref('');

onMounted(() => {
  const el = bigLink.value?.$el ?? bigLink.value;
  if (!el || !el.querySelector) return;
  const anchor = el.tagName === 'A' ? el : el.querySelector('a') || el;
  const cs = getComputedStyle(anchor);
  metrics.value = `underline ${cs.textDecorationThickness} thick, offset ${cs.textUnderlineOffset}`;
});
</script>
