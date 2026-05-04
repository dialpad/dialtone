<template>
  <dt-stack gap="200">
    <h3>
      Call Bar Buttons
    </h3>
    <dt-stack
      direction="row"
      gap="200"
      class="d-fw-wrap"
    >
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
        :open-popover="$attrs.openPopover"
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
    </dt-stack>

    <h3>
      Active Call Bar Buttons
    </h3>
    <dt-stack
      direction="row"
      gap="200"
      class="d-fw-wrap"
    >
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
    </dt-stack>
  </dt-stack>
</template>

<script>
import DtRecipeCallbarButtonWithPopover from './CallbarButtonWithPopover.vue';
import { DtIcon } from '@/components/Icon';
import { DtStack } from '@/components/Stack';

export default {
  name: 'DtRecipeCallbarButtonWithPopoverVariants',
  components: {
    DtRecipeCallbarButtonWithPopover,
    DtIcon,
    DtStack,
  },
};
</script>
