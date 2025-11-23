import { closeConnection } from "../../connection";
import { connection } from "../../connection.js"
import { 
    getSites, 
    getSiteByID, 
    getSiteByName, 
    getSiteCount, 
    createSite, 
    updateSite, 
    deleteSite 
} from "../../siteQueries";
import { jest } from '@jest/globals';

test('getSites to throw undefined if no connection', async () => {
    await closeConnection();
    expect(await getSites()).toThrow(undefined);
}, 10000);
test('getSiteByID to throw undefined if no connection', async () => {
    await closeConnection();
    expect(await getSiteByID(0)).toThrow(undefined);
}, 10000);
test('getSiteByName returns false if no connection', async () => {
    await closeConnection();
    expect(await getSiteByName("")).toThrow(undefined);
}, 10000);
test('getSiteCount returns false if no connection', async () => {
    await closeConnection();
    expect(await getSiteCount(0)).toThrow(undefined);
}, 10000);
test('createSite returns false if no connection', async () => {
    await closeConnection();
    expect(await createSite("",0)).toThrow(false);
}, 10000);
test('updateSite returns false if no connection', async () => {
    await closeConnection();
    expect(await updateSite(0,"",{})).toThrow(false);
}, 10000);
test('deleteSite returns false if no connection', async () => {
    await closeConnection();
    expect(await deleteSite(0)).toThrow(false);
}, 10000);