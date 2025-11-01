import '@testing-library/jest-dom'

// jest.setup.js
class IntersectionObserver {
constructor(callback, options) {
this.callback = callback;
this.options = options;
}

observe(target) {
// Mock the observe method, perhaps immediately triggering the callback for testing purposes
// or by providing a way to manually trigger it in your tests.
// For a basic mock, you might just do nothing or call the callback with a default state.
}

unobserve(target) {
// Mock the unobserve method
}

disconnect() {
// Mock the disconnect method
}
}

Object.defineProperty(window, 'IntersectionObserver', {
writable: true,
configurable: true,
value: IntersectionObserver,
});

// If using react-intersection-observer, you might also want to mock its utilities
// import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';
// beforeEach(() => {
//   mockAllIsIntersecting(true); // Or false, depending on your test needs
// });

// setupTests.js or jest.setup.js
class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe(target) {
    // You can simulate a resize event here if needed for specific tests
    // For example:
    // this.callback([{ contentRect: { width: 100, height: 100 }, target }]);
  }
  unobserve(target) {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;