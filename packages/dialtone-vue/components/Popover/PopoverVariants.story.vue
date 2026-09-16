<!-- eslint-disable max-lines -->
<template>
  <div class="d-d-flex d-jc-space-between d-fw-wrap d-w100p d-cg-150 d-fl-col2">
    <dt-popover
      :open="$attrs.open"
      :modal="$attrs.modal"
      :close-on-click="$attrs.closeOnClick"
      :transition="$attrs.transition"
      width-content="anchor"
      placement="bottom-start"
      initial-focus-element="first"
      class="d-mbe-200"
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
          <p class="d-mbe-50">
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
      :close-on-click="$attrs.closeOnClick"
      :transition="$attrs.transition"
      width-content="anchor"
      initial-focus-element="first"
      class="d-mbe-200 d-jc-flex-end"
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
          <p class="d-mbe-50">
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
      :close-on-click="$attrs.closeOnClick"
      :transition="$attrs.transition"
      padding="none"
      width-content="anchor"
      initial-focus-element="first"
      class="d-mbe-200"
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
        <div class="d-fs-200 d-m-0">
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
      :modal="false"
      :close-on-click="$attrs.closeOnClick"
      :transition="$attrs.transition"
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
          <p class="d-mbe-50">
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
      :close-on-click="$attrs.closeOnClick"
      :transition="$attrs.transition"
      class="d-mbe-200"
      :show-close-button="true"
      placement="bottom-start"
      header-class="d-d-flex d-ai-center d-jc-space-between"
      initial-focus-element="first"
      max-height="20rem"
      max-width="50rem"
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
            class="d-p-75 d-bc-transparent"
            importance="outlined"
          >
            <template #startIcon>
              <dt-icon
                name="external-link"
                size="300"
              />
            </template>
          </dt-button>

          <dt-button
            circle
            class="d-p-75 d-bc-transparent"
            importance="outlined"
          >
            <template #startIcon>
              <dt-icon
                name="more-vertical"
                size="300"
              />
            </template>
          </dt-button>
        </div>
      </template>
      <template #content>
        <dt-stack gap="100">
          <p>
            {{ sampleText }}
          </p>
          <p>
            {{ sampleText }}
          </p>
          <p>
            {{ sampleText }}
          </p>
        </dt-stack>
      </template>
    </dt-popover>

    <dt-popover
      :open="$attrs.open"
      :modal="$attrs.modal"
      :close-on-click="$attrs.closeOnClick"
      :transition="$attrs.transition"
      class="d-mbe-200 d-jc-flex-end"
      :show-close-button="true"
      max-height="20rem"
      max-width="50rem"
      initial-focus-element="first"
    >
      <template #anchor="{ attrs }">
        <dt-button
          v-bind="attrs"
        >
          Popover with close
        </dt-button>
      </template>
      <template #content>
        <dt-stack gap="100">
          <p>
            {{ sampleText }}
          </p>
          <p>
            {{ sampleText }}
          </p>
          <p>
            {{ sampleText }}
          </p>
        </dt-stack>
      </template>
    </dt-popover>

    <dt-popover
      :open="$attrs.open"
      :modal="$attrs.modal"
      :transition="$attrs.transition"
      :close-on-click="$attrs.closeOnClick"
      class="d-my-200"
      max-height="20rem"
      max-width="50rem"
      initial-focus-element="first"
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
        <dt-stack gap="100">
          <p>
            {{ sampleText }}
          </p>
          <p>
            {{ sampleText }}
          </p>
          <p>
            {{ sampleText }}
          </p>
        </dt-stack>
      </template>
    </dt-popover>

    <dt-popover
      :open="$attrs.open"
      :modal="$attrs.modal"
      :transition="$attrs.transition"
      :close-on-click="$attrs.closeOnClick"
      content-class="d-pis-150 d-pie-200"
      initial-focus-element="first"
      class="d-my-200 d-jc-flex-end"
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
        <dt-stack gap="100">
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
        </dt-stack>
      </template>
    </dt-popover>

    <dt-popover
      :open="$attrs.open"
      :modal="$attrs.modal"
      :transition="$attrs.transition"
      :close-on-click="$attrs.closeOnClick"
      content-class="d-pis-150 d-pie-200"
      class="d-my-200"
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
        <dt-stack gap="100">
          <p>
            {{ sampleText }}
          </p>
          <dt-tooltip :open="$attrs.open">
            <template #anchor>
              <dt-button>
                Hover me
              </dt-button>
            </template>
            This is the tooltip content
          </dt-tooltip>
        </dt-stack>
      </template>
    </dt-popover>

    <dt-popover
      :modal="false"
      :close-on-click="$attrs.closeOnClick"
      :transition="$attrs.transition"
      content-class="d-pis-150 d-pie-200"
      class="d-my-200 d-jc-flex-end"
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

    <dt-popover>
      <template
        #anchor="{ attrs }"
      >
        <dt-button
          v-if="switchAnchor"
          v-bind="attrs"
        >
          Changing anchor 1
        </dt-button>
        <dt-button
          v-else
          v-bind="attrs"
        >
          Changing anchor 2
        </dt-button>
      </template>
      <template #content>
        <dt-button @click="switchAnchor = !switchAnchor">
          switch anchor
        </dt-button>
      </template>
    </dt-popover>

    <iframe
      title="iframe popover example"
      :src="withURLprefix('?args=&id=components-popover--iframe-test&viewMode=story')"
    />

    <iframe
      title="iframe popover example 2"
      :src="withURLprefix('?args=&id=components-popover--iframe-test&viewMode=story')"
    />
  </div>
</template>

<script>
import { DtPopover } from './';
import { DtButton } from '@/components/Button';
import { DtDropdown } from '@/components/Dropdown';
import { DtListItem } from '@/components/ListItem';
import { DtTooltip } from '@/components/Tooltip';
import { DtIcon } from '@/components/Icon';
import { DtStack } from '@/components/Stack';

export default {
  name: 'PopoverVariantsStory',

  components: {
    DtPopover,
    DtButton,
    DtDropdown,
    DtTooltip,
    DtIcon,
    DtListItem,
    DtStack,
  },

  data () {
    return {
      openPopoverWithTriggerOverride: this.$attrs.open,
      sampleText: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Consequuntur delectus distinctio id iure labore,
            maiores mollitia reprehenderit sunt tempore veritatis.
            Aliquam delectus earum ex, expedita ipsam nobis
            obcaecati quibusdam repudiandae.`,

      switchAnchor: true,
    };
  },

  methods: {
    onMouseEnter () {
      this.openPopoverWithTriggerOverride = true;
    },

    onMouseLeave () {
      this.openPopoverWithTriggerOverride = false;
    },

    withURLprefix (query) {
      return window.location.origin + window.location.pathname + query;
    },
  },
};
</script>
