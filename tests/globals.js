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

beforeAll(() => {
  global.IntersectionObserver = ObserverMock;
  global.ResizeObserver = ObserverMock;
});

afterAll(() => {
  global.IntersectionObserver = null;
  global.ResizeObserver = null;
});
