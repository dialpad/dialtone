<template>
  <div class="d-stack16">
    <h3>
      Call Bar Buttons
    </h3>
    <div class="d-d-flex d-flow16 d-fw-wrap">
      <dt-recipe-callbar-button>
        Button
        <template #icon>
          <icon-recording />
        </template>
        <template #tooltip>
          Tooltip
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button>
        No tooltip
        <template #icon>
          <icon-dialpad-glyph />
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
          <icon-mic-on />
        </template>
        <template #tooltip>
          Icon only
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button disabled>
        Disabled
        <template #icon>
          <icon-mic-on />
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
          <icon-recording />
        </template>
        <template #tooltip>
          Tooltip
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button active>
        No tooltip
        <template #icon>
          <icon-dialpad-glyph />
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
          <icon-mic-on />
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
          <icon-mic-on />
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
          <icon-recording />
        </template>
        <template #tooltip>
          Tooltip
        </template>
      </dt-recipe-callbar-button>

      <dt-recipe-callbar-button danger>
        No tooltip
        <template #icon>
          <icon-dialpad-glyph />
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
          <icon-mic-on />
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
          <icon-mic-on />
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
          <icon-recording />
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
          <icon-dialpad-glyph />
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
          <icon-mic-on />
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
          <icon-mic-on />
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
          <icon-recording />
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
          <icon-person />
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
          <icon-play />
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
          <icon-star />
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
          <icon-dialpad-glyph />
        </template>
        <template #tooltip>
          Rounded button
        </template>
      </dt-recipe-callbar-button>
    </div>
  </div>
</template>

<script>
import DtRecipeCallbarButton from './callbar_button';
import IconDialpadGlyph from '@dialpad/dialtone/lib/dist/vue/icons/IconDialpadGlyph';
import IconMicOn from '@dialpad/dialtone/lib/dist/vue/icons/IconMicOn';
import IconRecording from '@dialpad/dialtone/lib/dist/vue/icons/IconRecording';
import IconPerson from '@dialpad/dialtone/lib/dist/vue/icons/IconPerson';
import IconPlay from '@dialpad/dialtone/lib/dist/vue/icons/IconPlay';
import IconStar from '@dialpad/dialtone/lib/dist/vue/icons/IconStar';
import IconAi from '@dialpad/dialtone/lib/dist/vue/icons/IconAiGlyph.vue';

export default {
  name: 'DtRecipeCallbarButtonVariants',
  components: {
    DtRecipeCallbarButton,
    IconDialpadGlyph,
    IconMicOn,
    IconRecording,
    IconPerson,
    IconPlay,
    IconStar,
    IconAi,
  },
};
</script>
