// run-tests.js - Main file to run all tests
import { userTests } from './user.test.js';
import { websiteTests } from './website.test.js';
import { setupTestEnvironment } from './testConfig.js';

/**
 * Main test runner
 * Runs all test suites and reports final results
 */
async function runAllTests() {
  console.log('\n========================================');
  console.log('=           TEST SUITE               =');
  console.log('========================================\n');
  
  // Setup test environment and get teardown function
  const teardown = setupTestEnvironment();
  
  try {
    console.log('Running all tests...\n');
    
    // Run user tests
    console.log('Running User tests...');
    await userTests.runTests();
    
    // Run website tests
    console.log('Running Website tests...');
    await websiteTests.runTests();
    
    console.log('\n========================================');
    console.log('=        TEST SUITE SUMMARY          =');
    console.log('========================================\n');
    
    // Report overall test results
    const totalTests = userTests.results.total + websiteTests.results.total;
    const totalPassed = userTests.results.passed + websiteTests.results.passed;
    const totalFailed = userTests.results.failed + websiteTests.results.failed;
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${totalPassed}`);
    console.log(`Failed: ${totalFailed}`);
    console.log(`Success Rate: ${Math.round((totalPassed / totalTests) * 100)}%`);
    
    // List failed tests if any
    if (totalFailed > 0) {
      console.log('\nFailed Tests:');
      
      // Check user tests for failures
      userTests.tests.forEach((test, index) => {
        if (index >= userTests.results.passed) {
          console.log(`- User: ${test.name}`);
        }
      });
      
      // Check website tests for failures
      websiteTests.tests.forEach((test, index) => {
        if (index >= websiteTests.results.passed) {
          console.log(`- Website: ${test.name}`);
        }
      });
    }
    
    console.log('\n========================================\n');
    
    // Return non-zero exit code if any tests failed
    if (totalFailed > 0) {
      process.exit(1);
    }
  } finally {
    // Clean up test environment
    if (teardown && typeof teardown === 'function') {
      teardown();
    }
  }
}

// Run all tests
runAllTests().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});