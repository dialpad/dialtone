<template>
  <dt-hovercard placement="bottom-start">
    <template #anchor>
      <dt-button kind="muted" importance="outlined">
        Hover to see the hovercard
      </dt-button>
    </template>
    <template #content>
      <div>This is the content of the hovercard</div>
    </template>
    <template #headerContent>
      <span>This is the header</span>
    </template>
    <template #footerContent>
      <span>This is the footer</span>
    </template>
  </dt-hovercard>
</template>

<script>

</script>
