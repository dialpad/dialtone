import { DtTooltip, TOOLTIP_DIRECTIONS } from '@/components/tooltip';
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
        addTooltip (id, message, placement) {
          this.tooltips.push({ id, message, placement });
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

    const isValidBindingTextValue = (value) => typeof value === 'string' && value?.trim();
    const isValidBindingPlacementValue = (value) => value === undefined || TOOLTIP_DIRECTIONS.includes(value);

    app.directive('dt-tooltip', {
      beforeMount (anchor, binding) {
        if (!isValidBindingTextValue(binding.value)) {
          // eslint-disable-next-line no-console
          console.warn(
            'Missing value for v-dt-tooltip directive on: ',
            anchor,
            'received value: ',
            binding.value,
          );
          return;
        }
        if (!isValidBindingPlacementValue(binding.arg)) {
          // eslint-disable-next-line no-console
          console.warn(
            'Wrong placement value provided for v-dt-tooltip directive on: '
            , anchor,
            'received value: ',
            binding.arg);
          return;
        }

        const tooltipId = getUniqueString();
        const message = binding.value;
        const placement = binding.arg || DEFAULT_PLACEMENT;

        anchor.setAttribute('data-dt-tooltip-id', tooltipId);
        DtTooltipDirectiveApp._instance?.ctx.addTooltip(tooltipId, message, placement);
      },
      unmounted (anchor) {
        DtTooltipDirectiveApp._instance?.ctx.removeTooltip(anchor.getAttribute('data-dt-tooltip-id'));
      },
    });
  },
};

export default DtTooltipDirective;
