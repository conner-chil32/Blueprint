import Navbar from "../components/navbar";  // Import the Navbar component


export default function RawHTMLPage() {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pricing Plans</title>

    <style>
        body {
            font-family: 'OpenDyslexic', sans-serif;
            background-color: #555;
            color: white;
            text-align: center;
            display: inline;
            margin: 0;
            padding: 0;
        }

        .logoStyle {
            height: 40px;
            cursor: pointer;
        }

        .nav-button {
            background-color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            text-decoration: none;
            color: black;
            display: inline-block;
        }

        .title {
            font-size: 32px;
            font-weight: 600;
            margin: 30px 0;
        }

        .plans {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            padding: 20px;
        }

        .plan {
            background-color: white;
            color: black;
            padding: 20px;
            border-radius: 10px;
            width: 250px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
            font-weight: 400;
        }

        .plan h2 {
            margin: 10px 0;
            font-weight: 600;
        }

        .plan ul {
            list-style: none;
            padding: 0;
        }

        .plan ul li {
            margin-bottom: 15px;
        }
    </style>
</head>
<body>

 <div class="content">
    <h1 class="title">There is a plan for everyone</h1>

    <div class="plans">
        <div class="plan">
            <h2>FREE PLAN</h2>
            <p>$0</p>
            <ul>
                <li>PERK 1 OF FREE</li>
                <li>PERK 2 OF FREE</li>
                <li>PERK 3 OF FREE</li>
                <li>PERK 4 OF FREE</li>
            </ul>
        </div>

        <div class="plan">
            <h2>PERSONAL PLAN</h2>
            <p>$5/mo</p>
            <ul>
                <li>ALL PERKS OF FREE</li>
                <li>PERK 1 OF PERSONAL</li>
                <li>PERK 2 OF PERSONAL</li>
                <li>PERK 3 OF PERSONAL</li>
            </ul>
        </div>

        <div class="plan">
            <h2>BUSINESS PLAN</h2>
            <p>$15/mo</p>
            <ul>
                <li>ALL PERKS OF PERSONAL</li>
                <li>PERK 1 OF BUSINESS</li>
                <li>PERK 2 OF BUSINESS</li>
                <li>PERK 3 OF BUSINESS</li>
            </ul>
        </div>

        <div class="plan">
            <h2>ENTERPRISE PLAN</h2>
            <p>Custom Pricing</p>
            <ul>
                <li>ALL PERKS OF BUSINESS</li>
                <li>PERK 1 OF ENTERPRISE</li>
                <li>PERK 2 OF ENTERPRISE</li>
                <li>PERK 3 OF ENTERPRISE</li>
            </ul>
        </div>
    </div>
    </div>

</body>
</html>

    `;

    return (
        <>
            <Navbar />  {/* Add the Navbar here */}
            <div>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
        </>
    );
}