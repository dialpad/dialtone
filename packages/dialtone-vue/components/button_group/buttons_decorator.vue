<template>
  <div>
    <dt-button importance="primary">
      {{ 'Confirm' }}
    </dt-button>
    <dt-button importance="outlined">
      {{ 'Cancel' }}
    </dt-button>
  </div>
</template>

<script>
import { DtButton } from '../button';

export default {
  compatConfig: { MODE: 3 },
  name: 'ButtonsDecorator',
  components: { DtButton },
};
</script>
