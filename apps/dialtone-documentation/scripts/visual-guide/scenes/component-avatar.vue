<template>
  <!-- Avatar redesign in Next: numeric size scale, 12-family seeded colors,
       and group avatars render at their real size. On staging, group avatars
       are HARDCODED to xs ("Group only supports xs size for now" in
       avatar.vue) and the count badge overlaps the tiny circle — initials are
       genuinely not legible there, which is exactly the before story. Photo
       row uses image-src, supported on both branches. -->
  <div
    class="vg-scene"
    style="width:560px;"
  >
    <p class="vg-heading">
      Avatar — color, sizing, groups
    </p>
    <div style="display:flex;gap:48px;align-items:flex-start;">
      <div style="text-align:center;">
        <p class="vg-label">
          single
        </p>
        <dt-avatar
          full-name="Daniel Parker"
          seed="daniel-parker"
        />
      </div>
      <div style="text-align:center;">
        <p class="vg-label">
          seeded colors
        </p>
        <div style="display:flex;gap:8px;">
          <dt-avatar
            full-name="Ana Silva"
            seed="ana-silva"
          />
          <dt-avatar
            full-name="Ben Okafor"
            seed="ben-okafor"
          />
          <dt-avatar
            full-name="Cleo Wong"
            seed="cleo-wong"
          />
        </div>
      </div>
      <div style="text-align:center;">
        <p class="vg-label">
          group
        </p>
        <div style="display:inline-block;position:relative;">
          <dt-avatar
            :group="12"
            full-name="Daniel Parker"
            seed="daniel-parker"
          />
        </div>
        <p
          class="vg-mono"
          style="margin:10px auto 0;width:130px;"
        >
          {{ groupCaption }}
        </p>
      </div>
    </div>
    <div style="display:flex;gap:48px;align-items:center;margin-top:32px;">
      <div style="text-align:center;">
        <p class="vg-label">
          with photo
        </p>
        <div style="display:flex;gap:8px;align-items:center;">
          <dt-avatar
            image-src="/assets/images/migration-visual/sample-person.png"
            image-alt="Daniel Parker"
            full-name="Daniel Parker"
          />
          <dt-avatar
            image-src="/assets/images/migration-visual/sample-person.png"
            image-alt="Daniel Parker"
            full-name="Daniel Parker"
            presence="active"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Two component rules explain the before side: tiny (xs) avatars never
// render initials, and current Dialtone always draws group avatars tiny.
// The caption explains it in-image, per branch, in plain language.
const groupCaption = ref('groups always render tiny — too small for initials');

onMounted(() => {
  const probe = getComputedStyle(document.documentElement).getPropertyValue('--dt-color-surface-overlay');
  if (probe && probe.trim()) groupCaption.value = 'groups render full size — initials show';
});
</script>
