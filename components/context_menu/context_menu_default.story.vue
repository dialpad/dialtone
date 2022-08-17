<template>
  <dt-context-menu>
    <template
      slot="anchor"
      slot-scope="{ attrs }"
    >
      <div
        v-if="anchor"
        v-html="anchor"
      />
      <dt-button
        v-else
        v-bind="attrs"
      >
        Rigth Click to open
      </dt-button>
    </template>
    <template
      slot="list"
      slot-scope="{ close }"
    >
      <div
        v-if="list"
        v-html="list"
      />
      <dt-list-item
        v-for="(item) in items"
        v-else
        :key="item.id"
        role="menuitem"
        navigation-type="arrow-keys"
        @click="close"
      >
        {{ item.name }}
      </dt-list-item>
    </template>
  </dt-context-menu>
</template>

<script>
import DtContextMenu from './context_menu';
import { DtListItem } from '../list_item';
import { DtButton } from '../button';
import { DROPDOWN_STORY_ITEMS } from '@/components/dropdown/dropdown_story_constants';

export default {
  name: 'DtContextMenuDefault',

  components: { DtContextMenu, DtListItem, DtButton },

  computed: {
    items () {
      return DROPDOWN_STORY_ITEMS;
    },
  },
};
</script>
