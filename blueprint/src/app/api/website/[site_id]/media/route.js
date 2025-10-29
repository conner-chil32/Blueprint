'use server'

import { createMedia } from "@lib/siteQueries";
import { validateUser, validateSite } from "@lib/userQueries";
import { useRouter } from "next/router";
import { NextResponse  } from "next/server";

export async function POST(request, {site_id}) {
    const params = new URLSearchParams(request.url); //get the parameter name (user)
    const jsonpage = params.get('media_data');

    if (((pages_name !== undefined && jsonpage !== undefined && site_id !== undefined) && await validateUser(request) && await validateSite(site_id))) return NextResponse({message: "Unauthorized User"}, 401); 


}