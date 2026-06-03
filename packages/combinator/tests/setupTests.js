class MockObserver {
  observe () {}
  disconnect () {}
  unobserve () {}
}

global.IntersectionObserver = MockObserver;
global.ResizeObserver = MockObserver;
