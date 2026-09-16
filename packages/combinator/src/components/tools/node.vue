<script>
import { h } from 'vue';

export default {
  name: 'DtcNode',
  props: {
    template: {
      type: String,
      required: true,
    },
    library: {
      type: Object,
      default: () => {},
    },
    scope: {
      type: Object,
      default: () => ({}),
    },
  },
  render (props) {
    return h({
      components: props.library,
      data () { return { ...props.scope }; },
      template: props.template,
    });
  },
};
</script>
