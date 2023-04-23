<template>
  <dt-radio
    :label="label"
    :name="name"
    :value="value"
    :checked="checked"
    :description="description"
    :validation-state="validationState"
    :disabled="disabled"
    :input-class="inputClass"
    :label-class="labelClass"
    :description-class="descriptionClass"
    :label-child-props="labelChildProps"
    :description-child-props="descriptionChildProps"
    :messages="messages"
    @input="onInput"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <template v-if="defaultSlot">
      <span v-html="defaultSlot" />
    </template>
    <template
      v-if="descriptionSlot"
      slot="description"
    >
      <span v-html="descriptionSlot" />
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
