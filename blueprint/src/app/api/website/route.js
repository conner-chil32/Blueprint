import { NextResponse } from "next/server";
import { setCookie } from "../CookieController";
import { createSite, getSitesByUser, updateSite } from "@lib/siteQueries";
import { validateSite, validateUser } from "@lib/userQueries";

/** */
export async function PATCH(request) {
    //validate user (grab id when verified)
    const res = NextResponse.redirect(new URL("/canvas", request.url)); //ready the redirect to the canvas page
    const site_id = request.nextUrl.searchParams.get('site_id');
    const { sitejson } = await request.json();

    try{
        //validate and obtain 
        await validateUser(request);
        const site = await validateSite(site_id);
        await updateSite(site, sitejson); //update site
    } catch (err) {
        console.log(err);
        return new NextResponse("Something went wrong updating the site...", {status: 500});
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

        //create site and add id
        const createdSite = await createSite(name, user);

        //set cookie 'CurrentSite' to the current site of focus for rendering in Canvas
        setCookie(res, 'CurrentSite', createdSite ? createdSite : 'NULL');

        //create site and prepare to navigate to the created site's canvas
    } catch (err) {
        console.log(err);
        return new NextResponse("Something went wrong creating the site...", {status: 500});
    }
        
    //redirect to canvas with cookie in mind
    return res;
}

//redirect the user to the canvas page of their website 
export async function GET(request) {    

    try {
        const params =(new URL(request.url)).searchParams
        const res = NextResponse.redirect(new URL('/canvas', request.url));
        const temp_ste_id = params.get('site_id');
        const usr = validateUser(request);

        if (temp_ste_id !== null){ //if there's no query parameters treat as a redirect
            const site_id = await validateSite(temp_ste_id);
            /**store the id of the site temporarily for redirection to canvas
                once redirected, canvas will pull the neccessary values. 
            */
            setCookie(res, 'CurrentSite', site_id);
            return res;
        } else if (usr !== undefined){ //if the client id exists return the user's websites
            const s = await getSitesByUser(usr);
            return NextResponse.json(JSON.stringify(s));
        } else {
            throw false;
        }
    } catch (err) {
        console.log(err);
        return new NextResponse({status: 500, error: "Something went wrong retrieving the site(s)..."});
    }
}

