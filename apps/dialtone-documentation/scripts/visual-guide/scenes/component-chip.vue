<template>
  <!-- Next: a default <dt-chip> renders as a non-interactive <span> (no hover/
       focus/pointer affordance). On staging the same default renders as a
       <button> that looks clickable. The capture pipeline parks the pointer
       over the display-only chip (`hover` scene flag): before shows the
       button-like hover state, after shows no reaction — that non-reaction IS
       the change. The interactive opt-in and close button give contrast. -->
  <div class="vg-scene" style="width:560px;">
    <p class="vg-heading">
      Chip — interactive default
    </p>
    <div style="display:flex;gap:40px;align-items:flex-start;">
      <!-- Close hidden via both prop names: hide-close (staging) and
           show-close (next, the hide-*→show-* rename). -->
      <div style="text-align:center;">
        <p class="vg-label">
          display-only<br>(pointer over)
        </p>
        <dt-chip id="vg-hover-target" :hide-close="true" :show-close="false">
          Label
        </dt-chip>
      </div>
      <div style="text-align:center;">
        <p class="vg-label">
          <code>:interactive="true"</code>
        </p>
        <dt-chip :interactive="true" :hide-close="true" :show-close="false">
          Label
        </dt-chip>
      </div>
      <div style="text-align:center;">
        <p class="vg-label">
          with close
        </p>
        <dt-chip @close="() => {}">
          Label
        </dt-chip>
      </div>
    </div>
  </div>
</template>
