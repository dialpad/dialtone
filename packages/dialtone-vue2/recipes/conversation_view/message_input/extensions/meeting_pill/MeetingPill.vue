<template>
  <node-view-wrapper class="d-recipe-message-input-meeting-pill">
    <dt-item-layout
      class="d-recipe-message-input-meeting-pill__layout"
      unstyled
    >
      <template #left>
        <div class="d-recipe-message-input-meeting-pill__icon">
          <dt-icon-video
            size="400"
          />
        </div>
      </template>
      {{ node.attrs.text }}
      <template #right>
        <div class="d-recipe-message-input-meeting-pill__close">
          <dt-button
            circle
            importance="clear"
            size="xs"
            v-bind="$ta('DIALTONE_CLOSE_BUTTON')"
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
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-2';
import { DtItemLayout } from '@/components/item_layout';
import { DtIconClose, DtIconVideo } from '@dialpad/dialtone-icons/vue2';
import { DtButton } from '@/components/button';
import { DtLocalizationMixin } from '@/common/mixins';

export default {
  name: 'MeetingPill',

  components: {
    NodeViewWrapper,
    DtItemLayout,
    DtIconClose,
    DtButton,
    DtIconVideo,
  },

  mixins: [DtLocalizationMixin],

  props: nodeViewProps,

  emits: ['meeting-pill-close'],

  methods: {
    close (e) {
      this.$parent.$emit('meeting-pill-close', e);
    },
  },
};
</script>
