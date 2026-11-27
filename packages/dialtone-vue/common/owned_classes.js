// Element -> Map(owner -> class that owner added).
const classOwners = new WeakMap();

/**
 * Adds a class to an element on behalf of an owner. Adding again for the same owner does nothing.
 * @param element {HTMLElement}
 * @param className {string}
 * @param owner {*}
 */
export function addOwnedClass (element, className, owner) {
  let owners = classOwners.get(element);
  if (!owners) {
    owners = new Map();
    classOwners.set(element, owners);
  }
  if (owners.has(owner)) return;
  owners.set(owner, className);
  element.classList.add(className);
}

/**
 * Releases the class an owner added. The class is removed once no remaining owner holds it.
 * @param element {HTMLElement}
 * @param owner {*}
 */
export function removeOwnedClass (element, owner) {
  const owners = classOwners.get(element);
  const className = owners?.get(owner);
  if (!className) return;
  owners.delete(owner);
  if (!owners.size) classOwners.delete(element);
  for (const remainingClassName of owners.values()) {
    if (remainingClassName === className) return;
  }
  element.classList.remove(className);
}

/**
 * @param element {HTMLElement}
 * @returns {boolean} whether any owner holds a class on the element.
 */
export function hasClassOwners (element) {
  return classOwners.has(element);
}
