'use server'

import { createMedia } from "@lib/siteQueries";
import { useRouter } from "next/router";

export async function POST(request) {

    //

    const router = useRouter();

    const {site_id, media_id} = router.query;

    if(validateUser() && validateSite(site_id)) {
        createMedia(site_id, "test/test", )
    }
    

    /**
     * PLAN - NOT DONE
     * create a media object
     * 1. validate the object
     * 2. create an entry into the database
     * 3. send the object
     * 4. send a response depending if the transfer was successful or not
     */
}