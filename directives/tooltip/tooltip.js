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
          this.tooltips.push({ id, message, placement, show: false });
        },

        hideTooltip (id) {
          const tooltipIndex = this.tooltips.findIndex(tooltip => tooltip.id === id);
          this.tooltips[tooltipIndex].show = false;
        },

        removeTooltip (id) {
          this.tooltips = this.tooltips.filter(tooltip => tooltip.id !== id);
        },

        showTooltip (id) {
          const tooltipIndex = this.tooltips.findIndex(tooltip => tooltip.id === id);
          this.tooltips[tooltipIndex].show = true;
        },
      },

      render () {
        return h('div',
          this.tooltips.map(({ id, message, placement, show }) => {
            return h(DtTooltip, {
              key: id,
              message,
              placement,
              show,
              externalAnchor: `[data-dt-tooltip-id="${id}"]`,
            });
          }),
        );
      },
    });

    DtTooltipDirectiveApp.mount(mountPoint);

    const isValidBindingTextValue = (value) => typeof value === 'string' && value?.trim();
    const isValidBindingPlacementValue = (value) => value === undefined || TOOLTIP_DIRECTIONS.includes(value);

    function showTooltipListener (event) {
      const tooltipId = event.target.getAttribute('data-dt-tooltip-id');
      DtTooltipDirectiveApp._instance?.ctx.showTooltip(tooltipId);
    }

    function hideTooltipListener (event) {
      if (event.type === 'keydown' && event.code !== 'Escape') return;
      const tooltipId = event.target.getAttribute('data-dt-tooltip-id');
      DtTooltipDirectiveApp._instance?.ctx.hideTooltip(tooltipId);
    }

    function addAnchorEventListeners (anchor) {
      ['focusin', 'mouseenter'].forEach(listener => {
        anchor.addEventListener(listener, (event) => showTooltipListener(event));
      });
      ['focusout', 'mouseleave', 'keydown'].forEach(listener => {
        anchor.addEventListener(listener, (event) => hideTooltipListener(event));
      });
    }

    function removeAnchorEventListeners (anchor) {
      ['focusin', 'mouseenter'].forEach(listener => {
        anchor.removeEventListener(listener, (event) => showTooltipListener(event));
      });
      ['focusout', 'mouseleave', 'keydown'].forEach(listener => {
        anchor.removeEventListener(listener, (event) => hideTooltipListener(event));
      });
    }

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
        addAnchorEventListeners(anchor);
      },
      unmounted (anchor) {
        removeAnchorEventListeners(anchor);
        DtTooltipDirectiveApp._instance?.ctx.removeTooltip(anchor.getAttribute('data-dt-tooltip-id'));
      },
    });
  },
};

export default DtTooltipDirective;
