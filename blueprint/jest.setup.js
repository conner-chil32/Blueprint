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