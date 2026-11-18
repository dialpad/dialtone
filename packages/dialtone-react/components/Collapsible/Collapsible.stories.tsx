import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { DtCollapsible, type DtCollapsibleProps } from './Collapsible';

// Slots are args named as in Vue: `anchor` and `content` are HTML strings, as CollapsibleDefault.story.vue renders
// them with v-html.
type CollapsibleStoryArgs = Omit<DtCollapsibleProps, 'anchor' | 'content'> & {
  anchor?: string;
  content?: string;
};

export const argsData: Partial<CollapsibleStoryArgs> = {
  anchorText: 'Click me to toggle Content',
  onOpened: action('opened'),
};

const argTypesData = {
  // Slots
  anchor: {
    control: 'text',
    table: {
      type: {
        summary: 'ReactNode',
      },
    },
  },
  content: {
    control: 'text',
    table: {
      type: {
        summary: 'ReactNode',
      },
    },
  },

  // Props
  anchorText: {
    description: 'Text on the anchor if slot is unused.',
    table: {
      type: { summary: 'string' },
    },
    control: {
      type: 'text',
    },
  },

  id: {
    table: {
      defaultValue: { summary: 'generated unique ID' },
    },
  },

  maxHeight: {
    control: { type: 'text' },
  },
  maxWidth: {
    control: { type: 'text' },
  },
  elementType: {
    control: { type: 'text' },
  },
  contentElementType: {
    control: { type: 'text' },
  },
  anchorClass: {
    description: 'Additional class name for the anchor wrapper element.',
  },
  contentClass: {
    description: 'Additional class name for the content wrapper element.',
  },
  ariaLabel: {
    control: { type: 'text' },
  },
  ariaLabelledBy: {
    control: { type: 'text' },
  },
  open: {
    control: { type: 'boolean' },
  },

  // Action Event Handlers
  onOpened: {
    description: 'Called whenever the content is collapsed or expanded.',
    table: {
      type: { summary: 'event' },
    },
  },
  onOpenChange: {
    table: {
      disable: true,
    },
  },
} satisfies Meta<CollapsibleStoryArgs>['argTypes'];

const meta = {
  title: 'Components/Collapsible',
  component: DtCollapsible,
  argTypes: argTypesData,
  args: argsData,
  excludeStories: /.Data$/,
} satisfies Meta<CollapsibleStoryArgs>;

export default meta;
type Story = StoryObj<CollapsibleStoryArgs>;

// CollapsibleDefault.story.vue
function CollapsibleDefault ({
  id, anchorText, maxHeight, maxWidth, open, defaultOpen, elementType, contentElementType, anchorClass, contentClass,
  ariaLabel, ariaLabelledBy, onOpened, anchor, content,
}: CollapsibleStoryArgs) {
  // Vue's `isOpen` data, starting from the `open` arg and following it.
  const [isOpen, setIsOpen] = useState(open);
  const [lastOpen, setLastOpen] = useState(open);
  if (open !== lastOpen) {
    setLastOpen(open);
    setIsOpen(open);
  }

  return (
    <DtCollapsible
      id={id}
      anchorText={anchorText}
      maxHeight={maxHeight}
      maxWidth={maxWidth}
      open={isOpen ?? null}
      // React-only: the starting state while `open` is unset. Read on mount only.
      defaultOpen={defaultOpen}
      // As in Vue's template, which passes these as attributes: they reach the root element.
      initial-focus-element="first"
      elementType={elementType}
      contentElementType={contentElementType}
      anchorClass={anchorClass}
      contentClass={contentClass}
      ariaLabel={ariaLabel}
      // Vue's story declares no props, so every arg falls through to its single root `DtCollapsible` as well. That
      // is how `ariaLabelledBy` reaches the prop there, alongside the `aria-labelledby` attribute its template binds.
      ariaLabelledBy={ariaLabelledBy}
      aria-labelledby={ariaLabelledBy ?? undefined}
      onOpened={onOpened}
      anchor={anchor
        ? ({ attrs }) => <div {...attrs} dangerouslySetInnerHTML={{ __html: anchor }} />
        : undefined}
      content={content
        ? <div dangerouslySetInnerHTML={{ __html: content }} />
        : (
          <div className="d-ai-center d-fs-16">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam et ex risus. In id
              pellentesque tellus. In hac habitasse platea dictumst. Suspendisse nec egestas nulla. Nam
              fermentum nisi sit amet arcu fringilla, in porta libero volutpat. Proin ac odio egestas,
              luctus magna a, luctus leo. Maecenas eget orci vel nibh sollicitudin maximus quis at quam.
              Curabitur imperdiet lacus nec malesuada pharetra. Nullam leo mi, suscipit at arcu vitae,
              vestibulum rutrum eros.
            </p>
            <p>
              Mauris convallis, elit quis imperdiet aliquet, elit elit tincidunt dui, at tincidunt
              ligula metus ac tortor. Vestibulum vehicula, nibh pulvinar consequat faucibus, turpis
              metus tempus dui, eu facilisis risus risus at ipsum. Praesent feugiat nibh non ipsum
              facilisis, volutpat ullamcorper dui vehicula. Nunc mollis dui porta purus tristique
              aliquam sed at turpis. Phasellus in aliquet sem, sed consequat turpis. Suspendisse
              potenti. Aenean vitae leo quam. Fusce ipsum nulla, egestas at eros sit amet, consectetur
              consectetur turpis. Fusce sit amet tellus rutrum, sollicitudin ante porta, consequat
              dolor. Quisque ut nulla iaculis, eleifend neque in, euismod massa. Sed pulvinar erat nec
              interdum porttitor. Pellentesque interdum tincidunt nisl, nec finibus augue faucibus sit
              amet. Morbi vestibulum rhoncus tristique. Duis at vehicula nulla. Sed hendrerit est id
              lacus placerat cursus. Cras in lacus sit amet ligula ullamcorper vehicula vitae porttitor
              est.
            </p>
          </div>
          )}
    />
  );
}

export const Default: Story = {
  render: args => <CollapsibleDefault {...args} />,

  args: {
    maxWidth: '512px',
  },
};
