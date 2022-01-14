<template>
  <div class="d-d-flex d-fw-wrap d-w100p d-flg12 d-fl-col4">
    <dt-popover
      :open="openAlignmentLeft"
      fixed-alignment="left"
      width-content="anchor"
      class="d-mr12"
      @update:open="openAlignmentLeft = $event"
    >
      <template #anchor="{ attrs }">
        <dt-button
          v-bind="attrs"
          @click="openAlignmentLeft = !openAlignmentLeft"
        >
          Fixed alignment left
        </dt-button>
      </template>
      <template #content>
        <div class="d-fs14 d-m0">
          <p
            v-if="content"
            v-html="content"
          />
          <div v-else>
            <dt-button
              @click="openAlignmentLeft = !openAlignmentLeft"
            >
              Click to close
            </dt-button>
          </div>
        </div>
      </template>
    </dt-popover>
    <dt-popover
      :open="openAlignmentRight"
      fixed-alignment="right"
      width-content="anchor"
      class="d-mr12"
      @update:open="openAlignmentRight = $event"
    >
      <template #anchor="{ attrs }">
        <dt-button
          v-bind="attrs"
          @click="openAlignmentRight = !openAlignmentRight"
        >
          Fixed alignment right
        </dt-button>
      </template>
      <template #content>
        <div class="d-fs14 d-m0">
          <p
            v-if="content"
            v-html="content"
          />
          <div v-else>
            <dt-button
              @click="openAlignmentRight = !openAlignmentRight"
            >
              Click to close
            </dt-button>
          </div>
        </div>
      </template>
    </dt-popover>
    <dt-popover
      :open="openPopoverWithNoPadding"
      padding="none"
      fixed-alignment="right"
      width-content="anchor"
      class="d-mr12"
      @update:open="openPopoverWithNoPadding = $event"
    >
      <template #anchor="{ attrs }">
        <dt-button
          v-bind="attrs"
          @click="openPopoverWithNoPadding = !openPopoverWithNoPadding"
        >
          No padding
        </dt-button>
      </template>
      <template #content>
        <div class="d-fs14 d-m0">
          <p
            v-if="content"
            v-html="content"
          />
          <div v-else>
            <dt-button
              @click="openPopoverWithNoPadding = !openPopoverWithNoPadding"
            >
              Click to close
            </dt-button>
          </div>
        </div>
      </template>
    </dt-popover>
    <dt-popover
      :open="openWithOverlay"
      :modal="true"
      fixed-alignment="right"
      width-content="anchor"
      class="d-mr12"
      @update:open="openWithOverlay = $event"
    >
      <template #anchor="{ attrs }">
        <dt-button
          v-bind="attrs"
          @click="openWithOverlay = !openWithOverlay"
        >
          Overlay Modal
        </dt-button>
      </template>
      <template #content>
        <div class="d-fs14 d-m0">
          <p
            v-if="content"
            v-html="content"
          />
          <div v-else>
            <dt-button
              @click="openWithOverlay = !openWithOverlay"
            >
              Click to close
            </dt-button>
          </div>
        </div>
      </template>
    </dt-popover>
    <dt-popover
      :open="openPopoverWithHeader"
      :show-close-button="true"
      :fixed-header="isHeaderFixed"
      title="Potential Title"
      content-class="d-pl12 d-pr16"
      class="d-mr12"
      max-height="20rem"
      max-width="50rem"
      :close-button-props="{
        ariaLabel: 'Close popover',
      }"
      @update:open="openPopoverWithHeader = $event"
    >
      <template #anchor="{ attrs }">
        <dt-button
          v-bind="attrs"
          @click="openPopoverWithHeader = !openPopoverWithHeader"
        >
          Popover header, custom width and height
        </dt-button>
      </template>
      <template #content>
        <div class="d-fs14 d-m0">
          <div>
            <dt-button
              @click="isHeaderFixed = !isHeaderFixed"
            >
              Click to make header {{ isHeaderFixed ? "not fixed" : "fixed" }}
            </dt-button>
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore,
            maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis
            obcaecati quibusdam repudiandae.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore,
            maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis
            obcaecati quibusdam repudiandae.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur delectus distinctio id iure labore,
            maiores mollitia reprehenderit sunt tempore veritatis. Aliquam delectus earum ex, expedita ipsam nobis
            obcaecati quibusdam repudiandae.
          </p>
        </div>
      </template>
      <template #headerActions>
        <dt-button
          circle
          class="d-p6 d-bc-transparent"
          importance="outlined"
        >
          <template #icon>
            <icon-launch
              class="d-svg--size20"
            />
          </template>
        </dt-button>

        <dt-button
          circle
          class="d-p6 d-bc-transparent"
          importance="outlined"
        >
          <template #icon>
            <icon-menu-vertical
              class="d-svg--size20"
            />
          </template>
        </dt-button>
      </template>
    </dt-popover>
  </div>
</template>

<script>
import { DtPopover } from './';
import { DtButton } from '../button';
import IconMenuVertical from '@dialpad/dialtone/lib/dist/vue/icons/IconMenuVertical';
import IconLaunch from '@dialpad/dialtone/lib/dist/vue/icons/IconLaunch';

export default {
  name: 'PopoverDefaultStory',
  components: {
    DtPopover,
    DtButton,
    IconMenuVertical,
    IconLaunch,
  },

  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      openAlignmentRight: false,
      openAlignmentLeft: false,
      openWithOverlay: false,
      openPopoverWithHeader: false,
      openPopoverWithNoPadding: false,
      isHeaderFixed: false,
      isOpen: this.open || false,
    };
  },

  watch: {
    open (isOpen) {
      this.isOpen = isOpen;
    },
  },
};
</script>
