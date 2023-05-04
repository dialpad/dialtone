<template>
  <dt-checkbox
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
    :indeterminate="indeterminate"
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
  </dt-checkbox>
</template>

<script>
import DtCheckbox from './checkbox.vue';

export default {
  name: 'CheckboxDefault',
  components: { DtCheckbox },
};
</script>
