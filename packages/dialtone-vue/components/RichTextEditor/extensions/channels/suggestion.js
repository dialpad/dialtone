import { createSuggestionRenderer } from '../utils/SuggestionUtils';
import ChannelSuggestion from './ChannelSuggestion.vue';

export default {

  // This function comes from the user and passed to the editor directly.
  // This will also activate the mention plugin on the editor
  // items: ({ query }) => { return [] },

  allowSpaces: true,

  render: createSuggestionRenderer(ChannelSuggestion, 'channel'),
};
