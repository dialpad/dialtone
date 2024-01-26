<template>
  <div
    v-if="modifiedSvgContent"
    :id="id"
    ref="iconRef"
    data-qa="dt-icon"
    :aria-hidden="ariaLabel ? 'false' : 'true'"
    :aria-label="ariaLabel"
    :class="iconSize"
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
    };
  },

  computed: {
    iconSize () {
      return ICON_SIZE_MODIFIERS[this.size];
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
    setRefObserver () {
      const iconRef = this.$refs.iconRef;

      if (iconRef) {
        const observer = new MutationObserver(() => {
          if (!this.auxElement) {
            const svgElement = this.$refs.iconRef.children[0];
            Array.from(this.$refs.iconRef.attributes).forEach(attr => {
              svgElement.setAttribute(attr.name, attr.value);
            });
            this.auxElement = svgElement;

            this.$refs.iconRef.replaceWith(svgElement);
          } else {
            Array.from(this.$refs.iconRef.attributes).forEach(attr => {
              this.auxElement.setAttribute(attr.name, attr.value);
            });
          }
        });

        observer.observe(iconRef, { attributes: true, childList: true, subtree: true });

        this.observer = observer;
      }
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
