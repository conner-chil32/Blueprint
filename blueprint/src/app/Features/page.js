import Navbar from "../components/navbar";  // Import the Navbar component


export default function RawHTMLPage() {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>Blueprint Features For Website Creation</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    
    <!-- Link to the relevant files -->
    <script src='js/SpotFront.js'></script>
    <link rel='stylesheet' type = 'text/css' href='css/Generals.css'>
    <link rel='stylesheet' type = 'text/css' href='css/Assets.css'>
    
    <script src='js/main.js'></script>
</head>
<body>
    <div class="features-page-container">
        <div class="features-header-section">
            <h1>Blueprint Features</h1>
            <h2>Webdesign for goldfish</h2>
            <!--Had to change this to format features list, Not certain why it says web design for goldfish - Elijah-->
        </div>
    
<!-- this is comment notation
it lets you put things on multiple lines
this document needs to have a set of buttons like in the figma
could also borrow the Home/Login code from Account-Creation.html
-->
        <!--features list-->
        <div class="features-section">
            <h3 class="features-title">Features List</h3>
            <div class="features-grid">
                <div class="feature-card"><!--Added Description lines to each feature, not in mockup but felt necessary with the dead space. - Elijah-->
                    <p class="feature-text">Dozens of Templates!<br><br><br><br>For all of your website needs.</p>
                </div>
                <div class="feature-card">
                    <p class="feature-text">Edit your website at any time.<br><br><br>For maximum convenience and efficiency</p>
                </div>
                <div class="feature-card">
                    <p class="feature-text">World class customer support<br><br><br><br>A service that you can count on.</p>
                </div>
                <div class="feature-card">
                    <p class="feature-text">Choose your own domain...<br><br><br><br>Enter a world of possibilities.</p>
                </div>
                <div class="feature-card">
                    <p class="feature-text">And many more features...</p>
                </div>
            </div>
        </div>
    </div>

</body>
</html>
`;

    return (
        <>
            <div>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
        </>
    );
}