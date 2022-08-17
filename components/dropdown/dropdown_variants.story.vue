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

    <dt-dropdown
      :open="open"
      class="d-mr8"
      :placement="placement"
      :fallback-placements="fallbackPlacements"
      :content-width="contentWidth"
      :padding="padding"
      :modal="modal"
      :max-height="maxHeight"
      :max-width="maxWidth"
      :navigation-type="navigationType"
      @highlight="onHighlight"
      @opened="onOpened"
    >
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
          with sections
        </dt-button>
      </template>
      <template
        slot="list"
        slot-scope="{ close }"
      >
        <dt-dropdown-list
          :list-class="listClass"
        >
          <dt-list-item
            role="menuitem"
            :navigation-type="navigationType"
            @click="close"
          >
            Menu item 1
          </dt-list-item>
          <dt-list-item
            role="menuitem"
            :navigation-type="navigationType"
            @click="close"
          >
            Menu Item 2
          </dt-list-item>
        </dt-dropdown-list>
        <dt-dropdown-separator />
        <dt-list-item
          role="menuitem"
          :navigation-type="navigationType"
          @click="close"
        >
          Menu Item 3
        </dt-list-item>
      </template>
    </dt-dropdown>

    <dt-dropdown
      :open="open"
      :placement="placement"
      :fallback-placements="fallbackPlacements"
      :content-width="contentWidth"
      :padding="padding"
      :modal="modal"
      :max-height="maxHeight"
      :max-width="maxWidth"
      :navigation-type="navigationType"
      @highlight="onHighlight"
      @opened="onOpened"
    >
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
          with sections and headings
        </dt-button>
      </template>
      <template
        slot="list"
        slot-scope="{ close }"
      >
        <dt-dropdown-list
          :list-class="listClass"
          heading="Menu Heading A"
        >
          <dt-list-item
            role="menuitem"
            :navigation-type="navigationType"
            @click="close"
          >
            Menu Item 1
          </dt-list-item>
          <dt-dropdown-separator />
          <dt-list-item
            role="menuitem"
            :navigation-type="navigationType"
            @click="close"
          >
            Menu Item 2
          </dt-list-item>
        </dt-dropdown-list>
        <dt-dropdown-separator />
        <dt-dropdown-list
          :list-class="listClass"
          heading="Menu Heading B"
        >
          <dt-list-item
            role="menuitem"
            :navigation-type="navigationType"
            @click="close"
          >
            Menu Item 3
          </dt-list-item>
        </dt-dropdown-list>
      </template>
    </dt-dropdown>
  </div>
</template>

<script>
import DtDropdown from './dropdown';
import DtDropdownList from './dropdown_list';
import DtDropdownSeparator from './dropdown_separator';
import { DtListItem } from '../list_item';
import { DtButton } from '../button';
import { DROPDOWN_STORY_ITEMS } from './dropdown_story_constants';

export default {
  name: 'DtDropdownVariants',

  components: { DtDropdown, DtListItem, DtButton, DtDropdownList, DtDropdownSeparator },

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
