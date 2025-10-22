import { NextResponse } from "next/server";

export async function POST(request) {

    const formdata = await request.formData();
    const file = formdata.get("mediafile");
    console.log(file);
    
   return new NextResponse(200);
}