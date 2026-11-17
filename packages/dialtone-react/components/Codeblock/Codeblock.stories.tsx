import type { Meta, StoryObj } from '@storybook/react-vite';
import { DtStack } from '../Stack';
import { DtCodeblock, type DtCodeblockProps } from './Codeblock';

type CodeblockStoryArgs = DtCodeblockProps;

export const argTypesData = {
  // Props
  text: {
    control: {
      type: 'text',
    },
  },
  bordered: {
    control: { type: 'boolean' },
  },

  size: {
    control: { type: 'select' },
    options: ['xs', 'sm', 'md', 'lg'],
  },
} satisfies Meta<CodeblockStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Codeblock',
  component: DtCodeblock,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<CodeblockStoryArgs>;

export default meta;
type Story = StoryObj<CodeblockStoryArgs>;

// CodeblockDefault.story.vue
function CodeblockDefault ({ text, bordered, size }: CodeblockStoryArgs) {
  return <DtCodeblock text={text} bordered={bordered} size={size} />;
}

// CodeblockVariants.story.vue
const variantsText = 'function someFunction() {\n  return "some result";\n}';

function CodeblockVariants () {
  return (
    <DtStack gap="100">
      <div>
        <h4>Default (sm)</h4>
        <DtCodeblock text={variantsText} />
      </div>
      <div>
        <h4>xs</h4>
        <DtCodeblock text={variantsText} size={100} />
      </div>
      <div>
        <h4>md</h4>
        <DtCodeblock text={variantsText} size={300} />
      </div>
      <div>
        <h4>lg</h4>
        <DtCodeblock text={variantsText} size={400} />
      </div>
      <div>
        <h4>Bordered</h4>
        <DtCodeblock text={variantsText} bordered />
      </div>
    </DtStack>
  );
}

export const Default: Story = {
  render: args => <CodeblockDefault {...args} />,

  args: {
    text: 'function someFunction() {\n  return "some result";\n}',
    bordered: false,
    size: 200,
  },
};

export const Variants: Story = {
  render: () => <CodeblockVariants />,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};
