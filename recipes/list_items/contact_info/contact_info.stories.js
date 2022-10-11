/* eslint-disable max-lines */
import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtRecipeContactInfo from './contact_info';
import DtRecipeContactInfoMdx from './contact_info.mdx';
import DtRecipeContactInfoDefaultTemplate from './contact_info_default.story';
import DtRecipeContactInfoVariantsTemplate from './contact_info_variants.story';
import { USER_STATUS_COLOR_MODIFIERS } from './contact_info_constants';
import { AVATAR_COLOR_MODIFIERS } from '@/components/avatar/avatar_constants';

// Default Prop Values
export const argsData = {
};

export const argTypesData = {
  // Props
  id: {
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'generated unique ID' },
    },
  },
  role: {
    table: {
      type: { summary: 'string' },
    },
  },

  avatarColor: {
    control: {
      type: 'select',
    },
    options: Object.keys(AVATAR_COLOR_MODIFIERS),
  },

  userStatusColor: {
    control: {
      type: 'select',
    },
    options: Object.keys(USER_STATUS_COLOR_MODIFIERS),
  },

  // Slots
  header: {
    description: 'Slot for header information',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },

  subtitle: {
    description: 'Slot for subtitle information',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },

  bottom: {
    description: 'Slot for information at the bottom',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },

  right: {
    description: 'Slot for the right content',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },
};

// Story Collection
export default {
  title: 'Recipes/List Items/Contact Info',
  component: DtRecipeContactInfo,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    docs: {
      page: DtRecipeContactInfoMdx,
    },
    controls: {
      sort: 'requiredFirst',
    },
    options: { showPanel: true },
  },
};

// Templates
const DefaultTemplate = (args) => createTemplateFromVueFile(
  args,
  DtRecipeContactInfoDefaultTemplate,
);
const VariantsTemplate = (args) => createTemplateFromVueFile(
  args,
  DtRecipeContactInfoVariantsTemplate,
);

const avatarImage = require('./avatar.png');

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {
  avatarSrc: avatarImage,
  avatarInitials: 'JL',
  avatarColor: 'base',
  userStatusColor: 'green',
  header: `<div class="d-fs-200 d-fw-bold">
  Joseph Lumaban
</div>`,

  subtitle: `<div class="d-fs12 d-mt2">
  +1 (415) 123-4567
</div>`,

  bottom: `<div class="d-d-flex d-ai-center d-mtn6">
  <div class="d-w8 d-h8 d-mr4 d-bgc-magenta-200">
    &nbsp;
  </div>
  <div class="d-fs-100 d-mr4">
    Aerolabs Support
  </div>
</div>`,
};

Default.parameters = {
  docs: {
    source: {
      code: `
<dt-recipe-contact-info
  :avatar-src="avatarSrc"
  :user-status-color="userStatusColor"
>
  <template #header>
    <div class="d-fs-200 d-fw-bold d-mr4">Joseph Lumaban</div>
  </template>
  <template #subtitle>
    <div class="d-d-flex d-ai-center">
      <div class="d-fs-100 d-mt2">+1 (415) 123-4567</div>
      <icon-checkbox-filled class="d-fc-black-500 d-svg--size14 d-va-text-bottom" />
    </div>
  </template>
  <template #bottom>
    <div class="d-d-flex d-ai-center d-mtn6">
      <div class="d-w8 d-h8 d-mr4 d-bgc-magenta-200">&nbsp;</div>
      <div class="d-fs-100 d-mr4">Aerolabs Support</div>
    </div>
  </template>
</dt-recipe-contact-info>
      `,
    },
  },
  a11y: {
    config: {
      rules: [
        {
          id: 'aria-allowed-attr',
          enabled: false,
        },
        // Verify why contact info and avatar aren't getting unique IDs
        {
          id: 'duplicate-id-active',
          enabled: false,
        },
      ],
    },
  },
};

export const Variants = VariantsTemplate.bind({});
Variants.args = {
  avatarInitials: 'NW',
  avatarColor: 'orange-500',
  userStatusColor: 'gold',
  onGroupContactClick: action('click: clickable group contact'),
  onMarkAsSpam: action('click: mark this contact as spam'),
  onConnectToARecord: action('click: connect to a record'),
};

Variants.parameters = {
  docs: {
    source: {
      code: `
<div class="d-divide-y d-divide-purple-400">
  <div class="d-m32">
    <p class="d-my16 d-fs-200 d-fw-bold">Unknown contact (phone number only) with attestation</p>
    <dt-recipe-contact-info>
      <template #header>
        <div class="d-d-flex d-ai-center d-mb2">
          <div class="d-fs-200 d-fw-bold d-mr4">+1 (415) 123-4567</div>
          <icon-checkbox-filled class="d-fc-black-500 d-svg--size14" />
        </div>
      </template>
      <template #subtitle>San Francisco, California</template>
    </dt-recipe-contact-info>
  </div>
  <div class="d-m32">
    <p class="d-my16 d-fs-200 d-fw-bold">Unknown contact with "marked as spam" button</p>
    <dt-recipe-contact-info>
      <template #header>
        <div class="d-d-flex d-ai-center d-mb2">
          <div class="d-fs-200 d-fw-bold d-mr4">+1 (415) 123-4567</div>
        </div>
      </template>
      <template #subtitle>
        <div class="d-fc-red-300" @click.stop="onMarkAsSpam">Mark as spam</div>
      </template>
    </dt-recipe-contact-info>
  </div>
  <div class="d-m32">
    <p class="d-my16 d-fs-200 d-fw-bold">Clickable Group contact</p>
    <dt-button
      importance="clear"
      kind="muted"
      @click="onGroupContactClick"
    >
      <dt-recipe-contact-info>
        <template #header>
          <div class="d-fs-200 d-fw-bold d-mr4">Joseph Lumaban</div>
        </template>
        <template #subtitle>
          <div class="d-d-flex d-ai-center">
            <div class="d-fs-100 d-mt2">+1 (415) 123-4567</div>
            <icon-checkbox-filled class="d-fc-black-500 d-svg--size14 d-va-text-bottom" />
          </div>
        </template>
        <template #bottom>
          <div class="d-d-flex d-ai-center d-mtn6">
            <div class="d-w8 d-h8 d-mr4 d-bgc-magenta-200">&nbsp;</div>
            <div class="d-fs-100 d-mr4">Aerolabs Support</div>
          </div>
        </template>
      </dt-recipe-contact-info>
    </dt-button>
  </div>
  <div class="d-m32">
    <p class="d-my16 d-fs-200 d-fw-bold">Group contact with transfer info</p>
    <dt-recipe-contact-info>
      <template #header><div class="d-fs-200 d-fw-bold d-mr4">Joseph Lumaban</div></template>
      <template #subtitle>
        <div class="d-d-flex d-ai-center">
          <div class="d-fs-100 d-mt2">+1 (415) 123-4567</div>
          <icon-checkbox-filled class="d-fc-black-500 d-svg--size14 d-va-text-bottom" />
        </div>
      </template>
      <template #bottom>
        <div class="d-d-flex d-ai-center d-mtn6">
          <div class="d-w8 d-h8 d-mr4 d-bgc-magenta-200">&nbsp;</div>
          <div class="d-fs-100 d-mr4">Aerolabs Support</div>
          <div class="d-fw-bold d-fs-100">• Transfer from Billing Support</div>
        </div>
      </template>
    </dt-recipe-contact-info>
  </div>
  <div class="d-m32">
    <p class="d-my16 d-fs-200 d-fw-bold">Admin view / listening in</p>
    <dt-recipe-contact-info>
      <template #header>
        <div class="d-d-flex d-ai-center d-mb2">
          <div class="d-fw-bold d-fs-200">Joseph Lumaban & Justin H.</div>
          <div class="d-fs-200">(Agent)</div>
        </div>
      </template>
      <template #subtitle>
        <div class="d-d-flex d-ai-center">
          <div class="d-fs-100 d-mt2">+1 (415) 123-4567</div>
          <icon-checkbox-filled class="d-fc-black-500 d-svg--size14 d-va-text-bottom" />
        </div>
      </template>
      <template #bottom>
        <div class="d-d-flex d-ai-center d-mtn6">
          <div class="d-w8 d-h8 d-mr4 d-bgc-magenta-200">&nbsp;</div>
          <div class="d-fs-100 d-mr4">Aerolabs Support</div>
        </div>
      </template>
    </dt-recipe-contact-info>
  </div>
  <div class="d-m32">
    <p class="d-my16 d-fs-200 d-fw-bold">Contact with items in right slot</p>
    <dt-recipe-contact-info
      :avatar-initials="avatarInitials"
      :avatar-color="avatarColor"
    >
      <template #header><div class="d-fw-bold d-fs-200">Natalie Woods</div></template>
      <template #subtitle>+1 (415) 123-4567</template>
      <template #right>
        <div class="d-d-flex d-ai-center d-m16">
          <icon-chat class="d-m4" />
          <icon-menu-horizontal class="d-m4" />
          <div class="d-m4">0:32</div>
        </div>
      </template>
      <template #bottom>
        2 matches found.
        <dt-button link @click.stop="onConnectToARecord">Connect to a record</dt-button>
      </template>
    </dt-recipe-contact-info>
  </div>
</div>
`,
    },
  },
  controls: {
    disable: true,
  },
  actions: {
    disable: true,
  },
  options: {
    showPanel: false,
  },
  a11y: Default.parameters.a11y,
};
