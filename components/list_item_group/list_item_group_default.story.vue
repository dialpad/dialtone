<template>
  <div
    role="listbox"
    aria-label="list"
  >
    <dt-list-item-group
      :heading="heading"
      :heading-class="headingClass"
      :list-class="listClass"
    >
      <dt-list-item
        class="d-pl8"
        role="option"
        navigation-type="tab"
      >
        item1
      </dt-list-item>
      <dt-list-item
        class="d-pl8"
        role="option"
        navigation-type="tab"
      >
        item2
      </dt-list-item>
      <dt-list-item
        class="d-pl8"
        role="option"
        navigation-type="tab"
      >
        item3
      </dt-list-item>
      <template
        v-if="headingSlot"
        slot="headingSlot"
      >
        <span v-html="headingSlot" />
      </template>
    </dt-list-item-group>
  </div>
</template>

<script>
import DtListItemGroup from './list_item_group.vue';
import DtListItem from '../list_item/list_item.vue';

export default {
  name: 'DtListItemGroupDefault',
  components: { DtListItemGroup, DtListItem },
};
</script>
