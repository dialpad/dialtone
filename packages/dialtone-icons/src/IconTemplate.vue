<template>
  __SVG_CONTENT__
</template>

<script>
import { getUniqueString } from '@/common/utils';

export default {
  name: '__ICON_NAME__',
  computed: {
    uniqueID () {
      return getUniqueString();
    },
  },
};
</script>
