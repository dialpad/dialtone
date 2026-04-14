<template>
  <dt-stack gap="400">
    <dt-text as="h2" kind="headline" size="lg">Surface</dt-text>
    <dt-stack gap="200">
      <dt-text as="h3" kind="headline" size="md">Neutral</dt-text>
      <dt-stack direction="row" gap="100">
        <dt-box v-for="s in neutralSurfaces" :key="s" padding="100" :surface="s" border-color="subtle" border-width="100">
          <dt-text kind="body" :size="100">{{ s }}</dt-text>
        </dt-box>
      </dt-stack>
      <dt-text as="h3" kind="headline" size="md">Semantic</dt-text>
      <dt-stack direction="row" gap="100">
        <dt-box v-for="s in semanticSurfaces" :key="s" padding="100" :surface="s" border-color="subtle" border-width="100">
          <dt-text kind="body" :size="100">{{ s }}</dt-text>
        </dt-box>
      </dt-stack>
      <dt-text as="h3" kind="headline" size="md">Subtle / Strong</dt-text>
      <dt-stack direction="row" gap="100">
        <dt-box v-for="s in variantSurfaces" :key="s" padding="100" :surface="s" border-color="subtle" border-width="100">
          <dt-text kind="body" :size="100">{{ s }}</dt-text>
        </dt-box>
      </dt-stack>
      <dt-text as="h3" kind="headline" size="md">Opaque</dt-text>
      <dt-stack direction="row" gap="100">
        <dt-box v-for="s in opaqueSurfaces" :key="s" padding="100" :surface="s" border-color="subtle" border-width="100">
          <dt-text kind="body" :size="100">{{ s }}</dt-text>
        </dt-box>
      </dt-stack>
    </dt-stack>

    <dt-text as="h2" kind="headline" size="lg">Border Color</dt-text>
    <dt-stack gap="200">
      <dt-stack direction="row" gap="100">
        <dt-box v-for="bc in borderColors" :key="bc" padding="100" :border-color="bc" border-width="100">
          <dt-text kind="body" :size="100">{{ bc }}</dt-text>
        </dt-box>
      </dt-stack>
    </dt-stack>

    <dt-text as="h2" kind="headline" size="lg">Border Width</dt-text>
    <dt-stack direction="row" gap="200">
      <dt-box v-for="bw in borderWidths" :key="bw" padding="200" border-color="default" :border-width="bw">
        <dt-text kind="body" :size="100">{{ bw }}</dt-text>
      </dt-box>
    </dt-stack>

    <dt-text as="h2" kind="headline" size="lg">Border Radius</dt-text>
    <dt-stack direction="row" gap="200">
      <dt-box
        v-for="br in borderRadii"
        :key="br"
        padding="200"
        surface="secondary"
        border-color="subtle"
        border-width="100"
        :border-radius="br"
        class="d-d-flex d-ai-center d-jc-center"
        style="min-width: 80px; min-height: 80px;"
      >
        <dt-text kind="body" :size="100">{{ br }}</dt-text>
      </dt-box>
    </dt-stack>

    <dt-text as="h2" kind="headline" size="lg">Shadow</dt-text>
    <dt-stack direction="row" gap="300">
      <dt-box v-for="s in shadows" :key="s" padding="200" surface="primary" border-radius="300" :shadow="s">
        <dt-text kind="body" :size="100">{{ s }}</dt-text>
      </dt-box>
    </dt-stack>
  </dt-stack>
</template>

<script>
import DtBox from './box.vue';
import DtStack from '../stack/stack.vue';
import DtText from '../text/text.vue';

export default {
  name: 'BoxVariants',
  components: { DtBox, DtStack, DtText },
  data () {
    return {
      neutralSurfaces: ['primary', 'secondary', 'moderate', 'bold', 'strong', 'contrast'],
      semanticSurfaces: ['brand', 'info', 'success', 'warning', 'critical'],
      variantSurfaces: ['brand-subtle', 'brand-strong', 'info-subtle', 'info-strong', 'success-subtle', 'success-strong', 'warning-subtle', 'warning-strong', 'critical-subtle', 'critical-strong'],
      opaqueSurfaces: ['primary-opaque', 'secondary-opaque', 'moderate-opaque', 'bold-opaque', 'strong-opaque', 'contrast-opaque'],
      borderColors: ['subtle', 'default', 'moderate', 'bold', 'accent', 'focus', 'brand', 'info', 'success', 'warning', 'critical'],
      borderWidths: ['0', '50', '100', '150', '200', '300', '400'],
      borderRadii: ['0', '100', '200', '300', '350', '400', '450', '500', '600', 'pill', 'circle'],
      shadows: ['small', 'medium', 'large', 'extra-large', 'card'],
    };
  },
};
</script>
