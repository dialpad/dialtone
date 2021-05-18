import DtModal from './modal.vue';
import ModalMdx from './modal.mdx';
import { MODAL_KIND_MODIFIERS, MODAL_SIZE_MODIFIERS } from './modal_constants';
import { generateTemplate } from '../storybook_utils';
import DtButton from '../button/button';

export const argTypesData = {
  // Slots
  default: {
    table: {
      category: 'slot data',
      type: {
        summary: 'node',
      },
    },
  },

  footer: {
    table: {
      category: 'slot data',
      type: {
        summary: 'node',
      },
    },
  },

  header: {
    table: {
      category: 'slot data',
      type: {
        summary: 'node',
      },
    },
  },

  // Events
  'update:show': {
    description: `The modal will emit a "false" boolean value for this event when the \
user performs a modal-closing action.  Parent components can sync on this value to create \
a 2-way binding to control modal visibility.`,
    table: {
      type: {
        summary: 'boolean',
      },
    },
  },

  size: {
    control: {
      type: 'select',
      options: Object.keys(MODAL_SIZE_MODIFIERS),
    },
  },

  kind: {
    control: {
      type: 'select',
      options: Object.keys(MODAL_KIND_MODIFIERS),
    },
  },
};

// Default Props for all variations
export const argsData = {
  closeButtonProps: {
    ariaLabel: 'Close',
  },
  copy: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget lacus quis velit \
viverra iaculis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum \
maximus ipsum ex. Curabitur elementum luctus augue, quis eleifend tortor feugiat vel. \
Maecenas maximus, ipsum et laoreet congue, diam massa aliquam libero, at pellentesque \
orci ipsum et velit.`,
  show: true,
  title: 'Example Title',
};

export default {
  title: 'Elements/Modal',
  component: DtModal,
  parameters: {
    docs: {
      page: ModalMdx,
    },
  },
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

const modalTemplate = generateTemplate(DtModal, {
  customProps: ['class="d-p-static"'],
});
const defaultTemplate = (args, { argTypes }) => {
  return {
    components: { DtModal },
    template: modalTemplate,
    props: Object.keys(argTypes),
  };
};
export const Default = defaultTemplate.bind({});

const footerTemplate = generateTemplate(DtModal, {
  childTemplate: `
    <template #footer>
      <dt-button :kind="kind" importance="primary">Confirm</dt-button>
      <dt-button :kind="kind" importance="clear">Cancel</dt-button>
    </template>
  `,
  customProps: ['class="d-p-static"'],
});
const withFooterTemplate = (args, { argTypes }) => {
  return {
    components: { DtButton, DtModal },
    template: footerTemplate,
    props: Object.keys(argTypes),
  };
};
export const WithFooter = withFooterTemplate.bind({});

export const WithDangerStyle = withFooterTemplate.bind({});
WithDangerStyle.args = { kind: 'danger' };

export const WithFullSize = defaultTemplate.bind({});
WithFullSize.args = { size: 'full' };

const slotsTemplate = generateTemplate(DtModal, {
  childTemplate: `
    <template #header>
      <div class="d-fl-center d-p12 d-bgc-blue-100">
        <div>[custom header]</div>
      </div>
    </template>
    <div class="d-fl-center d-p32 d-bgc-yellow-300">
      <h2>[custom body]</h2>
    </div>
  `,
  customProps: ['class="d-p-static"'],
});
const withCustomHeaderAndContentTemplate = (args, { argTypes }) => {
  return {
    components: { DtButton, DtModal },
    template: slotsTemplate,
    props: Object.keys(argTypes),
  };
};
export const WithCustomHeaderAndContent = withCustomHeaderAndContentTemplate.bind({});
