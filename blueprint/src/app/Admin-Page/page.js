import Navbar from "../components/navbar";  // Import the Navbar component


export default function RawHTMLPage() {
    const htmlContent = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    
    <!-- Import Alexandria font from Google Fonts -->
    <!-- <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700&display=swap" rel="stylesheet"> -->
     
    <!-- Link to the relevant files -->
    <script src='src/SpotFront.js'></script>
    <link rel='stylesheet' type = 'text/css' href='css/Generals.css'>
    <link rel='stylesheet' type = 'text/css' href='css/Assets.css'>

    <style>
        /* Apply Alexandria font to the entire page */
        body {
            font-family: 'OpenDyslexic', sans-serif;
            background-color: #444;
            color: white;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
        }

        /* Main container layout */
        .container {
            width: 90%;
            max-width: 1200px;
            background: #666;
            padding: 20px;
            border-radius: 10px;
            display: grid;
            grid-template-columns: 1fr 2fr 1fr;
            gap: 15px;
        }

        /* General box styling */
        .box {
            background: #888;
            padding: 15px;
            border-radius: 10px;
        }

        /* Logo section */
        .logo {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            background: white;
            color: black;
            padding: 10px;
            border-radius: 10px;
        }

        /* Server status summary */
        .status-summary div {
            background: #aaa;
            padding: 5px;
            margin-top: 5px;
            border-radius: 5px;
        }

        /* Input fields & account list styling */
        .user-summary input,
        .account-list div {
            background: white;
            color: black;
            padding: 10px;
            margin: 5px 0;
            border-radius: 5px;
            width: 100%;
            box-sizing: border-box;
        }

        /* Admin action buttons (white background) */
        .actions {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .actions button {
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 5px;
            background: #FFFFFF; /* White background */
            color: #000000; /* Black text */
            font-size: 14px;
            cursor: pointer;
            font-weight: 500; /* Slightly bold for readability */
        }

        /* Search input */
        .modify-accounts input {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
            border: none;
        }

        /* Add Account button */
        .modify-accounts button.add-account {
            background: #FFFFFF; /* White button */
            color: #000000; /* Black text */
        }

        /* Graph container */
        .graph-container {
            grid-column: span 3;
            background: #777;
            padding: 20px;
            border-radius: 10px;
            min-height: 250px;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
        }
    </style>
</head>
<body>

    <div class="container">
        <!-- Sidebar: Logo & Server Status -->
        <div class="box">
            <div class="logo">Blueprint Logo</div>
            <div class="status-summary">
                <h3>Server status summary:</h3>
                <div>Ping: ##ms</div>
                <div>Mem. usage: ##%</div>
                <div>Disk Used ##%</div>
            </div>
        </div>

        <!-- Center Section: Selected User Summary & Admin Actions -->
        <div class="box">
            <h3>Selected user summary:</h3>
            <input type="text" placeholder="Username">
            <input type="text" placeholder="Email address">
            <input type="text" placeholder="Phone number">
            <input type="text" placeholder="Name">
            
            <h3>Admin actions:</h3>
            <div class="actions">
                <button>Delete account</button>
                <button>Temporarily ban user</button>
                <button>Permanently ban user</button>
                <button>Add note</button>
            </div>
        </div>

        <!-- Right Section: Modify Accounts -->
        <div class="box">
            <h3>Modify Accounts:</h3>
            <input type="text" placeholder="Search For Account">
            <div class="account-list">
                <div>Username</div>
                <div>Username</div>
                <div>Username</div>
                <div>Username</div>
            </div>
            <button class="add-account">Add Account</button>
        </div>

        <!-- Bottom Section: Server Status Graphs -->
        <div class="graph-container">
            <h3>Server Status Graphs (Placeholder)</h3>
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