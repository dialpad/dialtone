<template>
  <dt-split-button
    :start-active="$attrs.startActive"
    :start-aria-label="$attrs.startAriaLabel"
    :start-icon-position="$attrs.startIconPosition"
    :start-label-class="$attrs.startLabelClass"
    :start-loading="$attrs.startLoading"
    :start-tooltip-text="$attrs.startTooltipText"
    :assertive-on-focus="$attrs.assertiveOnFocus"
    :disabled="$attrs.disabled"
    :dropdown-placement="$attrs.dropdownPlacement"
    :importance="$attrs.importance"
    :kind="$attrs.kind"
    :end-active="$attrs.endActive"
    :end-aria-label="$attrs.endAriaLabel"
    :end-id="$attrs.endId"
    :end-tooltip-text="$attrs.endTooltipText"
    :root-class="$attrs.rootClass"
    :size="$attrs.size"
    :width="$attrs.width"
    @start-clicked="$attrs.onStartClicked"
    @end-clicked="$attrs.onEndClicked"
  >
    <template
      v-if="defaultSlot"
      #default
    >
      {{ defaultSlot }}
    </template>
    <template
      v-if="$attrs.startIcon"
      #startIcon="{ size }"
    >
      <dt-icon
        :name="$attrs.startIcon"
        :size="size"
      />
    </template>
    <template
      v-if="$attrs.endIcon"
      #endIcon="{ size }"
    >
      <dt-icon
        :name="$attrs.endIcon"
        :size="size"
      />
    </template>
    <template #dropdownList="{ close }">
      <dt-list-item
        v-for="option in options"
        :key="option"
        role="menuitem"
        navigation-type="arrow-keys"
        @click="close"
      >
        {{ option }}
      </dt-list-item>
    </template>
    <template
      v-if="$attrs.end"
      #end
    >
      <span v-html="$attrs.end" />
    </template>
  </dt-split-button>
</template>

<script>
import DtSplitButton from './split_button.vue';
import { DtIcon } from '@/components/icon';
import { DtListItem } from '@/components/list_item';

export default {
  name: 'DtSplitButtonDefault',
  components: { DtSplitButton, DtIcon, DtListItem },
  data () {
    return {
      options: ['Option 1', 'Option 2', 'Option 3'],
    };
  },
};
</script>
