// Run with: docker-compose exec web-app node /blueprint/lib/tests/back-end/ban_and_logs.test.js

import { closeConnection } from '../../connection.js';
import * as UQ from '../../userQueries.js';

let totalTests = 0;
let passedTests = 0;

function testPassed(desc) {
    passedTests++;
    totalTests++;
    console.log(`✅ [PASS] ${desc}`);
}

function testFailed(desc) {
    totalTests++;
    console.log(`❌ [FAIL] ${desc}`);
}

async function wait(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
    try {
        console.log("✅ Starting userQueries.js tests...\n");

        // --------------------------------------------------------------------
        // 1️Test banUser()
        // --------------------------------------------------------------------
        console.log("Banning tester1 for 5 seconds...");
        const duration = new Date(Date.now() + 5 * 1000).toISOString().slice(0, 19).replace('T', ' ');
        const banResult = await UQ.banUser(1, duration);
        if (banResult.affectedRows === 1) testPassed("banUser updated 1 row");
        else testFailed("banUser did not update row correctly");

        // --------------------------------------------------------------------
        // 2️Test isBanned()
        // --------------------------------------------------------------------
        console.log("Checking if tester1 is banned...");
        const banned = await UQ.isBanned(1);
        if (banned === true) testPassed("isBanned returned true for banned user");
        else testFailed("isBanned did not return true for banned user");

        console.log("Waiting 5 seconds for ban to expire...");
        await wait(5000);
        const bannedAfter = await UQ.isBanned(1);
        if (bannedAfter === false) testPassed("isBanned returned false after ban expired");
        else testFailed("isBanned did not return false after ban expired");

        // --------------------------------------------------------------------
        // 3️Test createLoginById()
        // --------------------------------------------------------------------
        console.log("Creating login entry for tester2...");
        const loginResult = await UQ.createLoginById(2);
        if (loginResult.affectedRows === 1) testPassed("createLoginById succeeded");
        else testFailed("createLoginById failed");

        // --------------------------------------------------------------------
        // 4️Test createLoginByUsername()
        // --------------------------------------------------------------------
        console.log("Creating login entry for tester3 by username...");
        const loginByUsernameResult = await UQ.createLoginByUsername("tester3");
        if (loginByUsernameResult.affectedRows === 1) testPassed("createLoginByUsername succeeded");
        else testFailed("createLoginByUsername failed");

        // --------------------------------------------------------------------
        // 5️Test getAllLogins()
        // --------------------------------------------------------------------
        console.log("Fetching all logins...");
        const allLogins = await UQ.getAllLogins(5);
        if (allLogins.length > 0) testPassed(`getAllLogins returned ${allLogins.length} entries`);
        else testFailed("getAllLogins returned no entries");

        // --------------------------------------------------------------------
        // 6️Test getLoginsById()
        // --------------------------------------------------------------------
        console.log("Fetching logins for tester2...");
        const loginsTester2 = await UQ.getLoginsById(2);
        if (loginsTester2.length > 0) testPassed(`getLoginsById returned ${loginsTester2.length} entries`);
        else testFailed("getLoginsById returned no entries");

        // --------------------------------------------------------------------
        // 7️Cleanup / Reset ban
        // --------------------------------------------------------------------
        await UQ.banUser(1, null);
        testPassed("Reset ban for tester1");

        // --------------------------------------------------------------------
        //  Summary
        // --------------------------------------------------------------------
        console.log(`\nTest results: ${passedTests}/${totalTests} tests passed.`);
        if (passedTests === totalTests) console.log("✅All userQueries.js tests passed!");
        else console.log("Some tests failed. Review logs above.");

    } catch (err) {
        console.error("❌ Test sequence failed:", err);
    } finally {
        await closeConnection();
    }
}

runTests();
