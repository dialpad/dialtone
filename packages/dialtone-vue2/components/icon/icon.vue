<template>
  <div
    :id="id"
    ref="iconRef"
    data-qa="dt-icon"
    :data-name="setDataName(name)"
    :aria-hidden="ariaLabel ? 'false' : 'true'"
    :aria-label="ariaLabel"
    :class="iconClass"
    v-html="modifiedSvgContent"
  />
</template>

<script>
import { ICON_SIZE_MODIFIERS } from './icon_constants';
import { getUniqueString } from '@/common/utils.js';
import iconNames from '@dialpad/dialtone-icons/dist/icons.json';

/**
 * The Icon component provides a set of glyphs and sizes to provide context your application.
 * @see https://dialtone.dialpad.com/components/icon.html
 */
export default {
  name: 'DtIcon',

  props: {
    /**
     * DtIcon identifier
     */
    id: {
      type: String,
      default () {
        return getUniqueString();
      },
    },

    /**
     * The size of the icon.
     * @values 100, 200, 300, 400, 500, 600, 700, 800
     */
    size: {
      type: String,
      default: '500',
      validator: (s) => Object.keys(ICON_SIZE_MODIFIERS).includes(s),
    },

    /**
     * The icon name in kebab-case
     */
    name: {
      type: String,
      required: true,
      validator: (name) => iconNames.includes(name),
    },

    /**
     * The label of the icon as read out by a screenreader. Leave this unset if your icon is purely presentational
     */
    ariaLabel: {
      type: String,
      default: undefined,
    },
  },

  data () {
    return {
      modifiedSvgContent: null,
      auxElement: null,
      observer: null,
    };
  },

  computed: {
    iconClass () {
      return `d-icon d-icon--${this.name} ${ICON_SIZE_MODIFIERS[this.size]}`;
    },
  },

  watch: {
    name () {
      this.loadSvg();
    },
  },

  mounted () {
    this.loadSvg();
    this.setRefObserver();
  },

  beforeDestroy () {
    if (this.observer) {
      this.observer.disconnect();
    }
  },

  methods: {
    setDataName (str) {
      return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },

    setRefObserver () {
      if (!this.$refs.iconRef) return;

      this.observer = new MutationObserver(async (mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            await this.handleChildListMutation();
          } else if (mutation.type === 'attributes') {
            this.handleAttributesMutation();
          }
        }
      });

      this.observerConnect();
    },

    async handleChildListMutation () {
      if (!this.auxElement) {
        // Initial setup when the child (SVG) is first added
        await this.initializeSvgElement();
      } else {
        // Update SVG element when children change
        await this.updateSvgElement();
      }
    },

    handleAttributesMutation () {
      if (!this.auxElement) return;

      // Update auxElement attributes to match iconRef
      this.syncAttributes(this.auxElement, this.$refs.iconRef.attributes);

      // Reflect changes in the DOM
      const currentSvgElement = document.getElementById(this.id);
      if (currentSvgElement) {
        currentSvgElement.replaceWith(this.auxElement.cloneNode(true));
      }
    },

    async initializeSvgElement () {
      await this.loadSvg();

      const initialSvgElement = this.$refs.iconRef.children[0];

      this.syncAttributes(initialSvgElement, this.$refs.iconRef.attributes);

      this.auxElement = initialSvgElement.cloneNode(true);

      this.$refs.iconRef.replaceWith(initialSvgElement);
    },

    async updateSvgElement () {
      await this.loadSvg();

      const updatedSvgElement = this.$refs.iconRef.children[0];

      if (!updatedSvgElement) return;

      // Get updated SVG element attributes using cloneNode to avoid reference issues
      const auxUpdatedSvgElementAttributes = this.$refs.iconRef.children[0].cloneNode(true).attributes;

      // Add previous attributes to the updated SVG element
      this.syncAttributes(updatedSvgElement, this.auxElement.attributes);

      // Add current attributes to the updated SVG element (e.g. v-show attribute)
      this.syncAttributes(updatedSvgElement, this.$refs.iconRef.attributes);

      // Override auxElement attributes with the updated SVG element attributes
      // This will override for example viewBox attribute but will not override id (because it doesnt has it)
      this.syncAttributes(updatedSvgElement, auxUpdatedSvgElementAttributes);

      // Update auxElement with the updated SVG element
      this.auxElement = updatedSvgElement.cloneNode(true);

      const currentSvgElement = document.getElementById(this.id);

      currentSvgElement?.replaceWith(updatedSvgElement);
    },

    syncAttributes (targetElement, attributes) {
      // To avoid triggering the observer when setting attributes
      // we disconnect the observer, set the attributes, and then reconnect the observer
      this.observerDisconnect();

      Array.from(attributes).forEach(attr => {
        targetElement.setAttribute(attr.name, attr.value);
      });

      this.observerConnect();
    },

    observerConnect () {
      this.observer.observe(this.$refs.iconRef, { attributes: true, childList: true, subtree: true });
    },

    observerDisconnect () {
      this.observer.disconnect();
    },

    async loadSvg () {
      try {
        // Import svg in raw format
        const svgModule = await import(`./../../node_modules/@dialpad/dialtone-icons/dist/svg/${this.name}.svg?raw`);
        // Modify svg ids
        this.modifiedSvgContent = this.modifySvgIds(svgModule.default || svgModule);
      } catch (e) {
        console.error('Error loading SVG:', e);
      }
    },

    modifySvgIds (svgContent) {
      // Find all 'url(#id)' and 'id="id"' instances
      const idRegex = /url\(#([^)]+)\)|id="([^"]+)"/g;

      // Generate a unique ID
      const uniqueId = (originalId) => `${this._uid}-${originalId}`;

      // Replace all 'url(#id)' and 'id="id"' instances with 'url(#uniqueId)' and 'id="uniqueId"
      return svgContent.replace(idRegex, (match, urlId, normalId) => {
        const idToReplace = urlId || normalId;
        if (idToReplace) {
          return match.replace(idToReplace, uniqueId(idToReplace));
        }
        return match;
      });
    },
  },
};
</script>
