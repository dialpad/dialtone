<template>
  <dt-recipe-callbar-button-with-popover
    :id="id"
    :aria-label="ariaLabel"
    :arrow-button-label="arrowButtonLabel"
    :placement="placement"
    :initial-focus-element="initialFocusElement"
    :show-close-button="showCloseButton"
    :disabled="disabled"
    :force-show-arrow="forceShowArrow"
    :active="active"
    :danger="danger"
    @arrow-click="onClick"
    @click="onClick"
  >
    <span
      v-if="defaultSlot"
      v-html="defaultSlot"
    />
    <template
      v-if="icon"
      slot="icon"
    >
      <component :is="icon" />
    </template>
    <template
      v-if="tooltip"
      slot="tooltip"
    >
      <span v-html="tooltip" />
    </template>
    <template #content>
      <span v-html="content" />
    </template>
    <template
      v-if="headerContent"
      #headerContent
    >
      <span v-html="headerContent" />
    </template>
    <template
      v-if="footerContent"
      #footerContent
    >
      <span v-html="footerContent" />
    </template>
  </dt-recipe-callbar-button-with-popover>
</template>

<script>
import DtRecipeCallbarButtonWithPopover from './callbar_button_with_popover';
import IconDialpadAi from '@dialpad/dialtone/lib/dist/vue/icons/IconDialpadAi';
import icon from '@/common/mixins/icon';

export default {
  name: 'DtRecipeCallbarButtonWithPopoverDefault',
  components: { DtRecipeCallbarButtonWithPopover, IconDialpadAi },
  mixins: [icon],
};
</script>
