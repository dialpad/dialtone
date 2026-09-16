<script>
import { DtInputGroup } from '../InputGroup';

/**
 * Checkbox Groups are convenience components for a grouping of related Checkboxes.
 * While each Checkbox within the group is independent, the `v-model` on the group provides
 * a convenient interface for determining which Checkboxes within the group are checked.
 * @see https://dialtone.dialpad.com/components/checkbox_group.html
 */
export default {
  name: 'DtCheckboxGroup',

  extends: DtInputGroup,

  props: {
    /**
     * A provided list of selected values(s) for the checkbox group
     */
    modelValue: {
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
     * Selected values for the checkbox group
     *
     * @event update:modelValue
     * @type {Array}
     */
    'update:modelValue',
  ],

  data () {
    return {
      internalValue: this.modelValue,
    };
  },

  watch: {
    modelValue (newModelValue) {
      this.internalValue = newModelValue;
    },

    /*
    * watching value to support 2 way binding for slotted checkboxes.
    * need this to pass value to slotted checkboxes if modified outside
    * checkbox group.
    */
    internalValue: {
      immediate: true,
      handler (newInternalValue) {
        this.provideObj.selectedValues = newInternalValue;
      },
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

      this.$emit('update:modelValue', this.internalValue);
    },

    getMessageKey (type, index) {
      return `checkbox-group-message-${type}-${index}-${this.id}`;
    },
  },
};
</script>
