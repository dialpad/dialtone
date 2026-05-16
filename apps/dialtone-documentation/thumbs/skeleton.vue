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
    <dt-skeleton
      :list-item-option="{ shapeSize: 'sm', paragraphs: { rows: 1 } }"
      :animate="false"
    />
    <dt-skeleton :paragraph-option="{ lines: 2 }" :animate="false" />
  </dt-stack>
</template>
