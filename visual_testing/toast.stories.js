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
import ToastMdx from './toast.mdx';

export default {
  title: 'Visual Testing/Toast',
  parameters: {
    docs: {
      page: ToastMdx,
    },
    options: { showPanel: false },
    a11y: {
      disable: true,
    },
  },
  args: { ...argsData, show: true },
  argTypes: argTypesData,
};

export { Default, Error, Info, Success, Warning, Important };
