// Mock IntersectionObserver
class MockObserver {
  observe () {
  }

  disconnect () {
  }

  unobserve () {
  }
}

beforeAll(() => {
  global.IntersectionObserver = MockObserver;
  global.ResizeObserver = MockObserver;
});
