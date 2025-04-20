import { closeConnection, openConnection } from "@lib/connection";
import { createUserTable, createWebsiteTable } from "@lib/construction";
import { validateConnection } from "@lib/utility";

export default async function InitTable() {
    console.error("[DB] Initializing tables...");
    const connection = await openConnection(3);
    if (await validateConnection(connection)) {
        await createUserTable(connection);
        await createWebsiteTable(connection);
        console.log("[DB] Tables initialized successfully.");
    }
    return (
        <div>
            <h1>Initializing Tables...</h1>
            <p>Please check the console for status updates.</p>
        </div>
    );
}