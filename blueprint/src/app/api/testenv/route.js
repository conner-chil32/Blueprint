/* DEFINING THE WORDPRESS ENVIRONMENT TYPE
If the define('WP_ENVIRONMENT_TYPE', 'local') *(used to create the application key)* is NOT WORKING on the file that is visible
in your Wordpress folder in VS CODE, then you have to go in and modify it nside your WordPress Docker container.
In the terminal:
STEP 1: docker exec -it blueprint-wordpress bash
STEP 2: cd /var/www/html
STEP 3: nano wp-config.php
        If you need to install nano, do:
        1. apt update && apt install nano -y
STEP 4: nano wp-config.php
STEP 5: Add this line: define( 'WP_ENVIRONMENT_TYPE', 'local' );
        Add it anywhere before this line: /* That's all, stop editing! Happy publishing. * /
STEP 6: You should now be able to go into localhost:8000/wp-admin/profile.php and create your Application Password that needs
        to be encoded to a base64 string.
STEP 7: In order to encode your Application Password into a base64 string, you must do:
        echo -n 'your-wordpress-username:your-app-password' | base64
        (Wordpress username can be seen on top right of localhost:8000/wp-admin)
        (your-app-password is the same one you just created in the last step)
STEP 8: Go to your .env.local file and write the following:
        NEXT_PUBLIC_WP_AUTH=Basic YOUR_BASE64_STRING
STEP 9: http://localhost:3000/api/testenv to test that your authorization is working properly.
        Should return something like: {"auth":"Basic dXNlcm5hbWUxOnBUYm8gUWhPMCBQd04wIGNVR2IgWDBOciBhRFh1"}
*/

/* FILE INFORMATION
Use this file to test that your .env.local file is properly holding your wordpress application password
REMEMBER TO PUT THE .env.local FILE (WHICH HOLDS YOUR WP_AUTH KEY) UNDER THE /blueprint/src/app FOLDER
NEXT_PUBLIC_WP_AUTH key must be in base64 form and held in .env.local
*/

//src/app/api/testenv/route.js
export async function GET() {
    return new Response(
      JSON.stringify({ auth: process.env.NEXT_PUBLIC_WP_AUTH }),
      { status: 200 }
    );
  }