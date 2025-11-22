import { connection } from '../../connection';
    
test('empty query is successful', async () => {
    const result = await connection.query("SELECT 1 as 'ok';");
    expect(result).toBeDefined();
}, 10000);