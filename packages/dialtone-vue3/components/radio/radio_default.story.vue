<template>
  <dt-radio
    :label="$attrs.label"
    :name="$attrs.name"
    :value="$attrs.value"
    :checked="$attrs.checked"
    :description="$attrs.description"
    :validation-state="$attrs.validationState"
    :disabled="$attrs.disabled"
    :input-class="$attrs.inputClass"
    :label-class="$attrs.labelClass"
    :description-class="$attrs.descriptionClass"
    :label-child-props="$attrs.labelChildProps"
    :description-child-props="$attrs.descriptionChildProps"
    :messages="$attrs.messages"
    @input="$attrs.onInput"
    @focusin="$attrs.onFocusIn"
    @focusout="$attrs.onFocusOut"
  >
    <template v-if="defaultSlot">
      <span v-html="defaultSlot" />
    </template>
    <template
      v-if="$attrs.descriptionSlot"
      #description
    >
      <span v-html="$attrs.descriptionSlot" />
    </template>
  </dt-radio>
</template>

<script>
import DtRadio from './radio.vue';

export default {
  name: 'RadioDefault',
  components: { DtRadio },
};
</script>
