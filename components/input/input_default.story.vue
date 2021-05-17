<template>
  <dt-input
    :value="value"
    :type="type"
    :messages="messages"
    :size="size"
    :label="label"
    :messages-child-props="messagesChildProps"
    :name="name"
    :disabled="disabled"
    :show-messages="showMessages"
    :messages-class="messagesClass"
    :placeholder="placeholder"
    :show-clear-button="showClearButton"
    @input="onInput"
    @clear="onClear"
  >
    <template
      v-if="icon"
      #icon
    >
      <component :is="icon" />
    </template>
    <template
      v-if="innerLeft"
      #innerLeft
    >
      <component
        :is="innerLeft"
        class="d-svg--size16"
      />
    </template>
    <template
      v-if="innerRight"
      #innerRight
    >
      <component
        :is="innerRight"
        class="d-svg--size16"
      />
    </template>
    <template
      v-if="label"
      #label
    >
      <span v-html="label" />
    </template>
    <template
      v-if="description"
      #description
    >
      <span v-html="description" />
    </template>
  </dt-input>
</template>

<script>
import DtInput from './input';
import icon from '../mixins/icon';

export default {
  name: 'InputDefault',
  components: { DtInput },
  mixins: [icon],
};
</script>
