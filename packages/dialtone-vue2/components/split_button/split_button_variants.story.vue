<template>
  <dt-stack
    gap="500"
    class="d-px8"
  >
    <h2>Variants</h2>
    <table class="d-table d-bt d-bb d-bbw2 d-bc-default">
      <thead>
        <tr>
          <th
            class="d-ba d-bc-default"
            v-text="''"
          />
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
            class="d-ta-right d-ba d-brw2 d-bc-default"
            scope="row"
            :class="{ 'd-bc-default-inverted d-fc-primary-inverted': kind === 'inverted' }"
          >
            <span
              class="d-headline--eyebrow"
              v-text="kind"
            />
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
              gap="500"
              class="d-jc-center"
            >
              <div>
                <dt-split-button
                  size="xs"
                  :kind="kind"
                  :importance="importance"
                  aria-label="Open dropdown"
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
          </td>
        </tr>
      </tbody>
    </table>
    <dt-stack
      direction="row"
      gap="500"
      class="d-ai-stretch d-jc-center"
    >
      <!-- Sizes  -->
      <dt-stack
        gap="500"
        class="d-br d-bc-default d-pr16"
      >
        <h2>Sizes</h2>
        <dt-stack gap="500">
          <div
            v-for="size in Object.keys(sizes)"
            :key="size"
            class="d-ta-center"
          >
            <dt-split-button
              :size="size"
            >
              <span
                class="d-tt-capitalize"
                v-text="sizes[size]"
              />
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
      <!-- With alpha icon  -->
      <dt-stack
        gap="500"
        class="d-br d-bc-default d-pr16"
      >
        <h2>With alpha icon</h2>
        <dt-stack gap="500">
          <div
            v-for="position in iconPositions"
            :key="position"
            class="d-ta-center"
          >
            <dt-split-button
              size="xs"
              :alpha-icon-position="position"
            >
              <span
                class="d-tt-capitalize"
                v-text="position"
              />
              <template #dropdownList>
                <dt-list-item
                  v-for="item in listItems"
                  :key="item.id"
                >
                  {{ item.text }}
                </dt-list-item>
              </template>
              <template #alphaIcon>
                <dt-icon
                  name="accessibility"
                  size="300"
                />
              </template>
            </dt-split-button>
          </div>
        </dt-stack>
      </dt-stack>
      <!-- With custom omega icon  -->
      <dt-stack
        gap="500"
        class="d-br d-bc-default d-pr16"
      >
        <h2>With custom omega icon</h2>
        <dt-stack gap="500">
          <div
            v-for="size in Object.keys(sizes)"
            :key="size"
            class="d-ta-center"
          >
            <dt-split-button
              :size="size"
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
              <template #omegaIcon>
                <dt-icon
                  name="phone"
                  :size="iconSizes[size]"
                />
              </template>
            </dt-split-button>
          </div>
        </dt-stack>
      </dt-stack>
      <!-- Status  -->
      <dt-stack
        gap="500"
        class="d-br d-bc-default d-pr16"
      >
        <h2>Status</h2>
        <dt-stack gap="500">
          <dt-split-button
            size="xs"

            :alpha-active="true"
          >
            Alpha active
          </dt-split-button>
          <dt-split-button
            size="xs"

            :omega-active="true"
          >
            Omega active
          </dt-split-button>
          <dt-split-button
            size="xs"

            :alpha-active="true"
            :omega-active="true"
          >
            Both active
          </dt-split-button>
          <dt-split-button
            size="xs"

            :alpha-loading="true"
          >
            Place call
          </dt-split-button>
        </dt-stack>
      </dt-stack>
      <!-- With tooltip -->
      <dt-stack
        gap="500"
        class="d-br d-bc-default d-pr16"
      >
        <h2>With tooltip</h2>
        <dt-stack gap="500">
          <dt-split-button
            size="xs"

            alpha-tooltip-text="Alpha tooltip"
          >
            Hover me
          </dt-split-button>
          <dt-split-button
            size="xs"

            omega-tooltip-text="Omega tooltip"
          >
            Hover omega
          </dt-split-button>
          <dt-split-button
            size="xs"

            alpha-tooltip-text="Alpha tooltip"
            omega-tooltip-text="Omega tooltip"
          >
            Hover both
          </dt-split-button>
        </dt-stack>
      </dt-stack>
    </dt-stack>
  </dt-stack>
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
      sizes: { xs: 'extra small', sm: 'small', md: 'medium', lg: 'large', xl: 'extra large' },
      kinds: ['default', 'danger', 'inverted', 'muted'],
      importances: ['clear', 'outlined', 'primary'],
      iconSizes: {
        xs: '200',
        sm: '200',
        md: '300',
        lg: '400',
        xl: '500',
      },

      iconPositions: ['left', 'right', 'top', 'bottom'],
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
