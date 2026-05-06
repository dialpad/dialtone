import { createSuggestionRenderer } from '../Utils/SuggestionUtils';
import SlashCommandSuggestion from './SlashCommandSuggestion.vue';

export default {

  // This function comes from the user and passed to the editor directly.
  // This will also activate the mention plugin on the editor
  // items: ({ query }) => { return [] },

  allowSpaces: true,
  startOfLine: true,

  render: createSuggestionRenderer(SlashCommandSuggestion, 'slash-command'),
};
