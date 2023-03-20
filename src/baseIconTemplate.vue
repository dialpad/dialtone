<template>
/*SVG-CONTENT*/
</template>

<script>
import { getUniqueString } from "@/utils";

export default {
  created () {
    this.uniqueID = getUniqueString();
  },
}
</script>
