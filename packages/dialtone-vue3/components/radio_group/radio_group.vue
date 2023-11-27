<script>
import { DtInputGroup } from '../input_group';

/**
 * Radio Groups are control elements that allow the user to make a single selection from a list of options.
 * @see https://dialpad.design/components/radio_group.html
 */
export default {
  name: 'DtRadioGroup',

  extends: DtInputGroup,

  props: {
    /**
     * A provided value for the radio group
     * @model value
     */
    value: {
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
     * Native input event
     *
     * @event input
     * @type {String | Number}
     */
    'input',
  ],

  data () {
    return {
      internalValue: this.value,
    };
  },

  watch: {
    value (newValue) {
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
      this.$emit('input', newValue);
    },

    getMessageKey (type, index) {
      return `radio-group-message-${type}-${index}-${this.id}`;
    },
  },
};
</script>
