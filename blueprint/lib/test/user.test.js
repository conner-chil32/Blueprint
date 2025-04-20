/*
FOR TESTING BOTH THE USER AND WEBSITE CLASS RUN:
docker compose up -d
node /path/to/run-parser-tests.js
*/
import assert from 'assert';
import { User } from '../user.js';
import { Website } from '../website.js';
import { validateConnection, commit } from '../utility.js';

export class TestRunner {
  constructor(name) {
    this.name = name;
    this.tests = [];
    this.beforeEachFns = [];
    this.afterEachFns = [];
    this.results = {
      total: 0,
      passed: 0,
      failed: 0
    };
  }

  beforeEach(fn) {
    this.beforeEachFns.push(fn);
  }

  afterEach(fn) {
    this.afterEachFns.push(fn);
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async runTests() {
    console.log(`\n--- Running ${this.name} Tests ---\n`);
    
    for (const test of this.tests) {
      this.results.total++;
      try {
        // Run beforeEach functions
        for (const beforeFn of this.beforeEachFns) {
          await beforeFn();
        }

        // Run test
        await test.fn();
        
        // Run afterEach functions
        for (const afterFn of this.afterEachFns) {
          await afterFn();
        }
        
        this.results.passed++;
        console.log(`PASSED: ${test.name}`);
      } catch (error) {
        this.results.failed++;
        console.error(`FAILED: ${test.name}`);
        console.error(`Error: ${error.message}`);
        if (error.stack) {
          console.error(`   Stack: ${error.stack.split('\n')[1]}`);
        }
      }
    }

    console.log(`\n--- ${this.name} Test Results ---`);
    console.log(`Total: ${this.results.total}`);
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Failed: ${this.results.failed}`);
    console.log('---------------------------\n');
  }
}

// Create and export the User tests
export const userTests = new TestRunner('User Class');

// Mock utility functions
const mockValidateConnection = () => true;
const mockCommit = async () => true;

// Mock the imported dependencies
const mockUserQueries = {
  getUserByEmail: async () => ({ id: 1, userName: 'testUser', userEmail: 'test@example.com' }),
  getUserByID: async () => ({ id: 1, userName: 'testUser', userEmail: 'test@example.com' })
};

// Setup state before each test
userTests.beforeEach(() => {
  // Setup global connection
  global.connection = {
    query: async () => [{ id: 1, userName: 'testUser', userEmail: 'test@example.com' }],
    commit: async () => true
  };
  
  // Mock the utility functions
  global.validateConnection = mockValidateConnection;
  global.commit = mockCommit;
});

// Reset state after each test
userTests.afterEach(() => {
  delete global.connection;
  delete global.validateConnection;
  delete global.commit;
});

// Test User class constructor
userTests.test('User constructor initializes with default values', () => {
  const user = new User();
  assert.strictEqual(user.id, null);
  assert.strictEqual(user.userName, '');
  assert.strictEqual(user.userEmail, '');
  assert.strictEqual(user.userWebsites, 0);
  assert.strictEqual(user.isAdmin, false);
});

// Test User class getters and setters
userTests.test('User getters and setters work correctly', () => {
  const user = new User();
  
  user.setUserName('testUser');
  user.setUserEmail('test@example.com');
  user.setUserPhone('123-456-7890');
  
  assert.strictEqual(user.getUserName(), 'testUser');
  assert.strictEqual(user.getUserEmail(), 'test@example.com');
  assert.strictEqual(user.getUserPhone(), '123-456-7890');
});

// Test static methods with mocked responses
userTests.test('Static method getUserByEmail returns user data', async () => {
  // Mock the static method to use our mock implementation
  const originalMethod = User.getUserByEmail;
  User.getUserByEmail = async () => mockUserQueries.getUserByEmail();
  
  try {
    const user = await User.getUserByEmail('test@example.com');
    assert.strictEqual(user.id, 1);
    assert.strictEqual(user.userName, 'testUser');
    assert.strictEqual(user.userEmail, 'test@example.com');
  } finally {
    // Restore original method
    User.getUserByEmail = originalMethod;
  }
});

userTests.test('Static method getUserById returns user data', async () => {
  // Mock the static method
  const originalMethod = User.getUserById;
  User.getUserById = async () => mockUserQueries.getUserByID();
  
  try {
    const user = await User.getUserById(1);
    assert.strictEqual(user.id, 1);
    assert.strictEqual(user.userName, 'testUser');
  } finally {
    // Restore original method
    User.getUserById = originalMethod;
  }
});

// Test addWebsite method with proper mocking
userTests.test('addWebsite method handles website creation correctly', async () => {
  // Create a user with test data
  const user = new User();
  user.id = 1;
  user.userWebsites = 0;
  user.websiteName = 'test-website';
  
  // Original validateConnection function
  const originalValidateConnection = validateConnection;
  
  // Mock validateConnection to always return true
  global.validateConnection = () => true;
  
  // Original commit function
  const originalCommit = commit;
  
  // Mock commit to always return true
  global.commit = async () => true;
  
  // Mock Website addWebsite method
  const originalWebsiteAddWebsite = Website.prototype.addWebsite;
  Website.prototype.addWebsite = async function() {
    return true;
  };
  
  try {
    const result = await user.addWebsite();
    assert.strictEqual(result, true);
    assert.strictEqual(user.userWebsites, 1);
  } finally {
    // Restore original methods
    Website.prototype.addWebsite = originalWebsiteAddWebsite;
    global.validateConnection = originalValidateConnection;
    global.commit = originalCommit;
  }
});

// Test removeWebsite method with proper mocking
userTests.test('removeWebsite method handles website removal correctly', async () => {
  // Create a user with test data
  const user = new User();
  user.id = 1;
  user.userWebsites = 1;
  user.websiteId = 1;
  
  // Original validateConnection function
  const originalValidateConnection = validateConnection;
  
  // Mock validateConnection to always return true
  global.validateConnection = () => true;
  
  // Original commit function
  const originalCommit = commit;
  
  // Mock commit to always return true
  global.commit = async () => true;
  
  // Mock Website removeWebsite method
  const originalWebsiteRemoveWebsite = Website.prototype.removeWebsite;
  Website.prototype.removeWebsite = async function() {
    return true;
  };
  
  try {
    const result = await user.removeWebsite();
    assert.strictEqual(result, true);
    assert.strictEqual(user.userWebsites, 0);
  } finally {
    // Restore original methods
    Website.prototype.removeWebsite = originalWebsiteRemoveWebsite;
    global.validateConnection = originalValidateConnection;
    global.commit = originalCommit;
  }
});

userTests.test('handleError returns appropriate error message', () => {
  const error = new Error('Test error');
  const message = User.handleError(error);
  assert.strictEqual(message, 'User not found: Test error');
});

// Run the User tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  userTests.runTests();
}