<template>
  <div>
    <dt-modal
      :header-text="'Overlay components inside a modal'"
      :open="isOpen"
      @update:open="isOpen = $event"
    >
      <template #default>
        <p class="d-mbe-400">
          Both tooltips below sit inside this modal's native
          <code>&lt;dialog&gt;</code>. The first uses the Tooltip default
          <code>appendTo="body"</code>, which detects the ancestor
          <code>&lt;dialog&gt;</code> and stays in the browser's top layer. The
          second forces <code>appendTo</code> to an explicit
          <code>document.body</code> element, which escapes the dialog's top
          layer and renders behind the modal despite matching z-index.
        </p>
        <dt-stack
          direction="row"
          gap="400"
          class="d-mbe-400"
        >
          <dt-tooltip message="I stay above the modal">
            <template #anchor>
              <dt-button>Default appendTo (correct)</dt-button>
            </template>
          </dt-tooltip>
          <dt-tooltip
            message="I render behind the modal"
            :append-to="bodyEl"
          >
            <template #anchor>
              <dt-button kind="critical">
                Forced document.body (bug)
              </dt-button>
            </template>
          </dt-tooltip>
        </dt-stack>

        <p class="d-mbe-200">
          Dropdown and Popover default to <code>modal="true"</code>, which renders
          a click-blocking scrim while open. That scrim now resolves the same
          ancestor-<code>&lt;dialog&gt;</code> target as the overlay's own content, so
          it lands in the same top layer: opening either one below correctly blocks
          clicks on the rest of this modal (try clicking this text while one is open)
          while its own list/content stays clickable.
        </p>
        <dt-stack
          direction="row"
          gap="400"
          align="start"
          class="d-mbe-400"
        >
          <dt-dropdown :modal="true">
            <template #anchor="{ attrs }">
              <dt-button v-bind="attrs">
                Open dropdown
              </dt-button>
            </template>
            <template #list="{ close }">
              <dt-list-item
                v-for="item in dropdownItems"
                :key="item"
                role="menuitem"
                navigation-type="arrow-keys"
                @click="close"
              >
                {{ item }}
              </dt-list-item>
            </template>
          </dt-dropdown>

          <dt-popover placement="bottom-start">
            <template #anchor="{ attrs }">
              <dt-button v-bind="attrs">
                Open popover
              </dt-button>
            </template>
            <template #content="{ close }">
              <p class="d-mbe-50">
                Popover inside a modal
              </p>
              <dt-button @click="close">
                Close
              </dt-button>
            </template>
          </dt-popover>

          <dt-combobox
            :show-list="!!comboboxValue"
            label="Combobox"
            show-label
          >
            <template #input="{ inputProps }">
              <dt-input
                v-model="comboboxValue"
                v-bind="inputProps"
                placeholder="Type to filter"
              />
            </template>
            <template #list="{ listProps }">
              <ol
                v-bind="listProps"
                class="d-p-0 d-mbs-100"
              >
                <dt-list-item
                  v-for="item in comboboxItems"
                  :key="item"
                  role="option"
                  navigation-type="arrow-keys"
                  @click="comboboxValue = item"
                >
                  {{ item }}
                </dt-list-item>
              </ol>
            </template>
          </dt-combobox>
        </dt-stack>

        <p class="d-mbe-200">
          ImageViewer inside the modal: its <code>appendTo</code> now detects the
          ancestor <code>&lt;dialog&gt;</code> the same way Tooltip/Popover do, so the
          full-size view stays in the top layer instead of rendering hidden behind
          this modal.
        </p>
        <dt-image-viewer
          :image-src="imageSrc"
          image-alt="Example preview image"
          aria-label="Open example image"
          image-button-class="overlays-story__thumbnail"
        />
      </template>
    </dt-modal>
    <dt-button @click="isOpen = !isOpen">
      Click to open
    </dt-button>
  </div>
</template>

<script>
import DtModal from './Modal.vue';
import DtTooltip from '../Tooltip/Tooltip.vue';
import { DtButton } from '../Button';
import { DtStack } from '../Stack';
import { DtDropdown } from '../Dropdown';
import { DtPopover } from '../Popover';
import { DtCombobox } from '../Combobox';
import { DtInput } from '../Input';
import { DtListItem } from '../ListItem';
import { DtImageViewer } from '../ImageViewer';
import imageSrc from '@/common/assets/test.jpg?url';

export default {
  name: 'DtModalWithOverlays',

  components: {
    DtModal,
    DtTooltip,
    DtButton,
    DtStack,
    DtDropdown,
    DtPopover,
    DtCombobox,
    DtInput,
    DtListItem,
    DtImageViewer,
  },

  data () {
    return {
      isOpen: this.$attrs.open,
      bodyEl: document.body,
      comboboxValue: '',
      dropdownItems: ['First item', 'Second item', 'Third item'],
      comboboxItems: ['Apple', 'Banana', 'Cherry'],
      imageSrc,
    };
  },
};
</script>

<style>
.overlays-story__thumbnail {
  max-inline-size: 96px;
  max-block-size: 96px;
  object-fit: cover;
}
</style>
