<template>
  <dt-recipe-callbar-button-with-dropdown
    :id="$attrs.id"
    :aria-label="$attrs.ariaLabel"
    :arrow-button-label="$attrs.arrowButtonLabel"
    :placement="$attrs.placement"
    :fallback-placements="$attrs.fallbackPlacements"
    :disabled="$attrs.disabled"
    :force-show-arrow="$attrs.forceShowArrow"
    :active="$attrs.active"
    :danger="$attrs.danger"
    :button-class="$attrs.buttonClass"
    :button-width-size="$attrs.buttonWidthSize"
    :text-class="$attrs.textClass"
    @arrow-click="$attrs.onArrowClick"
    @click="$attrs.onClick"
    @opened="$attrs.onOpened"
  >
    <span
      v-if="$attrs.default"
      v-html="$attrs.default"
    />
    <template
      v-if="$attrs.icon"
      #icon
    >
      <dt-icon :name="$attrs.icon" />
    </template>
    <template
      v-if="$attrs.tooltip"
      #tooltip
    >
      <span v-html="$attrs.tooltip" />
    </template>
    <template #list>
      <dt-list-item-group
        heading-class="d-py4 d-px8 d-fw-semibold d-c-default"
        heading="Menu Heading A"
      >
        <dt-list-item
          role="menuitem"
          navigation-type="arrow-keys"
        >
          Menu Item 1
        </dt-list-item>
        <dt-dropdown-separator />
        <dt-list-item
          role="menuitem"
          navigation-type="arrow-keys"
        >
          Menu Item 2
        </dt-list-item>
      </dt-list-item-group>
      <dt-dropdown-separator />
      <dt-list-item-group
        heading-class="d-py4 d-px8 d-fw-semibold d-c-default"
        heading="Menu Heading B"
      >
        <dt-list-item
          role="menuitem"
          navigation-type="arrow-keys"
        >
          Menu Item 3
        </dt-list-item>
      </dt-list-item-group>
    </template>
  </dt-recipe-callbar-button-with-dropdown>
</template>

<script>
import DtRecipeCallbarButtonWithDropdown from './callbar_button_with_dropdown.vue';
import { DtIcon } from '@/components/icon';
import { DtListItem } from '@/components/list_item';
import { DtListItemGroup } from '@/components/list_item_group';
import { DtDropdownSeparator } from '@/components/dropdown';

export default {
  name: 'DtRecipeCallbarButtonWithPopoverDefault',
  components: { DtRecipeCallbarButtonWithDropdown, DtIcon, DtListItem, DtListItemGroup, DtDropdownSeparator },
};
</script>
