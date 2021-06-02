<template>
  <dt-select-menu
    :label="label"
    :options="options"
    :size="size"
    :description="description"
    :show-messages="showMessages"
    :messages="messages"
    :name="name"
    :value="value"
    :disabled="disabled"
    :label-class="labelClass"
    :description-class="descriptionClass"
    :select-class="selectClass"
    :option-class="optionClass"
    :messages-class="messagesClass"
    :label-child-props="labelChildProps"
    :description-child-props="descriptionChildProps"
    :option-child-props="optionChildProps"
    :messages-child-props="messagesChildProps"
    @input="onInput"
    @change="onChange"
  >
    <template
      #label
      v-if="labelSlot"
    >
      <span v-html="labelSlot" />
    </template>
    <template
      #description
      v-if="descriptionSlot"
    >
      <span v-html="descriptionSlot" />
    </template>
    <div v-if="defaultSlot">
      <div v-html="defaultSlot" />
    </div>
  </dt-select-menu>
</template>

<script>
import DtSelectMenu from './select_menu';

export default {
  name: 'DtSelectMenuDefault',
  components: { DtSelectMenu },
};
</script>
