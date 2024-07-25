<template>
  <table class="d-table d-bt d-bb d-bbw2 d-bc-default">
    <thead>
      <tr>
        <th class="d-ta-center d-br d-bc-default">
          &nbsp;
        </th>
        <th
          v-for="importance in importances"
          :key="importance"
          class="d-ta-center d-br d-bc-default"
        >
          {{ importance }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="kind in kinds"
        :key="kind"
        :class="{ 'd-bgc-contrast': kind === 'inverted' }"
      >
        <th
          class="d-ta-right d-br d-brw2 d-bc-default"
          scope="row"
          :class="{ 'd-bc-default-inverted d-fc-primary-inverted': kind === 'inverted' }"
        >
          <span class="d-headline--eyebrow">{{ kind }}</span>
        </th>
        <td
          v-for="importance in importances"
          :key="`${kind}-${importance}`"
          class="d-ta-center d-br"
          :class="[kind === 'inverted' ? 'd-bc-default-inverted' : 'd-bc-default']"
        >
          <abbr
            v-if="isInvalidCombination({ kind, importance })"
            class="d-fc-muted d-td-none d-fs-100"
            title="Not applicable"
          >N/A</abbr>
          <dt-stack
            v-else
            direction="row"
            gap="500"
            class="d-jc-center"
          >
            <dt-stack gap="400">
              <div
                v-for="size in sizes"
                :key="`${kind}-${importance}-${size}`"
                class="d-ta-center"
              >
                <dt-split-button
                  :size="size"
                  :kind="kind"
                  :importance="importance"
                >
                  Place call
                  <template #dropdownList>
                    <dt-list-item
                      v-for="item in listItems"
                      :key="item.id"
                    >
                      {{ item.text }}
                    </dt-list-item>
                  </template>
                </dt-split-button>
              </div>
            </dt-stack>
            <dt-stack gap="400">
              <div
                v-for="size in sizes"
                :key="`${kind}-${importance}-${size}`"
                class="d-ta-center"
              >
                <dt-split-button
                  :size="size"
                  :kind="kind"
                  :importance="importance"
                >
                  <template #alphaIcon>
                    <dt-icon
                      name="phone"
                      :size="iconSizes[size]"
                    />
                  </template>
                  <template #dropdownList>
                    <dt-list-item
                      v-for="item in listItems"
                      :key="item.id"
                    >
                      {{ item.text }}
                    </dt-list-item>
                  </template>
                </dt-split-button>
              </div>
            </dt-stack>
          </dt-stack>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { DtSplitButton } from './';
import { DtStack } from '@/components/stack';
import { DtIcon } from '@/components/icon';
import { DtListItem } from '@/components/list_item';

export default {
  name: 'DtSplitButtonVariants',
  components: {
    DtSplitButton,
    DtStack,
    DtIcon,
    DtListItem,
  },

  data () {
    return {
      sizes: ['xs', 'sm', 'md', 'lg', 'xl'],
      kinds: ['default', 'danger', 'inverted', 'muted'],
      importances: ['clear', 'outlined', 'primary'],
      iconSizes: {
        xs: '200',
        sm: '200',
        md: '300',
        lg: '400',
        xl: '500',
      },

      listItems: [
        { id: 1, text: 'First item' },
        { id: 2, text: 'Second item' },
      ],
    };
  },

  beforeMount () {
    this.invalidCombinations = [
      { kind: 'muted', importance: 'primary' },
    ];
  },

  methods: {
    isInvalidCombination (item) {
      return this.invalidCombinations.some(combination =>
        combination.kind === item.kind && combination.importance === item.importance,
      );
    },
  },
};
</script>
