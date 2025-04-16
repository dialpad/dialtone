<!-- eslint-disable max-lines -->
<template>
  <div class="d-stack16">
    <dt-recipe-callbox
      avatar-full-name="Jaqueline Nackos"
      avatar-seed="Jaqueline Nackos"
      title="Jaqueline Nackos"
      border-color="ai"
    >
      <template #subtitle>
        <span class="d-fvn-tabular">06:01</span>
      </template>
      <template #right>
        <dt-button
          aria-label="toggle dialpad ai"
          circle
          importance="clear"
        >
          <template #icon>
            <dt-icon-dialpad-sparkle size="400" />
          </template>
        </dt-button>
        <dt-button
          aria-label="hang call"
          circle
          importance="clear"
          kind="danger"
        >
          <template #icon>
            <dt-icon-phone-hang-up size="400" />
          </template>
        </dt-button>
      </template>
    </dt-recipe-callbox>
    <dt-recipe-callbox
      title="1 Participant"
      avatar-seed="1 Participant"
    >
      <template #subtitle>
        <span class="d-fvn-tabular">06:01</span>
      </template>
      <template #right>
        <dt-button
          aria-label="toggle mic"
          circle
          importance="clear"
        >
          <template #icon>
            <dt-icon-mic size="400" />
          </template>
        </dt-button>
        <dt-button
          aria-label="toggle video"
          circle
          importance="clear"
        >
          <template #icon>
            <dt-icon-video size="400" />
          </template>
        </dt-button>
        <dt-button
          aria-label="hang call"
          circle
          importance="clear"
          kind="danger"
        >
          <template #icon>
            <dt-icon-phone-hang-up size="400" />
          </template>
        </dt-button>
      </template>
    </dt-recipe-callbox>
    <dt-recipe-callbox
      title="1 Participant"
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
      <template #right>
        <dt-button
          aria-label="toggle mic"
          circle
          importance="clear"
        >
          <template #icon>
            <dt-icon-mic size="400" />
          </template>
        </dt-button>
        <dt-button
          aria-label="toggle video"
          circle
          importance="clear"
        >
          <template #icon>
            <dt-icon-video size="400" />
          </template>
        </dt-button>
        <dt-button
          aria-label="hang call"
          circle
          importance="clear"
          kind="danger"
        >
          <template #icon>
            <dt-icon-phone-hang-up size="400" />
          </template>
        </dt-button>
      </template>
    </dt-recipe-callbox>
    <dt-recipe-callbox
      avatar-full-name="Jaqueline Nackos"
      avatar-seed="Jaqueline Nackos"
      title="Jaqueline Nackos"
      badge-text="Test_Call_Center"
      badge-color="warning"
      border-color="ai"
    >
      <template #subtitle>
        <span class="d-fvn-tabular">06:01</span>
      </template>
      <template #right>
        <dt-button
          aria-label="toggle dialpad ai"
          circle
          importance="clear"
        >
          <template #icon>
            <dt-icon-dialpad-sparkle size="400" />
          </template>
        </dt-button>
        <dt-button
          aria-label="hang call"
          circle
          importance="clear"
          kind="danger"
        >
          <template #icon>
            <dt-icon-phone-hang-up size="400" />
          </template>
        </dt-button>
      </template>
    </dt-recipe-callbox>
    <dt-recipe-callbox
      avatar-full-name="Jaqueline Nackos"
      avatar-seed="Jaqueline Nackos"
      title="Jaqueline Nackos"
      border-color="ai"
    >
      <template #subtitle>
        <dt-stack
          direction="row"
          gap="300"
          class="d-ai-center"
        >
          <dt-icon-share-screen size="100" />
          <span class="d-fvn-tabular">06:01</span>
        </dt-stack>
      </template>
      <template #right>
        <dt-button
          aria-label="share screen"
          circle
          importance="clear"
          kind="muted"
        >
          <template #icon>
            <dt-icon-share-screen size="400" />
          </template>
        </dt-button>
        <dt-button
          aria-label="toggle dialpad ai"
          circle
          importance="clear"
        >
          <template #icon>
            <dt-icon-dialpad-sparkle size="400" />
          </template>
        </dt-button>
        <dt-button
          aria-label="hang call"
          circle
          importance="clear"
          kind="danger"
        >
          <template #icon>
            <dt-icon-phone-hang-up size="400" />
          </template>
        </dt-button>
      </template>
    </dt-recipe-callbox>
    <dt-recipe-callbox
      avatar-full-name="Jaqueline Nackos"
      title="Jaqueline Nackos"
      avatar-seed="Jaqueline Nackos"
      border-color="ai"
    >
      <template #subtitle>
        <dt-stack
          direction="row"
          gap="300"
          class="d-ai-center"
        >
          <dt-icon-share-screen size="100" />
          <p>Screenshare</p>
        </dt-stack>
      </template>
      <template #right>
        <dt-button
          aria-label="stop call"
          importance="clear"
          kind="danger"
        >
          <template #icon>
            <dt-icon-stop-filled size="300" />
          </template>
          Stop
        </dt-button>
      </template>
    </dt-recipe-callbox>
    <dt-recipe-callbox
      avatar-full-name="design-product-lt-so"
      avatar-seed="design-product-lt-so"
      title="design-product-lt-so"
      border-color="critical"
      clickable
    >
      <template #subtitle>
        <dt-stack
          direction="row"
          gap="300"
        >
          <dt-stack
            direction="row"
            class="d-ai-center"
          >
            <dt-icon-users
              size="100"
              class="d-mr2"
            />
            <span>3</span>
          </dt-stack>
          <span
            class="d-body--sm-compact"
            aria-hidden="true"
          >
            &bull;
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
      <template #right>
        <dt-button
          aria-label="toggle mic"
          importance="clear"
          kind="muted"
          circle
        >
          <template #icon>
            <dt-icon-mic size="300" />
          </template>
        </dt-button>
        <dt-button
          aria-label="hang call"
          circle
          importance="clear"
          kind="danger"
        >
          <template #icon>
            <dt-icon-phone-hang-up size="400" />
          </template>
        </dt-button>
      </template>
    </dt-recipe-callbox>
    <dt-recipe-callbox
      avatar-full-name="Jaqueline Nackos"
      avatar-seed="Jaqueline Nackos"
      title="Jaqueline Nackos"
      border-color="ai"
    >
      <template #subtitle>
        <dt-stack
          direction="row"
          gap="300"
          class="d-ai-center"
        >
          <dt-icon-share-screen size="100" />
          <span class="d-fvn-tabular">06:01</span>
        </dt-stack>
      </template>
      <template #right>
        <dt-button
          aria-label="toggle dialpad ai"
          circle
          importance="clear"
        >
          <template #icon>
            <dt-icon-dialpad-sparkle size="400" />
          </template>
        </dt-button>
        <dt-button
          aria-label="hang call"
          circle
          importance="clear"
          kind="danger"
        >
          <template #icon>
            <dt-icon-phone-hang-up size="400" />
          </template>
        </dt-button>
      </template>
      <template #bottom>
        <dt-item-layout
          class="d-py4 d-px8"
          content-class="d-ac-center"
          unstyled
        >
          <template #default>
            <dt-stack
              direction="row"
              gap="400"
              class="d-pl2"
            >
              <dt-stack
                class="d-ai-center d-w24"
              >
                <dt-icon-share-screen size="400" />
              </dt-stack>
              <span class="d-body--sm-compact">Sharing screen</span>
            </dt-stack>
          </template>
          <template #right>
            <dt-button
              aria-label="stop call"
              importance="clear"
              kind="danger"
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
      title="Jaqueline Nackos"
      is-on-hold
    >
      <template #subtitle>
        <dt-stack
          direction="row"
          gap="300"
          class="d-ai-center"
        >
          <dt-icon-share-screen size="100" />
          <span class="d-fvn-tabular">06:01</span>
        </dt-stack>
      </template>
      <template #right>
        <dt-button
          aria-label="hang call"
          circle
          importance="clear"
          kind="danger"
        >
          <template #icon>
            <dt-icon-phone-hang-up size="400" />
          </template>
        </dt-button>
      </template>
    </dt-recipe-callbox>
  </div>
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
} from '@dialpad/dialtone-icons/vue2';
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

  data () {
    return {
      chattingPersonImage,
    };
  },
};
</script>

<style lang="less" scoped>
.callbox-image {
  height: 140px;
  object-fit: cover;
  width: 100%;
}

.voice-chat-icon {
  color: var(--dt-color-purple-400);
}
</style>
