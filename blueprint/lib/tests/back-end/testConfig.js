/**
 * Test configuration and setup
 * Sets up the environment for testing parser
 */

import { validateConnection, commit } from '../../utility.js';
import { getConnectionObject } from '../../connection.js';

// Set up environment variables for testing
export function setupTestEnvironment() {
  // Set test environment variables using the provided values
  process.env.DB_HOST = 'blueprint'; // Using container name as the host
  process.env.DB_USER = 'blueprintuser';
  process.env.DB_PASSWORD = 'password';
  process.env.DB_NAME = 'blueprint';
  
  // WordPress environment variables
  process.env.WORDPRESS_DATABASE_ROOT_PASSWORD = 'password';
  process.env.WORDPRESS_DATABASE_NAME = 'blueprint-wordpress';
  process.env.WORDPRESS_DATABASE_USER = 'blueprintuser';
  process.env.WORDPRESS_DATABASE_PASSWORD = 'password';
  
  // Create global connection object for tests if it doesn't exist
  if (!global.connection) {
    global.connection = {
      query: async (queryString, params) => {
        // Mock query that returns default test data based on the query
        if (queryString.includes('userAccounts')) {
          return [{ 
            id: 1, 
            userName: 'testUser', 
            userEmail: 'test@example.com',
            userWebsites: 1 
          }];
        } else if (queryString.includes('userWebsites')) {
          return [{ 
            id: 1, 
            websiteName: 'test-website',
            website_user_id: 1 
          }];
        }
        return [{ success: true }];
      },
      commit: async () => true,
      rollback: async () => true,
      destroy: async () => true,
      end: async () => true,
      state: 'connected'
    };
  }
  
  // Override validateConnection and commit functions
  const originalValidateConnection = validateConnection;
  const originalCommit = commit;
  
  global.validateConnection = function() {
    console.error("[TEST] Mock validateConnection called");
    return true;
  };
  
  global.commit = async function() {
    console.error("[TEST] Mock commit called");
    return true;
  };
  
  // Override console methods to avoid noise during tests
  const originalConsoleError = console.error;
  const originalConsoleLog = console.log;
  
  console.error = function(...args) {
    // Only log errors if they're not related to database operations
    if (!args[0] || typeof args[0] !== 'string' || !args[0].startsWith('[DB]')) {
      originalConsoleError(...args);
    }
  };
  
  console.log = function(...args) {
    // Only log messages if they're not related to database operations
    if (!args[0] || typeof args[0] !== 'string' || !args[0].startsWith('[DB]')) {
      originalConsoleLog(...args);
    }
  };
  
  // Return a function to restore the original functions
  return function teardown() {
    console.error = originalConsoleError;
    console.log = originalConsoleLog;
    global.validateConnection = originalValidateConnection;
    global.commit = originalCommit;
  };
}

// Mock the database utility functions
export function mockDatabaseUtilities() {
  return {
    validateConnection: () => true,
    commit: async () => true,
    rollback: async () => true,
    getConnectionObject: async () => global.connection
  };
}

// Generate test data for User
export function generateTestUserData() {
  return {
    id: 1,
    userName: 'testUser',
    userPassHash: 'hashedPassword123',
    userWpName: 'wpTestUser',
    userWpPassHash: 'wpHashedPassword123',
    userEmail: 'test@example.com',
    userPhone: '123-456-7890',
    userWebsites: 2,
    userDateCreated: new Date('2025-01-01'),
    userLastLogin: new Date('2025-04-16'),
    isAdmin: false
  };
}

// Generate test data for Website
export function generateTestWebsiteData() {
  return {
    id: 1,
    websiteName: 'test-website.com',
    websiteDateAdded: new Date('2025-01-15'),
    websiteDateLastVisited: new Date('2025-04-15'),
    websiteDateLastModified: new Date('2025-04-10'),
    website_user_id: 1
  };
}

// Export all test utilities as default
export default {
  setupTestEnvironment,
  mockDatabaseUtilities,
  generateTestUserData,
  generateTestWebsiteData
};