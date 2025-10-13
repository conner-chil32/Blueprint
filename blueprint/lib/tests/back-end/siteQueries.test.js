import { 
    getSites, 
    getSiteByID, 
    getSiteByName, 
    getSiteCount, 
    createSite, 
    updateSite, 
    deleteSite 
} from "../../siteQueries";

test('getSites returns false if no connection', () => {
    const connection = null;
    const result = getSites();
    expect(result).toBe(false);
});
test('getSiteByID returns false if no connection', () => {
    const connection = null;
    const result = getSiteByID(1);
    expect(result).toBe(false);
});
test('getSiteByName returns false if no connection', () => {
    const connection = null;
    const result = getSiteByName("test.com");
    expect(result).toBe(false);
});
test('getSiteCount returns false if no connection', () => {
    const connection = null;
    const result = getSiteCount();
    expect(result).toBe(false);
});
test('createSite returns false if no connection', () => {
    const connection = null;
    const result = createSite("test.com");
    expect(result).toBe(false);
});
test('updateSite returns false if no connection', () => {
    const connection = null;
    const result = updateSite(1, "test.com");
    expect(result).toBe(false);
});
test('deleteSite returns false if no connection', () => {
    const connection = null;
    const result = deleteSite(1);
    expect(result).toBe(false);
});