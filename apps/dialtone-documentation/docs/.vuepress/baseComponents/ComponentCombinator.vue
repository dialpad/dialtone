<template>
  <div v-if="component && documentation">
    <div class="d-d-flex d-mt64 d-h628">
      <dtc-combinator
        :documentation="documentation"
        :component="component"
        :library="library"
        :variants="variants"
      />
    </div>
    <ul
      v-if="hasBlueprints"
      class="d-ls-reset d-mt64 d-bgc-black-025 d-ba d-bar4"
    >
      <template
        v-for="(variant, name) in variants"
        :key="name"
      >
        <dtc-section
          :heading="capitalize(name)"
          :open="false"
        >
          <div class="d-d-flex d-hmx332">
            <dtc-combinator
              :documentation="documentation"
              :component="component"
              :library="library"
              :variants="{ default: variant }"
              root-class="d-baw0"
              blueprint
            />
          </div>
        </dtc-section>
      </template>
    </ul>
  </div>
</template>

<script>
import { capitalize, resolveComponent } from 'vue';

export default {
  name: 'ComponentCombinator',

  inject: [
    'dialtoneComponents',
    'dialtoneIcons',
    'variantBank',
  ],

  props: {
    componentName: {
      type: String,
      required: true,
    },

    showBlueprints: {
      type: Boolean,
      default: false,
    },
  },

  data () {
    return {
      documentation: null,
      iconLibrary: null,
    };
  },

  computed: {
    component () {
      return resolveComponent(this.componentName);
    },

    variants () {
      switch (this.componentName) {
        case 'DtAvatar': return {
          default: {
            slots: {
              default: {
                initialValue: '<img src="/assets/images/person.png" alt="Avatar image">',
              },
            },
          },
        };
        default: return this.variantBank[this.componentName];
      }
    },

    library () {
      return {
        ...Object.fromEntries(this.dialtoneComponents.map(componentName => {
          return [componentName, resolveComponent(componentName)];
        })),

        ...Object.fromEntries(this.dialtoneIcons.map(componentName => {
          return [componentName, resolveComponent(componentName)];
        })),
      };
    },

    hasBlueprints () {
      return this.showBlueprints && Object.keys(this.variants).length > 0;
    },
  },

  async beforeCreate () {
    this.documentation = (
      await import('../../../node_modules/@dialpad/dialtone-vue/dist/component-documentation.json')
    ).default;
  },

  methods: {
    capitalize,
  },
};
</script>
