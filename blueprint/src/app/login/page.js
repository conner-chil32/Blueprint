import Navbar from "../components/navbar";  // Import the Navbar component


export default function Login() {
    const htmlContent = `
    <!DOCTYPE html>
<html lang = "en">
    <!-- Ensure the page fits within aspect ratios -->
    <head>
        <meta charset = "UTF-8">
        <meta name = "viewport" content = "width = device-width, initial-scale = 1.0">
        <title>Login View</title>

        <!-- Link to the relevant files -->
         <script src='js/SpotFront.js'></script>
        <link rel='stylesheet' type = 'text/css' href='css/Generals.css'>
        <link rel='stylesheet' type = 'text/css' href='css/Assets.css'>
    </head>

    <body>
        <div class = "loginContainer" style = "padding-top: 10vh; gap: 3vh;">
            <!-- Currently In a Flex Column -->
            <img src = "images/pog_web_logo.png" style = "order: 1; align-self: center; height: 25vh; border-radius: 100px;"></h1>
            <div style = "order: 2; display:flex; flex-direction: row; justify-content: center;">
                <!-- Flex Row -->
                <input placeholder = "Enter Username" type = "text" style = "border-width: 0px; order:2; border-radius: 10px; height: 3.4vw; width: 25vw; align-self: center; position: relative;" id = "login_username">
            </div>
            <div style = "order: 3; display:flex; flex-direction: row; justify-content: center;">
                <!-- Flex Row -->
                <input type = "password" placeholder="Enter Password" style = "border-width: 0px; order:2; border-radius: 10px; height: 3.4vw; width: 25vw; align-self: center; position: relative;" id = "login_username">
            </div>
            <div style = "order: 4; display:flex; flex-direction: row; justify-content: center;">
                <!-- Flex Row -->
                <button class = "generalButton generalText" style = "order: 1; align-self: center; position: relative; width: 15vw; height: 3.4vw;">Login</button>
                <div style="order: 2; align-self: center; padding-left: 3%;padding-right: 3%;"></div>
                <button class = "generalButton generalText" style = "order: 3; align-self: center; position: relative; width: 15vw; height: 3.4vw;">Create Account</button>
            </div>
            <div style = "order: 5; display:flex; flex-direction: row; justify-content: center;">
                <h6><a href="/recovery">Cant log in?</a></h6>
            </div>
        </div>
    </body>

</html>
    `;

    return (
        <>
            <div>
                <Navbar />
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
        </>
    );
}