import { DtTooltip, TOOLTIP_DIRECTIONS } from '@/components/Tooltip';
import { getUniqueString } from '@/common/Utils';
import { createApp, h } from 'vue';
import deepEqual from 'deep-equal';
import { CONTENT_MODE_VALUES } from '@/common/mode_constants';

export const DtTooltipDirective = {
  name: 'dt-tooltip-directive',
  install (app) {
    const DEFAULT_PLACEMENT = 'top';
    if (!globalThis.__DtTooltipDirectiveApp) {
      const DtTooltipDirectiveApp = createApp({
        name: 'DtTooltipDirectiveApp',
        components: { DtTooltip },
        data () {
          return {
            tooltips: [],
          };
        },

        mounted () {
          globalThis.__DtTooltipDirectiveApp = this;
        },

        methods: {
          addOrUpdateTooltip (id, tooltipConfig) {
            const index = this.tooltips.findIndex(tooltip => tooltip.id === id);
            if (index !== -1) {
              // Update existing tooltip
              this.tooltips.splice(index, 1, { id, ...tooltipConfig });
            } else {
              // Add new tooltip
              this.tooltips.push({ id, ...tooltipConfig });
            }
          },

          removeTooltip (id) {
            this.tooltips = this.tooltips.filter(tooltip => tooltip.id !== id);
          },
        },

        render () {
          return h('div',
            this.tooltips.map(({ id, anchorElement, ...tooltipProps }) => {
              return h(DtTooltip, {
                key: id,
                ...tooltipProps,
                sticky: tooltipProps.sticky !== undefined ? tooltipProps.sticky : true,
                /**
                 * Set the delay to false when running tests only.
                 */
                delay: tooltipProps.delay !== undefined ? tooltipProps.delay : (process.env.NODE_ENV !== 'test'),
                externalAnchorElement: anchorElement,
              });
            }),
          );
        },
      });

      const mountPoint = document.createElement('div');
      document.body.appendChild(mountPoint);
      DtTooltipDirectiveApp.mount(mountPoint);
    }

    const tooltipApp = globalThis.__DtTooltipDirectiveApp;

    app.directive('dt-tooltip', {
      beforeMount (anchor, binding) {
        // Initial tooltip setup
        setupTooltip(anchor, binding);
      },
      updated (anchor, binding) {
        // Update tooltip on binding value change
        // Use deep equality check to prevent infinite loops when objects are passed
        if (!deepEqual(binding.value, binding.oldValue)) {
          setupTooltip(anchor, binding);
        }
      },
      unmounted (anchor) {
        tooltipApp.removeTooltip(anchor.getAttribute('data-dt-tooltip-id'));
      },
    });

    function setupTooltip (anchor, binding) {
      if (binding.value === null || binding.value === undefined) {
        const tooltipId = anchor.getAttribute('data-dt-tooltip-id');
        if (tooltipId) {
          tooltipApp.removeTooltip(tooltipId);
        }
        return;
      }
      const tooltipId = anchor.getAttribute('data-dt-tooltip-id') || getUniqueString();

      let tooltipConfig;
      if (typeof binding.value === 'string') {
        tooltipConfig = {
          message: binding.value,
          placement: binding.arg || DEFAULT_PLACEMENT,
        };
      } else if (typeof binding.value === 'object' && binding.value !== null) {
        tooltipConfig = {
          placement: binding.arg || binding.value.placement || DEFAULT_PLACEMENT,
          ...binding.value,
        };
      } else {
        console.error('DtTooltipDirective: binding value must be string, object, null or undefined');
        return;
      }

      Object.keys(binding.modifiers).forEach(modifier => {
        switch (modifier) {
          case 'inverted':
            tooltipConfig.inverted = true;
            break;
          case 'no-delay':
            tooltipConfig.delay = false;
            break;
          case 'no-transition':
            tooltipConfig.transition = false;
            break;
          default:
            if (CONTENT_MODE_VALUES.includes(modifier)) {
              tooltipConfig.contentMode = modifier;
            } else if (TOOLTIP_DIRECTIONS.includes(modifier)) {
              tooltipConfig.placement = modifier;
            }
            break;
        }
      });

      tooltipConfig.anchorElement = anchor;
      anchor.setAttribute('data-dt-tooltip-id', tooltipId);
      tooltipApp.addOrUpdateTooltip(tooltipId, tooltipConfig);
    }
  },
};

export default DtTooltipDirective;
