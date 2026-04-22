<!-- eslint-disable vue/no-unregistered-components -->
<template>
  <dt-stack gap="200">
    <h3>Normal</h3>
    <dt-stack
      direction="row"
      gap="100"
      class="d-fw-wrap"
    >
      <dt-recipe-callbar-button>
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
    </dt-stack>

    <h3>Active</h3>
    <dt-stack
      direction="row"
      gap="100"
      class="d-fw-wrap"
    >
      <dt-recipe-callbar-button
        active
        danger
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
    </dt-stack>
  </dt-stack>
</template>

<script>
import DtRecipeCallbarButton from './callbar_button.vue';
import { DtIcon } from '@/components/icon';
import { DtStack } from '@/components/stack';

export default {
  name: 'DtRecipeCallbarButtonCallbar',
  components: {
    DtRecipeCallbarButton,
    DtIcon,
    DtStack,
  },
};
</script>
