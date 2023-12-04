<template>
  <dt-select-menu
    :label="$attrs.label"
    :options="$attrs.options"
    :size="$attrs.size"
    :description="$attrs.description"
    :show-messages="$attrs.showMessages"
    :messages="$attrs.messages"
    :name="$attrs.name"
    :value="$attrs.value"
    :disabled="$attrs.disabled"
    :label-class="$attrs.labelClass"
    :description-class="$attrs.descriptionClass"
    :select-class="$attrs.selectClass"
    :option-class="$attrs.optionClass"
    :messages-class="$attrs.messagesClass"
    :label-child-props="$attrs.labelChildProps"
    :description-child-props="$attrs.descriptionChildProps"
    :option-child-props="$attrs.optionChildProps"
    :messages-child-props="$attrs.messagesChildProps"
    @input="$attrs.onInput"
    @change="$attrs.onChange"
  >
    <template
      v-if="$attrs.labelSlot"
      #label
    >
      <span v-html="$attrs.labelSlot" />
    </template>
    <template
      v-if="$attrs.descriptionSlot"
      #description
    >
      <span v-html="$attrs.descriptionSlot" />
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
