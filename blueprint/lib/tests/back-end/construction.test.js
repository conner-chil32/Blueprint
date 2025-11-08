import { createUserTable, createWebsiteTable } from "../construction";

test('createUserTable returns false if no connection',() => {
    const connection = null;
    const result = createUserTable();
    expect(result).toBe(false);
});

test('createWebsiteTable returns false if no connection',() => {
    const connection = null;
    const result = createWebsiteTable();
    expect(result).toBe(false);
});

