import { render, screen } from '@testing-library/react'
import Login from '@/app/login/page'

describe('Login Page', () => {
    test('Checking to see if Login Page Loads', () => {
        render(<Login />);
        // Assert that a specific element or text is present on the page
        expect(screen.getByText("CREATE ACCOUNT")).toBeInTheDocument();
    });

    test('Checking to see if navbar loads',()=>{
        render(<Login />);
        expect(screen.getByAltText("Blueprint Logo",{exact:false})).toBeInTheDocument();
    })
    // Add more tests to check for other elements, data loading, or user interactions

    test('Checking if entry boxes load',()=>{
        render(<Login />);

        expect(screen.getByRole('textbox')).toHaveProperty('name', 'username');
        expect(screen.getByRole('textbox')).toHaveProperty('placeholder','Username');
        expect(screen.getByRole('textbox')).toHaveProperty('required',true);
        expect(screen.getByRole('textbox')).toHaveProperty('type','text');
    });

    test('Checking if log in button loads',()=>{
        render(<Login />);

        expect(screen.getByRole('button',{name:'LOG IN'})).toBeInTheDocument();
        expect(screen.getByRole('button',{name:'LOG IN'})).toHaveProperty('className','submit-button');
        expect(screen.getByRole('button',{name:'LOG IN'})).toHaveProperty('type','submit');
    });

    test('Checking if account creation text loads',()=>{
        render(<Login />);
        expect(screen.getByText("Dont have an account yet? Don't miss out! create one down below.")).toBeInTheDocument();
        expect(screen.getByText('CREATE ACCOUNT')).toBeInTheDocument();
    });

    test('Checking if create account button loads',()=>{
        render(<Login />);
        expect(screen.getByRole('button',{name:'CREATE ACCOUNT'})).toBeInTheDocument();
    });

    test('Checking if create account button routes to /signup',()=>{
        render(<Login />);
        expect(screen.getByRole('link',{name:'CREATE ACCOUNT'})).toHaveAttribute('href','/signup');
    });
});