import { getConnectionObject, openConnection } from "@lib/connection";
import { createUserTable } from "@lib/construction";
import { createAccount } from "@lib/userQueries";
import { redirect } from "next/dist/server/api-utils";
import { headers } from "next/headers";
import Link from "next/link";

export async function POST(request) {
    const formData = await request.formData();
    const {username, password} = Object.fromEntries(formData.entries());

    const connection = await getConnectionObject();
    await createUserTable(connection);
    await createAccount(username, password, connection);

    return new Response( `
        <h1>Thank you!</h1>
        <a href="/">Home</a>
        <a href="http://localhost:8080" >Database</a>`, {
            headers: {
                "Content-Type" : "text/html"
            }
    });
}