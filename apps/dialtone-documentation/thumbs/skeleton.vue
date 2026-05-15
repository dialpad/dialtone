<!--
  Thumbnail override for DtSkeleton.
  The default render has no inherent width — placeholder bars resolve to 0×0
  in the bounding-box check. This wrapper gives the skeleton a frame.
-->
<template>
  <dt-stack
    gap="300"
    :style="{ width: '320px' }"
  >
    <dt-skeleton :paragraph-option="{ lines: 4 }" />
  </dt-stack>
</template>
