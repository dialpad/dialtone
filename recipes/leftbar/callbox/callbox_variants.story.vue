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
        <span>06:01</span>
      </template>
      <template #right>
        <dt-button
          aria-label="toggle dialpad ai"
          circle
          importance="clear"
        >
          <template #icon>
            <dt-icon
              name="dialpad-ai-color"
              size="400"
            />
          </template>
        </dt-button>
        <dt-button
          aria-label="hang call"
          circle
          importance="clear"
          kind="danger"
        >
          <template #icon>
            <dt-icon
              name="phone-hang-up"
              size="400"
            />
          </template>
        </dt-button>
      </template>
    </dt-recipe-callbox>
    <dt-recipe-callbox
      title="1 Participant"
      avatar-seed="1 Participant"
    >
      <template #subtitle>
        <span>06:01</span>
      </template>
      <template #right>
        <dt-button
          aria-label="toggle mic"
          circle
          importance="clear"
        >
          <template #icon>
            <dt-icon
              name="mic"
              size="400"
            />
          </template>
        </dt-button>
        <dt-button
          aria-label="toggle video"
          circle
          importance="clear"
        >
          <template #icon>
            <dt-icon
              name="video"
              size="400"
            />
          </template>
        </dt-button>
        <dt-button
          aria-label="hang call"
          circle
          importance="clear"
          kind="danger"
        >
          <template #icon>
            <dt-icon
              name="phone-hang-up"
              size="400"
            />
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
          src="/common/assets/chatting-person-example.png"
          alt="person avatar"
          class="callbox-image"
        >
      </template>
      <template #subtitle>
        <span>06:01</span>
      </template>
      <template #right>
        <dt-button
          aria-label="toggle mic"
          circle
          importance="clear"
        >
          <template #icon>
            <dt-icon
              name="mic"
              size="400"
            />
          </template>
        </dt-button>
        <dt-button
          aria-label="toggle video"
          circle
          importance="clear"
        >
          <template #icon>
            <dt-icon
              name="video"
              size="400"
            />
          </template>
        </dt-button>
        <dt-button
          aria-label="hang call"
          circle
          importance="clear"
          kind="danger"
        >
          <template #icon>
            <dt-icon
              name="phone-hang-up"
              size="400"
            />
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
        <span>06:01</span>
      </template>
      <template #right>
        <dt-button
          aria-label="toggle dialpad ai"
          circle
          importance="clear"
        >
          <template #icon>
            <dt-icon
              name="dialpad-ai-color"
              size="400"
            />
          </template>
        </dt-button>
        <dt-button
          aria-label="hang call"
          circle
          importance="clear"
          kind="danger"
        >
          <template #icon>
            <dt-icon
              name="phone-hang-up"
              size="400"
            />
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
          <dt-icon
            name="share-screen"
            size="100"
          />
          <span>06:01</span>
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
            <dt-icon
              name="share-screen"
              size="400"
            />
          </template>
        </dt-button>
        <dt-button
          aria-label="toggle dialpad ai"
          circle
          importance="clear"
        >
          <template #icon>
            <dt-icon
              name="dialpad-ai-color"
              size="400"
            />
          </template>
        </dt-button>
        <dt-button
          aria-label="hang call"
          circle
          importance="clear"
          kind="danger"
        >
          <template #icon>
            <dt-icon
              name="phone-hang-up"
              size="400"
            />
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
          <dt-icon
            name="share-screen"
            size="100"
          />
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
            <dt-icon
              name="stop-filled"
              size="300"
            />
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
            <dt-icon
              name="users"
              size="100"
              class="d-mr2"
            />
            <span>3</span>
          </dt-stack>
          <span class="d-fs-300">
            •
          </span>
          <dt-stack
            direction="row"
            class="d-ai-center d-of-x-hidden"
          >
            <dt-icon
              name="activity"
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
            <dt-icon
              name="mic"
              size="300"
            />
          </template>
        </dt-button>
        <dt-button
          aria-label="hang call"
          circle
          importance="clear"
          kind="danger"
        >
          <template #icon>
            <dt-icon
              name="phone-hang-up"
              size="400"
            />
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
          <dt-icon
            name="share-screen"
            size="100"
          />
          <span>06:01</span>
        </dt-stack>
      </template>
      <template #right>
        <dt-button
          aria-label="toggle dialpad ai"
          circle
          importance="clear"
        >
          <template #icon>
            <dt-icon
              name="dialpad-ai-color"
              size="400"
            />
          </template>
        </dt-button>
        <dt-button
          aria-label="hang call"
          circle
          importance="clear"
          kind="danger"
        >
          <template #icon>
            <dt-icon
              name="phone-hang-up"
              size="400"
            />
          </template>
        </dt-button>
      </template>
      <template #bottom>
        <dt-item-layout>
          <template #default>
            <div class="d-d-flex d-ai-center">
              <dt-icon
                class="d-mr8"
                name="share-screen"
                size="400"
              />
              <span class="d-fs-100">Sharing screen</span>
            </div>
          </template>
          <template #right>
            <dt-button
              aria-label="stop call"
              importance="clear"
              kind="danger"
            >
              <template #icon>
                <dt-icon
                  name="stop-filled"
                  size="300"
                />
              </template>
              Stop
            </dt-button>
          </template>
        </dt-item-layout>
      </template>
    </dt-recipe-callbox>
  </div>
</template>

<script>
import DtRecipeCallbox from './callbox.vue';
import DtButton from '@/components/button/button.vue';
import DtIcon from '@/components/icon/icon.vue';
import DtItemLayout from '@/components/item_layout/item_layout.vue';
import DtStack from '@/components/stack/stack.vue';

export default {
  name: 'DtRecipeCallboxVariants',
  components: { DtStack, DtItemLayout, DtIcon, DtButton, DtRecipeCallbox },
  emits: [
    /**
     * Add click event here to prevent story from emitting clicks on Vue 3
     */
    'click',
  ],
};
</script>

<style lang="less" scoped>
.callbox-image {
  height: 140px;
  object-fit: cover;
  width: 100%;
}
</style>
