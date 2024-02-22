import { DtTooltip } from '@/components/tooltip';
import { getUniqueString } from '@/common/utils';
import { createApp, h } from 'vue';

export const DtTooltipDirective = {
  name: 'dt-tooltip-directive',
  install (app) {
    const mountPoint = document.createElement('div');
    document.body.appendChild(mountPoint);

    const DEFAULT_PLACEMENT = 'top';
    const DtTooltipDirectiveApp = createApp({
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

      render () {
        return h('div',
          this.tooltips.map(({ id, message, placement }) => {
            return h(DtTooltip, {
              key: id,
              message,
              placement,
              /**
               * Set the delay to false when running tests only.
               */
              delay: process.env.NODE_ENV !== 'test',
              externalAnchor: `[data-dt-tooltip-id="${id}"]`,
            });
          }),
        );
      },
    });

    DtTooltipDirectiveApp.mount(mountPoint);

    app.directive('dt-tooltip', {
      bind (anchor, binding) {
        // Initial tooltip setup
        setupTooltip(anchor, binding);
      },
      updated (anchor, binding) {
        // Update tooltip on binding value change
        if (binding.value !== binding.oldValue) {
          setupTooltip(anchor, binding);
        }
      },
      unmounted (anchor) {
        DtTooltipDirectiveApp._instance?.ctx.removeTooltip(anchor.getAttribute('data-dt-tooltip-id'));
      },
    });

    function setupTooltip (anchor, binding) {
      const tooltipId = anchor.getAttribute('data-dt-tooltip-id') || getUniqueString();
      const message = binding.value;
      const placement = binding.arg || DEFAULT_PLACEMENT;

      anchor.setAttribute('data-dt-tooltip-id', tooltipId);
      DtTooltipDirectiveApp._instance?.ctx.addOrUpdateTooltip(tooltipId, message, placement);
    }
  },
};

export default DtTooltipDirective;
