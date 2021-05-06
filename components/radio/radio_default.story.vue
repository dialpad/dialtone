<template>
  <hs-radio
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
  >
    <template v-if="defaultSlot">
      <span v-html="defaultSlot" />
    </template>
    <template
      v-if="descriptionSlot"
      #description
    >
      <span v-html="descriptionSlot" />
    </template>
  </hs-radio>
</template>

<script>
import HsRadio from './radio';
import fixDefaultSlot from '../plugins/fixDefaultSlot';

export default {
  name: 'RadioDefault',
  components: { HsRadio },
  mixins: [fixDefaultSlot],
};
</script>
