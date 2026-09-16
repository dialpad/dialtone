import DtButton from '@/components/Button/Button.vue';
import DtInput from '@/components/Input/Input.vue';
import DtLink from '@/components/Link/Link.vue';
import { DtText } from '@/components/Text';

export const argsData = {};
export const argTypesData = {};

export default {
  title: 'Directives/Focustrap',
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// -- Helper: inline story with single source of truth --------
const inline = (components, template) => ({
  render: () => ({ components, template }),
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    docs: { source: { code: template, language: 'html' } },
  },
});

// -- Default: always-active trap with buttons and input ------
export const Default = inline({ DtButton, DtInput, DtLink, DtText }, `\
<div
  v-dt-focustrap
  role="dialog"
  aria-label="Settings"
  class="d-w-500 d-p-300 d-bar-400 d-bc-default d-ba d-bgc-primary"
>
  <dt-stack gap="200">
    <dt-text as="p" kind="body" :size="200">Tab and Shift+Tab cycle within this container.</dt-text>
    <dt-stack gap="200">
      <dt-input label="Name" placeholder="Jane Doe" />
      <dt-input label="Email" placeholder="jane@example.com" />
      <dt-stack direction="row" gap="100">
        <dt-button>Save</dt-button>
        <dt-button kind="muted" importance="clear">Cancel</dt-button>
      </dt-stack>
      <dt-text as="p">
        <dt-link href="#">Terms and conditions</dt-link>
      </dt-text>
    </dt-stack>
  </dt-stack>
</div>`);

// -- Initial focus via CSS selector -------------------------
export const InitialFocusSelector = inline({ DtButton, DtInput, DtText }, `\
<div
  v-dt-focustrap="{ initialFocus: '#focus-target' }"
  role="dialog"
  aria-label="Initial focus demo"
  class="d-w-500 d-p-300 d-bar-400 d-bc-default d-ba d-bgc-primary"
>
  <dt-stack gap="200">
    <dt-text as="p" kind="body" :size="200">Initial focus goes to the email input via <code>#focus-target</code> selector.</dt-text>
    <dt-stack gap="200">
      <dt-input label="Name" placeholder="Jane Doe" />
      <dt-input id="focus-target" label="Email (initially focused)" placeholder="jane@example.com" />
      <dt-stack direction="row" gap="100">
        <dt-button>Submit</dt-button>
        <dt-button kind="muted" importance="clear">Cancel</dt-button>
      </dt-stack>
    </dt-stack>
  </dt-stack>
</div>`);

// -- Toggle activation with focus restoration ----------------
export const ToggleActivation = {
  render: () => ({
    components: { DtButton, DtInput, DtText },
    data () {
      return { isActive: false };
    },
    template: `\
<dt-stack gap="200">
  <dt-text as="p">
    <dt-button @click="isActive = !isActive" kind="muted" importance="outlined">
      {{ isActive ? 'Deactivate trap' : 'Activate trap' }}
    </dt-button>
  </dt-text>
  <div
    v-dt-focustrap="{ active: isActive, restoreFocus: true }"
    role="dialog"
    aria-label="Toggle demo"
    class="d-w-500 d-p-300 d-bar-400 d-bc-default d-ba d-bgc-primary"
  >
    <dt-stack gap="200">
      <dt-text as="p" kind="body" :size="200">
        Trap is <strong>{{ isActive ? 'active' : 'inactive' }}</strong>.
        When deactivated, focus returns to the toggle button.
      </dt-text>
      <dt-stack gap="200">
        <dt-input label="First name" placeholder="Jane" />
        <dt-input label="Last name" placeholder="Doe" />
        <dt-stack direction="row" gap="100">
          <dt-button>Save</dt-button>
          <dt-button kind="muted" importance="outlined" @click="isActive = false">Cancel</dt-button>
        </dt-stack>
      </dt-stack>
    </dt-stack>
  </div>
</dt-stack>`,
  }),
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    docs: {
      source: {
        code: `\
<dt-button @click="isActive = !isActive">
  {{ isActive ? 'Deactivate trap' : 'Activate trap' }}
</dt-button>
<div
  v-dt-focustrap="{ active: isActive, restoreFocus: true }"
  role="dialog"
  aria-label="Toggle demo"
>
  <dt-input label="First name" />
  <dt-input label="Last name" />
  <dt-button>Save</dt-button>
  <dt-button @click="isActive = false">Cancel</dt-button>
</div>`,
        language: 'html',
      },
    },
  },
};

// -- No initial focus — focus stays where it was -------------
export const NoInitialFocus = inline({ DtButton, DtInput, DtText }, `\
<div
  v-dt-focustrap="{ initialFocus: false }"
  role="dialog"
  aria-label="No initial focus demo"
  class="d-w-500 d-p-300 d-bar-400 d-bc-default d-ba d-bgc-primary"
>
  <dt-stack gap="200">
    <dt-text as="p" kind="body" :size="200">
      <code>initialFocus: false</code> &mdash; focus stays where it was before the trap activated.
      Tab still cycles within the container.
    </dt-text>
    <dt-stack gap="200">
      <dt-input label="Search" placeholder="Type to search..." />
      <dt-stack direction="row" gap="100">
        <dt-button>Apply</dt-button>
        <dt-button kind="muted" importance="outlined">Reset</dt-button>
      </dt-stack>
    </dt-stack>
  </dt-stack>
</div>`);
