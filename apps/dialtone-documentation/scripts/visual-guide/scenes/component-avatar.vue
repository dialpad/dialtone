<template>
  <!-- Avatar redesign in Next: numeric size scale, 12-family seeded colors,
       and group avatars render at their real size instead of being forced
       tiny. On staging the numeric :size falls back to the default, which is
       part of the story the pair tells. -->
  <div class="vg-scene" style="width:560px;">
    <p class="vg-heading">
      Avatar — color, sizing, groups
    </p>
    <div style="display:flex;gap:48px;align-items:center;">
      <div style="text-align:center;">
        <p class="vg-label">
          single
        </p>
        <dt-avatar full-name="Daniel Parker" seed="daniel-parker" />
      </div>
      <div style="text-align:center;">
        <p class="vg-label">
          seeded colors
        </p>
        <div style="display:flex;gap:8px;">
          <dt-avatar full-name="Ana Silva" seed="ana-silva" />
          <dt-avatar full-name="Ben Okafor" seed="ben-okafor" />
          <dt-avatar full-name="Cleo Wong" seed="cleo-wong" />
        </div>
      </div>
      <div style="text-align:center;">
        <p class="vg-label">
          group
        </p>
        <dt-avatar :group="12" full-name="Daniel Parker" seed="daniel-parker" />
      </div>
    </div>
  </div>
</template>
