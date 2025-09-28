/**
 * Set the current theme and optionally the brand
 * @param theme the theme object which contains two properties base and brand which refer to the css files.
 * @param rootNode optional, the root node to apply the theme to, defaults to document.documentElement, you will likely
 * only want to change this if you're using shadow dom.
 */
export function setTheme (theme, rootNode = document.documentElement) {
  _setThemeAttributeOnRoot(theme.base.name, theme.brand.name, rootNode);
  if (rootNode?.shadowRoot) {
    rootNode = rootNode.shadowRoot;
  }
  // Load css files
  _setStyleTag('dialtone-css-theme', theme.base.css, rootNode);
  _setStyleTag('dialtone-css-brand', theme.brand.css, rootNode);
}

/**
 * Set the content of a style tag with the given id, create it if the id doesn't exist.
 */
function _setStyleTag (id, content, rootNode) {
  if (!rootNode.querySelector('#' + id)) {
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('id', id);
    style.innerHTML = content;
    if (rootNode.querySelector('head')) {
      rootNode.querySelector('head').appendChild(style);
    } else {
      rootNode.appendChild(style);
    }
  } else {
    rootNode.querySelector('#' + id).innerHTML = content;
  }
}

/**
 * Apply or remove contrast theme
 * @param contrastLevel 'default' | 'high'
 * @param contrastTheme the high-contrast theme object (only needed for 'high')
 * @param rootNode optional, the root node to apply the theme to, defaults to document.documentElement
 */
export function applyContrast (contrastLevel, contrastTheme = null, rootNode = document.documentElement) {
  if (rootNode?.shadowRoot) {
    rootNode = rootNode.shadowRoot;
  }

  if (contrastLevel === 'high' && contrastTheme) {
    // Apply high-contrast CSS
    _setStyleTag('dialtone-css-contrast', contrastTheme.css, rootNode);
    rootNode.setAttribute('data-dt-contrast', 'high');
  } else {
    // Remove high-contrast CSS
    _removeStyleTag('dialtone-css-contrast', rootNode);
    rootNode.setAttribute('data-dt-contrast', 'default');
  }
}

/**
 * Remove a style tag with the given id
 */
function _removeStyleTag (id, rootNode) {
  const existingStyleTag = rootNode.querySelector('#' + id);
  if (existingStyleTag) {
    existingStyleTag.remove();
  }
}

/**
 * Set the dialtone theme and brand custom attributes on the root element
 */
function _setThemeAttributeOnRoot (theme, brand, rootNode) {
  rootNode.setAttribute('data-dt-theme', theme);
  rootNode.setAttribute('data-dt-brand', brand);
}
