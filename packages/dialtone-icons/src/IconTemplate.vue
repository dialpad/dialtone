<template>
  __SVG_CONTENT__
</template>

<script>
import { getUniqueString } from '@/common/utils';

export default {
  name: '__ICON_NAME__',
  created () {
    this.uniqueID = getUniqueString('dt-icon');
  },
};
</script>
