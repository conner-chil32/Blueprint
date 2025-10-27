import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import RawHTMLPage from '@/app/admin-detailed/page'

describe('Admin user details page',()=>{

    test('Checking if navbar loads', () =>{
        render(<RawHTMLPage />);
        expect(screen.getByAltText('blueprint logo',{hidden:true,exact:false})).toBeInTheDocument();
    });

    test('Checking if Back button loads',()=>{
        render(<RawHTMLPage />);
        expect(screen.getByRole('button',{name:'Back'})).toBeInTheDocument();
    });

    test('Checking if page header loads',()=>{
        render(<RawHTMLPage />);
        expect(screen.getByTestId("user's username")).toBeInTheDocument();
    });

    test('Checking if Login History box loads entire array',()=>{
        render(<RawHTMLPage />);

        const size = screen.getAllByText('Day / Month / Year',{exact:false}).length;
        for(var i = 0; i < size; i++){
            expect(screen.getAllByText('Day / Month / Year',{exact:false})[i]).toBeInTheDocument();
        }
        
    });

    test('Checking if planTypes boxes load',()=>{
        render(<RawHTMLPage />);
        const headers = ["Login History","Projects","Client Info","Notes"];
        for(var i=0; i < headers.length; i++){
            expect(screen.getByText(headers[i],{exact:false})).toBeInTheDocument();
        }
    });

    test('Checking if project button loads',()=>{ //would need refactoring with a less hardcoded site
        render(<RawHTMLPage />);
        expect(screen.getByTestId('project button')).toBeInTheDocument();
    });
});
