<template>
  <dt-illustration
    :name="$attrs.name"
  />
</template>

<script>
import { DtIllustration } from './';

export default {
  name: 'IllustrationDefault',
  components: { DtIllustration },
};
</script>
