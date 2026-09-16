<template>
  <dt-hovercard :open="true" placement="top">
    <template #anchor>
      <dt-button importance="outlined" kind="muted">
        Hover over me
      </dt-button>
    </template>
    <template #content>
      Hovercard content
    </template>
  </dt-hovercard>
</template>
