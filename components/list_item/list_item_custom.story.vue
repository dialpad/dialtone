<template>
  <ul
    ref="listWrapper"
  >
    <dt-list-item
      navigation-type="tab"
      type="custom"
      @click="$attrs.onClick"
    >
      <span
        v-if="defaultSlot"
        v-html="defaultSlot"
      />
      <div
        v-else
        class="custom-list-item d-ps-relative d-py8 d-px12 d-d-flex d-ai-center"
      >
        <time
          class="custom-list-item--time d-fs-100 d-pr12"
          datetime="10:00"
        >
          10:00
        </time>
        <span class="d-fs-200">
          Custom List Item Example
        </span>
        <div class="custom-list-item--actions d-ps-absolute d-p6 d-tn8 d-r12 d-d-flex d-bgc-white d-bar4 d-bs-md">
          <dt-button
            class="d-p4 d-py8"
            importance="clear"
            @click.stop="() => {}"
          >
            <template #icon>
              <icon-social aria-hidden="false" />
            </template>
          </dt-button>
          <dt-button
            class="d-p4 d-py8 d-ml4"
            importance="clear"
            @click.stop="() => {}"
          >
            <template #icon>
              <icon-star-outline aria-hidden="false" />
            </template>
          </dt-button>
          <dt-button
            class="d-p4 d-py8 d-ml4"
            importance="clear"
            @click.stop="() => {}"
          >
            <template #icon>
              <icon-menu-vertical aria-hidden="false" />
            </template>
          </dt-button>
        </div>
      </div>
    </dt-list-item>
  </ul>
</template>

<script>
import DtButton from '../button/button';
import DtListItem from './list_item';
import IconMenuVertical from '@dialpad/dialtone/lib/dist/vue/icons/IconMenuVertical';
import IconSocial from '@dialpad/dialtone/lib/dist/vue/icons/IconSocial';
import IconStarOutline from '@dialpad/dialtone/lib/dist/vue/icons/IconStarOutline';
import KeyboardNavigation from '@/common/mixins/keyboard_list_navigation';

export default {
  name: 'DtListItemDefault',

  components: {
    DtButton,
    DtListItem,
    IconMenuVertical,
    IconSocial,
    IconStarOutline,
  },

  mixins: [
    KeyboardNavigation({
      indexKey: 'highlightIndex',
      idKey: 'highlightId',
      listElementKey: 'getListElement',
    }),
  ],

  methods: {
    getListElement () {
      return this.$refs.listWrapper;
    },
  },
};
</script>

<style lang="less">
.custom-list-item {
  &--time,
  &--actions {
    opacity: 0;
  }
}

.dt-list-item:hover,
.dt-list-item:focus-within {
  .custom-list-item--time {
    opacity: 0.75;
  }
}

.dt-list-item:hover,
.dt-list-item:focus-within {
  .custom-list-item--actions {
    opacity: 1;
  }
}
</style>
