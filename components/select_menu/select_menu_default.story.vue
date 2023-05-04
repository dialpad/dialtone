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
      v-if="labelSlot"
      slot="label"
    >
      <span v-html="labelSlot" />
    </template>
    <template
      v-if="descriptionSlot"
      slot="description"
    >
      <span v-html="descriptionSlot" />
    </template>
    <html-fragment
      v-if="defaultSlot"
      :html="defaultSlot"
    />
  </dt-select-menu>
</template>

<script>
import DtSelectMenu from './select_menu.vue';
import { htmlFragment } from '@/common/utils';

export default {
  name: 'DtSelectMenuDefault',
  components: { DtSelectMenu, htmlFragment },
};
</script>
