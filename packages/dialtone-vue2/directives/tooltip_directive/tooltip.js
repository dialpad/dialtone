import { DtTooltip } from '@/components/tooltip';
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
        addOrUpdateTooltip (id, message, placement) {
          const index = this.tooltips.findIndex(tooltip => tooltip.id === id);
          if (index !== -1) {
            // Update existing tooltip
            this.tooltips[index].message = message;
            this.tooltips[index].placement = placement;
          } else {
            // Add new tooltip
            this.tooltips.push({ id, message, placement });
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
            this.tooltips.map(({ id, message, placement }) => {
              return h(DtTooltip, {
                key: id,
                props: {
                  message,
                  placement,
                  sticky: true,
                  /**
                   * Set the delay to false when running tests only.
                   */
                  delay: process.env.NODE_ENV !== 'test',
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
      const tooltipId = anchor.getAttribute('data-dt-tooltip-id') || getUniqueString();
      const message = binding.value;
      const placement = binding.arg || DEFAULT_PLACEMENT;

      anchor.setAttribute('data-dt-tooltip-id', tooltipId);
      DtTooltipDirectiveApp.addOrUpdateTooltip(tooltipId, message, placement);
    }
  },
};

export default DtTooltipDirective;
