import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import Recovery from '@/app/account-recovery/page'


describe('Recovery Page', () => {

    test('Checking if navbar loads', () =>{
        render(<Recovery />);
        expect(screen.getByAltText('blueprint logo',{hidden:true,exact:false})).toBeInTheDocument();
    });

    test('Checking the logo loads',()=>{
        render(<Recovery />);
        expect(screen.getByAltText('pog web', {exact:false})).toBeInTheDocument();
    });

    test('Checking if username box loads', ()=>{
        render(<Recovery />);
        
        const userbox = screen.getByRole('textbox');
        expect(userbox).toBeInTheDocument();
        expect(userbox).toHaveAttribute('class', 'userField');
        expect(userbox).toHaveAttribute('id', 'recover_email');
        expect(userbox).toHaveAttribute('name','email');
        expect(userbox).toHaveAttribute('placeholder','Enter Your Email Address');
        expect(userbox).toHaveAttribute('type','email');
    });

    test('Checking if Recovery button loads',()=>{
        render(<Recovery />);
        
        const reset = screen.getByRole('button',{name:"Send Reset Link",exact:false});
        expect(reset).toBeInTheDocument();
        expect(reset).toHaveAttribute('type','submit');
        expect(reset).toHaveAttribute('class','accountSubmit submit-button')

    });
});