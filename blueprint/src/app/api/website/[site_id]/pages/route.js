import { useRouter } from "next/router";
import { NextResponse } from "next/server";

import { validateUser, validateSite } from "@lib/userQueries"
import { createPage, deletePage, getPageByID, getSiteByID, updateSite, validateSite } from "@lib/siteQueries"


export async function POST(req, {site_id}) {
    // const site_id = useRouter().query().site_id; //get the site id from the url
    // const { pages_name, jsonpage } = req.body.json(); //get the json from the user

    const params = new URLSearchParams(request.url); //get the parameter name (user)
    const pages_name = params.get('pages_name');
    const jsonpage = params.get('jsonpage');
    //validate user and compare against the user id
    if ((pages_name === undefined && jsonpage === undefined && site_id === undefined) && await validateUser(req)) return NextResponse({message: "Something went wrong..."}, 500); 
    //user is assumed to be logged in and a site with the requested id matches
    return NextResponse({success: await createPage(site_id,`${pages_name}`)},200)
}

export async function GET(req, {site_id}) {
    // const site_id = useRouter().query().site_id;
    // const { pages_id } = req.body.json();

    const params = new URLSearchParams(request.url); //get the parameter name (user)
    const pages_id = params.get('pages_id');

    //validate user and compare against the user id
    if ((site_id === undefined && pages_id === undefined) && await validateUser(req) && await validateSite(site_id)) return NextResponse({message: "Something went wrong..."}, 500); 
    // return await getPageByID(site_id); //return the page
}

export async function PUT(req, {site_id}){
    // const site_id = useRouter().query().site_id; //get the site from the user
    // const { jsonpage, pages_id } = req.body.json(); //get the page id and the updated json

    const params = new URLSearchParams(request.url); //get the parameter name (user)
    const jsonpage = params.get('jsonpage');
    const pages_id = params.get('pages_id');
    //validate user and compare against the user id
    if (!((pages_name === undefined && jsonpage === undefined && site_id === undefined) && await validateUser(req) && await validateSite(site_id))) return NextResponse({message: "Unauthorized User"}, 401); 
    return NextResponse({success: await updateSite(pages_id, await getSiteByID(site_id))}, 200);
}

export async function DELETE(req, {site_id}) {
    // const site_id = useRouter().query().site_id;
    // const { pages_id } = req.body.json();
    //validate user and compare against the user id

    const params = new URLSearchParams(request.url); //get the parameter name (user)
    const pages_id = params.get('pages_id');

    if (!((pages_name === undefined && jsonpage === undefined && site_id === undefined) && await validateUser(req) && await validateSite(site_id))) return NextResponse({message: "Unauthorized User"}, 401); 
    return NextResponse({success: await deletePage(site_id, pages_id)});
}