import {
  argsData,
  argTypesData,
  Default,
} from '@/components/image_viewer/image_viewer.stories';

export default {
  title: 'Visual Testing/Image Viewer',
  parameters: {
    percy: {
      queryParams: {
        viewMode: 'story',
      },
    },
    options: { showPanel: false },
    a11y: {
      disable: true,
    },
  },
  args: {
    ...argsData,
    open: true,
  },
  argTypes: argTypesData,
};
export { Default };
