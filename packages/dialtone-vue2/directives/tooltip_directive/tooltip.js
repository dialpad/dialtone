import { DtTooltip, TOOLTIP_DIRECTIONS } from '@/components/tooltip';
import { getUniqueString } from '@/common/utils';

export const DtTooltipDirective = {
  name: 'dt-tooltip-directive',
  install (Vue) {
    const mountPoint = document.createElement('div');
    document.body.appendChild(mountPoint);

    const DEFAULT_PLACEMENT = 'top';
    const DtTooltipDirectiveApp = new Vue({
      name: 'DtTooltipDirectiveApp',
      components: { DtTooltip },
      data () {
        return {
          tooltips: [],
        };
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

      render (h) {
        return h('div',
          {
            domProps: { id: 'dt-tooltip-directive-app' },
          },
          [
            this.tooltips.map(({ id, ...tooltipProps }) => {
              return h(DtTooltip, {
                key: id,
                props: {
                  ...tooltipProps,
                  sticky: tooltipProps.sticky !== undefined ? tooltipProps.sticky : true,
                  /**
                   * Set the delay to false when running tests only.
                   */
                  delay: tooltipProps.delay !== undefined ? tooltipProps.delay : (process.env.NODE_ENV !== 'test'),
                  externalAnchor: `[data-dt-tooltip-id="${id}"]`,
                },
              });
            }),
          ],
        );
      },
    });

    DtTooltipDirectiveApp.$mount(mountPoint);

    Vue.directive('dt-tooltip', {
      bind (anchor, binding) {
        // Initial tooltip setup
        setupTooltip(anchor, binding);
      },
      update (anchor, binding) {
        // Update tooltip on binding value change
        if (binding.value !== binding.oldValue) {
          setupTooltip(anchor, binding);
        }
      },
      unbind (anchor) {
        DtTooltipDirectiveApp.removeTooltip(anchor.getAttribute('data-dt-tooltip-id'));
      },
    });

    function setupTooltip (anchor, binding) {
      if (binding.value === null || binding.value === undefined) {
        const tooltipId = anchor.getAttribute('data-dt-tooltip-id');
        if (tooltipId) {
          DtTooltipDirectiveApp.removeTooltip(tooltipId);
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
            if (TOOLTIP_DIRECTIONS.includes(modifier)) {
              tooltipConfig.placement = modifier;
            }
            break;
        }
      });

      anchor.setAttribute('data-dt-tooltip-id', tooltipId);
      DtTooltipDirectiveApp.addOrUpdateTooltip(tooltipId, tooltipConfig);
    }
  },
};

export default DtTooltipDirective;
