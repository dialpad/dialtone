<template>
  <dt-notice
    header-text="Info title"
    kind="critical"
  >
    Message body with <dt-link to="/path/to/">
      a link
    </dt-link>.
    <template #action>
      <dt-button :size="200" importance="outlined" kind="muted">
        Action
      </dt-button>
    </template>
  </dt-notice>
</template>
