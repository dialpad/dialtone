import {
  argsData,
  argTypesData,
  Default,
  Error,
  Info,
  Success,
  Warning,
  Important,
} from '@/components/toast/toast.stories';


import DtToast from '@/components/toast/toast.vue';

export default {
  title: 'Visual Testing/Toast',
  component: DtToast,
  parameters: {
    options: { showPanel: false },
    a11y: {
      disable: true,
    },
  },
  args: { ...argsData, show: true, duration: 0 },
  argTypes: argTypesData,
};

export { Default, Error, Info, Success, Warning, Important };
