<template>
  <div class="d-stack16">
    <h3>
      Call Bar Buttons
    </h3>
    <div class="d-d-flex d-flow16 d-fw-wrap">
      <dt-recipe-callbar-button-with-popover arrow-button-label="Open popover">
        Button
        <template #icon>
          <dt-icon name="record" />
        </template>
        <template #tooltip>
          Tooltip text
        </template>
        <template #content>
          Body
        </template>
        <template #headerContent>
          Header Content
        </template>
      </dt-recipe-callbar-button-with-popover>

      <dt-recipe-callbar-button-with-popover
        arrow-button-label="Open popover"
        aria-label="Icon only"
        button-width-size="md"
      >
        <template #icon>
          <dt-icon name="mic" />
        </template>
        <template #tooltip>
          Icon only
        </template>
        <template #content>
          Body
        </template>
        <template #headerContent>
          Header Content
        </template>
      </dt-recipe-callbar-button-with-popover>

      <dt-recipe-callbar-button-with-popover
        disabled
        arrow-button-label="Open popover"
      >
        Disabled
        <template #icon>
          <dt-icon name="mic" />
        </template>
        <template #tooltip>
          Tooltip
        </template>
        <template #content>
          Body
        </template>
        <template #headerContent>
          Header Content
        </template>
      </dt-recipe-callbar-button-with-popover>
    </div>

    <h3>
      Active Call Bar Buttons
    </h3>
    <div class="d-d-flex d-flow16 d-fw-wrap">
      <dt-recipe-callbar-button-with-popover
        active
        arrow-button-label="Open popover"
      >
        Button
        <template #icon>
          <dt-icon name="record" />
        </template>
        <template #tooltip>
          Tooltip text
        </template>
        <template #content>
          Body
        </template>
        <template #headerContent>
          Header Content
        </template>
      </dt-recipe-callbar-button-with-popover>

      <dt-recipe-callbar-button-with-popover
        active
        arrow-button-label="Open popover"
        aria-label="Icon only"
        button-width-size="md"
      >
        <template #icon>
          <dt-icon name="mic" />
        </template>
        <template #tooltip>
          Icon only
        </template>
        <template #content>
          Body
        </template>
        <template #headerContent>
          Header Content
        </template>
      </dt-recipe-callbar-button-with-popover>

      <dt-recipe-callbar-button-with-popover
        active
        disabled
        arrow-button-label="Open popover"
      >
        Disabled
        <template #icon>
          <dt-icon name="mic" />
        </template>
        <template #tooltip>
          Tooltip
        </template>
        <template #content>
          Body
        </template>
        <template #headerContent>
          Header Content
        </template>
      </dt-recipe-callbar-button-with-popover>
    </div>
  </div>
</template>

<script>
import DtRecipeCallbarButtonWithPopover from './callbar_button_with_popover';
import { DtIcon } from '@/components/icon';

export default {
  name: 'DtRecipeCallbarButtonWithPopoverVariants',
  components: {
    DtRecipeCallbarButtonWithPopover,
    DtIcon,
  },
};
</script>
