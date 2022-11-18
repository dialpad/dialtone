<template>
  <div>
    <dt-icon
      v-for="size in sizes"
      :key="size"
      :size="size"
      name="accessibility"
    />
  </div>
</template>

<script>
import DtIcon from './icon';

export default {
  name: 'IconDefault',
  components: { DtIcon },
  data () {
    return {
      sizes: [
        '100',
        '200',
        '300',
        '400',
        '500',
        '600',
        '700',
        '800',
      ],
    };
  },
};
</script>
