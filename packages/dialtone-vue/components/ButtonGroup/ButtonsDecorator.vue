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
import { DtButton } from '../Button';

export default {
  compatConfig: { MODE: 3 },
  name: 'ButtonsDecorator',
  components: { DtButton },
};
</script>
