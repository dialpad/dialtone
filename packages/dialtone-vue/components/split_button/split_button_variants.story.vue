<template>
  <dt-stack
    gap="200"
    class="d-px-100"
  >
    <h2>Variants</h2>
    <table class="d-table d-bt d-bb d-bbw2">
      <thead>
        <tr>
          <td class="d-ba d-bc-default">
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
        >
          <th
            class="d-ta-right d-ba d-brw2"
            scope="row"
          >
            <span
              class="d-headline--eyebrow"
              v-text="kind"
            />
          </th>
          <td
            v-for="importance in importanceList"
            :key="`${kind}-${importance}`"
            class="d-ta-center d-br d-bc-default"
          >
            <abbr
              v-if="isInvalidCombination({ kind, importance })"
              class="d-td-none d-fs-100"
              title="Not applicable"
            >N/A</abbr>
            <dt-stack
              v-else
              gap="200"
              class="d-jc-center"
            >
              <div>
                <dt-split-button
                  :kind="kind"
                  :importance="importance"
                  :end-tooltip-text="endTooltipText"
                  :end-aria-label="endAriaLabel"
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
      gap="200"
      class="d-ai-stretch d-jc-flex-start d-fw-wrap"
    >
      <!-- Sizes  -->
      <dt-stack
        gap="200"
        class="d-br d-pie-200"
      >
        <h2>Sizes</h2>
        <dt-stack gap="200">
          <div
            v-for="size in sizes"
            :key="size"
            class="d-ta-center"
          >
            <dt-split-button
              :size="size"
              :end-tooltip-text="endTooltipText"
              :end-aria-label="endAriaLabel"
            >
              <span
                class="d-tt-capitalize"
                v-text="sizeNameMapping[size]"
              />
            </dt-split-button>
          </div>
        </dt-stack>
      </dt-stack>
      <!-- With start icon  -->
      <dt-stack
        gap="200"
        class="d-br d-pie-200"
      >
        <h2>With start icon</h2>
        <dt-stack gap="200">
          <div
            v-for="position in iconPositions"
            :key="position"
            class="d-ta-center"
          >
            <dt-split-button
              :size="100"
              :start-icon-position="position"
              :end-tooltip-text="endTooltipText"
              :end-aria-label="endAriaLabel"
            >
              <span
                class="d-tt-capitalize"
                v-text="position"
              />
              <template #startIcon>
                <dt-icon
                  name="accessibility"
                  size="300"
                />
              </template>
            </dt-split-button>
          </div>
        </dt-stack>
      </dt-stack>
      <!-- With custom end icon  -->
      <dt-stack
        gap="200"
        class="d-br d-pie-200"
      >
        <h2>With custom end icon</h2>
        <dt-stack gap="200">
          <div
            v-for="size in sizes"
            :key="size"
            class="d-ta-center"
          >
            <dt-split-button
              :size="size"
              end-tooltip-text="Close"
              :end-aria-label="endAriaLabel"
            >
              Place call
              <template #endIcon="{ size: iconSize }">
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
        gap="200"
        class="d-br d-pie-200"
      >
        <h2>Status</h2>
        <dt-stack gap="200">
          <dt-split-button
            :size="100"
            :start-active="true"
            :end-tooltip-text="endTooltipText"
            :end-aria-label="endAriaLabel"
          >
            Start active
          </dt-split-button>
          <dt-split-button
            :size="100"
            :end-active="true"
            :end-tooltip-text="endTooltipText"
            :end-aria-label="endAriaLabel"
          >
            End active
          </dt-split-button>
          <dt-split-button
            :size="100"
            :start-active="true"
            :end-active="true"
            :end-tooltip-text="endTooltipText"
            :end-aria-label="endAriaLabel"
          >
            Both active
          </dt-split-button>
          <dt-split-button
            :size="100"
            :start-loading="true"
            start-aria-label="loading"
            :end-tooltip-text="endTooltipText"
            :end-aria-label="endAriaLabel"
          />
        </dt-stack>
      </dt-stack>
      <!-- Disabled  -->
      <dt-stack
        gap="200"
        class="d-br d-bc-default d-pie-200"
      >
        <h2>Disabled</h2>
        <dt-stack gap="200">
          <dt-split-button
            :size="100"
            :start-disabled="true"
            :end-tooltip-text="endTooltipText"
            :end-aria-label="endAriaLabel"
          >
            Start disabled
          </dt-split-button>
          <dt-split-button
            :size="100"
            :end-disabled="true"
            :end-tooltip-text="endTooltipText"
            :end-aria-label="endAriaLabel"
          >
            End disabled
          </dt-split-button>
          <dt-split-button
            :size="100"
            :disabled="true"
            :end-tooltip-text="endTooltipText"
            :end-aria-label="endAriaLabel"
          >
            Both disabled
          </dt-split-button>
        </dt-stack>
      </dt-stack>
      <!-- With tooltip -->
      <dt-stack
        gap="200"
        class="d-br d-bc-default d-pie-200"
      >
        <h2>Disabled</h2>
        <dt-stack gap="200">
          <dt-split-button
            :size="100"
            :start-disabled="true"
            :end-tooltip-text="endTooltipText"
            :end-aria-label="endAriaLabel"
          >
            Start disabled
          </dt-split-button>
          <dt-split-button
            :size="100"
            :end-disabled="true"
            :end-tooltip-text="endTooltipText"
            :end-aria-label="endAriaLabel"
          >
            End disabled
          </dt-split-button>
          <dt-split-button
            :size="100"
            :disabled="true"
            :end-tooltip-text="endTooltipText"
            :end-aria-label="endAriaLabel"
          >
            Both disabled
          </dt-split-button>
        </dt-stack>
      </dt-stack>
      <!-- With tooltip -->
      <dt-stack
        gap="200"
        class="d-br d-pie-200"
      >
        <h2>With tooltip</h2>
        <dt-stack gap="200">
          <dt-split-button
            :size="100"
            start-tooltip-text="Hover text"
            :end-tooltip-text="endTooltipText"
            :end-aria-label="endAriaLabel"
          >
            Hover me
          </dt-split-button>
          <dt-split-button
            :size="100"
            :end-tooltip-text="endTooltipText"
            :end-aria-label="endAriaLabel"
          >
            Hover end
          </dt-split-button>
          <dt-split-button
            :size="100"
            start-tooltip-text="Start tooltip"
            :end-tooltip-text="endTooltipText"
            :end-aria-label="endAriaLabel"
          >
            Hover both
          </dt-split-button>
        </dt-stack>
      </dt-stack>
      <!-- Icon-only  -->
      <dt-stack
        gap="200"
        class="d-br d-pie-200"
      >
        <h2>Icon only</h2>
        <dt-stack gap="200">
          <div
            v-for="size in sizes"
            :key="`icon-only-${size}`"
            class="d-ta-center"
          >
            <dt-split-button
              start-tooltip-text="Call"
              start-aria-label="Call"
              :end-tooltip-text="endTooltipText"
              :size="size"
              :end-aria-label="endAriaLabel"
            >
              <template #startIcon="{ size: iconSize }">
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
            end-id="external-anchor-example"
            end-tooltip-text="Open popover"
            :end-aria-label="endAriaLabel"
            @end-clicked="isPopoverShown = true"
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
      kinds: Object.keys(BUTTON_KIND_MODIFIERS).filter(k => k !== 'inverted'),
      importanceList: Object.keys(BUTTON_IMPORTANCE_MODIFIERS),
      iconPositions: Object.keys(ICON_POSITION_MODIFIERS),
      listItems: [
        { id: 1, text: 'First item' },
        { id: 2, text: 'Second item' },
        { id: 3, text: 'Third item' },
      ],

      isPopoverShown: false,
      endTooltipText: 'More calling options',
      endAriaLabel: 'More calling options',
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
