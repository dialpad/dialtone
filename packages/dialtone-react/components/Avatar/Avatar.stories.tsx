import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import {
  DtIconContacts,
  DtIconHash,
  DtIconHashBold,
  DtIconHear,
  DtIconInbox,
  DtIconLock,
  DtIconLockFilled,
  DtIconUser,
} from '../../icons';
import { DtIcon, type DtIconProps, ICON_NAMES, type IconName } from '../Icon';
import { DtStack } from '../Stack';
import { DtAvatar, type DtAvatarProps } from './Avatar';
import { AVATAR_SIZE_MODIFIERS, AVATAR_PRESENCE_STATES, type AvatarSize } from './AvatarConstants';

// `iconName` and `overlayIcon` name an icon, as in Vue: the templates render it into the matching slot.
type AvatarStoryArgs = Omit<DtAvatarProps, 'overlayIcon'> & {
  iconName?: IconName;
  iconSize?: DtIconProps['size'];
  overlayIcon?: IconName;
};

// Vue's getIconNames(): every icon name, after an empty choice.
const ICONS_LIST = [undefined, ...ICON_NAMES];

// Served from dialtone-vue's assets (the Storybook's staticDirs), the file Vue's story imports.
const defaultImage = '/avatar2.png';

export const argsData = {
  onClick: action('click'),
  size: 300,
  presence: null,
  fullName: 'Jaqueline Nackos',
  imageAlt: 'profile image',
  imageSrc: defaultImage,
  seed: '',
  iconName: 'accessibility',
  iconSize: '500',
} satisfies Partial<AvatarStoryArgs>;

export const argTypesData = {
  // Props
  avatarClass: {
    description: 'Pass through classes. Used to customize the avatar container',
  },
  // react-docgen reports these as unions of numbers; a plain select keeps them drivable from the URL.
  family: {
    control: 'select',
    options: [undefined, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  variant: {
    control: 'select',
    options: [undefined, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  iconName: {
    options: ICONS_LIST,
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
  iconSize: {
    control: 'select',
    options: ['100', '200', '300', '400', '500', '600', '700', '800'],
  },
  id: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  overlayClass: {
    description: 'Pass through classes. Used to customize the avatar overlay',
  },
  overlayIcon: {
    options: ICONS_LIST,
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
  overlayText: {
    description: 'The text that overlays the avatar',
  },
  presence: {
    control: {
      type: 'select',
    },
    options: Object.values(AVATAR_PRESENCE_STATES),
    table: {
      defaultValue: {
        summary: 'null',
      },
    },
  },
  presenceProps: {
    description: 'Pass through props. Used to customize the presence component',
  },
  size: {
    control: {
      type: 'select',
    },
    options: Object.keys(AVATAR_SIZE_MODIFIERS),
  },

  // Action Event Handlers
  onClick: {
    table: {
      disable: true,
    },
  },
} satisfies Meta<AvatarStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Avatar',
  component: DtAvatar,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<AvatarStoryArgs>;

export default meta;
type Story = StoryObj<AvatarStoryArgs>;

// AvatarDefault.story.vue
function AvatarDefault (args: AvatarStoryArgs) {
  return (
    <DtAvatar
      id={args.id}
      fullName={args.fullName}
      imageSrc={args.imageSrc}
      imageAlt={args.imageAlt}
      size={args.size}
      presence={args.presence}
      avatarClass={args.avatarClass}
      canvasClass={args.canvasClass}
      iconClass={args.iconClass}
      seed={args.seed}
      group={args.group}
      overlayText={args.overlayText}
      overlayClass={args.overlayClass}
      interactive={args.interactive}
      onClick={args.onClick}
      icon={args.iconName ? <DtIcon name={args.iconName} size={args.iconSize} /> : undefined}
      overlayIcon={args.overlayIcon ? <DtIcon name={args.overlayIcon} size="300" /> : undefined}
    />
  );
}

const avatarSizes = Object.keys(AVATAR_SIZE_MODIFIERS) as AvatarSize[];
const groupSizes = ['100', '150', '200', '250', '300', '400', '500'] as const;

function Section ({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

// AvatarVariants.story.vue
function AvatarVariants ({ seed, imageSrc, imageAlt }: AvatarStoryArgs) {
  const iconOnlyIcons = [DtIconHash, DtIconHashBold, DtIconLock, DtIconLockFilled, DtIconInbox, DtIconContacts];

  return (
    <DtStack gap="200">
      <Section title="Image">
        <DtStack direction="row" gap="200" align="center">
          {avatarSizes.map(size => (
            <DtAvatar
              key={`image-${size}`}
              seed={seed}
              size={size}
              fullName="Avatar Image"
              imageSrc={imageSrc}
              imageAlt={imageAlt}
            />
          ))}
        </DtStack>
      </Section>
      <Section title="Initials">
        <DtStack direction="row" gap="200" align="center">
          {avatarSizes.map(size => (
            <DtAvatar key={`initials-${size}`} seed={seed} size={size} fullName="Avatar Icon" />
          ))}
        </DtStack>
      </Section>
      <Section title="Icon">
        <DtStack direction="row" gap="200" align="center">
          {avatarSizes.map(size => (
            <DtAvatar key={`icon-${size}`} seed={seed} size={size} fullName="Avatar Icon" icon={<DtIconUser />} />
          ))}
        </DtStack>
      </Section>
      <Section title="Icon Only (Transparent Background)">
        <DtStack direction="row" gap="200" align="center">
          {iconOnlyIcons.map(Icon => (
            <DtAvatar key={Icon.displayName} iconOnly size="300" icon={<Icon />} />
          ))}
        </DtStack>
      </Section>
      <Section title="Deactivated">
        <DtStack direction="row" gap="200" align="center">
          <DtAvatar
            seed={seed}
            size="300"
            fullName="Deactivated User"
            imageSrc={imageSrc}
            imageAlt={imageAlt}
            deactivated
          />
          <DtAvatar seed={seed} size="300" fullName="Deactivated User" deactivated />
          <DtAvatar seed={seed} size="300" deactivated icon={<DtIconUser />} />
        </DtStack>
      </Section>
      <Section title="Presence">
        <DtStack direction="row" gap="200" align="center">
          {Object.values(AVATAR_PRESENCE_STATES).map(state => (
            <DtAvatar
              key={`presence-${state}`}
              seed={seed}
              size={300}
              fullName="Person avatar"
              imageSrc={imageSrc}
              imageAlt={imageAlt}
              presence={state}
            />
          ))}
        </DtStack>
      </Section>
      <Section title="Overlay">
        <DtStack direction="row" gap="200">
          <DtAvatar
            seed={seed}
            size={500}
            fullName="Person avatar"
            imageSrc={imageSrc}
            imageAlt={imageAlt}
            overlayIcon={<DtIconHear />}
          />
          <DtAvatar
            seed={seed}
            size={500}
            fullName="Person avatar"
            imageSrc={imageSrc}
            imageAlt={imageAlt}
            overlayText="+3"
          />
        </DtStack>
      </Section>
      <Section title="Interactive">
        <DtStack direction="row" gap="200">
          <DtAvatar seed={seed} fullName="Person avatar" interactive />
          <DtAvatar seed={seed} iconAriaLabel="user icon" interactive icon={<DtIconUser />} />
          <DtAvatar seed={seed} fullName="Person avatar" imageSrc={imageSrc} imageAlt={imageAlt} interactive />
        </DtStack>
      </Section>
      {([
        ['Group (Single Digit)', 'group', 'group-initials', 3, 5],
        ['Group (Double Digit)', 'group-double', 'group-double-initials', 12, 12],
        ['Group (Triple Digit)', 'group-triple', 'group-triple-initials', 120, 120],
      ] as const).map(([title, imageKey, initialsKey, imageGroup, initialsGroup]) => (
        <Section key={title} title={title}>
          <DtStack direction="row" gap="200" align="center">
            {groupSizes.map(size => (
              <DtAvatar
                key={`${imageKey}-${size}`}
                seed={seed}
                size={size}
                fullName="Person avatar"
                imageSrc={imageSrc}
                imageAlt={imageAlt}
                group={imageGroup}
              />
            ))}
          </DtStack>
          <DtStack direction="row" gap="200" align="center" className="d-mbs-100">
            {groupSizes.map(size => (
              <DtAvatar
                key={`${initialsKey}-${size}`}
                seed={seed}
                size={size}
                fullName="Person avatar"
                group={initialsGroup}
              />
            ))}
          </DtStack>
        </Section>
      ))}
    </DtStack>
  );
}

// Stories
export const Default: Story = {
  render: args => <AvatarDefault {...args} />,
  decorators: [
    Story => (
      <DtStack direction="row">
        <Story />
      </DtStack>
    ),
  ],
};

export const Variants: Story = {
  render: args => <AvatarVariants {...args} />,
  parameters: {
    percy: {
      args: {
        seed: 'seed',
      },
    },
    options: { showPanel: false },
    controls: { disable: true },
  },
};
