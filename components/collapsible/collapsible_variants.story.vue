<template>
  <div>
    <p>Collapsible is open: {{ isOpenLocal }}</p>
    <dt-collapsible
      anchor-text="Favorites"
      aria-label="Favorites, click to expand or collapse"
      content-element-type="ol"
      class="d-p0 d-w100p"
      :open.sync="isOpenLocal"
    >
      <template #contentOnExpanded>
        <li
          v-for="item in items"
          :key="item.name"
        >
          {{ item.name }}
        </li>
      </template>
      <template #contentOnCollapsed>
        <li
          v-for="item in unreadItems"
          :key="item.name"
        >
          {{ item.name }}
        </li>
      </template>
    </dt-collapsible>
  </div>
</template>

<script>
import DtCollapsible from './collapsible';

export default {
  name: 'DtCollapsibleVariantsStory',

  components: {
    DtCollapsible,
  },

  data () {
    return {
      isOpenLocal: true,
      items: [
        {
          name: 'Item 1',
          unread: false,
        },
        {
          name: 'Item 2',
          unread: false,
        },
        {
          name: 'Unread Item 3',
          unread: true,
        },
      ],
    };
  },

  computed: {
    unreadItems () {
      return this.items.filter(item => item.unread);
    },
  },
};
</script>
