// mockHelpers.js
/**
 * Helper functions for mocking database interactions
 */

/**
 * Creates a mock database results object
 * @param {Array|Object} data - The data to include in the results
 * @returns {Object} Mock database results
 */
export function createMockResults(data) {
    return Array.isArray(data) ? data : [data];
  }
  
  /**
   * Creates a mock connection object with predefined query responses
   * @param {Object} queryResponses - Map of query patterns to response data
   * @returns {Object} Mock connection object
   */
  export function createMockConnection(queryResponses = {}) {
    return {
      query: async (queryString, params = []) => {
        // Find the matching query response
        let responseData = null;
        
        for (const pattern in queryResponses) {
          if (queryString.includes(pattern)) {
            responseData = queryResponses[pattern];
            break;
          }
        }
        
        // Return default empty result if no match found
        if (!responseData) {
          return [[]];
        }
        
        // Process the response data - could be a function or direct data
        if (typeof responseData === 'function') {
          return [responseData(queryString, params)];
        }
        
        return [responseData];
      },
      commit: async () => true,
      rollback: async () => true,
      end: async () => true,
      destroy: async () => true
    };
  }
  
  /**
   * Creates a mock User object with predefined data
   * @param {Object} userData - User data to include
   * @returns {Object} Mock User object
   */
  export function createMockUser(userData = {}) {
    const defaultUser = {
      id: 1,
      userName: 'testUser',
      userPassHash: 'hashedPassword123',
      userEmail: 'test@example.com',
      userWebsites: 0,
      isAdmin: false
    };
    
    return { ...defaultUser, ...userData };
  }
  
  /**
   * Creates a mock Website object with predefined data
   * @param {Object} websiteData - Website data to include
   * @returns {Object} Mock Website object
   */
  export function createMockWebsite(websiteData = {}) {
    const defaultWebsite = {
      id: 1,
      websiteName: 'test-website.com',
      websiteDateAdded: new Date('2025-01-15'),
      website_user_id: 1
    };
    
    return { ...defaultWebsite, ...websiteData };
  }
  
  /**
   * Mocks the query results for common functions
   * @param {Object} overrides - Override specific query results
   * @returns {Object} Mock query results object
   */
  export function mockQueryResults(overrides = {}) {
    const defaultResults = {
      getUserByEmail: createMockUser(),
      getUserByID: createMockUser(),
      signIn: createMockUser(),
      createAccount: { insertId: 1 },
      getSites: [createMockWebsite(), createMockWebsite({ id: 2, websiteName: 'second-site.com' })],
      getSiteByID: createMockWebsite(),
      getSiteByName: createMockWebsite(),
      getSiteCount: [{ count: 2 }],
      createSite: { insertId: 3 },
      deleteSite: { affectedRows: 1 },
      updateSite: { affectedRows: 1 }
    };
    
    return { ...defaultResults, ...overrides };
  }
  
  /**
   * Creates a spy function that tracks calls
   * @param {Function} implementation - The function implementation
   * @returns {Function} Spy function
   */
  export function createSpy(implementation = () => {}) {
    const calls = [];
    
    const spy = (...args) => {
      calls.push(args);
      return implementation(...args);
    };
    
    spy.calls = calls;
    spy.callCount = () => calls.length;
    spy.calledWith = (...args) => calls.some(call => 
      args.every((arg, i) => arg === call[i])
    );
    
    return spy;
  }
  
  // Export all functions as named exports and as default
  export default {
    createMockResults,
    createMockConnection,
    createMockUser,
    createMockWebsite,
    mockQueryResults,
    createSpy
  };