<template>
  <dt-stack
    direction="row"
    gap="500"
    align="start"
  >
    <ul aria-label="Ordinary list">
      <dt-list-item>Ordinary list content</dt-list-item>
      <dt-list-item selected>
        A visual checkmark keeps the default listitem role
      </dt-list-item>
    </ul>
    <dt-dropdown
      :visibility-change-callback="$attrs.visibilityChangeCallback"
      @opened="$attrs.onOpened"
    >
      <template #anchor="anchorAttrs">
        <dt-button
          :aria-expanded="anchorAttrs['aria-expanded']"
          :aria-controls="anchorAttrs['aria-controls']"
          :aria-haspopup="anchorAttrs['aria-haspopup']"
        >
          Sort: {{ newestFirst ? 'Newest first' : 'Oldest first' }}
        </dt-button>
      </template>
      <template #list="{ close }">
        <dt-list-item-group heading="Sort order">
          <dt-list-item
            role="menuitemradio"
            navigation-type="arrow-keys"
            :selected="newestFirst"
            @click="newestFirst = true; close()"
          >
            Newest first
          </dt-list-item>
          <dt-list-item
            role="menuitemradio"
            navigation-type="arrow-keys"
            :selected="!newestFirst"
            @click="newestFirst = false; close()"
          >
            Oldest first
          </dt-list-item>
        </dt-list-item-group>
        <dt-dropdown-separator />
        <dt-list-item
          role="menuitem"
          navigation-type="arrow-keys"
          @click="refresh(close)"
        >
          Refresh
        </dt-list-item>
      </template>
    </dt-dropdown>
    <p role="status">
      {{ actionStatus }}
    </p>
  </dt-stack>
</template>

<script>
import { DtDropdown, DtDropdownSeparator } from './index';
import { DtListItem } from '@/components/ListItem';
import { DtListItemGroup } from '@/components/ListItemGroup';
import { DtStack } from '@/components/Stack';
import { DtButton } from '@/components/Button';

export default {
  name: 'DtDropdownMenuRoles',
  components: { DtStack, DtDropdown, DtDropdownSeparator, DtListItem, DtListItemGroup, DtButton },
  data () {
    return { newestFirst: true, actionStatus: '' };
  },

  methods: {
    refresh (close) {
      this.actionStatus = 'Refreshed';
      close();
    },
  },
};
</script>
