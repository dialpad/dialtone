<template>
  <dt-item-layout
    :as="$attrs.as"
    :unstyled="$attrs.unstyled"
    :start-class="$attrs.startClass"
    :content-class="$attrs.contentClass"
    :title-class="$attrs.titleClass"
    :subtitle-class="$attrs.subtitleClass"
    :bottom-class="$attrs.bottomClass"
    :end-class="$attrs.endClass"
    :selected-class="$attrs.selectedClass"
  >
    <template #start>
      <span
        v-if="$attrs.start"
        v-html="$attrs.start"
      />
    </template>
    <span
      v-if="defaultSlot"
      v-html="defaultSlot"
    />
    <template #subtitle>
      <span
        v-if="$attrs.subtitle"
        v-html="$attrs.subtitle"
      />
    </template>
    <template #bottom>
      <span
        v-if="$attrs.bottom"
        v-html="$attrs.bottom"
      />
    </template>
    <template #end>
      <span
        v-if="$attrs.end"
        v-html="$attrs.end"
      />
    </template>
    <template #selected>
      <span
        v-if="$attrs.selected"
        v-html="$attrs.selected"
      />
    </template>
  </dt-item-layout>
</template>

<script>
import DtItemLayout from './item_layout.vue';

export default {
  name: 'DtItemLayoutDefault',
  components: { DtItemLayout },
};
</script>
