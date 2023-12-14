import DtHovercard from './hovercard.vue';

import DtHovercardDefaultTemplate from './hovercard_default_story.vue';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { action } from '@storybook/addon-actions';

export const argTypesData = {

};

export const argsData = {
  placement: 'bottom-end',
  contentWidth: null,
  sticky: false,
  offset: [50, 20],
  appendTo: 'body',
  onOpened: action('opened'),
  visuallyHiddenCloseLabel: 'Close popover',
};

const decorator = () => ({
  template: `<div style="background-color: var(--dt-theme-sidebar-color-background)" class="d-wmx264 d-p8"><story />
  </div>`,
});

export default {
  title: 'Components/Hovercard',
  component: DtHovercard,
  args: argsData,
  argTypes: argTypesData,
  decorators: [decorator],
  excludeStories: /.*Data$/,
};

const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtHovercardDefaultTemplate,
);
export const Default = {
  render: DefaultTemplate,

  args: {},
};
