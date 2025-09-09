import styles from './styles.module.css';

/*
    UserField: A component that renders a text input field for the username.
    Input: none
    Output: A div containing an input field for the username.
    Author: Lydell Jones
    Date: 4/13/2025
*/
function UserField() {
    return (
        <div className = {styles.userFieldContainer}>
            <input name = "" placeholder = "Enter Username" type = "text" className={styles.userField} id = "login_username"></input>
        </div>
    )
}

/*
    PasswField: A component that renders a password input field for the password.
    Input: none
    Output: A div containing an input field for the password.
    Date: 4/13/2025
    Author: Lydell Jones
*/
function PasswField() {
    return (
        <div className = {styles.passFieldContainer}>
            <input name = "" className={styles.passField} placeholder="Enter Password" type = "password" id = "login_username"></input>
        </div>
    );
}

/* 
    PhoneNumberField A component that renders a phone number input field
    Input: none
    Output: a div containing an input for the user's phone number
    Date: 09/08/2025
    Author: Elijah White
*/
function PhoneNumberField(){
    return (
        <div className = {styles.userFieldContainer}>
            <input name = "" placeholder = "Enter Phone Number" type = "text" className={styles.phoneField} id = "login_username"></input>
        </div>
    )
}

/*
    AccountSubmit: A component that renders a submit button for the form.
    Input: none
    Output: A button element that submits the form when clicked.
    Date: 4/13/2025
    Author: Lydell Jones
*/
function AccountSubmit( { path } ) {
    const buttonMessage = {
        "/login": "Login",
        "/recovery": "Recover",
        "/signup": "Create",
    }
    return (
        <button type = "submit" className={`${styles.accountSubmit} submit-button`} >{buttonMessage[path] ?? "ERROR"}</button>
    );
}

/*
    AccountCollecter: A component that collects user account information based on the current page.
    Input: currentPage (string) - The current page URL.
    Ouput: A form element that contiains the neccessary fields for the current page.
    Date: 4/13/2025
    Author: Lydell Jones
    Dependencies: UserField, PasswField, AccountSubmit
*/
export default function AccountCollecter( { currentPage } ) {
    var account_pages = {
        "/login": "login_form",
        "/recovery": "revovery_form",
        "/signup": "creation_form",
    };

    /*XXX: The logic of this element is set so that /api/login, /api/recovery, and /api/create are the only submittable forms
        if any other link is preset the form's id will be pointed to "ERR ACCT 39" and no fields will populate*/
    console.log("[Login] Current Page: " + currentPage + " Loaded!");
    return (
        <div style = {{display: "block"}}>
        <form id = {account_pages[currentPage] ?? "ERR ACCTCOLLT 39"} action = {"/api"+currentPage} method = "POST" className = {styles.AccountCollecter}>
            {
                (currentPage == "/login") ? (
                    <>
                        <UserField />
                        <PasswField />
                        <AccountSubmit path={currentPage}/>
                    </>
                )
                : (currentPage == "/recovery") ? (
                    <>
                        <UserField />
                        <PasswField />
                        <AccountSubmit path={currentPage}/>
                    </>
                ) : (currentPage == "/signup") ? (
                    <>
                        <UserField />
                        <PasswField />
                        <PhoneNumberField />
                        <AccountSubmit path={currentPage}/>
                    </>
                ) : (
                    <h1>ERR ACCTCOLLT 39</h1>
                )
            }
        </form>
    </div>
    );
}