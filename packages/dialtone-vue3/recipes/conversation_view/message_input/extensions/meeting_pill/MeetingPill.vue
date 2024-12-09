<template>
  <node-view-wrapper class="dt-recipe-message-input-meeting-pill">
    <dt-item-layout
      class="dt-recipe-message-input-meeting-pill__layout"
      unstyled
    >
      <template #left>
        <div class="dt-recipe-message-input-meeting-pill__icon">
          <dt-icon-video
            size="400"
          />
        </div>
      </template>
      {{ node.attrs.text }}
      <template #right>
        <div class="dt-recipe-message-input-meeting-pill__close">
          <dt-button
            circle
            :aria-label="node.attrs['close-button-aria-label']"
            size="xs"
            importance="clear"
            @click="close"
          >
            <template #icon>
              <dt-icon-close
                size="300"
              />
            </template>
          </dt-button>
        </div>
      </template>
    </dt-item-layout>
  </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3';
import { DtItemLayout } from '@/components/item_layout';
import { DtIconClose, DtIconVideo } from '@dialpad/dialtone-icons/vue3';
import { DtButton } from '@/components/button';

export default {
  name: 'MeetingPill',

  components: {
    NodeViewWrapper,
    DtItemLayout,
    DtIconClose,
    DtButton,
    DtIconVideo,
  },

  props: nodeViewProps,

  emits: ['meeting-pill-close'],

  methods: {
    close (e) {
      this.$parent.$emit('meeting-pill-close', e);
    },
  },
};
</script>
