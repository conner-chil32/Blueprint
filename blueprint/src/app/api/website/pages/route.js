import { NextResponse } from "next/server";

import { validateUserSite } from "@lib/userQueries";
import { createPage, deletePage, getPageByID, getSiteByID, updateSite, validateSite } from "@lib/siteQueries";


export async function POST(request) {

    const params = new URLSearchParams(new URL(request.url)); //get the parameter name (user)
    const pages_name = params?.get('page_name');
    const jsonpage = params?.get('jsonpage');
    //validate user and compare against the user id
    if ((pages_name === undefined && jsonpage === undefined && site_id === undefined)) return NextResponse({message: "Something went wrong..."}, 500); 
    //user is assumed to be logged in and a site with the requested id matches
    return NextResponse({success: await createPage(site_id,`${pages_name}`)},200)
}

export async function GET(request) {
    // const site_id = useRouter().query().site_id;
    // const { pages_id } = req.body.json();

    const params = new URLSearchParams(new URL(request.url)); //get the parameter name (user)
    const pages_id = params.get('pages_id');

    //validate user and compare against the user id
    if ((site_id === undefined && pages_id === undefined) && await validateUser(request) && await validateSite(site_id)) return NextResponse({message: "Something went wrong..."}, 500); 
    return await getPageByID(site_id); //return the page
}

export async function PUT(request){
    // const site_id = useRouter().query().site_id; //get the site from the user
    // const { jsonpage, pages_id } = req.body.json(); //get the page id and the updated json

    const params = new URLSearchParams(new URL(request.url)); //get the parameter name (user)
    const jsonpage = params.get('jsonpage');
    const pages_id = params.get('pages_id');
    //validate user and compare against the user id
    if (!((pages_name === undefined && jsonpage === undefined && site_id === undefined) && await validateUser(request) && await validateSite(site_id))) return NextResponse({message: "Unauthorized User"}, 401); 
    return NextResponse({success: await updateSite(pages_id, await getSiteByID(site_id))}, 200);
}

export async function DELETE(request) {
    // const site_id = useRouter().query().site_id;
    // const { pages_id } = req.body.json();
    //validate user and compare against the user id

    const params = new URLSearchParams(new URL(request.url)); //get the parameter name (user)
    const pages_id = params.get('pages_id');

    if (!((pages_name === undefined && jsonpage === undefined && site_id === undefined) && await validateUserSite(request, site_id))) return NextResponse({message: "Unauthorized User"}, 401); 
    return NextResponse({success: await deletePage(site_id, pages_id)});
}