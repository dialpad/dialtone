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
            title="share"
            @click.stop="() => {}"
          >
            <template #icon>
              <dt-icon
                name="share-2"
                size="200"
              />
            </template>
          </dt-button>
          <dt-button
            class="d-p4 d-py8 d-ml4"
            importance="clear"
            title="star"
            @click.stop="() => {}"
          >
            <template #icon>
              <dt-icon
                name="star"
                size="200"
              />
            </template>
          </dt-button>
          <dt-button
            class="d-p4 d-py8 d-ml4"
            importance="clear"
            title="more"
            @click.stop="() => {}"
          >
            <template #icon>
              <dt-icon
                name="more-vertical"
                size="200"
              />
            </template>
          </dt-button>
        </div>
      </div>
    </dt-list-item>
  </ul>
</template>

<script>
import { DtButton } from '@/components/button';
import { DtIcon } from '@/components/icon';
import DtListItem from './list_item.vue';
import KeyboardNavigation from '../../common/mixins/keyboard_list_navigation';

export default {
  name: 'DtListItemDefault',

  components: {
    DtButton,
    DtListItem,
    DtIcon,
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
