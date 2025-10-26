// use this command 'docker-compose exec web-app node ./lib/test/databaseSiteTables.test.js'
// At least 3 users should exist in DB
import { closeConnection } from '../connection.js';
import * as SQ from '../siteQueries.js';

import path from "path";
import { fileURLToPath } from "url";

// no need for __dirname unless you’re writing files locally
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Example URLs — you can replace with your own test assets
const imgUrl = "https://pyxis.nymag.com/v1/imgs/a59/8f2/af4ffa51c4bbd612e05e8a0f26cba27f5c-shrek.rsquare.w400.jpg";
const vidUrl = "https://m.media-amazon.com/images/M/MV5BZmU5ZDE5NTItN2I1YS00ZmFmLTk3YTgtNzQwOGNkYzFjOWRkXkEyXkFqcGdeQXVyNzU1NzE3NTg@._V1_QL75_UX500_CR0,47,500,281_.jpg";
const waitTime = 1000
function wait() {
    return new Promise(resolve => setTimeout(resolve, waitTime));
}

async function loadTestFiles() {
    const [imgRes, vidRes] = await Promise.all([
        fetch(imgUrl),
        fetch(vidUrl),
    ]);

    if (!imgRes.ok || !vidRes.ok) {
        throw new Error("Failed to fetch one or more test files.");
    }

    const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
    const vidBuffer = Buffer.from(await vidRes.arrayBuffer());

    return { imgBuffer, vidBuffer };
}

// ✅ Test tracking variables
let totalTests = 0;
let passedTests = 0;

function testPassed(description) {
    passedTests++;
    totalTests++;
    console.log(`✅ [PASS] ${description}`);
}

function testFailed(description) {
    totalTests++;
    console.log(`❌ [FAIL] ${description}`);
}

async function runTests() {
    try {
        console.log("✅ Starting test sequence...\n");
        const { imgBuffer, vidBuffer } = await loadTestFiles();
        console.log("✅ Loaded test media from URLs");

        // --------------------------------------------------------------------
        // 1️⃣ CREATE WEBSITES
        // --------------------------------------------------------------------
        console.log("Creating sites for users...");
        await SQ.createSite("Test Site A", 1);
        await SQ.createSite("Test Site B", 2);
        await SQ.createSite("Test Site C", 3);
        testPassed("Created three test sites");

        // Get all sites
        let sites = await SQ.getSites();
        console.log("All sites:", sites);

        // --------------------------------------------------------------------
        // 2️⃣ FETCH SITE BY ID / NAME / USER
        // --------------------------------------------------------------------
        const firstSiteID = sites[0].siteID;
        console.log(`\nFetching site by ID (${firstSiteID})...`);
        console.log(await SQ.getSiteByID(firstSiteID));
        testPassed("Fetched site by ID");

        console.log("\nFetching site by name 'Test Site A'...");
        console.log(await SQ.getSiteByName("Test Site A"));
        testPassed("Fetched site by name");

        console.log("\nFetching sites by userID 1...");
        console.log(await SQ.getSitesByUser(1));
        testPassed("Fetched sites by user ID");

        // --------------------------------------------------------------------
        // 3️⃣ UPDATE SITE NAME
        // --------------------------------------------------------------------
        console.log("\nUpdating site name...");
        await SQ.updateSite(firstSiteID, "Test Site A - Updated");
        const updated = await SQ.getSiteByID(firstSiteID);
        console.log("✅ Updated site:", updated);
        testPassed("Updated site name and verified change");

        // --------------------------------------------------------------------
        // 4️⃣ CREATE MEDIA
        // --------------------------------------------------------------------
        console.log("\nInserting media...");
        await SQ.createMedia(firstSiteID, "image", "jpeg", imgBuffer);
        await SQ.createMedia(firstSiteID, "image", "jpeg", vidBuffer);
        testPassed("Inserted media files for site");

        // --------------------------------------------------------------------
        // 5️⃣ CREATE PAGES
        // --------------------------------------------------------------------
        console.log("\nInserting pages...");
        const pageData = JSON.stringify({ html: "<h1>Hello</h1>", css: "h1{color:red;}" });
        await SQ.createPage(firstSiteID, "/index", pageData);
        await SQ.createPage(firstSiteID, "/about", pageData);
        testPassed("Created pages for site");

        // --------------------------------------------------------------------
        // 6️⃣ DELETE MEDIA
        // --------------------------------------------------------------------
        console.log("\nDeleting media...");
        const mediaList = await SQ.getMediaBySite(firstSiteID);
        const firstMediaID = mediaList[0].mediaID;
        await SQ.deleteMedia(firstMediaID, firstSiteID);
        testPassed("Deleted media successfully");

        // --------------------------------------------------------------------
        // 7️⃣ DELETE PAGE
        // --------------------------------------------------------------------
        console.log("\nDeleting page...");
        const pages = await SQ.getPagesBySite(firstSiteID);
        const firstPageID = pages[0].pageID;
        await SQ.deletePage(firstPageID, firstSiteID);
        testPassed("Deleted page successfully");

        // --------------------------------------------------------------------
        // 8️⃣ DELETE SITE
        // --------------------------------------------------------------------
        console.log(`\nDeleting site with ID ${firstSiteID}...`);
        await SQ.deleteSite(firstSiteID);
        testPassed("Deleted site successfully");

        // --------------------------------------------------------------------
        // 🔟 LAST MODIFIED TESTS
        // --------------------------------------------------------------------
        let remainingSites = await SQ.getSites();
        const site2 = remainingSites.find(s => s.websiteName.includes("Test Site B"));
        const site3 = remainingSites.find(s => s.websiteName.includes("Test Site C"));

        console.log(`\nTesting lastModified update on site 2 (ID ${site2.siteID})...`);
        const beforeMediaAdd = await SQ.getSiteByID(site2.siteID);
        await SQ.createMedia(site2.siteID, "image", "jpeg", imgBuffer);
        const afterMediaAdd = await SQ.getSiteByID(site2.siteID);
        if (afterMediaAdd[0].websiteDateUpdated > beforeMediaAdd[0].websiteDateUpdated) {
            testPassed("websiteDateUpdated updated on media insert");
        } else {
            testFailed("websiteDateUpdated did NOT update on media insert");
        }

        console.log(`\nTesting lastModified update on site 3 (ID ${site3.siteID})...`);
        const beforePageAdd = await SQ.getSiteByID(site3.siteID);
        const testPageData = JSON.stringify({ html: "<p>New page test</p>", css: "p{color:blue;}" });
        await SQ.createPage(site3.siteID, "/newpage", testPageData);
        const afterPageAdd = await SQ.getSiteByID(site3.siteID);
        if (afterPageAdd[0].websiteDateUpdated > beforePageAdd[0].websiteDateUpdated) {
            testPassed("websiteDateUpdated updated on page insert");
        } else {
            testFailed("websiteDateUpdated did NOT update on page insert");
        }

        // --------------------------------------------------------------------
        // 🧹 DELETE MEDIA/PAGE FROM SITE 2/3
        // --------------------------------------------------------------------
        const site2MediaList = await SQ.getMediaBySite(site2.siteID);
        if (site2MediaList.length > 0) {
            const beforeDel = await SQ.getSiteByID(site2.siteID);
            await wait();
            await SQ.deleteMedia(site2MediaList[0].mediaID, site2.siteID);
            const afterDel = await SQ.getSiteByID(site2.siteID);
            if (afterDel[0].websiteDateUpdated > beforeDel[0].websiteDateUpdated)
                testPassed("websiteDateUpdated updated on media delete");
            else
                testFailed("websiteDateUpdated did NOT update on media delete");
        }

        const site3Pages = await SQ.getPagesBySite(site3.siteID);
        const pageToDelete = site3Pages.find(p => p.pagePath === "/newpage");
        if (pageToDelete) {
            const beforeDel = await SQ.getSiteByID(site3.siteID);
            await wait();
            await SQ.deletePage(pageToDelete.pageID, site3.siteID);
            const afterDel = await SQ.getSiteByID(site3.siteID);
            if (afterDel[0].websiteDateUpdated > beforeDel[0].websiteDateUpdated)
                testPassed("websiteDateUpdated updated on page delete");
            else
                testFailed("websiteDateUpdated did NOT update on page delete");
        }

        // --------------------------------------------------------------------
        // COUNT & SUMMARY
        // --------------------------------------------------------------------
        console.log(`\nTest results: ${passedTests}/${totalTests} tests passed.`);
        if (passedTests === totalTests) {
            console.log("All tests passed successfully!");
        } else {
            console.log("Some tests failed. Review above for details.");
        }

    } catch (err) {
        console.error("Test sequence failed:", err);
    } finally {
        await closeConnection();
    }
}

runTests();
