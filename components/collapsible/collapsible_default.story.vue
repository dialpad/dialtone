<template>
  <dt-collapsible
    :id="$attrs.id"
    :anchor-text="$attrs.anchorText"
    :max-height="$attrs.maxHeight"
    :max-width="$attrs.maxWidth"
    :open="$attrs.isOpen"
    :initial-focus-element="'first'"
    :element-type="$attrs.elementType"
    :content-element-type="$attrs.contentElementType"
    :anchor-class="$attrs.anchorClass"
    :content-class="$attrs.contentClass"
    :aria-label="$attrs.ariaLabel"
    :aria-labelledby="$attrs.ariaLabelledBy"
  >
    <template
      v-if="$attrs.anchor"
      #anchor="{ attrs }"
    >
      <div
        v-bind="attrs"
        v-html="$attrs.anchor"
      />
    </template>
    <template #content>
      <div
        v-if="$attrs.content"
        v-html="$attrs.content"
      />
      <div
        v-else
        class="d-ai-center d-fs-16"
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et ex risus. In id
          pellentesque tellus. In hac habitasse platea dictumst. Suspendisse nec egestas nulla. Nam
          fermentum nisi sit amet arcu fringilla, in porta libero volutpat. Proin ac odio egestas,
          luctus magna a, luctus leo. Maecenas eget orci vel nibh sollicitudin maximus quis at quam.
          Curabitur imperdiet lacus nec malesuada pharetra. Nullam leo mi, suscipit at arcu vitae,
          vestibulum rutrum eros.
        </p>
        <p>
          Mauris convallis, elit quis imperdiet aliquet, elit elit tincidunt dui, at tincidunt
          ligula metus ac tortor. Vestibulum vehicula, nibh pulvinar consequat faucibus, turpis
          metus tempus dui, eu facilisis risus risus at ipsum. Praesent feugiat nibh non ipsum
          facilisis, volutpat ullamcorper dui vehicula. Nunc mollis dui porta purus tristique
          aliquam sed at turpis. Phasellus in aliquet sem, sed consequat turpis. Suspendisse
          potenti. Aenean vitae leo quam. Fusce ipsum nulla, egestas at eros sit amet, consectetur
          consectetur turpis. Fusce sit amet tellus rutrum, sollicitudin ante porta, consequat
          dolor. Quisque ut nulla iaculis, eleifend neque in, euismod massa. Sed pulvinar erat nec
          interdum porttitor. Pellentesque interdum tincidunt nisl, nec finibus augue faucibus sit
          amet. Morbi vestibulum rhoncus tristique. Duis at vehicula nulla. Sed hendrerit est id
          lacus placerat cursus. Cras in lacus sit amet ligula ullamcorper vehicula vitae porttitor
          est.
        </p>
      </div>
    </template>
  </dt-collapsible>
</template>

<script>
import DtCollapsible from './collapsible.vue';

export default {
  name: 'DtCollapsibleDefaultStory',

  components: {
    DtCollapsible,
  },

  data () {
    return {
      isOpen: this.open,
    };
  },

  watch: {
    open (open) {
      this.isOpen = open;
    },
  },
};
</script>
