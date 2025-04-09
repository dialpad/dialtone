<template>
  <div>
    <dt-popover
      :id="$attrs.id"
      :key="uniqueKey"
      :open.sync="isOpen"
      :placement="$attrs.placement"
      :content-class="$attrs.contentClass"
      :fallback-placements="$attrs.fallbackPlacements"
      :padding="$attrs.padding"
      :hide-on-click="$attrs.hideOnClick"
      :role="$attrs.role"
      :element-type="$attrs.elementType"
      :transition="$attrs.transition"
      :aria-labelledby="$attrs.ariaLabelledby"
      :aria-label="$attrs.ariaLabel"
      :offset="$attrs.offset"
      :modal="$attrs.modal"
      :initial-focus-element="$attrs.initialFocusElement"
      :content-width="$attrs.contentWidth"
      :show-close-button="$attrs.showCloseButton"
      :close-button-props="$attrs.closeButtonProps"
      :header-class="$attrs.headerClass"
      :footer-class="$attrs.footerClass"
      :max-height="$attrs.maxHeight"
      :max-width="$attrs.maxWidth"
      :tether="$attrs.tether"
      :sticky="$attrs.sticky"
      :open-with-arrow-keys="$attrs.openWithArrowKeys"
      :visually-hidden-close="$attrs.visuallyHiddenClose"
      :visually-hidden-close-label="$attrs.visuallyHiddenCloseLabel"
      :append-to="$attrs.appendTo"
      @opened="$attrs.onOpened"
    >
      <template
        slot="anchor"
        slot-scope="{ attrs }"
      >
        <dt-button
          v-bind="attrs"
        >
          {{ $t('CLICK_TO_OPEN') }}
        </dt-button>
      </template>
      <template
        slot="content"
        slot-scope="{ close }"
      >
        <div>
          <span
            v-if="$attrs.content"
            v-html="$attrs.content"
          />
          <template v-else>
            <p class="d-mb4">
              I will be displayed in the popover!
            </p>
            <dt-button
              id="content-close"
              @click="close"
            >
              {{ $t('CLICK_TO_CLOSE') }}
            </dt-button>
          </template>
        </div>
      </template>
      <template
        v-if="$attrs.headerContent"
        slot="headerContent"
      >
        <span v-html="$attrs.headerContent" />
      </template>
      <template
        v-if="$attrs.footerContent"
        slot="footerContent"
      >
        <span v-html="$attrs.footerContent" />
      </template>
    </dt-popover>

    <dt-stack
      direction="row"
      gap="300"
      class="d-ps-absolute d-b4 d-r4"
    >
      <span>{{ $t('SET_LANGUAGE') }}: </span>
      <dt-button
        size="xs"
        importance="outlined"
        @click="setLocale('en-US')"
      >
        {{ $t('ENGLISH') }}
      </dt-button>
      <dt-button
        size="xs"
        importance="outlined"
        @click="setLocale('es-LA')"
      >
        {{ $t('SPANISH') }}
      </dt-button>
      <dt-button
        size="xs"
        importance="outlined"
        @click="setLocale('dp-DP')"
      >
        {{ $t('DIALPADISTAN') }}
      </dt-button>
    </dt-stack>
  </div>
</template>

<script>
import { DtPopover } from './';
import { DtButton } from '@/components/button';
import { DtStack } from '@/components/stack';
import { getUniqueString } from '@/common/utils';
import { useI18N } from '@dialpad/i18n-vue2';
const { $t, setI18N } = useI18N();

export default {
  name: 'PopoverDefaultStory',
  components: {
    DtStack,
    DtPopover,
    DtButton,
  },

  data: function () {
    return {
      isOpen: this.$attrs.open,
    };
  },

  computed: {
    uniqueKey () {
      return getUniqueString();
    },
  },

  watch: {
    open: function (open) {
      this.isOpen = open;
    },
  },

  methods: {
    $t,

    async setLocale (locale) {
      await setI18N({ preferredLocale: locale });
    },
  },
};
</script>
