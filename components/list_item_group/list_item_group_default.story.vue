<template>
  <div
    role="listbox"
    aria-label="list"
  >
    <dt-list-item-group
      :heading="$attrs.heading"
      :heading-class="$attrs.headingClass"
      :list-class="$attrs.listClass"
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
        v-if="$attrs.headingSlot"
        #headingSlot
      >
        <span v-html="$attrs.headingSlot" />
      </template>
    </dt-list-item-group>
  </div>
</template>

<script>
import DtListItemGroup from './list_item_group';
import DtListItem from '../list_item/list_item';

export default {
  name: 'DtListItemGroupDefault',
  components: { DtListItemGroup, DtListItem },
};
</script>
