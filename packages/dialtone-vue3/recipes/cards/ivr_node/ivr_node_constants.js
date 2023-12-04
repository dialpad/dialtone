export const IVR_NODE_PROMPT_MENU = 'promptmenu';
export const IVR_NODE_PROMPT_COLLECT = 'promptcollect';
export const IVR_NODE_PROMPT_PLAY = 'promptplay';
export const IVR_NODE_EXPERT = 'gotoexpert';
export const IVR_NODE_GO_TO = 'goto';
export const IVR_NODE_BRANCH = 'branch';
export const IVR_NODE_TRANSFER = 'transfer';
export const IVR_NODE_HANGUP = 'hangup';

export const IVR_NODE_ICON_TYPES = {
  [IVR_NODE_PROMPT_MENU]: 'keypad',
  [IVR_NODE_PROMPT_COLLECT]: 'dialer',
  [IVR_NODE_PROMPT_PLAY]: 'volume-2',
  [IVR_NODE_EXPERT]: 'expert-node',
  [IVR_NODE_BRANCH]: 'branch',
  [IVR_NODE_GO_TO]: 'call-merge',
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
  [IVR_NODE_TRANSFER]: 'Transfer',
  [IVR_NODE_HANGUP]: 'Hangup',
};

const IVR_NODE_COLORS = {
  PROMPT: {
    normal: 'd-bc-blue-200',
    selected: 'd-bc-blue-300',
  },
  LOGIC: {
    normal: 'd-bc-purple-200',
    selected: 'd-bc-purple-400',
  },
  TERMINAL: {
    normal: 'd-bc-red-100',
    selected: 'd-bc-red-200',
  },
};

export const IVR_NODE_COLOR_MAPPING = {
  [IVR_NODE_PROMPT_MENU]: IVR_NODE_COLORS.PROMPT,
  [IVR_NODE_PROMPT_COLLECT]: IVR_NODE_COLORS.PROMPT,
  [IVR_NODE_PROMPT_PLAY]: IVR_NODE_COLORS.PROMPT,
  [IVR_NODE_EXPERT]: IVR_NODE_COLORS.LOGIC,
  [IVR_NODE_BRANCH]: IVR_NODE_COLORS.LOGIC,
  [IVR_NODE_GO_TO]: IVR_NODE_COLORS.LOGIC,
  [IVR_NODE_TRANSFER]: IVR_NODE_COLORS.TERMINAL,
  [IVR_NODE_HANGUP]: IVR_NODE_COLORS.TERMINAL,
};
