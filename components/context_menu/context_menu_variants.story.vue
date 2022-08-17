<template>
  <div class="d-d-flex">
    <dt-context-menu class="d-mr12">
      <template
        slot="anchor"
        slot-scope="{ attrs }"
      >
        <dt-link
          v-bind="attrs"
        >
          Right click to open
        </dt-link>
      </template>
      <template
        slot="list"
        slot-scope="{ close }"
      >
        <dt-list-item
          role="menuitem"
          navigation-type="arrow-keys"
          @click="close"
        >
          Option 1
        </dt-list-item>
        <dt-dropdown-separator />
        <dt-dropdown-list heading="Menu Heading A">
          <dt-list-item
            v-for="(item) in items"
            :key="item.id"
            role="menuitem"
            navigation-type="arrow-keys"
            @click="close"
          >
            {{ item.name }}
          </dt-list-item>
        </dt-dropdown-list>
      </template>
    </dt-context-menu>

    <dt-context-menu>
      <template
        slot="anchor"
        slot-scope="{ attrs }"
      >
        <dt-avatar
          kind="initials"
          color="purple-500"
          v-bind="attrs"
        >
          <span>CM</span>
        </dt-avatar>
      </template>
      <template
        slot="list"
        slot-scope="{ close }"
      >
        <dt-list-item
          role="menuitem"
          navigation-type="arrow-keys"
          @click="close"
        >
          <template slot="left">
            <icon-video />
          </template>
          <span>Menu Item 1</span>
        </dt-list-item>
        <dt-dropdown-separator />
        <dt-dropdown-list>
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="close"
          >
            Menu item 2
          </dt-list-item>
          <dt-list-item
            role="menuitem"
            navigation-type="arrow-keys"
            @click="close"
          >
            Menu Item 3
          </dt-list-item>
        </dt-dropdown-list>
      </template>
    </dt-context-menu>
  </div>
</template>

<script>
import DtContextMenu from './context_menu';
import DtLink from '@/components/link/link';
import { DtListItem } from '../list_item';
import { DROPDOWN_STORY_ITEMS } from '@/components/dropdown/dropdown_story_constants';
import DtAvatar from '@/components/avatar/avatar';
import DtDropdownSeparator from '@/components/dropdown/dropdown_separator';
import DtDropdownList from '@/components/dropdown/dropdown_list';
import IconVideo from '@dialpad/dialtone/lib/dist/vue/icons/IconVideo';

export default {
  name: 'DtContextMenuVariants',

  components: { DtAvatar, DtLink, DtContextMenu, DtListItem, DtDropdownSeparator, DtDropdownList, IconVideo },

  computed: {
    items () {
      return DROPDOWN_STORY_ITEMS;
    },
  },
};
</script>
