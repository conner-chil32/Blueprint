import { useRouter } from "next/router";
import { NextResponse } from "next/server";

import { validateUser, validateSite } from "@lib/userQueries"
import { createPage, deletePage, getPageByID, getSiteByID, updateSite, validateSite } from "@lib/siteQueries"


export async function POST(req) {
    const site_id = useRouter().query().site_id; //get the site id from the url
    const { page_name, jsonpage } = req.body.json(); //get the json from the user
    //validate user and compare against the user id
    if ((page_name === undefined && jsonpage === undefined && site_id === undefined) && !await validateUser(req)) return NextResponse({message: "Unauthorized User"}, 401); 
    //user is assumed to be logged in and a site with the requested id matches
    return NextResponse({success: await createPage(site_id,`${page_name}`)},200)
}

export async function GET(req) {
    const site_id = useRouter().query().site_id;
    const { page_id } = req.body.json();
    //validate user and compare against the user id
    if ((site_id === undefined && page_id === undefined) && await validateUser(req) || await validateSite(site_id)) return NextResponse({message: "Unauthorized User"}, 401); 
    return await getPageByID(site_id); //return the page
}

export async function PUT(req){
    const site_id = useRouter().query().site_id; //get the site from the user
    const { jsonpage, page_id } = req.body.json(); //get the page id and the updated json
    //validate user and compare against the user id
    if (!((page_name === undefined && jsonpage === undefined && site_id === undefined) && await validateUser(req) && await validateSite(site_id))) return NextResponse({message: "Unauthorized User"}, 401); 
    return NextResponse({success: await updateSite(page_id, await getSiteByID(site_id))}, 200);
}

export async function DELETE(req) {
    const site_id = useRouter().query().site_id;
    const { page_id } = req.body.json();
    //validate user and compare against the user id
    if (!((page_name === undefined && jsonpage === undefined && site_id === undefined) && await validateUser(req) && await validateSite(site_id))) return NextResponse({message: "Unauthorized User"}, 401); 
    return NextResponse({success: await deletePage(site_id, page_id)});
}