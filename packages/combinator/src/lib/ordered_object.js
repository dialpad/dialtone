/**
 * Proxy that uses a map to mimic an object that always enumerates
 * keys in the same order that they were added to the object.
 *
 * Used by the 'object' control to keep keys in order when
 * updating them. The controls will bounce around while editing otherwise.
 */
export class OrderedObject {
  constructor () {
    this.map = new Map();
    return new Proxy(this, {
      get: this.get,

      /**
       * Designates the keys, which come from the map, which is always ordered.
       *
       * @param {OrderedObject} target - The proxy target.
       * @returns {Array} Array of ordered keys.
       */
      ownKeys (target) {
        const keys = [];
        for (const key of target.map.keys()) {
          keys.push(key);
        }
        return keys;
      },

      /**
       * Has to be declared to use with object functions such as `Object.entries(...)` etc...
       *
       * @returns {object} The property descriptor.
       */
      getOwnPropertyDescriptor () {
        return {
          enumerable: true,
          configurable: true,
        };
      },
    });
  }

  /**
   * When accessing with an indexer '[]', will search the underlying map object for a key.
   * If the key doesn't exist, the accessor will be reflected to this 'OrderedObject' instance.
   *
   * @param {OrderedObject} target - The proxy target.
   * @param {string} prop - The property that is being accessed.
   * @returns {*} Property value from the map or this object.
   */
  get (target, prop) {
    if (target.map.has(prop)) {
      return target.map.get(prop);
    }

    return Reflect.get(target, prop);
  }

  set (key, value) {
    this.map.set(key, value);
  }

  static fromEntries (entries) {
    const obj = new OrderedObject();
    entries.forEach(([key, value]) => {
      obj.set(key, value);
    });
    return obj;
  }

  toJSON () {
    return Object.fromEntries(Object.entries(this));
  }

  [Symbol.iterator] () {
    const iterator = this.map[Symbol.iterator]();
    return {
      next: () => iterator.next(),
    };
  }
}
