import { updateSite } from "@lib/siteQueries";
import { NextResponse } from "next/server";
import { getCookie } from "../CookieController";

export default function GET(req) {
    
}

export default async function PUT(req) {
    try{
        const { name, siteID } = await request.json();
        userID = getCookie(req,'UserCookie');

        if (userID === undefined || userID == "") {
            return NextResponse({success: true}, {status: 200});
        }

        await updateSite();

        return NextResponse({success: true}, {status: 200});
    } catch (err) {
    }
    
}

export default function POST(req) {
    
}

export default function DELETE(req) {
    
}