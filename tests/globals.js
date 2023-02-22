/* eslint-disable mocha/no-top-level-hooks */
class ObserverMock {
  observe () {
    // do nothing
  }

  unobserve () {
    // do nothing
  }

  disconnect () {
    // do nothing
  }
}

before(function () {
  global.IntersectionObserver = ObserverMock;
  global.ResizeObserver = ObserverMock;
});

after(function () {
  global.IntersectionObserver = null;
  global.ResizeObserver = null;
});
