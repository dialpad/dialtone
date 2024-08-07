<template>
  <dt-split-button
    :alpha-active="$attrs.alphaActive"
    :alpha-aria-label="$attrs.alphaAriaLabel"
    :alpha-icon-position="$attrs.alphaIconPosition"
    :alpha-label-class="$attrs.alphaLabelClass"
    :alpha-loading="$attrs.alphaLoading"
    :alpha-tooltip-text="$attrs.alphaTooltipText"
    :dropdown-placement="$attrs.dropdownPlacement"
    :assertive-on-focus="$attrs.assertiveOnFocus"
    :disabled="$attrs.disabled"
    :importance="$attrs.importance"
    :kind="$attrs.kind"
    :omega-active="$attrs.omegaActive"
    :omega-aria-label="$attrs.omegaAriaLabel"
    :omega-id="$attrs.omegaId"
    :omega-tooltip-text="$attrs.omegaTooltipText"
    :size="$attrs.size"
    :width="$attrs.width"
    @alpha-clicked="$attrs.onAlphaClicked"
    @omega-clicked="$attrs.onOmegaClicked"
  >
    <template
      v-if="$attrs.default"
      #default
    >
      {{ $attrs.default }}
    </template>
    <template
      v-if="$attrs.alphaIcon"
      #alphaIcon="{ size }"
    >
      <dt-icon
        :name="$attrs.alphaIcon"
        :size="size"
      />
    </template>
    <template
      v-if="$attrs.omegaIcon"
      #omegaIcon="{ size }"
    >
      <dt-icon
        :name="$attrs.omegaIcon"
        :size="size"
      />
    </template>
    <template #dropdownList>
      <ul>
        <dt-list-item navigation-type="tab">
          Some text
        </dt-list-item>
      </ul>
    </template>
    <template
      v-if="$attrs.omega"
      #omega
    >
      <span v-html="$attrs.omega" />
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
};
</script>
