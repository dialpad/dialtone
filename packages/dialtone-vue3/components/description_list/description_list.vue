<template>
  <dl :class="['dt-description-list', getDirectionClass, getGapClass]">
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
import { DT_STACK_GAP } from '../stack/stack_constants';
import { DT_DESCRIPTION_LIST_DIRECTION } from './description_list_constants';
import { itemsValidator } from './description_list_validators';

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
     * @values 0, 100, 200, 300, 400, 500, 600
     */
    gap: {
      type: String,
      default: '400',
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
      return ['dt-description-list__term', this.termClass];
    },

    ddClass () {
      return ['dt-description-list__description', this.descriptionClass];
    },

    getDirectionClass () {
      return `dt-description-list--${this.direction}`;
    },

    getGapClass () {
      return `dt-description-list--gap-${this.gap}`;
    },
  },
};
</script>

<style lang="less">
.dt-description-list {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  flex-direction: row;
  line-height: var(--dt-font-line-height-300);
  font-size: var(--dt-font-size-100);
  --description-list-gap: var(--dt-space-400);
  gap: var(--description-list-gap);
  each(range(0, 600, 100), {
    &--gap-@{value} {
     --description-list-gap: ~"var(--dt-space-@{value})";
    }
  });
  &--column {
    flex-direction: column;
  }
  &__term {
    color: var(--dt-color-foreground-tertiary);
    flex: 0 1 40%;
  }
  &__description {
    color: var(--dt-color-foreground-primary);
    flex: 1 1 50%;
    margin-left: 0;
  }
}
</style>
