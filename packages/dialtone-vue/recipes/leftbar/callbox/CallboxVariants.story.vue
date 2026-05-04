<!-- eslint-disable max-lines -->
<template>
  <dt-stack gap="200">
    <dt-recipe-callbox
      avatar-full-name="Jaqueline Nackos"
      avatar-seed="Jaqueline Nackos"
      header-text="Jaqueline Nackos"
      border-color="ai"
    >
      <template #subtitle>
        <span class="d-fvn-tabular">06:01</span>
      </template>
      <template #end>
        <dt-button
          v-dt-tooltip="`Dialpad AI`"
          aria-label="toggle dialpad AI"
          importance="clear"
          kind="muted"
        >
          <template #icon="{ iconSize }">
            <dt-icon-dialpad-sparkle :size="iconSize" />
          </template>
        </dt-button>
        <dt-button
          v-dt-tooltip="`Hang up`"
          aria-label="hang call"
          importance="clear"
          kind="critical"
        >
          <template #icon="{ iconSize }">
            <dt-icon-phone-hang-up :size="iconSize" />
          </template>
        </dt-button>
      </template>
    </dt-recipe-callbox>
    <dt-recipe-callbox
      header-text="1 Participant"
      avatar-seed="1 Participant"
    >
      <template #subtitle>
        <span class="d-fvn-tabular">06:01</span>
      </template>
      <template #end>
        <dt-button
          v-dt-tooltip="`Mute`"
          aria-label="toggle mic"
          importance="clear"
          kind="muted"
        >
          <template #icon="{ iconSize }">
            <dt-icon-mic :size="iconSize" />
          </template>
        </dt-button>
        <dt-button
          v-dt-tooltip="`Video`"
          aria-label="toggle video"
          importance="clear"
          kind="muted"
        >
          <template #icon="{ iconSize }">
            <dt-icon-video :size="iconSize" />
          </template>
        </dt-button>
        <dt-button
          v-dt-tooltip="`Hang up`"
          aria-label="hang call"
          importance="clear"
          kind="critical"
        >
          <template #icon="{ iconSize }">
            <dt-icon-phone-hang-up :size="iconSize" />
          </template>
        </dt-button>
      </template>
    </dt-recipe-callbox>
    <dt-recipe-callbox
      header-text="1 Participant"
      avatar-seed="1 Participant"
    >
      <template #video>
        <img
          :src="chattingPersonImage"
          alt="person avatar"
          class="callbox-image"
        >
      </template>
      <template #subtitle>
        <span class="d-fvn-tabular">06:01</span>
      </template>
      <template #end>
        <dt-button
          v-dt-tooltip="`Mute`"
          aria-label="toggle mic"
          importance="clear"
          kind="muted"
        >
          <template #icon="{ iconSize }">
            <dt-icon-mic :size="iconSize" />
          </template>
        </dt-button>
        <dt-button
          v-dt-tooltip="`Video`"
          aria-label="toggle video"
          importance="clear"
          kind="muted"
        >
          <template #icon="{ iconSize }">
            <dt-icon-video :size="iconSize" />
          </template>
        </dt-button>
        <dt-button
          v-dt-tooltip="`Hang up`"
          aria-label="hang call"
          importance="clear"
          kind="critical"
        >
          <template #icon="{ iconSize }">
            <dt-icon-phone-hang-up :size="iconSize" />
          </template>
        </dt-button>
      </template>
    </dt-recipe-callbox>
    <dt-recipe-callbox
      avatar-full-name="Jaqueline Nackos"
      avatar-seed="Jaqueline Nackos"
      header-text="Jaqueline Nackos"
      badge-text="Test_Call_Center"
      badge-color="warning"
      border-color="ai"
    >
      <template #subtitle>
        <span class="d-fvn-tabular">06:01</span>
      </template>
      <template #end>
        <dt-button
          v-dt-tooltip="`Dialpad AI`"
          aria-label="toggle dialpad AI"
          importance="clear"
          kind="muted"
        >
          <template #icon="{ iconSize }">
            <dt-icon-dialpad-sparkle :size="iconSize" />
          </template>
        </dt-button>
        <dt-button
          v-dt-tooltip="`Hang up`"
          aria-label="hang call"
          importance="clear"
          kind="critical"
        >
          <template #icon="{ iconSize }">
            <dt-icon-phone-hang-up :size="iconSize" />
          </template>
        </dt-button>
      </template>
    </dt-recipe-callbox>
    <dt-recipe-callbox
      avatar-full-name="Jaqueline Nackos"
      avatar-seed="Jaqueline Nackos"
      header-text="Jaqueline Nackos"
      border-color="ai"
    >
      <template #subtitle>
        <dt-stack
          direction="row"
          gap="50"
          class="d-ai-center"
        >
          <dt-icon-share-screen size="100" />
          <span class="d-fvn-tabular">06:01</span>
        </dt-stack>
      </template>
      <template #end>
        <dt-button
          v-dt-tooltip="`Share screen`"
          aria-label="share screen"
          importance="clear"
          kind="muted"
        >
          <template #icon="{ iconSize }">
            <dt-icon-share-screen :size="iconSize" />
          </template>
        </dt-button>
        <dt-button
          v-dt-tooltip="`Dialpad AI`"
          aria-label="toggle dialpad AI"
          importance="clear"
          kind="muted"
        >
          <template #icon="{ iconSize }">
            <dt-icon-dialpad-sparkle :size="iconSize" />
          </template>
        </dt-button>
        <dt-button
          v-dt-tooltip="`Hang up`"
          aria-label="hang call"
          importance="clear"
          kind="critical"
        >
          <template #icon="{ iconSize }">
            <dt-icon-phone-hang-up :size="iconSize" />
          </template>
        </dt-button>
      </template>
    </dt-recipe-callbox>
    <dt-recipe-callbox
      avatar-full-name="Jaqueline Nackos"
      header-text="Jaqueline Nackos"
      avatar-seed="Jaqueline Nackos"
      border-color="ai"
    >
      <template #subtitle>
        <dt-stack
          direction="row"
          gap="50"
          class="d-ai-center"
        >
          <dt-icon-share-screen size="100" />
          <p>Screenshare</p>
        </dt-stack>
      </template>
      <template #end>
        <dt-button
          v-dt-tooltip="`Stop`"
          aria-label="stop call"
          importance="clear"
          kind="critical"
        >
          <template #icon="{ iconSize }">
            <dt-icon-stop-filled :size="iconSize" />
          </template>
          Stop
        </dt-button>
      </template>
    </dt-recipe-callbox>
    <dt-recipe-callbox
      avatar-full-name="design-product-lt-so"
      avatar-seed="design-product-lt-so"
      header-text="design-product-lt-so"
      border-color="critical"
      clickable
    >
      <template #subtitle>
        <dt-stack
          direction="row"
          gap="50"
        >
          <dt-stack
            direction="row"
            class="d-ai-center"
          >
            <dt-icon-users
              size="100"
              class="d-mie-25"
            />
            <span>3</span>
          </dt-stack>
          <span
            class="d-body--sm-compact"
            aria-hidden="true"
          >
            •
          </span>
          <dt-stack
            direction="row"
            class="d-ai-center d-of-x-hidden"
          >
            <dt-icon-waveform
              class="voice-chat-icon"
              size="100"
            />
            <p class="d-to-ellipsis d-ws-nowrap d-of-hidden">
              Jaqueline Nackos Jaqueline Nackos
            </p>
          </dt-stack>
        </dt-stack>
      </template>
      <template #end>
        <dt-button
          v-dt-tooltip="`Mute`"
          aria-label="toggle mic"
          importance="clear"
          kind="muted"
        >
          <template #icon="{ iconSize }">
            <dt-icon-mic :size="iconSize" />
          </template>
        </dt-button>
        <dt-button
          v-dt-tooltip="`Hang up`"
          aria-label="hang call"
          importance="clear"
          kind="critical"
        >
          <template #icon="{ iconSize }">
            <dt-icon-phone-hang-up :size="iconSize" />
          </template>
        </dt-button>
      </template>
    </dt-recipe-callbox>
    <dt-recipe-callbox
      avatar-full-name="Jaqueline Nackos"
      avatar-seed="Jaqueline Nackos"
      header-text="Jaqueline Nackos"
      border-color="ai"
    >
      <template #subtitle>
        <dt-stack
          direction="row"
          gap="50"
          class="d-ai-center"
        >
          <dt-icon-share-screen size="100" />
          <span class="d-fvn-tabular">06:01</span>
        </dt-stack>
      </template>
      <template #end>
        <dt-button
          v-dt-tooltip="`Dialpad AI`"
          aria-label="toggle dialpad AI"
          importance="clear"
          kind="muted"
        >
          <template #icon="{ iconSize }">
            <dt-icon-dialpad-sparkle :size="iconSize" />
          </template>
        </dt-button>
        <dt-button
          v-dt-tooltip="`Hang up`"
          aria-label="hang call"
          importance="clear"
          kind="critical"
        >
          <template #icon="{ iconSize }">
            <dt-icon-phone-hang-up :size="iconSize" />
          </template>
        </dt-button>
      </template>
      <template #blockEnd>
        <dt-item-layout
          class="d-py-50 d-px-100"
          content-class="d-ac-center"
          unstyled
        >
          <template #default>
            <dt-stack
              direction="row"
              gap="100"
              class="d-pis-25"
            >
              <dt-stack
                class="d-ai-center d-w-24px"
              >
                <dt-icon-share-screen size="300" />
              </dt-stack>
              <span class="d-body--sm-compact">Sharing screen</span>
            </dt-stack>
          </template>
          <template #end>
            <dt-button
              v-dt-tooltip="`Stop`"
              aria-label="stop call"
              importance="clear"
              kind="critical"
            >
              <template #icon>
                <dt-icon-stop-filled size="300" />
              </template>
              Stop
            </dt-button>
          </template>
        </dt-item-layout>
      </template>
    </dt-recipe-callbox>
    <dt-recipe-callbox
      avatar-full-name="Jaqueline Nackos"
      avatar-seed="Jaqueline Nackos"
      header-text="Jaqueline Nackos"
      is-on-hold
    >
      <template #subtitle>
        <dt-stack
          direction="row"
          gap="50"
          class="d-ai-center"
        >
          <dt-icon-share-screen size="100" />
          <span class="d-fvn-tabular">06:01</span>
        </dt-stack>
      </template>
      <template #end>
        <dt-button
          v-dt-tooltip="`Hang up`"
          aria-label="hang call"
          importance="clear"
          kind="critical"
        >
          <template #icon="{ iconSize }">
            <dt-icon-phone-hang-up :size="iconSize" />
          </template>
        </dt-button>
      </template>
    </dt-recipe-callbox>
  </dt-stack>
</template>

<script>
import DtRecipeCallbox from './callbox.vue';
import DtButton from '@/components/button/button.vue';
import {
  DtIconDialpadSparkle,
  DtIconPhoneHangUp,
  DtIconShareScreen,
  DtIconStopFilled,
  DtIconVideo,
  DtIconMic,
  DtIconUsers,
  DtIconWaveform,
} from '@dialpad/dialtone-icons/vue';
import DtItemLayout from '@/components/item_layout/item_layout.vue';
import DtStack from '@/components/stack/stack.vue';
import chattingPersonImage from '@/common/assets/chatting-person-example.png';

export default {
  name: 'DtRecipeCallboxVariants',
  components: {
    DtStack,
    DtItemLayout,
    DtButton,
    DtRecipeCallbox,
    DtIconDialpadSparkle,
    DtIconPhoneHangUp,
    DtIconShareScreen,
    DtIconStopFilled,
    DtIconVideo,
    DtIconMic,
    DtIconUsers,
    DtIconWaveform,
  },

  emits: [
    /**
     * Add click event here to prevent story from emitting clicks on Vue 3
     */
    'click',
  ],

  data () {
    return {
      chattingPersonImage,
    };
  },
};
</script>

<style lang="less" scoped>
.callbox-image {
  block-size: 140px;
  object-fit: cover;
  inline-size: 100%;
}

.voice-chat-icon {
  color: var(--dt-color-link-primary);
}
</style>
