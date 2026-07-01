import unsupportedComponents from '@/src/unsupported_components.json';

export function getUnsupportedComponentReason (componentName) {
  return unsupportedComponents[componentName] ?? '';
}

function hasComponentDocumentation (componentName, documentation) {
  return Boolean(componentName) &&
    Array.isArray(documentation) &&
    documentation.some(componentInfo => componentInfo.displayName === componentName);
}

export function isSupportedComponent (componentName, documentation) {
  return hasComponentDocumentation(componentName, documentation) &&
    !getUnsupportedComponentReason(componentName);
}
