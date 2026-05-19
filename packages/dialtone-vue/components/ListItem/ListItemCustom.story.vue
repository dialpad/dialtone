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
      <dt-stack
        v-else
        direction="row"
        align="center"
        class="custom-list-item d-ps-relative d-py-100 d-px-150"
      >
        <time
          class="custom-list-item--time d-fs-100 d-pie-150"
          datetime="10:00"
        >
          10:00
        </time>
        <span class="d-fs-200">
          Custom List Item Example
        </span>
        <dt-stack
          direction="row"
          class="custom-list-item--actions d-ps-absolute d-p-75 d-ibs-n100 d-iie-150 d-bgc-white d-bar-300 d-bs-md"
        >
          <dt-button
            class="d-p-50 d-py-100"
            importance="clear"
            title="share"
            @click.stop="() => {}"
          >
            <template #startIcon>
              <dt-icon
                name="share-2"
                size="200"
              />
            </template>
          </dt-button>
          <dt-button
            class="d-p-50 d-py-100 d-mis-50"
            importance="clear"
            title="star"
            @click.stop="() => {}"
          >
            <template #startIcon>
              <dt-icon
                name="star"
                size="200"
              />
            </template>
          </dt-button>
          <dt-button
            class="d-p-50 d-py-100 d-mis-50"
            importance="clear"
            title="more"
            @click.stop="() => {}"
          >
            <template #startIcon>
              <dt-icon
                name="more-vertical"
                size="200"
              />
            </template>
          </dt-button>
        </dt-stack>
      </dt-stack>
    </dt-list-item>
  </ul>
</template>

<script>
import { DtStack } from '@/components/Stack';
import { DtButton } from '@/components/Button';
import { DtIcon } from '@/components/Icon';
import DtListItem from './ListItem.vue';
import KeyboardNavigation from '@/common/mixins/keyboard_list_navigation';

export default {
  name: 'DtListItemDefault',

  components: {
    DtButton,
    DtListItem,
    DtIcon,
    DtStack,
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
