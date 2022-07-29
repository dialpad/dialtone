<template>
  <div class="d-d-flex">
    <dt-dropdown
      v-for="(variant, i) in variants.placement"
      :key="i"
      class="d-mr8"
      :placement="variant"
      :content-width="contentWidth"
      :padding="padding"
      :navigation-type="navigationType"
      :open="open"
      @highlight="onHighlight"
    >
      <template slot="anchor">
        <dt-button>
          {{ variant }} aligned dropdown
        </dt-button>
      </template>
      <template
        slot="list"
        slot-scope="{ close }"
      >
        <dt-list-item
          v-for="(item) in items"
          :key="item.id"
          role="menuitem"
          :navigation-type="navigationType"
          @click="close"
        >
          {{ item.name }}
        </dt-list-item>
      </template>
    </dt-dropdown>
  </div>
</template>

<script>
import DtDropdown from './dropdown';
import { DtListItem } from '../list_item';
import { DtButton } from '../button';
import { DROPDOWN_STORY_ITEMS } from './dropdown_story_constants';

export default {
  name: 'DtDropdownVariants',

  components: { DtDropdown, DtListItem, DtButton },

  data () {
    return {
      variants: {
        placement: ['bottom-start', 'bottom', 'bottom-end'],
      },
    };
  },

  computed: {
    items () {
      return DROPDOWN_STORY_ITEMS;
    },
  },
};
</script>
