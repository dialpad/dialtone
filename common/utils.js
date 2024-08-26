let UNIQUE_ID_COUNTER = 0;
export function getUniqueString (prefix = 'dt') {
  return `${prefix}${UNIQUE_ID_COUNTER++}`;
}

const scheduler = typeof setImmediate === 'function' ? setImmediate : setTimeout;
export function flushPromises () {
  return new Promise((resolve) => {
    scheduler(resolve);
  });
}

export default {
  getUniqueString,
  flushPromises,
};
