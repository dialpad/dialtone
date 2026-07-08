<template>
  <dt-stack
    gap="300"
    :style="{ width: '280px' }"
  >
    <dt-text-list
      gap="100"
      marker-tone="secondary"
    >
      <dt-text-list-item>Capture action items</dt-text-list-item>
      <dt-text-list-item>
        Prepare launch notes
        <dt-text-list
          type="ordered"
          gap="50"
        >
          <dt-text-list-item>Draft</dt-text-list-item>
          <dt-text-list-item>Review</dt-text-list-item>
        </dt-text-list>
      </dt-text-list-item>
    </dt-text-list>
    <dt-text-list
      marker-tone="positive"
      gap="50"
    >
      <dt-text-list-item>
        <template #marker>
          <dt-icon-check size="200" />
        </template>
        Custom marker
      </dt-text-list-item>
    </dt-text-list>
  </dt-stack>
</template>
