<template>
  <dt-tooltip :open="true" message="This is a tooltip">
    <template #anchor>
      <dt-button kind="muted" importance="outlined">
        Hover me
      </dt-button>
    </template>
  </dt-tooltip>
</template>
