<script>
import {defineComponent, h, computed, isVue3 } from 'vue-demi';
import {getUniqueString} from '../../../../common/utils';

export default defineComponent({
  setup() {
    console.log('Is Vue 3: ', isVue3)
    const uniqueID = computed(() => getUniqueString())
    /*SVG_RENDER_FUNCTION*/
  }
});
</script>
