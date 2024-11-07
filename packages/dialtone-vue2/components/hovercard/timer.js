import { TOOLTIP_DELAY_MS } from '@/components/tooltip/index.js';

export default (function () {
  const current = { value: null };
  let timerLeave, timerEnter;

  // Handles the timer for when the event that opens the hovercard
  // is triggered.
  // If no hovercard is active, it sets a delay of TOOLTIP_DELAY_MS.
  // If there was an active hovercard, the delay depends on the time it takes
  // to move from one anchor to the other.
  function enter (id, enterDelay = TOOLTIP_DELAY_MS) {
    console.log('nina start to enter', id);
    if (timerLeave) clearTimeout(timerLeave);
    timerEnter = setTimeout(() => {
      console.log('nina enter', id);
      current.value = id;
    }, enterDelay);
    // }
  }

  // Handles the timer for when the event that closes the hovercard
  // is triggered.
  function leave (leaveDelay = TOOLTIP_DELAY_MS) {
    console.log('nina start to leave', current.value);
    if (timerEnter) {
      clearTimeout(timerEnter);
      timerEnter = null;
    }
    timerLeave = setTimeout(() => {
      console.log('nina leave', current.value);
      current.value = null;
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
