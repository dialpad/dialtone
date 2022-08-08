<script>
import { DtEmoji } from '../emoji';
import { getEmojiJson, findEmojis, findShortCodes } from '@/common/emoji';

export default {
  name: 'DtEmojiTextWrapper',

  components: {
    DtEmoji,
  },

  inheritAttrs: false,

  props: {
    /**
     * The type of element to use for the wrapper.
     */
    elementType: {
      type: String,
      default: 'div',
    },
  },

  data () {
    return {
      loadingEmojiJson: true,
    };
  },

  async created () {
    await getEmojiJson();
    this.loadingEmojiJson = false;
  },

  methods: {
    /**
     * Replaces the valid codes from the text content with a DtEmoji component.
     * @returns {Array<VNode|string>}
     */
    replaceDtEmojis (replaceList, textContent) {
      const regexp = new RegExp(`(${replaceList.join('|')})`, 'g');
      const split = textContent.split(regexp);
      return split.map((item) => {
        if (replaceList.includes(item)) {
          return this.$createElement(DtEmoji, {
            attrs: { class: 'd-mx4 d-d-inline-block' },
            props: { code: item, ...this.$attrs },
          });
        }
        return item;
      });
    },

    /**
     * Recursively search the Vue virtual DOM to find text
     * @param VNode
     * @returns {VNode|*}
     */
    searchVNodes (VNode) {
      // If VNode has no tag, it is a text node
      if (!VNode.tag && VNode.text) {
        return this.searchCodes(VNode.text);
      }

      const children = VNode.children ? VNode.children.map(VNodeChild => this.searchVNodes(VNodeChild)) : [];
      return this.$createElement(VNode.tag, VNode.data, children);
    },

    // TODO: Find a way to crawl vue components
    replaceVueComponentVNodeContent (VNode) {
      //
    },

    /**
     * Find codes in text.
     * @param textContent string
     * @returns {Array<VNode|string>|string}
     */
    searchCodes (textContent) {
      const shortcodes = findShortCodes(textContent);
      const emojis = findEmojis(textContent);

      const replaceList = [...shortcodes, ...emojis];
      if (replaceList.length === 0) return textContent;
      return this.replaceDtEmojis(replaceList, textContent);
    },
  },

  render (h) {
    const defaultSlotContent = this.$slots.default || [];
    return h(
      this.elementType,
      this.loadingEmojiJson
        ? defaultSlotContent
        : defaultSlotContent.map(VNode => this.searchVNodes(VNode)),
    );
  },
};
</script>
