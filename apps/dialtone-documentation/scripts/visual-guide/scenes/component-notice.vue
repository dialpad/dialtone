<template>
  <!-- DtNotice across kinds, plus the success → positive rename told from both
       sides: each branch styles the kind name it knows and falls back to the
       default style for the one it doesn't. In the before/after pair, the
       working row swaps — same green either way (value-preserving rename). -->
  <div class="vg-scene" style="width:560px;">
    <p class="vg-heading">
      Notice — kinds (incl. success → positive)
    </p>
    <!-- Cross-branch props: show-close (next) + hide-close (staging), and both
         legacy/new names for the renamed kinds (success→positive,
         error→critical) — each branch styles the name it knows. -->
    <div style="display:flex;flex-direction:column;gap:14px;">
      <dt-notice kind="info" header-text="Info" :show-close="false" :hide-close="true">
        Informational notice.
      </dt-notice>
      <dt-notice
        kind="success"
        header-text="kind=&quot;success&quot; (legacy name)"
        :show-close="false"
        :hide-close="true"
      >
        Styled on current Dialtone; falls back on Next.
      </dt-notice>
      <dt-notice
        kind="positive"
        header-text="kind=&quot;positive&quot; (new name)"
        :show-close="false"
        :hide-close="true"
      >
        Falls back on current Dialtone; styled on Next — same green.
      </dt-notice>
      <dt-notice kind="warning" header-text="Warning" :show-close="false" :hide-close="true">
        Warning notice.
      </dt-notice>
      <dt-notice kind="error" header-text="kind=&quot;error&quot; (legacy name)" :show-close="false" :hide-close="true">
        Styled on current Dialtone; falls back on Next.
      </dt-notice>
      <dt-notice
        kind="critical"
        header-text="kind=&quot;critical&quot; (new name)"
        :show-close="false"
        :hide-close="true"
      >
        Falls back on current Dialtone; styled on Next — same red.
      </dt-notice>
    </div>
  </div>
</template>
