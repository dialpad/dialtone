<script>
import { DtButton } from '@/components/button';
import { DtPopover } from '@/components/popover';
import { DtInput } from '@/components/input';
import { DtBadge } from '@/components/badge';
import { DialtoneLocalization } from '@/localization/index.js';
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3';

const MAX_VARIABLE_ALT_LENGTH = 50;

export default {
  name: 'VariableComponent',

  components: {
    DtBadge,
    DtButton,
    DtPopover,
    DtInput,
    NodeViewWrapper,
  },

  props: nodeViewProps,

  data() {
    return {
      i18n: new DialtoneLocalization(),
      MAX_VARIABLE_ALT_LENGTH,
    };
  },

  computed: {
    altText: {
      get() {
        return this.node?.attrs?.altText || '';
      },
      set(value) {
        this.updateAttributes({ altText: value });
      },
    },

    variableId() {
      return this.node?.attrs?.id;
    },

    placeholder() {
      return this.variableData?.placeholder || '';
    },

    variableItems() {
      return this.extension?.options?.variableItems || [];
    },

    variableData() {
      return this.variableItems.find(item => item.id === this.variableId);
    },

    badgeLabel() {
      return this.i18n.$t(`{} ${this.placeholder}`);
    },

    placeholderText() {
      return this.i18n.$t(`Replaces ${this.placeholder}`);
    },
  },
};
</script>
<template>
  <NodeViewWrapper class="d-d-inline-flex">
    <DtPopover
      padding="small"
      navigation-type="arrow-keys"
      placement="top-start"
      :modal="false"
    >
      <template #anchor="{ attrs }">
        <DtButton v-bind="attrs" kind="unstyled">
          <DtBadge :text="badgeLabel" contenteditable="false" />
        </DtButton>
      </template>
      <template #content="{ close }">
        <DtInput
          v-model="altText"
          root-class="d-p8 d-w332"
          :label="this.i18n.$t('Alternate text')"
          :placeholder="this.i18n.$t(placeholderText)"
          :validate="{
            length: {
              description: this.i18n.$t('Used when the variable data isn’t available.'),
              message: this.i18n.$t(`Max ${MAX_VARIABLE_ALT_LENGTH} characters allowed.`),
              max: MAX_VARIABLE_ALT_LENGTH,
              warn: MAX_VARIABLE_ALT_LENGTH,
              limitMaxLength: true,
            },
          }"
          @keyup.enter="close()"
        />
      </template>
    </DtPopover>
  </NodeViewWrapper>
</template>
