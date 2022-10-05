<script>
import Vue from 'vue';
import { DtInputGroup } from '../input_group';

/**
 * Checkbox Groups are convenience components for a grouping of related Checkboxes.
 * While each Checkbox within the group is independent, the `v-model` on the group provides
 * a convenient interface for determining which Checkboxes within the group are checked.
 * @see https://dialpad.design/components/checkbox_group.html
 */
export default {
  name: 'DtCheckboxGroup',

  extends: DtInputGroup,

  model: {
    prop: 'selectedValues',
  },

  props: {
    /**
     * Not supported by this component, please use selectedValues
     */
    value: {
      type: [],
      default: null,
      validator: value => {
        if (!value) {
          return true;
        }

        Vue.util.warn(
          'Component uses selectedValues to initialize the model, value is not supported by this component',
          this,
        );

        return false;
      },
    },

    /**
     * A provided list of selected values(s) for the checkbox group
     * @model selectedValues
     */
    selectedValues: {
      type: Array,
      default () {
        return [];
      },
    },

    /**
     * A data qa tag for the radio group
     */
    dataQaGroup: {
      type: String,
      default: 'checkbox-group',
    },

    /**
     * A data qa tag for the radio group legend
     */
    dataQaGroupLegend: {
      type: String,
      default: 'checkbox-group-legend',
    },

    /**
     * A data qa tag for the radio group messages
     */
    dataQaGroupMessages: {
      type: String,
      default: 'checkbox-group-messages',
    },
  },

  emits: [
    /**
     * Native input event
     *
     * @event input
     * @type {Array}
     */
    'input',
  ],

  data () {
    return {
      internalValue: this.selectedValues,
      // wrap values in object to make reactive
      provideObj: {
        selectedValues: this.selectedValues,
      },
    };
  },

  watch: {
    selectedValues (newSelectedValues) {
      this.internalValue = newSelectedValues;
    },

    /*
     * watching value to support 2 way binding for slotted checkboxes.
     * need this to pass value to slotted checkboxes if modified outside
     * checkbox group.
     */
    internalValue (newInternalValue) {
      this.provideObj.selectedValues = newInternalValue;
    },
  },

  methods: {
    /*
     * provided value to support 2 way binding for slotted checkboxes.
     * slotted checkbox will change this value and need to emit new value up.
     */
    setGroupValue (value, checked) {
      if (!checked) {
        this.internalValue = this.internalValue.filter(checkedValue => checkedValue !== value);
      } else if (!this.internalValue.includes(value)) {
        this.internalValue.push(value);
      }

      this.$emit('input', this.internalValue);
    },

    getMessageKey (type, index) {
      return `checkbox-group-message-${type}-${index}-${this.id}`;
    },
  },
};
</script>
