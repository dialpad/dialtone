export const IVR_NODE_PROMPT_MENU = 'promptmenu';
export const IVR_NODE_PROMPT_COLLECT = 'promptcollect';
export const IVR_NODE_PROMPT_PLAY = 'promptplay';
export const IVR_NODE_EXPERT = 'gotoexpert';
export const IVR_NODE_BRANCH = 'branch';
export const IVR_NODE_GO_TO = 'goto';
export const IVR_NODE_ASSIGN = 'assign';
export const IVR_NODE_CUSTOMER_DATA = 'customerdata';
export const IVR_NODE_TRANSFER = 'transfer';
export const IVR_NODE_HANGUP = 'hangup';

export const IVR_NODE_ICON_TYPES = {
  [IVR_NODE_PROMPT_MENU]: 'keypad',
  [IVR_NODE_PROMPT_COLLECT]: 'dialer',
  [IVR_NODE_PROMPT_PLAY]: 'volume-2',
  [IVR_NODE_EXPERT]: 'expert-node',
  [IVR_NODE_BRANCH]: 'branch',
  [IVR_NODE_GO_TO]: 'call-merge',
  [IVR_NODE_ASSIGN]: 'chevrons-right',
  [IVR_NODE_CUSTOMER_DATA]: 'list-bullet',
  [IVR_NODE_TRANSFER]: 'transfer',
  [IVR_NODE_HANGUP]: 'phone-hang-up',
};

export const IVR_NODE_LABELS = {
  [IVR_NODE_PROMPT_MENU]: 'Menu',
  [IVR_NODE_PROMPT_COLLECT]: 'Collect',
  [IVR_NODE_PROMPT_PLAY]: 'Play',
  [IVR_NODE_EXPERT]: 'Expert',
  [IVR_NODE_BRANCH]: 'Branch',
  [IVR_NODE_GO_TO]: 'Go-to',
  [IVR_NODE_ASSIGN]: 'Assign',
  [IVR_NODE_CUSTOMER_DATA]: 'Customer Data',
  [IVR_NODE_TRANSFER]: 'Transfer',
  [IVR_NODE_HANGUP]: 'Hangup',
};

const IVR_NODE_CLASSES = {
  PROMPT: {
    normal: 'd-recipe-ivr-node-prompt',
    selected: 'd-recipe-ivr-node-prompt--selected',
  },
  LOGIC: {
    normal: 'd-recipe-ivr-node-logic',
    selected: 'd-recipe-ivr-node-logic--selected',
  },
  TERMINAL: {
    normal: 'd-recipe-ivr-node-terminal',
    selected: 'd-recipe-ivr-node-terminal--selected',
  },
};

export const IVR_NODE_CLASS_MAPPING = {
  [IVR_NODE_PROMPT_MENU]: IVR_NODE_CLASSES.PROMPT,
  [IVR_NODE_PROMPT_COLLECT]: IVR_NODE_CLASSES.PROMPT,
  [IVR_NODE_PROMPT_PLAY]: IVR_NODE_CLASSES.PROMPT,
  [IVR_NODE_EXPERT]: IVR_NODE_CLASSES.LOGIC,
  [IVR_NODE_BRANCH]: IVR_NODE_CLASSES.LOGIC,
  [IVR_NODE_GO_TO]: IVR_NODE_CLASSES.LOGIC,
  [IVR_NODE_ASSIGN]: IVR_NODE_CLASSES.LOGIC,
  [IVR_NODE_CUSTOMER_DATA]: IVR_NODE_CLASSES.LOGIC,
  [IVR_NODE_TRANSFER]: IVR_NODE_CLASSES.TERMINAL,
  [IVR_NODE_HANGUP]: IVR_NODE_CLASSES.TERMINAL,
};
