import { render, screen } from '@testing-library/react'
import Build from '@/components/accountCollecter'

describe('AccountCollector component', () => {
    test('Checking to see if incorrect build message loads', () => {
        render(<Build />);
        // Assert that a specific element or text is present on the page
        expect(screen.getByRole('heading',{name:'ERR ACCTCOLLT 39'})).toBeInTheDocument();
    });

    test('Checking if /login loads with all elements',()=>{
        render(<Build currentPage = "/login"/>);

        // Assert Create Account button
        expect(screen.getByText('Create Account')).toBeInTheDocument();
        expect(screen.getByText('Create Account')).toHaveProperty('href',window.location.href+'signup');
        expect(screen.getByRole('link',{name:'Create Account'})).toHaveProperty('href',window.location.href+'signup');

        // Assert username box
        expect(screen.getByRole('textbox',{name:''})).toBeInTheDocument();
        expect(screen.getByRole('textbox',{name:''})).toHaveProperty('className','userField');
        expect(screen.getByRole('textbox',{name:''})).toHaveProperty('id','login_username');
        expect(screen.getByRole('textbox',{name:''})).toHaveProperty('name','username');
        expect(screen.getByRole('textbox',{name:''})).toHaveProperty('placeholder','Enter Username');
        expect(screen.getByRole('textbox',{name:''})).toHaveProperty('type','text');
        expect(screen.getByPlaceholderText('Enter Username')).toBeInTheDocument();

        // Assert Passwordbox
        expect(screen.getByTestId('password')).toBeInTheDocument();
        expect(screen.getByTestId('password')).toHaveProperty('className','passFieldContainer');
        expect(screen.getByPlaceholderText('Enter Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter Password')).toHaveProperty('name','password');
        expect(screen.getByPlaceholderText('Enter Password')).toHaveProperty('className','passField');
        expect(screen.getByPlaceholderText('Enter Password')).toHaveProperty('type','password');
        expect(screen.getByPlaceholderText('Enter Password')).toHaveProperty('id','login_username');

        // Assert AccountSubmit
        expect(screen.getByText('Login')).toBeInTheDocument(); //written on the button
        expect(screen.getByRole('button',{name:'Login'})).toBeInTheDocument();
        expect(screen.getByRole('button',{name:'Login'})).toHaveProperty('className','accountSubmit submit-button');
        expect(screen.getByRole('button',{name:'Login'})).toHaveProperty('type','submit');
    });

    test('Checking if /recovery loads with all elements',()=>{
        render(<Build currentPage = "/recovery"/>);

        // Assert username box
        expect(screen.getByRole('textbox',{name:''})).toBeInTheDocument();
        expect(screen.getByRole('textbox',{name:''})).toHaveProperty('className','userField');
        expect(screen.getByRole('textbox',{name:''})).toHaveProperty('id','login_username');
        expect(screen.getByRole('textbox',{name:''})).toHaveProperty('name','username');
        expect(screen.getByRole('textbox',{name:''})).toHaveProperty('placeholder','Enter Username');
        expect(screen.getByRole('textbox',{name:''})).toHaveProperty('type','text');
        expect(screen.getByPlaceholderText('Enter Username')).toBeInTheDocument();

        // Assert Passwordbox
        expect(screen.getByTestId('password')).toBeInTheDocument();
        expect(screen.getByTestId('password')).toHaveProperty('className','passFieldContainer');
        expect(screen.getByPlaceholderText('Enter Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter Password')).toHaveProperty('name','password');
        expect(screen.getByPlaceholderText('Enter Password')).toHaveProperty('className','passField');
        expect(screen.getByPlaceholderText('Enter Password')).toHaveProperty('type','password');
        expect(screen.getByPlaceholderText('Enter Password')).toHaveProperty('id','login_username');

        // Assert AccountSubmit
        expect(screen.getByText('Recover')).toBeInTheDocument(); //written on the button
        expect(screen.getByRole('button',{name:'Recover'})).toBeInTheDocument();
        expect(screen.getByRole('button',{name:'Recover'})).toHaveProperty('className','accountSubmit submit-button');
        expect(screen.getByRole('button',{name:'Recover'})).toHaveProperty('type','submit');
    });

    test('Checking if /signup loads with all elements',()=>{
        render(<Build currentPage = "/signup"/>);

        // Assert username box
        expect(screen.getByRole('textbox',{name:''})).toBeInTheDocument();
        expect(screen.getByRole('textbox',{name:''})).toHaveProperty('className','userField');
        expect(screen.getByRole('textbox',{name:''})).toHaveProperty('id','login_username');
        expect(screen.getByRole('textbox',{name:''})).toHaveProperty('name','username');
        expect(screen.getByRole('textbox',{name:''})).toHaveProperty('placeholder','Enter Username');
        expect(screen.getByRole('textbox',{name:''})).toHaveProperty('type','text');
        expect(screen.getByPlaceholderText('Enter Username')).toBeInTheDocument();

        // Assert Passwordbox
        expect(screen.getByTestId('password')).toBeInTheDocument();
        expect(screen.getByTestId('password')).toHaveProperty('className','passFieldContainer');
        expect(screen.getByPlaceholderText('Enter Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter Password')).toHaveProperty('name','password');
        expect(screen.getByPlaceholderText('Enter Password')).toHaveProperty('className','passField');
        expect(screen.getByPlaceholderText('Enter Password')).toHaveProperty('type','password');
        expect(screen.getByPlaceholderText('Enter Password')).toHaveProperty('id','login_username');

        // Assert AccountSubmit
        expect(screen.getByText('Create')).toBeInTheDocument(); //written on the button
        expect(screen.getByRole('button',{name:'Create'})).toBeInTheDocument();
        expect(screen.getByRole('button',{name:'Create'})).toHaveProperty('className','accountSubmit submit-button');
        expect(screen.getByRole('button',{name:'Create'})).toHaveProperty('type','submit');
    });
    /*     
    return (
        <div className = {styles.userFieldContainer} data-testid="username">
            <input name = "username" placeholder = "Enter Username" type = "text" className={styles.userField} id = "login_username"></input>
        </div>
    )

    return (
        <div className = {styles.passFieldContainer} data-testid="password">
            <input name = "password" className={styles.passField} placeholder="Enter Password" type = "password" id = "login_username"></input>
        </div>
    );

    return (
        <button type = "submit" className={`${styles.accountSubmit} submit-button`} >{buttonMessage[path] ?? "ERROR"}</button>
    );
    const buttonMessage = {
        "/login": "Login",
        "/recovery": "Recover",
        "/signup": "Create",
    }
    */
});