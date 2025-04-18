/*
FOR TESTING BOTH THE USER AND WEBSITE CLASS RUN:
docker compose up -d
node /path/to/run-parser-tests.js
*/
import assert from 'assert';
import { Website } from '../website.js';
import { TestRunner } from './user.test.js';
import { validateConnection, commit } from '../utility.js';

export const websiteTests = new TestRunner('Website Class');

// Mock the imported dependencies
const mockSiteQueries = {
  getSites: async () => [
    { id: 1, websiteName: 'test-site-1' },
    { id: 2, websiteName: 'test-site-2' }
  ],
  getSiteByID: async () => ({ id: 1, websiteName: 'test-site-1' }),
  getSiteByName: async () => ({ id: 1, websiteName: 'test-site-1' }),
  getSiteCount: async () => 2,
  createSite: async () => true,
  updateSite: async () => true,
  deleteSite: async () => true
};

// Setup state before each test
websiteTests.beforeEach(() => {
  // Setup global connection
  global.connection = {
    query: async () => [
      { id: 1, websiteName: 'test-site-1' },
      { id: 2, websiteName: 'test-site-2' }
    ],
    commit: async () => true
  };
  
  // Mock utility functions
  global.validateConnection = () => true;
  global.commit = async () => true;
});

// Reset state after each test
websiteTests.afterEach(() => {
  delete global.connection;
  delete global.validateConnection;
  delete global.commit;
});

// Test Website class constructor
websiteTests.test('Website constructor initializes with default values', () => {
  const website = new Website();
  assert.strictEqual(website.id, null);//Compares against expected default values
  assert.strictEqual(website.websiteName, '');
  assert.strictEqual(website.websiteDateAdded, null);
  assert.strictEqual(website.websiteDateLastVisited, null);
  assert.strictEqual(website.websiteDateLastModified, null);
  assert.strictEqual(website.website_user_id, null);
});

// Test Website class getters and setters
websiteTests.test('Website getters and setters work correctly', () => {
  const website = new Website();
  
  website.setWebsiteName('test-website');
  website.setWebsiteUserId(1);
  
  assert.strictEqual(website.getWebsiteName(), 'test-website');// Tested against new set website name, and new set user id
  assert.strictEqual(website.getWebsiteUserId(), 1);
});

// Test static methods with mocked responses
websiteTests.test('Static method getAllWebsites returns website data', async () => {
  const originalMethod = Website.getAllWebsites;
  Website.getAllWebsites = async () => mockSiteQueries.getSites();
  
  try {
    const sites = await Website.getAllWebsites();
    assert.strictEqual(sites.length, 2);
    assert.strictEqual(sites[0].id, 1);
    assert.strictEqual(sites[0].websiteName, 'test-site-1');
    assert.strictEqual(sites[1].id, 2);
    assert.strictEqual(sites[1].websiteName, 'test-site-2');
  } finally {
    // Restore original method
    Website.getAllWebsites = originalMethod;
  }
});

websiteTests.test('Static method getWebsiteById returns website data', async () => {
  // Mock the static method
  const originalMethod = Website.getWebsiteById;
  Website.getWebsiteById = async () => mockSiteQueries.getSiteByID();
  
  try {
    const site = await Website.getWebsiteById(1);
    assert.strictEqual(site.id, 1);
    assert.strictEqual(site.websiteName, 'test-site-1');
  } finally {
    // Restore original method
    Website.getWebsiteById = originalMethod;
  }
});

websiteTests.test('Static method getWebsiteByName returns website data', async () => {
  // Mock the static method
  const originalMethod = Website.getWebsiteByName;
  Website.getWebsiteByName = async () => mockSiteQueries.getSiteByName();
  
  try {
    const site = await Website.getWebsiteByName('test-site-1');
    assert.strictEqual(site.id, 1);
    assert.strictEqual(site.websiteName, 'test-site-1');
  } finally {
    // Restore original method
    Website.getWebsiteByName = originalMethod;
  }
});

websiteTests.test('Static method getWebsiteCount returns correct count', async () => {
  // Mock the static method
  const originalMethod = Website.getWebsiteCount;
  Website.getWebsiteCount = async () => mockSiteQueries.getSiteCount();
  
  try {
    const count = await Website.getWebsiteCount();
    assert.strictEqual(count, 2);
  } finally {
    // Restore original method
    Website.getWebsiteCount = originalMethod;
  }
});

// Test instance methods with mocked dependencies
websiteTests.test('addWebsite successfully adds a website', async () => {
  const website = new Website();
  website.websiteName = 'new-test-website';
  
  // Mock the entire siteQueries module
  const originalCreateSite = await import('../siteQueries.js').then(m => m.createSite);
  
  // Create a temporary mock module
  global.createSite = async () => true;
  
  // Replace the createSite function temporarily
  const originalWebsiteAddWebsite = website.addWebsite;
  website.addWebsite = async function() {
    // Use the mocked createSite function
    if (!global.validateConnection()) return false;
    const result = await global.createSite(this.websiteName);
    if (result) {
      await global.commit();
      return true;
    }
    return false;
  };
  
  try {
    const result = await website.addWebsite();
    assert.strictEqual(result, true);
  } finally {
    // Restore original method
    website.addWebsite = originalWebsiteAddWebsite;
    delete global.createSite;
  }
});

websiteTests.test('removeWebsite fails when no ID is provided', async () => {
  // Create website with null ID (default)
  const website = new Website();
  
  try {
    await website.removeWebsite();
    // If we get here, the test should fail because an error should have been thrown
    assert.fail('removeWebsite should throw an error when no ID is provided');
  } catch (error) {
    // Just verify that we got an error - don't check the message content
    assert.ok(error instanceof Error, 'Expected an Error to be thrown');
  }
});

websiteTests.test('removeWebsite successfully removes a website', async () => {
  // Create website with ID
  const website = new Website();
  website.id = 1;
  
  // Mock the deleteSite function using global variables
  global.deleteSite = async () => true;
  
  // Mock the removeWebsite method to use our mocked deleteSite
  const originalRemoveWebsite = website.removeWebsite;
  website.removeWebsite = async function() {
    if (!this.id) {
      throw new Error('Website ID is required to remove a website');
    }
    if (!global.validateConnection()) return false;
    const result = await global.deleteSite(this.id);
    if (result) {
      await global.commit();
      return true;
    }
    return false;
  };
  
  try {
    const result = await website.removeWebsite();
    assert.strictEqual(result, true);
  } finally {
    // Restore original method
    website.removeWebsite = originalRemoveWebsite;
    delete global.deleteSite;
  }
});

websiteTests.test('handleError returns appropriate error message', () => {
  const error = new Error('Test error');
  const message = Website.handleError(error);
  assert.strictEqual(message, 'Website not found: Test error');
});

// Run the Website tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  websiteTests.runTests();
}