<!-- eslint-disable max-lines -->
<!-- Use this template story to allow the user control the component's props and slots -->
<template>
  <div class="d-stack16">
    <h3>
      Call Bar Buttons
    </h3>
    <div class="d-d-flex d-flow16 d-fw-wrap">
      <dt-recipe-callbar-button>
        Button
        <template #icon>
          <dt-icon name="record" />
        </template>
        <template #tooltip>
          Tooltip
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button>
        No tooltip
        <template #icon>
          <dt-icon name="accessibility" />
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button>
        Label only
        <template #tooltip>
          Tooltip
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button aria-label="mic on">
        <template #icon>
          <dt-icon name="mic" />
        </template>
        <template #tooltip>
          Icon only
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button disabled>
        Disabled
        <template #icon>
          <dt-icon name="mic" />
        </template>
        <template #tooltip>
          Tooltip
        </template>
      </dt-recipe-callbar-button>
    </div>

    <h3>
      Active Call Bar Buttons
    </h3>
    <div class="d-d-flex d-flow16 d-fw-wrap">
      <dt-recipe-callbar-button active>
        Button
        <template #icon>
          <dt-icon name="record" />
        </template>
        <template #tooltip>
          Tooltip
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button active>
        No tooltip
        <template #icon>
          <dt-icon name="accessibility" />
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button active>
        Label only
        <template #tooltip>
          Tooltip
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button
        active
        aria-label="mic on"
      >
        <template #icon>
          <dt-icon name="mic" />
        </template>
        <template #tooltip>
          Icon only
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button
        active
        disabled
      >
        Disabled
        <template #icon>
          <dt-icon name="mic" />
        </template>
        <template #tooltip>
          Tooltip
        </template>
      </dt-recipe-callbar-button>
    </div>

    <h3>
      Danger Call Bar Buttons
    </h3>
    <div class="d-fs12">
      Danger Call Bar Buttons look the same as regular buttons; they only differ on their active state.
    </div>
    <div class="d-d-flex d-flow16 d-fw-wrap">
      <dt-recipe-callbar-button danger>
        Button
        <template #icon>
          <dt-icon name="record" />
        </template>
        <template #tooltip>
          Tooltip
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button danger>
        No tooltip
        <template #icon>
          <dt-icon name="accessibility" />
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button danger>
        Label only
        <template #tooltip>
          Tooltip
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button
        danger
        aria-label="mic on"
      >
        <template #icon>
          <dt-icon name="mic" />
        </template>
        <template #tooltip>
          Icon only
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button
        disabled
        danger
      >
        Disabled
        <template #icon>
          <dt-icon name="mic" />
        </template>
        <template #tooltip>
          Tooltip
        </template>
      </dt-recipe-callbar-button>
    </div>

    <h3>
      Danger Active Call Bar Buttons
    </h3>
    <div class="d-d-flex d-flow16 d-fw-wrap">
      <dt-recipe-callbar-button
        active
        danger
      >
        Button
        <template #icon>
          <dt-icon name="record" />
        </template>
        <template #tooltip>
          Tooltip
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button
        active
        danger
      >
        No tooltip
        <template #icon>
          <dt-icon name="accessibility" />
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button
        active
        danger
      >
        Label only
        <template #tooltip>
          Tooltip
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button
        active
        danger
        aria-label="mic on"
      >
        <template #icon>
          <dt-icon name="mic" />
        </template>
        <template #tooltip>
          Icon only
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button
        active
        disabled
        danger
      >
        Disabled
        <template #icon>
          <dt-icon name="mic" />
        </template>
        <template #tooltip>
          Tooltip
        </template>
      </dt-recipe-callbar-button>
    </div>

    <h3>
      Rounded
    </h3>
    <div class="d-d-flex d-flow16 d-fw-wrap">
      <dt-recipe-callbar-button
        circle
        aria-label="recording"
      >
        <template #icon>
          <dt-icon name="record" />
        </template>
        <template #tooltip>
          Rounded button
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button
        circle
        active
        aria-label="person"
      >
        <template #icon>
          <dt-icon name="user" />
        </template>
        <template #tooltip>
          Rounded active
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button
        circle
        danger
        aria-label="play"
      >
        <template #icon>
          <dt-icon name="play" />
        </template>
        <template #tooltip>
          Rounded danger
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button
        circle
        active
        danger
        aria-label="star"
      >
        <template #icon>
          <dt-icon name="star" />
        </template>
        <template #tooltip>
          Rounded danger active
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button
        circle
        disabled
        aria-label="dialpad"
      >
        <template #icon>
          <dt-icon name="accessibility" />
        </template>
        <template #tooltip>
          Rounded button
        </template>
      </dt-recipe-callbar-button>
    </div>
  </div>
</template>

<script>
import DtRecipeCallbarButton from './callbar_button.vue';
import { DtIcon } from '@/components/icon';

export default {
  name: 'DtRecipeCallbarButtonVariants',
  components: {
    DtRecipeCallbarButton,
    DtIcon,
  },
};
</script>
