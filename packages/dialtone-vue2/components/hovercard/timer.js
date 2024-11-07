import { TOOLTIP_DELAY_MS } from '@/components/tooltip/index.js';

export default (function () {
  const current = { value: null };
  let timerLeave, timerEnter;
  let start = null;
  let prevCard = null;

  // Handles the timer for when the event that opens the hovercard
  // is triggered.
  // If no hovercard is active, it sets a delay of TOOLTIP_DELAY_MS.
  // If there was an active hovercard, the delay depends on the time it takes
  // to move from one anchor to the other.
  function enter (id, enterDelay = TOOLTIP_DELAY_MS) {
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
      }, enterDelay);
    }
  }

  // Handles the timer for when the event that closes the hovercard
  // is triggered.
  function leave (leaveDelay = TOOLTIP_DELAY_MS) {
    if (timerEnter) {
      clearTimeout(timerEnter);
      timerEnter = null;
    }
    start = Date.now();
    timerLeave = setTimeout(() => {
      current.value = null;
      prevCard = null;
    }, leaveDelay);
  }

  let instance = null;

  return () => {
    if (instance === null) {
      instance = { current, enter, leave };
    }
    return instance;
  };
})();
