import { useId, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StandIn } from '../../.storybook/StandIn';
import { DtText } from '../../components/Text/Text';
import { useFocusTrap, type FocusTrapValue } from './useFocusTrap';

export const argsData = {};

export const argTypesData = {};

const meta = {
  title: 'Directives/Focustrap',
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const DIALOG_CLASS = 'd-w-500 d-p-300 d-bar-400 d-bc-default d-ba d-bgc-primary';

// Stack, Button, Input and Link aren't ported: Vue's components as they render.
function Stack ({ row = false, gap, children }: { row?: boolean; gap: string; children: ReactNode }) {
  return (
    <StandIn for="stack">
      <div data-qa="dt-stack" className={`d-stack ${row ? 'd-stack--row ' : ''}d-stack--gap-${gap}`}>
        {children}
      </div>
    </StandIn>
  );
}

function Button ({ kind, importance, onClick, children }: {
  kind?: string;
  importance?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  const classes = ['base-button__button', 'd-btn', importance && `d-btn--${importance}`, kind && `d-btn--${kind}`];
  return (
    <StandIn for="button">
      <button data-qa="dt-button" type="button" className={classes.filter(Boolean).join(' ')} onClick={onClick}>
        <span data-qa="dt-button-label" className="base-button__label d-btn__label">{children}</span>
      </button>
    </StandIn>
  );
}

function Input ({ id, label, placeholder }: { id?: string; label: string; placeholder: string }) {
  const generated = useId();
  const inputId = id ?? generated;
  return (
    <StandIn for="input">
      <div data-qa="dt-input" className="base-input">
        <label className="d-label" htmlFor={inputId}>
          <span data-qa="dt-input-label-wrapper" className="d-label__label-wrapper">{label}</span>
        </label>
        <div className="d-input__root">
          <input id={inputId} data-qa="dt-input-input" className="d-input" type="text" placeholder={placeholder} />
        </div>
      </div>
    </StandIn>
  );
}

function Link ({ href, children }: { href: string; children: ReactNode }) {
  return (
    <StandIn for="link">
      <a data-qa="dt-link" className="d-link d-link--default" href={href}>{children}</a>
    </StandIn>
  );
}

function TrapDialog ({ value, label, children }: { value?: FocusTrapValue; label: string; children: ReactNode }) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useFocusTrap(el, value);
  return <div ref={setEl} role="dialog" aria-label={label} className={DIALOG_CLASS}>{children}</div>;
}

// -- Default: always-active trap with buttons and input ------
function FocustrapDefault () {
  return (
    <TrapDialog label="Settings">
      <Stack gap="200">
        <DtText as="p" kind="body" size={200}>Tab and Shift+Tab cycle within this container.</DtText>
        <Stack gap="200">
          <Input label="Name" placeholder="Jane Doe" />
          <Input label="Email" placeholder="jane@example.com" />
          <Stack row gap="100">
            <Button>Save</Button>
            <Button kind="muted" importance="clear">Cancel</Button>
          </Stack>
          <DtText as="p">
            <Link href="#">Terms and conditions</Link>
          </DtText>
        </Stack>
      </Stack>
    </TrapDialog>
  );
}

export const Default: Story = {
  render: () => <FocustrapDefault />,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};

// -- Initial focus via CSS selector -------------------------
function FocustrapInitialFocusSelector () {
  return (
    <TrapDialog value={{ initialFocus: '#focus-target' }} label="Initial focus demo">
      <Stack gap="200">
        <DtText as="p" kind="body" size={200}>
          Initial focus goes to the email input via <code>#focus-target</code> selector.
        </DtText>
        <Stack gap="200">
          <Input label="Name" placeholder="Jane Doe" />
          <Input id="focus-target" label="Email (initially focused)" placeholder="jane@example.com" />
          <Stack row gap="100">
            <Button>Submit</Button>
            <Button kind="muted" importance="clear">Cancel</Button>
          </Stack>
        </Stack>
      </Stack>
    </TrapDialog>
  );
}

export const InitialFocusSelector: Story = {
  render: () => <FocustrapInitialFocusSelector />,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};

// -- Toggle activation with focus restoration ----------------
function FocustrapToggleActivation () {
  const [isActive, setIsActive] = useState(false);
  return (
    <Stack gap="200">
      <DtText as="p">
        <Button kind="muted" importance="outlined" onClick={() => setIsActive(!isActive)}>
          {isActive ? 'Deactivate trap' : 'Activate trap'}
        </Button>
      </DtText>
      <TrapDialog value={{ active: isActive, restoreFocus: true }} label="Toggle demo">
        <Stack gap="200">
          <DtText as="p" kind="body" size={200}>
            Trap is <strong>{isActive ? 'active' : 'inactive'}</strong>.
            When deactivated, focus returns to the toggle button.
          </DtText>
          <Stack gap="200">
            <Input label="First name" placeholder="Jane" />
            <Input label="Last name" placeholder="Doe" />
            <Stack row gap="100">
              <Button>Save</Button>
              <Button kind="muted" importance="outlined" onClick={() => setIsActive(false)}>Cancel</Button>
            </Stack>
          </Stack>
        </Stack>
      </TrapDialog>
    </Stack>
  );
}

export const ToggleActivation: Story = {
  render: () => <FocustrapToggleActivation />,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};

// -- No initial focus — focus stays where it was -------------
function FocustrapNoInitialFocus () {
  return (
    <TrapDialog value={{ initialFocus: false }} label="No initial focus demo">
      <Stack gap="200">
        <DtText as="p" kind="body" size={200}>
          <code>initialFocus: false</code> &mdash; focus stays where it was before the trap activated.
          Tab still cycles within the container.
        </DtText>
        <Stack gap="200">
          <Input label="Search" placeholder="Type to search..." />
          <Stack row gap="100">
            <Button>Apply</Button>
            <Button kind="muted" importance="outlined">Reset</Button>
          </Stack>
        </Stack>
      </Stack>
    </TrapDialog>
  );
}

export const NoInitialFocus: Story = {
  render: () => <FocustrapNoInitialFocus />,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};
