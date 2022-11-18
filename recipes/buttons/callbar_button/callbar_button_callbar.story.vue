<!-- eslint-disable vue/no-unregistered-components -->
<template>
  <div class="d-stack16">
    <h3>Normal</h3>
    <div class="d-d-flex d-flow16 d-fw-wrap d-stack16">
      <dt-recipe-callbar-button class="d-mt16">
        Screenshare
        <template #icon>
          <dt-icon name="share-screen" />
        </template>
        <template #tooltip>
          Share screen
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button>
        Record
        <template #icon>
          <dt-icon name="record" />
        </template>
        <template #tooltip>
          Record
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button>
        Mute
        <template #icon>
          <dt-icon name="mic" />
        </template>
        <template #tooltip>
          Mute mic
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button>
        Hold
        <template #icon>
          <dt-icon name="pause" />
        </template>
        <template #tooltip>
          Place on hold
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button>
        Assist
        <template #icon>
          <dt-icon name="dialpad-ai" />
        </template>
        <template #tooltip>
          Enable Assistant
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button>
        Transcript
        <template #icon>
          <dt-icon name="ai-notes" />
        </template>
        <template #tooltip>
          View transcript
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button>
        Transfer
        <template #icon>
          <dt-icon name="transfer" />
        </template>
        <template #tooltip>
          Transfer call
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button>
        Park
        <template #icon>
          <dt-icon name="park" />
        </template>
        <template #tooltip>
          Park call to mainline
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button>
        More
        <template #icon>
          <dt-icon name="more-horizontal" />
        </template>
        <template #tooltip>
          More options
        </template>
      </dt-recipe-callbar-button>
    </div>

    <h3>Active</h3>
    <div class="d-d-flex d-flow16 d-fw-wrap d-stack16">
      <dt-recipe-callbar-button
        active
        danger
        class="d-mt16"
      >
        Stop
        <template #icon>
          <dt-icon name="screen-share-off" />
        </template>
        <template #tooltip>
          Stop sharing
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button
        active
        danger
      >
        Stop Rec
        <template #icon>
          <dt-icon name="stop-circle" />
        </template>
        <template #tooltip>
          Stop recording
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button
        active
        danger
      >
        Unmute
        <template #icon>
          <dt-icon name="mic-off" />
        </template>
        <template #tooltip>
          Unmute mic
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button
        active
        danger
      >
        Unhold
        <template #icon>
          <dt-icon name="pause" />
        </template>
        <template #tooltip>
          Resume call
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button
        active
        danger
      >
        Assist Off
        <template #icon>
          <dt-icon name="dialpad-ai" />
        </template>
        <template #tooltip>
          Disable Assistant
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button active>
        Transcript
        <template #icon>
          <dt-icon name="ai-notes" />
        </template>
        <template #tooltip>
          View transcript
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button active>
        Transfer
        <template #icon>
          <dt-icon name="transfer" />
        </template>
        <template #tooltip>
          Transfer call
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button active>
        Park
        <template #icon>
          <dt-icon name="park" />
        </template>
        <template #tooltip>
          Park call to mainline
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button active>
        More
        <template #icon>
          <dt-icon name="more-horizontal" />
        </template>
        <template #tooltip>
          More options
        </template>
      </dt-recipe-callbar-button>
    </div>
  </div>
</template>

<script>
import DtRecipeCallbarButton from './callbar_button';
import { DtIcon } from '@/components/icon';

export default {
  name: 'DtRecipeCallbarButtonCallbar',
  components: {
    DtRecipeCallbarButton,
    DtIcon,
  },
};
</script>
