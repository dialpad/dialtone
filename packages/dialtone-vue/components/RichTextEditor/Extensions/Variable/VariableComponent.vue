<script>
import { DtButton } from '@/components/Button';
import { DtPopover } from '@/components/Popover';
import { DtInput } from '@/components/Input';
import { DtBadge } from '@/components/Badge';
import { DialtoneLocalization } from '@/localization/Index.js';
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3';

const MAX_VARIABLE_ALT_LENGTH = 100;

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

    enableAltText() {
      return this.node?.attrs?.enableAltText;
    },

    badgeLabel() {
      return `{} ${this.placeholder}`;
    },

    placeholderText() {
      return `Replaces ${this.placeholder}`;
    },
  },
};
</script>

<template>
  <!-- eslint-disable vue/no-restricted-class -->
  <node-view-wrapper class="d-d-inline-block">
    <dt-popover
      v-if="enableAltText"
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
          class="d-p-100 d-w332"
          :label="i18n.$t('DIALTONE_EDITOR_VARIABLE_LABEL')"
          :placeholder="placeholderText"
          :validate="{
            length: {
              description: i18n.$t('DIALTONE_EDITOR_VARIABLE_VALIDATE_DESCRIPTION'),
              message: i18n.$t('DIALTONE_EDITOR_VARIABLE_VALIDATE_MESSAGE'),
              max: MAX_VARIABLE_ALT_LENGTH,
              warn: MAX_VARIABLE_ALT_LENGTH,
              limitMaxLength: true,
            },
          }"
          @keyup.enter="close()"
        />
      </template>
    </dt-popover>
    <dt-badge
      v-else
      :text="badgeLabel"
      contenteditable="false"
    />
  </node-view-wrapper>
</template>
