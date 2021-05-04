<template>
  <div>
    <hs-radio value="pear">{{'Pear'}}</hs-radio>
    <hs-radio value="kiwi">{{'Kiwi'}}</hs-radio>
  </div>
</template>

<script>
import { HsRadio } from '../../components/radio';

export default {
  name: 'HsRadiosFixture',
  components: { HsRadio },
};
</script>
