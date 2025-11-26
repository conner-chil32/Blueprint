import { getUserByEmail } from "../../userQueries";
import { jest } from '@jest/globals';
import { closeConnection, connection } from "@lib/connection";
jest.useFakeTimers();


test('getUserByEmail returns false if no connection', async () => {
    //something to close the actual database connection needs to persist here
    expect(await getUserByEmail("")).rejects.toThrow(undefined);
}, 20000);