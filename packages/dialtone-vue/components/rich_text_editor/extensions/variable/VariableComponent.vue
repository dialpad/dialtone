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
  <!-- eslint-disable vue/no-restricted-class -->
  <node-view-wrapper class="d-d-inline-block">
    <dt-popover
      padding="small"
      navigation-type="arrow-keys"
      placement="top-start"
      :modal="false"
    >
      <template #anchor="{ attrs }">
        <dt-button
          v-bind="attrs"
          kind="unstyled"
        >
          <dt-badge
            :text="badgeLabel"
            contenteditable="false"
          />
        </dt-button>
      </template>
      <template #content="{ close }">
        <dt-input
          v-model="altText"
          root-class="d-p8 d-w332"
          :label="i18n.$t('Alternate text')"
          :placeholder="i18n.$t(placeholderText)"
          :validate="{
            length: {
              description: i18n.$t('Used when the variable data isn’t available.'),
              message: i18n.$t(`Max ${MAX_VARIABLE_ALT_LENGTH} characters allowed.`),
              max: MAX_VARIABLE_ALT_LENGTH,
              warn: MAX_VARIABLE_ALT_LENGTH,
              limitMaxLength: true,
            },
          }"
          @keyup.enter="close()"
        />
      </template>
    </dt-popover>
  </node-view-wrapper>
</template>
