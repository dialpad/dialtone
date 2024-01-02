import { ref } from 'vue';
import { TOOLTIP_DELAY_MS } from '@/components/tooltip/index.js';

export default (function () {
  const current = ref(null);
  let timerLeave, timerEnter;
  let start = null;
  let prevCard = null;

  function enter (id) {
    if (prevCard) {
      const time = Date.now() - start + 100;
      if (timerLeave) clearTimeout(timerLeave);
      if (prevCard !== id) {
        timerLeave = setTimeout(
          () => {
            if (current.value !== null) {
              start = Date.now();
            }
            current.value = null;
          },
          time,
        );
        if (timerEnter) clearTimeout(timerEnter);
        timerEnter = setTimeout(
          () => {
            current.value = id;
            prevCard = id;
          },
          time,
        );
      }
    } else {
      timerEnter = setTimeout(() => {
        current.value = id;
        prevCard = id;
      }, TOOLTIP_DELAY_MS);
    }
  }

  function leave () {
    if (timerEnter) {
      clearTimeout(timerEnter);
      timerEnter = null;
    }
    start = Date.now();
    timerLeave = setTimeout(() => {
      current.value = null;
      prevCard = null;
    }, TOOLTIP_DELAY_MS);
  }

  let instance = null;

  return () => {
    if (instance === null) {
      instance = { current, enter, leave };
    }
    return instance;
  };
})();
