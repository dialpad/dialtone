<template>
  <div>
    <dt-validation-messages
      :id="$attrs.id"
      :validation-messages="$attrs.validationMessages"
      :show-messages="$attrs.showMessages"
      :icon-class="$attrs.iconClass"
    />
  </div>
</template>

<script>
import DtValidationMessages from './ValidationMessages';

export default {
  name: 'DtValidationMessageDefault',
  components: { DtValidationMessages },
};
</script>
