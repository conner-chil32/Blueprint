import { getLoginsById } from '@lib/userQueries';
import { NextResponse } from 'next/server';

// GET — login history for one user
export async function GET(request, { params }) {
    try {
        const userId = Number(params['user-id']);


        const result = await getLoginsById(userId);
        console.log("Fetching login history for userId:", userId);


        if (!result) {
            return NextResponse.json(
                { success: false, error: "No DB connection" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, logins: result });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
