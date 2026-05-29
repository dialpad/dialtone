<template>
  <dt-segmented-control model-value="system" aria-label="Mode" size="300">
    <dt-segmented-control-item value="system">
      System
      <template #startIcon="{ iconSize }">
        <dt-icon name="laptop-2" :size="iconSize" />
      </template>
    </dt-segmented-control-item>
    <dt-segmented-control-item value="light">
      Light
      <template #startIcon="{ iconSize }">
        <dt-icon name="sun" :size="iconSize" />
      </template>
    </dt-segmented-control-item>
    <dt-segmented-control-item value="dark">
      Dark
      <template #startIcon="{ iconSize }">
        <dt-icon name="moon" :size="iconSize" />
      </template>
    </dt-segmented-control-item>
  </dt-segmented-control>
</template>
