<template>
  <dl :class="['d-description-list', getDirectionClass, getGapClass]">
    <template
      v-for="item in items"
      :key="item.term"
    >
      <dt :class="dtClass">
        {{ item.term }}
      </dt>
      <dd :class="ddClass">
        {{ item.description }}
      </dd>
    </template>
  </dl>
</template>

<script>
import { DT_STACK_GAP } from '@/components/Stack';
import { DT_DESCRIPTION_LIST_DIRECTION } from './DescriptionListConstants';
import { itemsValidator } from './DescriptionListValidators';

export default {
  name: 'DtDescriptionList',

  props: {
    /**
     * The direction for the list
     * @values row, column
     */
    direction: {
      type: String,
      default: 'row',
      validator: direction => DT_DESCRIPTION_LIST_DIRECTION.includes(direction),
    },

    /**
     * A list of items that represent the term and the description
     */
    items: {
      type: Array,
      default: () => [],
      validator: items => itemsValidator(items),
      required: true,
    },

    /**
     * Set the space between the elements
     * @values 0, 1, 25, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 525, 550, 600, 650, 700, 750, 800
     */
    gap: {
      type: String,
      default: '100',
      validator: (gap) => DT_STACK_GAP.includes(gap),
    },

    /**
     * Used to customize the term element
     */
    termClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Used to customize the description element
     */
    descriptionClass: {
      type: [String, Array, Object],
      default: '',
    },
  },

  computed: {
    dtClass () {
      return ['d-description-list__term', this.termClass];
    },

    ddClass () {
      return ['d-description-list__description', this.descriptionClass];
    },

    getDirectionClass () {
      return `d-description-list--${this.direction}`;
    },

    getGapClass () {
      return `d-description-list--gap-${this.gap}`;
    },
  },
};
</script>
