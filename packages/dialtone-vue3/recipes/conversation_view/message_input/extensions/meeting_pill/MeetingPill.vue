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
            :aria-label="closeButtonTitle"
            :title="closeButtonTitle"
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
import { DialtoneLocalization } from '@/localization';

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

  data () {
    return {
      i18n: new DialtoneLocalization(),
    };
  },

  computed: {
    closeButtonTitle () {
      return this.i18n.$t('DIALTONE_CLOSE_BUTTON');
    },
  },

  methods: {
    close (e) {
      // Get the callback from extension storage
      const onCloseCallback = this.editor?.storage?.meetingPill?.onClose;

      if (onCloseCallback && typeof onCloseCallback === 'function') {
        onCloseCallback(e);
      }
    },
  },
};
</script>
