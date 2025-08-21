<template>
  <dt-stack
    gap="500"
    class="d-px8"
  >
    <h2>Variants</h2>
    <table class="d-table d-bt d-bb d-bbw2">
      <thead>
        <tr>
          <td class="d-ba">
          &nbsp;
          </td>
          <th
            v-for="importance in importanceList"
            :key="importance"
            class="d-ta-center d-br"
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
            class="d-ta-right d-ba d-brw2"
            scope="row"
            :class="{ 'd-bc-default-inverted d-fc-primary-inverted': kind === 'inverted' }"
          >
            <span
              class="d-headline--eyebrow"
              v-text="kind"
            />
          </th>
          <td
            v-for="importance in importanceList"
            :key="`${kind}-${importance}`"
            class="d-ta-center d-br"
            :class="[kind === 'inverted' ? 'd-bc-default-inverted' : 'd-bc-default']"
          >
            <abbr
              v-if="isInvalidCombination({ kind, importance })"
              class="d-td-none d-fs-100"
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
                  :omega-tooltip-text="omegaTooltipText"
                  :omega-aria-label="omegaAriaLabel"
                >
                  Place call
                  <template #dropdownList>
                    <dt-list-item
                      v-for="item in listItems"
                      :key="item.id"
                      role="menuitem"
                      navigation-type="arrow-keys"
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
      class="d-ai-stretch d-jc-flex-start d-fw-wrap"
    >
      <!-- Sizes  -->
      <dt-stack
        gap="500"
        class="d-br d-pr16"
      >
        <h2>Sizes</h2>
        <dt-stack gap="500">
          <div
            v-for="size in sizes"
            :key="size"
            class="d-ta-center"
          >
            <dt-split-button
              :size="size"
              :omega-tooltip-text="omegaTooltipText"
              :omega-aria-label="omegaAriaLabel"
            >
              <span
                class="d-tt-capitalize"
                v-text="sizeNameMapping[size]"
              />
            </dt-split-button>
          </div>
        </dt-stack>
      </dt-stack>
      <!-- With alpha icon  -->
      <dt-stack
        gap="500"
        class="d-br d-pr16"
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
              :omega-tooltip-text="omegaTooltipText"
              :omega-aria-label="omegaAriaLabel"
            >
              <span
                class="d-tt-capitalize"
                v-text="position"
              />
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
        class="d-br d-pr16"
      >
        <h2>With custom omega icon</h2>
        <dt-stack gap="500">
          <div
            v-for="size in sizes"
            :key="size"
            class="d-ta-center"
          >
            <dt-split-button
              :size="size"
              omega-tooltip-text="Close"
              :omega-aria-label="omegaAriaLabel"
            >
              Place call
              <template #omegaIcon="{ size: iconSize }">
                <dt-icon
                  name="close"
                  :size="iconSize"
                />
              </template>
            </dt-split-button>
          </div>
        </dt-stack>
      </dt-stack>
      <!-- Status  -->
      <dt-stack
        gap="500"
        class="d-br d-pr16"
      >
        <h2>Status</h2>
        <dt-stack gap="500">
          <dt-split-button
            size="xs"
            :alpha-active="true"
            :omega-tooltip-text="omegaTooltipText"
            :omega-aria-label="omegaAriaLabel"
          >
            Alpha active
          </dt-split-button>
          <dt-split-button
            size="xs"
            :omega-active="true"
            :omega-tooltip-text="omegaTooltipText"
            :omega-aria-label="omegaAriaLabel"
          >
            Omega active
          </dt-split-button>
          <dt-split-button
            size="xs"
            :alpha-active="true"
            :omega-active="true"
            :omega-tooltip-text="omegaTooltipText"
            :omega-aria-label="omegaAriaLabel"
          >
            Both active
          </dt-split-button>
          <dt-split-button
            size="xs"
            :alpha-loading="true"
            alpha-aria-label="loading"
            :omega-tooltip-text="omegaTooltipText"
            :omega-aria-label="omegaAriaLabel"
          />
        </dt-stack>
      </dt-stack>
      <!-- With tooltip -->
      <dt-stack
        gap="500"
        class="d-br d-pr16"
      >
        <h2>With tooltip</h2>
        <dt-stack gap="500">
          <dt-split-button
            size="xs"
            alpha-tooltip-text="Hover text"
            :omega-tooltip-text="omegaTooltipText"
            :omega-aria-label="omegaAriaLabel"
          >
            Hover me
          </dt-split-button>
          <dt-split-button
            size="xs"
            :omega-tooltip-text="omegaTooltipText"
            :omega-aria-label="omegaAriaLabel"
          >
            Hover omega
          </dt-split-button>
          <dt-split-button
            size="xs"
            alpha-tooltip-text="Alpha tooltip"
            :omega-tooltip-text="omegaTooltipText"
            :omega-aria-label="omegaAriaLabel"
          >
            Hover both
          </dt-split-button>
        </dt-stack>
      </dt-stack>
      <!-- Icon-only  -->
      <dt-stack
        gap="500"
        class="d-br d-pr16"
      >
        <h2>Icon only</h2>
        <dt-stack gap="500">
          <div
            v-for="size in sizes"
            :key="`icon-only-${size}`"
            class="d-ta-center"
          >
            <dt-split-button
              alpha-tooltip-text="Call"
              alpha-aria-label="Call"
              :omega-tooltip-text="omegaTooltipText"
              :size="size"
              :omega-aria-label="omegaAriaLabel"
            >
              <template #alphaIcon="{ size: iconSize }">
                <dt-icon
                  name="phone"
                  :size="iconSize"
                />
              </template>
            </dt-split-button>
          </div>
        </dt-stack>
      </dt-stack>
      <!-- External anchor -->
      <dt-stack>
        <h2>External anchor</h2>
        <div>
          <dt-split-button
            omega-id="external-anchor-example"
            omega-tooltip-text="Open popover"
            :omega-aria-label="omegaAriaLabel"
            @omega-clicked="isPopoverShown = true"
          >
            External anchor example
          </dt-split-button>
        </div>

        <dt-popover
          v-model:open="isPopoverShown"
          external-anchor="external-anchor-example"
        >
          <template #content>
            <ul>
              <li>Custom popover Content</li>
            </ul>
          </template>
        </dt-popover>
      </dt-stack>
    </dt-stack>
  </dt-stack>
</template>

<script>
/* eslint-disable max-lines */
import { DtSplitButton } from './';
import { DtStack } from '@/components/stack';
import { DtIcon } from '@/components/icon';
import { DtListItem } from '@/components/list_item';
import { DtPopover } from '@/components/popover';
import {
  BUTTON_IMPORTANCE_MODIFIERS,
  BUTTON_KIND_MODIFIERS,
  BUTTON_SIZE_MODIFIERS, ICON_POSITION_MODIFIERS,
} from '@/components/button/button_constants.js';

export default {
  name: 'DtSplitButtonVariants',
  components: {
    DtSplitButton,
    DtStack,
    DtIcon,
    DtListItem,
    DtPopover,
  },

  data () {
    return {
      sizeNameMapping: {
        xs: 'Extra small',
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
        xl: 'Extra large',
      },

      sizes: Object.keys(BUTTON_SIZE_MODIFIERS),
      kinds: Object.keys(BUTTON_KIND_MODIFIERS),
      importanceList: Object.keys(BUTTON_IMPORTANCE_MODIFIERS),
      iconPositions: Object.keys(ICON_POSITION_MODIFIERS),
      listItems: [
        { id: 1, text: 'First item' },
        { id: 2, text: 'Second item' },
        { id: 3, text: 'Third item' },
      ],

      isPopoverShown: false,
      omegaTooltipText: 'More calling options',
      omegaAriaLabel: 'More calling options',
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
