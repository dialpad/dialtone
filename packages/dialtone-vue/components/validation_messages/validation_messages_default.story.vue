<template>
  <div>
    <dt-validation-messages
      :id="$attrs.id"
      :validation-messages="$attrs.validationMessages"
      :show-messages="$attrs.showMessages"
    />
  </div>
</template>

<script>
import DtValidationMessages from './validation_messages';

export default {
  name: 'DtValidationMessageDefault',
  components: { DtValidationMessages },
};
</script>
