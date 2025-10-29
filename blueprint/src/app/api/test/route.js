import { validateSite, validateUser } from "@lib/userQueries";
import { useRouter } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(request) {
    
    // if (await validateUser(request)) {
    //     console.log("user validation successful");
    // } else {
    //     console.log("user validation unsuccessful");
    // }

    // if (await validateSite(0)) {
    //     console.log("site validation successful");
    // } else {
    //     console.log("site validation unsuccessful");
    // }
    
    // return new NextResponse(200);

    // try {
        //await validateUser(request);
        const router = useServersideProps();
        const { page_name, jsonpage } = router.query//get the json from the user
        console.log(jsonpage);
        //         return new NextResponse(200);
    // } catch (err) {
        return new NextResponse("Ew, you cant look at this", {status: 401});
    // }

}