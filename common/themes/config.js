/**
 * Set the current theme and optionally the brand
 * @param theme the theme object which contains two properties base and brand which refer to the css files.
 */
export function setTheme (theme) {
  // Load css files
  _setStyleTag('dialtone-css-theme', theme.base.css);
  _setStyleTag('dialtone-css-brand', theme.brand.css);
  _setThemeAttributeOnRoot(theme.base.name, theme.brand.name);
}

/**
 * Set the content of a style tag with the given id, create it if the id doesn't exist.
 */
function _setStyleTag (id, content) {
  if (!document.getElementById(id)) {
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('id', id);
    style.innerHTML = content;
    document.head.appendChild(style);
  } else {
    document.getElementById(id).innerHTML = content;
  }
}

/**
 * Set the dialtone theme and brand custom attributes on the root element
 */
function _setThemeAttributeOnRoot (theme, brand) {
  document.documentElement.setAttribute('data-dt-theme', theme);
  document.documentElement.setAttribute('data-dt-brand', brand);
}
