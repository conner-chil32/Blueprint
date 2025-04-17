import { getUserByEmail } from "../userQueries";

test('getUserByEmail returns false if no connection', () => {
    expect(getUserByEmail().then()).toBe(false);
});