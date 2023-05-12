<template>
/*SVG-CONTENT*/
</template>

<script>
import { getUniqueString } from "@/utils.js";

export default {
  created () {
    this.uniqueID = getUniqueString();
  },
}
</script>
