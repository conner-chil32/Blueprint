import { NextResponse } from "next/server";
import { getCookie, setCookie } from "../CookieController";
import { createSite, getSiteByID, getSiteByName, updateSite } from "@lib/siteQueries";
import { validateSite, validateUser } from "@lib/userQueries";

/** */
export async function PATCH(request) {
    //validate user (grab id when verified)
    const res = NextResponse.redirect(new URL("/canvas", request.url)); //ready the redirect to the canvas page
    const params = new URLSearchParams(request.url);
    const site_id = params.get('site_id');
    console.log(site_id);
    const { sitejson } = await request.json();
    try{
        //validate user
        const user = 1;
        await validateSite(site_id);
        await updateSite(user, sitejson);
        //create site and prepare to navigate to the created site's canvas
    } catch (err) {
        console.log(err);
        return new NextResponse("Something went wrong...", {status: 500});
    }
        
    //redirect to canvas with cookie in mind
    return res;
}

//Create a new website
export async function POST(request) {
    const res = NextResponse.redirect(new URL("/canvas", request.url)); //ready the redirect to the canvas page
    const form = await request.formData();
    const name = form.get('name');
    try{
        //validate user
        const user = await validateUser(request);
        console.log(name);
        await createSite(name, user);
        setCookie(result, 'CurrentSite', site_id);
        //create site and prepare to navigate to the created site's canvas
    } catch (err) {
        console.log(err);
        return new NextResponse("Something went wrong...", {status: 500});
    }
        
    //redirect to canvas with cookie in mind
    return res;
}

export async function GET(request) {

    const params = new URLSearchParams(request.url);
    const site_id = params.get('site_id');
    const result = new NextResponse.redirect("/canvas");

    try {
        await validateUser(request);
        await validateSite(site_id);
        /**store the id of the site temporarily for redirection to canvas
            once redirected, canvas will pull the neccessary values. 
        */
        setCookie(result, 'CurrentSite', site_id);
        return result;
    } catch (err) {
        console.log(err);
        return new NextResponse({status: 500, error: "Something went wrong..."});
    }
}

