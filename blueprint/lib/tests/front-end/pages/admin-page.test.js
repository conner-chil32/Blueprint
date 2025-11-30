import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import AdminView from '@/app/admin-page/page'

// Mock fetch to prevent API errors
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, userList: [] })
    })
);

describe('Admin Home Page', () => {
    test('Checking if navbar loads', () =>{
        render(<AdminView />);
        expect(screen.getByAltText('blueprint logo',{hidden:true,exact:false})).toBeInTheDocument();
    });

    test('Checking if server summary loads',()=>{
        render(<AdminView />);
        expect(screen.getByRole('heading',{name:'Server Status Summary:'})).toBeInTheDocument();
    });
    test('Checking if user summary loads',()=>{
        render(<AdminView />);
        expect(screen.getByRole('heading',{name:'Selected User Summary:'})).toBeInTheDocument();
    });
    test('Checking if admin actions loads',()=>{
        render(<AdminView />);
        expect(screen.getByRole('heading',{name:'Admin Actions:'})).toBeInTheDocument();
    });
    test('Checking if Modify Accounts loads',()=>{
        render(<AdminView />);
        expect(screen.getByRole('heading',{name:'Modify Accounts:'})).toBeInTheDocument();
    });
    test('Checking if Server Status loads',()=>{
        render(<AdminView />);
        expect(screen.getByRole('heading',{name:'Server Status:'})).toBeInTheDocument();
    });
/*      there isn't a real way to sort out terms in the documentation
    test('Checking if Server Summay defaults load',()=>{
        render(<AdminView />);
        expect(screen.queryAllByRole('term',{name:'name',value:{text:'00'}})).toHaveLength(3)
        //placeholder 00 [].toHaveLength(3)
//------------------------------------        
    });
    test('Checking if User Summary defaults load',()=>{
        render(<AdminView />);
        expect(screen.queryAllByRole('term',{name:'name',value:{text:'placeholder'}})).toHaveLength(8)
        //placeholdertext [].toHaveLength(8)
//------------------------------------
    });*/
    test('Checking if Admin Actions buttons load',()=>{
        render(<AdminView />);
        expect(screen.getByRole('button',{name:"Delete account"})).toBeInTheDocument();
        expect(screen.getByRole('button',{name:"Ban user"})).toBeInTheDocument();
        expect(screen.getByRole('button',{name:"Login history"})).toBeInTheDocument();
        expect(screen.getByRole('button',{name:"Add note"})).toBeInTheDocument();
        expect(screen.getByRole('button',{name:"Add Account"})).toBeInTheDocument();
    });
    test('Checking if Modify Account textbox loads',()=>{
        render(<AdminView />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toHaveProperty('placeholder', 'Search For Account');
        expect(screen.getByRole('textbox')).toHaveProperty('className', 'searchUser');
        expect(screen.getByRole('textbox')).toHaveProperty('type', 'text');
    });
    test('Checking if Modify Account button loads',()=>{
        render(<AdminView />);
        expect(screen.getByRole('button',{name:"Add Account"})).toBeInTheDocument();
    });
    test('Checking if Server Status demo image loads',()=>{
        render(<AdminView />);
        expect(screen.getByAltText("demo graph",{exact:false})).toBeInTheDocument();
        expect(screen.getByAltText("demo graph",{exact:false})).toHaveProperty('src');
    });
});