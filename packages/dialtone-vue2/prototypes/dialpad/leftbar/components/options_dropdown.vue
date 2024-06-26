<template>
  <dt-dropdown
    navigation-type="arrow-keys"
    placement="bottom-start"
    @opened="openDropdown"
  >
    <template #anchor="{ attrs }">
      <dt-button
        ref="dropdownAnchor"
        v-dt-tooltip="'Section options'"
        class="d-fc-tertiary d-h24 d-w24"
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
</template>

<script>
import { DtDropdown, DtDropdownSeparator } from '@/components/dropdown';
import { DtListItem } from '@/components/list_item';
import { DtButton } from '@/components/button';
import { DtIcon } from '@/components/icon';

export default {
  name: 'OptionsDropdown',
  components: {
    DtDropdown,
    DtDropdownSeparator,
    DtListItem,
    DtButton,
    DtIcon,
  },

  emits: [
    'select-menu-option',
    'open-dropdown',
  ],

  data () {
    return {
      menuOptions: [
        { value: 0, name: 'Mark all as read' },
        { value: 1, separator: true },
        { value: 2, name: 'Create new channel' },
        { value: 3, name: 'Browse channels' },
      ],
    };
  },

  methods: {
    openDropdown (value) {
      this.$emit('open-dropdown', value);
    },
  },

  selectMenuOption (option, close) {
    close?.();
    this.$emit('select-menu-option', option);
  },
};
</script>
