<template>
  <div>
    <dt-radio value="pear">
      {{ 'Pear' }}
    </dt-radio>
    <dt-radio value="kiwi">
      {{ 'Kiwi' }}
    </dt-radio>
  </div>
</template>

<script>
import { DtRadio } from '../../components/Radio';

export default {
  name: 'DtRadiosFixture',
  components: { DtRadio },
};
</script>
