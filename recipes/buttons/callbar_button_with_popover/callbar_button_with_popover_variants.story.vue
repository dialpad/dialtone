<template>
  <div class="d-stack16">
    <h3>
      Call Bar Buttons
    </h3>
    <div class="d-d-flex d-flow16 d-fw-wrap">
      <dt-recipe-callbar-button-with-popover arrow-button-label="Open popover">
        Button
        <template #icon>
          <icon-recording />
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
      >
        <template #icon>
          <icon-mic-on />
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
          <icon-mic-on />
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
          <icon-recording />
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
      >
        <template #icon>
          <icon-mic-on />
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
          <icon-mic-on />
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
import IconMicOn from '@dialpad/dialtone/lib/dist/vue/icons/IconMicOn';
import IconRecording from '@dialpad/dialtone/lib/dist/vue/icons/IconRecording';

export default {
  name: 'DtRecipeCallbarButtonWithPopoverVariants',
  components: {
    DtRecipeCallbarButtonWithPopover,
    IconMicOn,
    IconRecording,
  },
};
</script>
