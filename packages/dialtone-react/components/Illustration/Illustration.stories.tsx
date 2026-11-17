import type { Meta, StoryObj } from '@storybook/react-vite';
import { DtIllustration, type DtIllustrationProps } from './Illustration';
import { ILLUSTRATION_NAMES } from './IllustrationConstants';

// Vue's getIllustrationNames(): every illustration name, after an empty choice.
const illustrationsList = [undefined, ...ILLUSTRATION_NAMES];

export const argTypesData = {
  name: {
    options: illustrationsList,
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
} satisfies Meta<DtIllustrationProps>['argTypes'];

export const argsData = {};

const meta = {
  title: 'Components/Illustration',
  component: DtIllustration,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<DtIllustrationProps>;

export default meta;
type Story = StoryObj<DtIllustrationProps>;

// dialtone-vue's IllustrationDefault.story.vue.
function IllustrationDefault ({ name }: DtIllustrationProps) {
  return <DtIllustration name={name} />;
}

export const Default: Story = {
  render: args => <IllustrationDefault {...args} />,

  args: {
    name: 'mind',
  },
};
