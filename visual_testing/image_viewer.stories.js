import { argsData, argTypesData, Default } from '@/components/image_viewer/image_viewer.stories.js';

import DtImageViewer from '@/components/image_viewer/image_viewer.vue';

export default {
  title: 'Visual Testing/Image Viewer',
  component: DtImageViewer,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
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
