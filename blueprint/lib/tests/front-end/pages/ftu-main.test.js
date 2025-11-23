import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import Main from '@/app/ftu-main/page'

describe('First Time User Page', () => {
    test('Checking to see if Features Page Loads', () => {
        render(<Main />);
        // Assert that a specific element or text is present on the page
        expect(screen.getByRole('heading', { name: "Get Started On Your Website!",exact:false })).toBeInTheDocument();
    });

    test('Checking if navbar loads',()=>{
        render(<Main />);
        expect(screen.getByAltText('blueprint logo',{hidden:true,exact:false})).toBeInTheDocument();
    });
        
    test('Checking if subheading loads',()=>{
        render(<Main />);
        expect(screen.getByText("With Blueprint, you will be on your way to creating your dream website in no time.")).toBeInTheDocument();
    });

    test('Checking if new website button loads',()=>{
        render(<Main />);
        expect(screen.getByRole('button',{name:'Create New Website +'})).toBeInTheDocument();
    });

    test('Checking wordpress dashboard button loads',()=>{
        render(<Main />);
        expect(screen.getByRole('button',{name:'Open WordPress Dashboard'})).toBeInTheDocument();
    });

    test('Checking if the new website button is in a form that posts to /api/website',()=>{
        render(<Main />);
        const button = screen.getByRole('button',{name:'Create New Website +'});
        const form = button.closest('form');
        expect(form).toBeInTheDocument();
        expect(form).toHaveAttribute('action', '/api/website');
        expect(form).toHaveAttribute('method', 'POST');
    });

    test('Checking if wordpress button opens a localhost:8000 window',async ()=>{
        render(<Main />);
        global.open = jest.fn();

        fireEvent.click(screen.getByRole('button',{name:'Open WordPress Dashboard'}));

        await waitFor(()=>{ 
            expect(global.open).toHaveBeenCalledTimes(1);
            expect(global.open).toHaveBeenCalledWith("http://localhost:8000", "_blank");
        });
    });
});