// Ambient types for runtime dependencies that ship none. They live in Phase 0 because unit PRs never touch
// package.json or tsconfig. Keep them to the surface the Vue components use; widen only when a port needs more.

declare module 'regex-combined-emojis' {
  /** Source of a RegExp matching any emoji sequence, with escaped \uXXXX surrogates. */
  export const emojiPattern: string;
  /** Same pattern with the surrogates already unescaped into literal characters. */
  export const compactEmojiPattern: string;
}

declare module '@dialpad/dialtone-emojis' {
  export interface Emoji {
    name: string;
    category: string;
    shortname: string;
    shortname_alternates: string[];
    keywords: string[];
    unicode_output: string;
    unicode_character: string;
  }

  /** Emojis keyed by "<Category><SkinTone>", e.g. PeopleDefault or ActivityMediumDark. */
  export const emojisGrouped: Record<string, Emoji[]>;
  /** Every emoji keyed by its unicode_character. */
  export const emojisIndexed: Record<string, Emoji>;
}
