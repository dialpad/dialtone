<template>
  <div>
    <div class="d-d-flex d-mb12">
      <dt-dropdown
        v-for="(variant, i) in variants.placement"
        :key="i"
        class="d-mr8"
        :placement="variant"
        :content-width="contentWidth"
        :padding="padding"
        :navigation-type="navigationType"
        :open="open"
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
        class="d-mr8"
        :open="open"
        :placement="placement"
        :fallback-placements="fallbackPlacements"
        :content-width="contentWidth"
        :padding="padding"
        :modal="modal"
        :max-height="maxHeight"
        :max-width="maxWidth"
        :navigation-type="navigationType"
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
          <dt-list-item-group
            heading-class="d-py4 d-px8 d-fw-semibold d-c-default"
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
          </dt-list-item-group>
          <dt-dropdown-separator />
          <dt-list-item-group
            :list-class="listClass"
            heading-class="d-py4 d-px8 d-fw-semibold d-c-default"
            heading="Menu Heading B"
          >
            <dt-list-item
              role="menuitem"
              :navigation-type="navigationType"
              @click="close"
            >
              Menu Item 3
            </dt-list-item>
          </dt-list-item-group>
        </template>
      </dt-dropdown>
    </div>
    <div class="d-d-flex d-fd-column">
      <p class="d-fw-bold d-mb2">
        Context menu
      </p>
      <p class="d-mb8">
        Displays the dropdown menu located at the pointer, triggered by a right-click
      </p>
      <div class="d-d-flex">
        <dt-dropdown
          class="d-mr8"
          :content-width="contentWidth"
          :padding="padding"
          :navigation-type="navigationType"
          :open="open"
          :open-on-context="true"
        >
          <template
            slot="anchor"
            slot-scope="{ attrs }"
          >
            <div
              v-bind="attrs"
              class="d-ba d-bas-dashed d-w264 d-py48 d-ta-center d-bgc-black-300"
            >
              Right click to open
            </div>
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
    </div>
  </div>
</template>

<script>
import DtDropdown from './dropdown';
import DtDropdownList from './dropdown_list';
import DtListItemGroup from '../list_item_group/list_item_group.vue';
import DtDropdownSeparator from './dropdown_separator';
import { DtListItem } from '../list_item';
import { DtButton } from '../button';
import { DROPDOWN_STORY_ITEMS } from './dropdown_story_constants';

export default {
  name: 'DtDropdownVariants',

  components: { DtDropdown, DtListItem, DtButton, DtListItemGroup, DtDropdownList, DtDropdownSeparator },

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
