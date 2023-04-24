// Mock IntersectionObserver
const MockObserver = {
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
};

beforeAll(() => {
  global.IntersectionObserver = MockObserver;
  global.ResizeObserver = MockObserver;
});
