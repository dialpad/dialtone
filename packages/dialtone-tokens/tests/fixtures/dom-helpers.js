export function setupRoot () {
  return document.createElement('div');
}

export function setupShadowHost () {
  const host = document.createElement('div');
  const shadowRoot = host.attachShadow({ mode: 'open' });
  return { host, shadowRoot };
}
