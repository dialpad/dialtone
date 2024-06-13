<template>
  <dt-list-item
    v-bind="$attrs"
    navigation-type="arrow-keys"
    role="menuitem"
    class="d-w100p f:d-bgc-transparent h:d-bgc-transparent d-bar-pill"
    tabindex="0"
    @click="toggleOpen"
    @focusin="isItemHovered = true"
    @focusout="handleFocusOut"
    @mouseenter="isItemHovered = true"
    @mouseleave="handleFocusOut"
  >
    <template #left>
      <dt-icon
        :name="isOpen ? 'chevron-down' : 'chevron-right'"
        size="300"
      />
    </template>

    <span
      class="d-mr-auto d-truncate d-lh12 d-headline--sm d-fc-tertiary d-us-none"
    >
      {{ text }}
    </span>

    <template #right>
      <dt-button
        v-if="showMarkAsRead && isItemHovered"
        ref="markAsReadButton"
        v-dt-tooltip="markAsReadButtonLabel"
        :aria-label="markAsReadButtonLabel"
        class="d-px0 d-w24 d-h24 d-py8 d-fc-tertiary"
        importance="clear"
        kind="muted"
        size="md"
        circle
        @click.stop="markAsRead"
      >
        <template #icon="{ iconSize }">
          <dt-icon
            name="double-check"
            :size="iconSize"
          />
        </template>
      </dt-button>
      <dt-dropdown
        v-if="showDropdown && isItemHovered"
        navigation-type="arrow-keys"
        placement="bottom-start"
        @opened="openDropdown"
      >
        <template #anchor="{ attrs }">
          <dt-button
            ref="dropdownAnchor"
            v-dt-tooltip="'Section options'"
            class="d-px0 d-w24 d-h24 d-py8 d-fc-tertiary"
            importance="clear"
            kind="muted"
            size="sm"
            circle
            aria-label="Section Options"
            v-bind="attrs"
            @click.stop="openDropdown"
          >
            <template #icon="{ iconSize }">
              <dt-icon
                name="more-vertical"
                :size="iconSize"
              />
            </template>
          </dt-button>
        </template>

        <template #list="{ close }">
          <template v-for="option in menuOptions">
            <dt-dropdown-separator
              v-if="option.separator"
              :key="`${option.value}separator`"
            />
            <dt-list-item
              v-else
              :key="option.value"
              navigation-type="arrow-keys"
              role="menuitem"
              @click="selectMenuOption(option, close);"
            >
              {{ option.name }}
            </dt-list-item>
          </template>
        </template>
      </dt-dropdown>
      <dt-button
        v-if="showContactCenterAvailability"
        ref="contactCenterAvailabilityButton"
        class="d-fc-success d-bar-pill"
        kind="muted"
        importance="clear"
        size="xs"
        @click.stop
      >
        <template #icon="{ iconSize }">
          <dt-icon
            name="bell-ring"
            :size="iconSize"
          />
        </template>
        <span>Available</span>
      </dt-button>
    </template>
  </dt-list-item>
</template>

<script setup>
import { DtButton } from '@/components/button';
import { DtIcon } from '@/components/icon';
import { DtListItem } from '@/components/list_item';
import { DtDropdown, DtDropdownSeparator } from '@/components/dropdown';
import { defineProps, ref, defineEmits, defineOptions } from 'vue';

const props = defineProps({
  text: { type: String, required: true },
  modelValue: { type: Boolean, default: false },
  showMarkAsRead: { type: Boolean, default: false },
  showDropdown: { type: Boolean, default: false },
  showContactCenterAvailability: { type: Boolean, default: false },
});
defineOptions({
  inheritAttrs: false,
});

const emits = defineEmits(['update:modelValue', 'select-menu-option', 'mark-as-read', 'open-dropdown']);

const markAsReadButton = ref(null);
const markAsReadButtonLabel = 'Mark all as read';
const dropdownAnchor = ref(null);
const contactCenterAvailabilityButton = ref(null);
const isOpen = ref(props.modelValue);
const menuOptions = ref([
  { value: 0, name: 'Mark all as read' },
  { value: 1, separator: true },
  { value: 2, name: 'Create new channel' },
  { value: 3, name: 'Browse channels' },
]);
const optionsOpened = ref(false);
const isItemHovered = ref(false);

const toggleOpen = (e) => {
  if ([
    markAsReadButton.value?.$el,
    dropdownAnchor.value?.$el,
    contactCenterAvailabilityButton.value?.$el,
  ].some(item => item === e.target)) return;

  isOpen.value = !isOpen.value;
  emits('update:modelValue', isOpen.value);
};

const selectMenuOption = (option, close) => {
  close?.();
  emits('select-menu-option', option);
};

const markAsRead = () => {
  emits('mark-as-read');
};

const openDropdown = (value) => {
  emits('open-dropdown');
  optionsOpened.value = value;
};

const handleFocusOut = (e) => {
  if (optionsOpened.value) return;
  isItemHovered.value = e.target.contains(e.relatedTarget);
};
</script>
