import { expect, userEvent, waitFor, within } from 'storybook/test';
import KitchenSinkView from './KitchenSinkView.vue';
import { createTemplateFromVueFile } from '@/common/storybook_utils';

const componentLoaders = import.meta.glob(['../**/*.stories.js', '!../kitchen_sink/**']);

export default {
  title: 'Kitchen Sink',
  tags: ['!autodocs'],
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    percy: { skip: true },
    // This gallery combines independent demo pages. Check its navigation here;
    // component accessibility is checked in each component's own stories.
    a11y: {
      context: {
        include: ['[data-qa="kitchen-sink-navigation"]', '[data-qa="kitchen-sink-section-heading"]'],
      },
    },
  },
};

const Template = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, KitchenSinkView);

export const Components = {
  render: Template,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.queryByText('Loading components...')).not.toBeInTheDocument(), { timeout: 10000 });
    const sections = [...canvasElement.querySelectorAll('.kitchen-sink__section')];
    expect(sections.length).toBeGreaterThan(0);
    expect(canvas.queryByText(/Failed (to render |story imports:)/)).not.toBeInTheDocument();

    const navigation = canvasElement.querySelector('[data-qa="kitchen-sink-navigation"]');
    const links = within(navigation).getAllByRole('link').filter(link => link.hash);
    expect(links.map(link => link.hash.slice(1))).toEqual(sections.map(section => section.id));
    for (const section of sections) {
      expect(within(section).getByRole('link', { name: 'View Story' })).toHaveAttribute('href', expect.stringContaining('/?path=/story/'));
      expect(section.querySelectorAll('[data-qa="kitchen-sink-variant"]').length).toBeGreaterThan(0);
    }

    await userEvent.click(links[1]);
    await waitFor(() => expect(sections[1].getBoundingClientRect().top)
      .toBeLessThan(canvasElement.ownerDocument.defaultView.innerHeight), { timeout: 3000 });
    links[0].focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(sections[0].getBoundingClientRect().top).toBeGreaterThanOrEqual(0), { timeout: 3000 });
  },
  args: {
    title: 'Kitchen Sink: Components',
    itemLabel: 'components',
    iframeUrl: '/iframe.html?id=kitchen-sink--components&viewMode=story',
    loaders: componentLoaders,
  },
};
