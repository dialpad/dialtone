<template>
  <!-- DtModal: Next renders a native <dialog> in the top layer on the new
       overlay surface; staging renders a div overlay. Cross-branch props: both
       show/open and title/header-text pairs are passed — each branch reads the
       one it knows. Captured as a full viewport (top-layer content escapes the
       element box). -->
  <div class="vg-scene" style="min-height:760px;">
    <p style="margin:0 0 16px;font-size:20px;font-weight:600;color:var(--dt-color-foreground-primary);">
      Workspace settings
    </p>
    <p style="margin:0 0 10px;font-size:14px;color:var(--dt-color-foreground-secondary);">
      Page content behind the modal — used to judge backdrop dimming and the overlay surface against the page.
    </p>
    <p style="margin:0;font-size:14px;color:var(--dt-color-foreground-secondary);">
      Members · Integrations · Billing · Notifications
    </p>

    <dt-modal
      :show="true"
      :open="true"
      title="Update workspace name"
      header-text="Update workspace name"
      copy="Choose a name your team will recognize."
      :close-button-props="{ ariaLabel: 'Close' }"
    >
      <template #default>
        <p style="margin:0;font-size:14px;color:var(--dt-color-foreground-primary);">
          Choose a name your team will recognize.
        </p>
      </template>
      <template #footer>
        <dt-button importance="clear">
          Cancel
        </dt-button>
        <dt-button importance="primary">
          Save
        </dt-button>
      </template>
    </dt-modal>
  </div>
</template>
