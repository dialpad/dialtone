let UNIQUE_ID_COUNTER = 0;
export const getUniqueString = () => `dt-icon${UNIQUE_ID_COUNTER++}`;

export default {
  getUniqueString,
};
