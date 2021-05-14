// import { action } from '@storybook/addon-actions';
import HsButton, {
  BUTTON_SIZE_MODIFIERS,
  BUTTON_KIND_MODIFIERS,
  BUTTON_IMPORTANCE_MODIFIERS,
  BUTTON_TYPES,
  ICON_POSITIONS,
  LINK_KIND_MODIFIERS,
} from './button';
import IconCamera from '@dialpad/dialtone/lib/dist/vue/icons/IconCamera.vue';
import IconStar from '@dialpad/dialtone/lib/dist/vue/icons/IconStar.vue';
import BaseButtonMdx from './button.mdx';
import { generateTemplate } from '../storybook_utils';

export const argTypesData = {
  // Slot data
  text: {
    description: 'Button text',
    defaultValue: 'Button',
    table: {
      category: 'slot data',
      defaultValue: {
        summary: '\'Button\'',
      },
      type: {
        summary: 'node',
      },
    },
    control: 'text',
  },

  // Props
  disabled: {
    description: 'native "disabled" prop',
    defaultValue: false,
    type: {
      summary: 'boolean',
    },
    table: {
      category: 'native props',
      defaultValue: {
        summary: 'false',
      },
    },
    control: 'boolean',
  },
  width: {
    table: {
      category: 'native props',
      defaultValue: {
        summary: 'auto',
      },
    },
    control: {
      type: 'text',
    },
  },

  // Buttons
  importance: {
    control: {
      type: 'select',
      options: Object.keys(BUTTON_IMPORTANCE_MODIFIERS),
    },
  },
  type: {
    control: {
      type: 'select',
      options: BUTTON_TYPES,
    },
  },
  size: {
    control: {
      type: 'select',
      options: Object.keys(BUTTON_SIZE_MODIFIERS),
    },
  },
  kind: {
    control: {
      type: 'select',
      options: Object.keys(BUTTON_KIND_MODIFIERS),
    },
  },

  // Links
  link: {
    defaultValue: false,
    type: {
      summary: 'boolean',
    },
    table: {
      category: 'Link props',
      defaultValue: {
        summary: 'false',
      },
    },
    control: 'boolean',
  },
  linkKind: {
    table: {
      category: 'Link props',
    },
    control: {
      type: 'select',
      options: Object.keys(LINK_KIND_MODIFIERS),
    },
  },
  linkInverted: {
    defaultValue: false,
    type: {
      summary: 'boolean',
    },
    table: {
      category: 'Link props',
      defaultValue: {
        summary: 'false',
      },
    },
    control: 'boolean',
  },

  // Args related to icons.
  icon: {
    control: {
      type: 'select',
      options: ['', 'IconCamera', 'IconStar'],
    },
    table: {
      category: 'Icon props',
      type: {
        summary: 'node',
      },
    },
  },
  iconPosition: {
    table: {
      category: 'Icon props',
    },
    control: {
      type: 'select',
      options: ICON_POSITIONS,
    },
  },
};

export const argsData = {
  disabled: false,
};

// const decorator = {

// };

export default {
  title: 'Elements/Buttons',
  component: HsButton,
  parameters: {
    docs: {
      page: BaseButtonMdx,
    },
  },
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

const baseButtonTemplate = generateTemplate(HsButton, {
  customProps: [':disabled="disabled"', ':style="{ width }"'],
  childTemplate: '{{ text }}<template #icon><component :is="icon" /></template>',
});

const Template = (_args, { argTypes }) => {
  return {
    components: { HsButton, IconCamera, IconStar },
    template: baseButtonTemplate,
    props: Object.keys(argTypes),
  };
};

const invertedTemplate = `<div class="d-background-color--slate-light \
d-border-radius--md d-p16 d-flow16"><story /></div>`;

export const Default = Template.bind({});

export const Clear = Template.bind({});
Clear.args = { importance: 'clear' };

export const Outlined = Template.bind({});
Outlined.args = { importance: 'outlined' };

export const Disabled = Template.bind({});
Disabled.args = { disabled: true };

export const Danger = Template.bind({});
Danger.args = { kind: 'danger', text: 'Danger!' };
Danger.parameters = {
  docs: {
    source: {
      code: '<hs-button kind="danger">Danger!</hs-button>',
    },
  },
};

export const Inverted = Template.bind({});
Inverted.args = { kind: 'inverted' };
Inverted.decorators = [() => ({
  template: invertedTemplate,
})];
Inverted.parameters = {
  docs: {
    source: {
      code: '<hs-button inverted>Button</hs-button>',
    },
  },
};

export const WithIcon = Template.bind({});
WithIcon.args = { icon: 'IconStar', width: '300px' };
WithIcon.decorators = [() => ({
  template: '<div><story /><p>Use the iconPosition prop to control the position of the icon in the button.</p></div>',
})];
WithIcon.parameters = {
  docs: {
    source: {
      code: `
<hs-button>
  Button
  <icon-star #icon />
</hs-button>
    `,
    },
  },
};

export const Circle = Template.bind({});
Circle.args = { circle: true, importance: 'outlined', icon: 'IconCamera' };
Circle.parameters = {
  docs: {
    source: {
      code: `
<hs-button circle importance="outline">
  <icon-camera #icon />
</hs-button>
    `,
    },
  },
};

export const Link = Template.bind({});
Link.args = { link: true, text: 'Link' };
Link.parameters = {
  docs: {
    source: {
      code: '<hs-button link>Link</hs-button>',
    },
  },
};

export const InvertedLink = Template.bind({});
InvertedLink.args = { link: true, linkInverted: true, text: 'Link' };
InvertedLink.decorators = [() => ({
  template: invertedTemplate,
})];

export const ExtraSmall = Template.bind({});
ExtraSmall.args = { size: 'xs' };

export const Small = Template.bind({});
Small.args = { size: 'sm' };

export const Large = Template.bind({});
Large.args = { size: 'lg' };

export const ExtraLarge = Template.bind({});
ExtraLarge.args = { size: 'xl' };
