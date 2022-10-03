<!-- eslint-disable vue/no-unregistered-components -->
<template>
  <div class="d-stack16">
    <h3>Normal</h3>
    <div class="d-d-flex d-flow16 d-fw-wrap d-stack16">
      <dt-recipe-callbar-button class="d-mt16">
        Screenshare
        <template #icon>
          <icon-screenshare-off />
        </template>
        <template #tooltip>
          Share screen
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button>
        Record
        <template #icon>
          <icon-recording />
        </template>
        <template #tooltip>
          Record
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button>
        Mute
        <template #icon>
          <icon-mic-on />
        </template>
        <template #tooltip>
          Mute mic
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button>
        Hold
        <template #icon>
          <icon-pause />
        </template>
        <template #tooltip>
          Place on hold
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button>
        Assist
        <template #icon>
          <icon-dialpad-ai />
        </template>
        <template #tooltip>
          Enable Assistant
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button>
        Transcript
        <template #icon>
          <icon-transcript />
        </template>
        <template #tooltip>
          View transcript
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button>
        Transfer
        <template #icon>
          <icon-phone-transfer />
        </template>
        <template #tooltip>
          Transfer call
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button>
        Park
        <template #icon>
          <icon-park />
        </template>
        <template #tooltip>
          Park call to mainline
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button>
        More
        <template #icon>
          <icon-menu-horizontal />
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
          <icon-screenshare />
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
          <icon-recording-off />
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
          <icon-mic-off />
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
          <icon-pause />
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
          <icon-ai-glyph />
        </template>
        <template #tooltip>
          Disable Assistant
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button active>
        Transcript
        <template #icon>
          <icon-transcript />
        </template>
        <template #tooltip>
          View transcript
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button active>
        Transfer
        <template #icon>
          <icon-phone-transfer />
        </template>
        <template #tooltip>
          Transfer call
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button active>
        Park
        <template #icon>
          <icon-park />
        </template>
        <template #tooltip>
          Park call to mainline
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button active>
        More
        <template #icon>
          <icon-menu-horizontal />
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
import icon from '@/common/mixins/icon';
import IconAiGlyph from '@dialpad/dialtone/lib/dist/vue/icons/IconAiGlyph.vue';
import IconDialpadAi from '@dialpad/dialtone/lib/dist/vue/icons/IconDialpadAi.vue';
import IconScreenshareOff from '@dialpad/dialtone/lib/dist/vue/icons/IconScreenshareOff.vue';
import IconRecording from '@dialpad/dialtone/lib/dist/vue/icons/IconRecording.vue';
import IconMicOn from '@dialpad/dialtone/lib/dist/vue/icons/IconMicOn.vue';
import IconPause from '@dialpad/dialtone/lib/dist/vue/icons/IconPause.vue';
import IconTranscript from '@dialpad/dialtone/lib/dist/vue/icons/IconTranscript.vue';
import IconPhoneTransfer from '@dialpad/dialtone/lib/dist/vue/icons/IconPhoneTransfer.vue';
import IconPark from '@dialpad/dialtone/lib/dist/vue/icons/IconPark.vue';
import IconMenuHorizontal from '@dialpad/dialtone/lib/dist/vue/icons/IconMenuHorizontal.vue';
import IconScreenshare from '@dialpad/dialtone/lib/dist/vue/icons/IconScreenshare.vue';
import IconRecordingOff from '@dialpad/dialtone/lib/dist/vue/icons/IconRecordingOff.vue';
import IconMicOff from '@dialpad/dialtone/lib/dist/vue/icons/IconMicOff.vue';

export default {
  name: 'DtRecipeCallbarButtonCallbar',
  components: {
    DtRecipeCallbarButton,
    IconAiGlyph,
    IconDialpadAi,
    IconScreenshareOff,
    IconRecording,
    IconMicOn,
    IconPause,
    IconTranscript,
    IconPhoneTransfer,
    IconPark,
    IconMenuHorizontal,
    IconScreenshare,
    IconRecordingOff,
    IconMicOff,
  },

  mixins: [icon],
};
</script>
