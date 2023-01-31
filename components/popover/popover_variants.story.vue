<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<!-- eslint-disable max-lines -->
<template>
  <div class="d-d-flex d-jc-space-between d-fw-wrap d-w100p d-flg12 d-fl-col2">
    <dt-popover
      :open="$attrs.open"
      :modal="$attrs.modal"
      :hide-on-click="$attrs.hideOnClick"
      width-content="anchor"
      placement="bottom-start"
      initial-focus-element="first"
      class="d-mb128"
    >
      <template
        #anchor="{ attrs }"
      >
        <dt-button
          v-bind="attrs"
        >
          bottom-end placement
        </dt-button>
      </template>
      <template #content="{ close }">
        <div>
          <p class="d-mb4">
            I will be displayed in the popover!
          </p>
          <dt-button
            @click="close"
          >
            Click to close
          </dt-button>
        </div>
      </template>
    </dt-popover>
    <dt-popover
      :open="$attrs.open"
      :modal="$attrs.modal"
      :hide-on-click="$attrs.hideOnClick"
      width-content="anchor"
      initial-focus-element="first"
      class="d-mb128 d-jc-flex-end"
    >
      <template
        #anchor="{ attrs }"
      >
        <dt-button
          v-bind="attrs"
        >
          bottom-start placement
        </dt-button>
      </template>
      <template #content="{ close }">
        <div>
          <p class="d-mb4">
            I will be displayed in the popover!
          </p>
          <dt-button
            @click="close"
          >
            Click to close
          </dt-button>
        </div>
      </template>
    </dt-popover>
    <dt-popover
      :open="$attrs.open"
      :modal="$attrs.modal"
      :hide-on-click="$attrs.hideOnClick"
      padding="none"
      width-content="anchor"
      initial-focus-element="first"
      class="d-mb128"
    >
      <template
        #anchor="{ attrs }"
      >
        <dt-button
          v-bind="attrs"
        >
          No padding
        </dt-button>
      </template>
      <template #content="{ close }">
        <div class="d-fs-200 d-m0">
          <div>
            <dt-button
              @click="close"
            >
              Click to close
            </dt-button>
          </div>
        </div>
      </template>
    </dt-popover>
    <dt-popover
      :open="$attrs.open"
      :modal="modal || false"
      :hide-on-click="hideOnClick"
      width-content="anchor"
      class="d-jc-flex-end"
    >
      <template
        #anchor="{ attrs }"
      >
        <dt-button
          v-bind="attrs"
        >
          Non-Modal
        </dt-button>
      </template>
      <template #content="{ close }">
        <div>
          <p class="d-mb4">
            I will be displayed in the popover!
          </p>
          <dt-button
            @click="close"
          >
            Click to close
          </dt-button>
        </div>
      </template>
    </dt-popover>
    <dt-popover
      :open="$attrs.open"
      :modal="$attrs.modal"
      :hide-on-click="$attrs.hideOnClick"
      class="d-mb128"
      :show-close-button="true"
      placement="bottom-start"
      header-class="d-d-flex d-ai-center d-jc-space-between"
      initial-focus-element="first"
      max-height="20rem"
      max-width="50rem"
      :close-button-props="{
        ariaLabel: 'Close popover',
      }"
    >
      <template #anchor="{ attrs }">
        <dt-tooltip>
          <template #anchor>
            <dt-button
              v-bind="attrs"
            >
              Popover with header and anchor tooltip
            </dt-button>
          </template>
          This is a test tooltip
        </dt-tooltip>
      </template>
      <template #headerContent>
        <div>
          Potential Title
        </div>
        <div>
          <dt-button
            circle
            class="d-p6 d-bc-transparent"
            importance="outlined"
          >
            <template #icon>
              <dt-icon
                name="external-link"
                size="300"
              />
            </template>
          </dt-button>

          <dt-button
            circle
            class="d-p6 d-bc-transparent"
            importance="outlined"
          >
            <template #icon>
              <dt-icon
                name="more-vertical"
                size="300"
              />
            </template>
          </dt-button>
        </div>
      </template>
      <template #content>
        <div class="d-stack8">
          <p>
            {{ sampleText }}
          </p>
          <p>
            {{ sampleText }}
          </p>
          <p>
            {{ sampleText }}
          </p>
        </div>
      </template>
    </dt-popover>

    <dt-popover
      :open="$attrs.open"
      :modal="$attrs.modal"
      :hide-on-click="$attrs.hideOnClick"
      class="d-mb128 d-jc-flex-end"
      :show-close-button="true"
      max-height="20rem"
      max-width="50rem"
      initial-focus-element="first"
      :close-button-props="{
        ariaLabel: 'Close popover',
      }"
    >
      <template #anchor="{ attrs }">
        <dt-button
          v-bind="attrs"
        >
          Popover with close
        </dt-button>
      </template>
      <template #content>
        <div class="d-stack8">
          <p>
            {{ sampleText }}
          </p>
          <p>
            {{ sampleText }}
          </p>
          <p>
            {{ sampleText }}
          </p>
        </div>
      </template>
    </dt-popover>

    <dt-popover
      :open="$attrs.open"
      :modal="$attrs.modal"
      :hide-on-click="$attrs.hideOnClick"
      class="d-my128"
      max-height="20rem"
      max-width="50rem"
      initial-focus-element="first"
      :close-button-props="{
        ariaLabel: 'Close popover',
      }"
    >
      <template #anchor="{ attrs }">
        <dt-button
          v-bind="attrs"
        >
          Popover with footer
        </dt-button>
      </template>
      <template #footerContent>
        <div>This is a footer</div>
      </template>
      <template #content>
        <div class="d-stack8">
          <p>
            {{ sampleText }}
          </p>
          <p>
            {{ sampleText }}
          </p>
          <p>
            {{ sampleText }}
          </p>
        </div>
      </template>
    </dt-popover>

    <dt-popover
      :open="$attrs.open"
      :modal="$attrs.modal"
      :hide-on-click="$attrs.hideOnClick"
      content-class="d-pl12 d-pr16"
      initial-focus-element="first"
      class="d-my128 d-jc-flex-end"
      max-height="15rem"
      max-width="50rem"
    >
      <template #anchor="{ attrs }">
        <dt-button
          v-bind="attrs"
        >
          Popover with dropdown
        </dt-button>
      </template>
      <template #content>
        <div class="d-stack8">
          <p>
            {{ sampleText }}
          </p>
          <dt-dropdown
            :open="$attrs.open"
            max-height="13rem"
          >
            <template #anchor="{ attrs }">
              <dt-button
                v-bind="attrs"
              >
                Open dropdown
              </dt-button>
            </template>
            <template #list="{ close }">
              <dt-list-item
                key="pd-1"
                navigation-type="arrow-keys"
                role="menuitem"
                @click="close"
              >
                Item 1
              </dt-list-item>
              <dt-list-item
                key="pd-2"
                navigation-type="arrow-keys"
                role="menuitem"
                @click="close"
              >
                Item 2 Item 2 Item 2
              </dt-list-item>
              <dt-list-item
                key="pd-3"
                navigation-type="arrow-keys"
                role="menuitem"
                @click="close"
              >
                Item 3
              </dt-list-item>
              <dt-list-item
                key="pd-4"
                navigation-type="arrow-keys"
                role="menuitem"
                @click="close"
              >
                Item 4
              </dt-list-item>
              <dt-list-item
                key="pd-5"
                navigation-type="arrow-keys"
                role="menuitem"
                @click="close"
              >
                Item 5
              </dt-list-item>
              <dt-list-item
                key="pd-6"
                navigation-type="arrow-keys"
                role="menuitem"
                @click="close"
              >
                Item 6
              </dt-list-item>
            </template>
          </dt-dropdown>
        </div>
      </template>
    </dt-popover>

    <dt-popover
      :open="$attrs.open"
      :modal="$attrs.modal"
      :hide-on-click="$attrs.hideOnClick"
      content-class="d-pl12 d-pr16"
      class="d-my128"
      initial-focus-element="first"
      max-height="20rem"
      max-width="50rem"
    >
      <template #anchor="{ attrs }">
        <dt-button
          v-bind="attrs"
        >
          Popover with tooltip
        </dt-button>
      </template>
      <template #content>
        <div class="d-stack8">
          <p>
            {{ sampleText }}
          </p>
          <dt-tooltip :show="$attrs.open">
            <template #anchor>
              <dt-button>
                Hover me
              </dt-button>
            </template>
            This is the tooltip content
          </dt-tooltip>
        </div>
      </template>
    </dt-popover>

    <dt-popover
      v-model:open="openPopoverWithTriggerOverride"
      :modal="$attrs.modal || false"
      :hide-on-click="$attrs.hideOnClick"
      content-class="d-pl12 d-pr16"
      class="d-my128 d-jc-flex-end"
      max-height="20rem"
      max-width="50rem"
    >
      <template #anchor="{ attrs }">
        <!-- eslint-disable-next-line vuejs-accessibility/mouse-events-have-key-events -->
        <dt-button
          v-bind="attrs"
          @mouseenter="onMouseEnter"
          @mouseleave="onMouseLeave"
        >
          Popover with mouseenter trigger
        </dt-button>
      </template>
      <template #content>
        <p>
          {{ sampleText }}
        </p>
      </template>
    </dt-popover>
  </div>
</template>

<script>
import { DtPopover } from './';
import { DtButton } from '@/components/button';
import { DtDropdown } from '@/components/dropdown';
import { DtListItem } from '@/components/list_item';
import { DtTooltip } from '@/components/tooltip';
import { DtIcon } from '@/components/icon';

export default {
  name: 'PopoverVariantsStory',
  components: {
    DtPopover,
    DtButton,
    DtDropdown,
    DtTooltip,
    DtIcon,
    DtListItem,
  },

  data () {
    return {
      openPopoverWithTriggerOverride: this.$attrs.open,
      sampleText: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Consequuntur delectus distinctio id iure labore,
            maiores mollitia reprehenderit sunt tempore veritatis.
            Aliquam delectus earum ex, expedita ipsam nobis
            obcaecati quibusdam repudiandae.`,
    };
  },

  methods: {
    onMouseEnter () {
      this.openPopoverWithTriggerOverride = true;
    },

    onMouseLeave () {
      this.openPopoverWithTriggerOverride = false;
    },
  },
};
</script>
