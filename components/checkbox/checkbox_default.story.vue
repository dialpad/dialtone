<template>
  <dt-checkbox
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
    :indeterminate="$attrs.indeterminate"
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
  </dt-checkbox>
</template>

<script>
import DtCheckbox from './checkbox.vue';

export default {
  name: 'CheckboxDefault',
  components: { DtCheckbox },
};
</script>
