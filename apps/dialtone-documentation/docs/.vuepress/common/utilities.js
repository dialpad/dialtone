let timer;
const isBaseColorClass = (string) => /d-(bgc|fc|bc|bgg)-\w+-\d{2,4}$/.test(string);
const isChartColorClass = (string) => /chart/.test(string);
const isSingleColor = (token) => /(neutral|transparent|current|unset)/.test(token);
const isCategorical = (token) => /(categorical)/.test(token);
const isSequential = (token) => /(sequential)/.test(token);

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
  let utilityClasses = Object.keys(utilityClassDocs)
    .filter(className => className.startsWith(prefix));

  utilityClasses = sortUtilityClassesByCategory(utilityClasses);

  return utilityClasses.reduce((result, className) => {
    result[className] = utilityClassDocs[className]
      .values
      .map(declaration => `${declaration.prop}: ${declaration.value};`)
      .join('\n');
    return result;
  }, {});
}

export function extractCSSVariableName (propValue) {
  const variable = Object.values(propValue.values)[0].value;
  if (!variable.startsWith('var(')) return;
  return variable.replace('var(', '').replace(/(-[hsla])?\).*/, '');
}

/**
 * Sorts alphabetically, considering numbers.
 * @param a
 * @param b
 * @returns {number}
 */
export function alphabeticalSorter (a, b) {
  return a.localeCompare(b, 'en', { numeric: true });
}

/**
 *
 * @param utilityClasses {Array<String>}
 * @returns {Array<String>}
 */
export function sortUtilityClassesByCategory (utilityClasses) {
  const categories = new Map();

  // Determines the order of the categories
  categories.set('single_color', []);
  categories.set('semantic', []);
  categories.set('chart_single_color', []);
  categories.set('chart_semantic', []);
  categories.set('chart_categorical', []);
  categories.set('chart_sequential', []);
  categories.set('base', []);

  utilityClasses
    .sort(alphabeticalSorter)
    .reduce((result, className) => {
      if (isChartColorClass(className)) {
        if (isSingleColor(className)) result.set('chart_single_color', [...result.get('chart_single_color'), className]);
        else if (isCategorical(className)) result.set('chart_categorical', [...result.get('chart_categorical'), className]);
        else if (isSequential(className)) result.set('chart_sequential', [...result.get('chart_sequential'), className]);
        else result.set('chart_semantic', [...result.get('chart_semantic'), className]);
      } else if (isBaseColorClass(className)) result.set('base', [...result.get('base'), className]);
      else if (isSingleColor(className)) result.set('single_color', [...result.get('single_color'), className]);
      else result.set('semantic', [...result.get('semantic'), className]);

      return result;
    }, categories);

  return Array.from(categories.values()).flat();
}

export default {
  debounce,
  ReleaseNoteFormatter,
  extractUtilityClasses,
  extractCSSVariableName,
  alphabeticalSorter,
  sortUtilityClassesByCategory,
};
