import Navbar from "../components/navbar";  // Import the Navbar component


export default function RawHTMLPage() {
    const htmlContent = `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FTU-Main</title>
</head>

<body>

    <div class="content">
        <h1>Get Started On <br> Your Website!</h1>
        <p>With Blueprint, you will be on your way to creating your dream website in no time.</p>

        <a href="canvas.html">
            <button class="createButton">Create New Website<br><b>+</b></button>
        </a>
    </div>
</body>

<style>

    /* Vertically aligns title, subtitle, and create website button*/
    body {
        text-align: left;
        display: inline;
        color: black;
    }

    /*Handles the content in the body of the page, outside of top bar*/
    .content {
        margin-left: 30px;
        margin-top: 100px;
        margin-bottom: 30px;
        padding-bottom: 30px;
        border-radius: 40px;
        background-color: rgba(255, 255, 255, 0.92);

        padding-left: 30px;
        max-width: 1700px;
        min-width: 500px;
        width: 90%; /*scales within the max and minrange */

        /* Title: "Get started..." */
        h1{
            font-size: 70px;
            padding-top: 30px;
        }

        /* Subtitle: "With Blueprint..." */
        p {
            font-size: 50px;
            max-width: 1000px;
        }
    }

    /* Create a website button*/
    .createButton {
        padding: 10px 20px;
        border: dashed black;
        border-width: 7px;
        background:var(--background-color) ;
        height: calc(100vh - 75vh);
        border-radius: 20px;
        width: 90%;
        font-size: 50px;
        line-height: 80px;
    }

    .createButton:hover {
        background-color: var(--light-blue);
        cursor: pointer;
    }
</style>

</html>
    `;

    return (
        <>
            <Navbar />  {}
            <div>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
        </>
    );
}