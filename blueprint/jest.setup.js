import '@testing-library/jest-dom'
import { createRequire } from 'module'
import { jest } from '@jest/globals'

// Make jest available globally
globalThis.jest = jest

// Make require available in ESM mode for jest.mock factories
if (typeof require === 'undefined') {
  global.require = createRequire(import.meta.url)
}

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

// Mock fetch if not available (for Node < 18 or when not injected)
if (!global.fetch) {
  global.fetch = () =>
    Promise.resolve({
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
      ok: true,
      status: 200,
    });
}

// Mock Request if not available
if (!global.Request) {
  global.Request = class Request {
    constructor(input, init) {
      this.url = typeof input === 'string' ? input : input.url;
      this.method = init?.method || 'GET';
      this.headers = new Headers(init?.headers || {});
    }
  };
}

// Mock TextEncoder/TextDecoder if not available (needed for React DOM Server)
if (!global.TextEncoder) {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock MessageChannel if not available (needed for React DOM Server)
if (!global.MessageChannel) {
  global.MessageChannel = class MessageChannel {
    constructor() {
      this.port1 = {
        onmessage: null,
        postMessage: () => {},
        close: () => {},
      };
      this.port2 = {
        onmessage: null,
        postMessage: () => {},
        close: () => {},
      };
    }
  };
}

// Mock Response if not available
if (!global.Response) {
  global.Response = class Response {
    constructor(body, init) {
      this.body = body;
      this.status = init?.status || 200;
      this.statusText = init?.statusText || 'OK';
      this.headers = new Headers(init?.headers || {});
      this.ok = this.status >= 200 && this.status < 300;
    }
    json() {
      return Promise.resolve(JSON.parse(this.body || '{}'));
    }
    text() {
      return Promise.resolve(this.body || '');
    }
    static json(data, init) {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: {
          'content-type': 'application/json',
          ...init?.headers,
        },
      });
    }
  };
}
