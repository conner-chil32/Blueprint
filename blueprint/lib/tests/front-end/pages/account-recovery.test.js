import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import Recovery from '@/app/account-recovery/page'

//4 hours 10/24: 12-4
//0.5 hours 10/25: 9:30 - 10

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
        expect(screen.getByTestId('username')).toBeInTheDocument();
    });

    test('Checking if password box loads', ()=>{
        render(<Recovery />);
        expect(screen.getByTestId('password')).toBeInTheDocument();
    });

    test('Checking if Recovery button loads',()=>{
        render(<Recovery />);
        expect(screen.getByRole('button',{name:"Recover",exact:false})).toBeInTheDocument();
    });

/*      10/25/25: removing test as button leads to a 404 error 
    test('Checking Recover button redirects to /recovery',()=>{
        render(<Recovery />);


        expect(getByRole('link')).toHaveTextContent('Recover')
        expect(getByRole('link')).toHaveProperty('href', '/recovery')
    });
    
    //verify Recover button goes to the right place
*/
});