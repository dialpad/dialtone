let timer;

/*
* Set's a global timer to debounce the execution of a function.
* @param { object } func - the function that is going to be called after timeout
* @param { number } [timeout=300] timeout
* */
export function debounce (func, timeout = 300) {
  clearTimeout(timer);
  timer = setTimeout(func, timeout);
}

/*
* Returns the formatted note with the commit and PR links.
* Removes extra asterisks (known issue in semantic-release-changelog-json plugin).
* */
export const ReleaseNoteFormatter = {
  note: '',
  project_url_handler: '',

  format () {
    this.note = this._withoutExtraAsterisks();
    this.note = this._withCommitLink();
    this.note = this._withPrLink();

    return this.note;
  },

  _withoutExtraAsterisks () {
    return this.note.replace(/\*\*/g, '');
  },

  _withCommitLink () {
    return this.note.replace(/\(([^)]+)\)$/, (match, text) => {
      const link = `<a href="https://github.com/dialpad/${this.project_url_handler}/commit/${text}">${text}</a>`;
      return `(${link})`;
    });
  },

  _withPrLink () {
    return this.note.replace(/(\([^)]+\))(?!.*\1)/, (match, text) => {
      const content = text.slice(1, -1);
      if (content[0] === '#') {
        const link =
          `<a href="https://github.com/dialpad/${this.project_url_handler}/pull/${content.slice(1)}">${text}</a>`;
        return `${link}`;
      }
      return text;
    });
  },
};

export function extractUtilityClasses (utilityClassDocs, prefix) {
  return Object.keys(utilityClassDocs)
    .filter(className => className.startsWith(prefix))
    .reduce((result, className) => {
      result[className] = utilityClassDocs[className]
        .values
        .map(declaration => `${declaration.prop}: ${declaration.value};`)
        .join('\n');
      return result;
    }, {});
}

export default {
  debounce,
  ReleaseNoteFormatter,
  extractUtilityClasses,
};
