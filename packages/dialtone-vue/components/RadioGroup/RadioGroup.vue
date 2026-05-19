<script>
import { DtInputGroup } from '../InputGroup';

/**
 * Radio Groups are control elements that allow the user to make a single selection from a list of options.
 * @see https://dialtone.dialpad.com/components/radio_group.html
 */
export default {
  name: 'DtRadioGroup',

  extends: DtInputGroup,

  props: {
    /**
     * A provided value for the radio group
     */
    modelValue: {
      type: [String, Number],
      default: '',
    },

    /**
     * A data qa tag for the radio group
     */
    dataQaGroup: {
      type: String,
      default: 'radio-group',
    },

    /**
     * A data qa tag for the radio group legend
     */
    dataQaGroupLegend: {
      type: String,
      default: 'radio-group-legend',
    },

    /**
     * A data qa tag for the radio group messages
     */
    dataQaGroupMessages: {
      type: String,
      default: 'radio-group-messages',
    },
  },

  emits: [
    /**
     * Event fired to sync the modelValue prop with the parent component
     *
     * @event update:modelValue
     * @type {String | Number}
     */
    'update:modelValue',
  ],

  data () {
    return {
      internalValue: this.modelValue,
    };
  },

  watch: {
    modelValue (newValue) {
      this.internalValue = newValue;
    },

    /*
    * watching value to support 2 way binding for slotted radios.
    * need this to pass value to slotted checkboxes if modified outside
    * radio group.
    */
    internalValue: {
      immediate: true,
      handler (newInternalValue) {
        this.provideObj.selectedValue = newInternalValue;
      },
    },
  },

  methods: {
    /*
     * provided value to support 2 way binding for slotted radios.
     * slotted radios will change this value and need to emit new value up.
     */
    setGroupValue (newValue) {
      this.$emit('update:modelValue', newValue);
    },

    getMessageKey (type, index) {
      return `radio-group-message-${type}-${index}-${this.id}`;
    },
  },
};
</script>
