<template>
  <dt-stack gap="400">
    <dt-filter-pill
      label="With header, content and footer"
    >
      <template #headerContent>
        <div class="d-mr16">
          <dt-input
            v-model="inputValue"
            aria-label="Search items"
            placeholder="Search Items"
            type="text"
          >
            <template #leftIcon="{ iconSize }">
              <dt-icon-search
                :size="iconSize"
              />
            </template>
            <template
              #rightIcon="{ clear }"
            >
              <dt-button
                kind="muted"
                importance="clear"
                size="xs"
                circle
                aria-label="Clear search"
                @click="clear"
              >
                <template #icon="{ iconSize }">
                  <dt-icon-close
                    :size="iconSize"
                  />
                </template>
              </dt-button>
            </template>
          </dt-input>
        </div>
      </template>
      <template #content>
        <dt-checkbox
          v-for="option in options"
          :key="option"
          :label="option"
        />
      </template>
      <template #footerContent>
        <div class="d-ta-right d-pr16">
          <dt-button
            kind="muted"
            importance="outlined"
            size="sm"
          >
            Apply
          </dt-button>
        </div>
      </template>
    </dt-filter-pill>
    <dt-filter-pill
      active
      label="Active filter"
    >
      <template #content>
        Default content
      </template>
    </dt-filter-pill>
    <dt-filter-pill
      active
      label="Active filter with reset"
      reset-button-aria-label="Reset"
      show-reset
    >
      <template #content>
        Default content
      </template>
    </dt-filter-pill>
    <dt-filter-pill
      disabled
      label="Disabled"
    />
    <!-- Loading -->
    <dt-stack gap="300">
      <h3>Loading</h3>
      <dt-filter-pill
        label="Loading"
        loading
      >
        <template #content>
          Default content
        </template>
      </dt-filter-pill>
      <h3>Loading with custom skeleton width</h3>
      <dt-filter-pill
        label="Loading with custom skeleton width"
        loading
        loading-skeleton-width="50px"
      >
        <template #content>
          Default content
        </template>
      </dt-filter-pill>
    </dt-stack>
  </dt-stack>
</template>

<script>
import DtFilterPill from './filter_pill.vue';
import { DtInput } from '@/components/input';
import { DtCheckbox } from '@/components/checkbox';
import { DtButton } from '@/components/button';
import { DtStack } from '@/components/stack';
import { DtIconClose, DtIconSearch } from '@dialpad/dialtone-icons/vue3';

export default {
  name: 'DtFilterPillVariants',
  components: {
    DtFilterPill,
    DtInput,
    DtCheckbox,
    DtButton,
    DtIconSearch,
    DtIconClose,
    DtStack,
  },

  data () {
    return {
      inputValue: '',
      options: [
        'Option 1',
        'Option 2',
        'Option 3',
        'Option 4',
        'Option 5',
      ],
    };
  },
};
</script>
