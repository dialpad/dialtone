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
  },
  render (props) {
    return h({
      components: props.library,
      template: props.template,
    });
  },
};
</script>
