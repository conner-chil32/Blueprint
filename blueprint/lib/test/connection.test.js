import { openConnection } from "../connection";

test('failed opening connection will be empty', () => {
    openConnection().then((connection) => {
        expect(connection).toBeUndefined();
    });
});