import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StandIn } from '../../.storybook/StandIn';
import { DtLazyShow, type DtLazyShowProps } from './LazyShow';

export const argTypesData = {
  // Slots
  children: {
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'ReactNode',
      },
    },
  },

  // Props
  transition: {
    options: ['', 'fade', 'slide-down', 'pop', 'shake'],
    control: {
      type: 'select',
    },
  },
} satisfies Meta<DtLazyShowProps>['argTypes'];

const meta = {
  title: 'Utilities/Lazy Show',
  component: DtLazyShow,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<typeof DtLazyShow>;

export default meta;
type Story = StoryObj<typeof meta>;

// LazyShowDefault.story.vue
function LazyShowDefaultStory ({ show = false, appear, transition }: DtLazyShowProps) {
  const [isShown, setIsShown] = useState(show);
  // Vue's `watch: { show }`: follow the arg when it changes.
  const [lastShow, setLastShow] = useState(show);
  if (show !== lastShow) {
    setLastShow(show);
    setIsShown(show);
  }

  return (
    <div>
      <StandIn for="button">
        <button
          type="button"
          data-qa="dt-button"
          className="base-button__button d-btn d-btn--primary"
          onClick={() => setIsShown(!isShown)}
        >
          <span data-qa="dt-button-label" className="base-button__label d-btn__label">Toggle</span>
        </button>
      </StandIn>
      <DtLazyShow show={isShown} appear={appear} transition={transition}>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Rick Astley — Never Gonna Give You Up"
        />
      </DtLazyShow>
    </div>
  );
}

export const Default: Story = {
  render: args => <LazyShowDefaultStory {...args} />,
  args: {},
};
