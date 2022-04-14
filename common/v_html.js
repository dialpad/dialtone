import { defineComponent } from 'vue';

//
//  v-html component
//  <v-html :html="HTML_STRING" />
//
export default defineComponent({
  name: 'VHtml',
  directives: {
    swap: {
      mounted (el, binding) {
        // createContextualFragment allows script execution
        // why you would probably want to sanitize the html
        // e.g. using https://github.com/cure53/DOMPurify
        const safe = binding.value;

        const frag = document.createRange()
          .createContextualFragment(safe);
        el.replaceWith(frag);
      },
    },
  },

  props: {
    // eslint-disable-next-line vue/no-unused-properties
    html: {
      type: String,
      required: true,
    },
  },

  template: '<div v-swap="html"></div>',
});
