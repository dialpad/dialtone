import { addons } from 'storybook/manager-api';
// The same manager as Vue's and React's (showRoots), so the sidebars match.
import '../../.storybook/manager';

// No addon panel: the args are in the comparison's own controls, under the frames.
addons.setConfig({ layoutCustomisations: { showPanel: () => false } });
