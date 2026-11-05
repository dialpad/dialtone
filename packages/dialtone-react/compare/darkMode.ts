// The dark-mode addon keeps its state in this origin's localStorage; reading it
// gives the comparison's mode before the addon's first event arrives.
export function readStoredDarkMode (): boolean {
  try {
    const stored = localStorage.getItem('sb-addon-themes-3');
    return stored ? JSON.parse(stored).current === 'dark' : false;
  } catch {
    return false;
  }
}
