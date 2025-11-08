'use server'

import { createMedia } from "@lib/siteQueries";
import { validateUser, validateSite, validateUserSite } from "@lib/userQueries";
import { useRouter } from "next/router";
import { NextResponse  } from "next/server";

export async function POST(request) {
    const params = new URLSearchParams(new URL(request.url)); //get the parameter name (user)
    const body = await request.body.json();

    if (await validateUserSite(request, params?.get('site_id'))) {
        
    } else {
        return NextResponse({message: "Could not Save Media"}, 401); 
    }
}