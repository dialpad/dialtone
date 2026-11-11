import type { ClassValue } from '../cx';
import { formatMessages, type ValidationMessage } from '../utils';
import type { ChildProps } from './useInput';

/** MessagesMixin's props. */
export interface MessagesProps {
  /** Used to customize the validation messages component */
  messagesClass?: ClassValue;
  /** A set of props that are passed into the validation messages component */
  messagesChildProps?: ChildProps;
  /** Used to hide / show the validation messages */
  showMessages?: boolean;
  /** Validation messages */
  messages?: (string | ValidationMessage)[];
}

export interface MessagesState {
  /** `messages` with strings turned into messages of the default type (critical). */
  formattedMessages: ValidationMessage[];
}

/** MessagesMixin: an input's validation messages. */
export function useMessages ({ messages }: Pick<MessagesProps, 'messages'>): MessagesState {
  return { formattedMessages: formatMessages(messages) };
}
