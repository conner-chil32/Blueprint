import { render, screen } from '@testing-library/react'
import Backend from '@/app/userwebbackend/page'

describe('userwebbackend page test', () => {
    test('Checking to see if buttons load', () => {
        render(<Backend />);
        
        const back = screen.getByRole('link',{name:'Back'});
        expect(back).toBeInTheDocument();
        expect(back).toHaveProperty('href', window.location.href);

        const backb = screen.getByRole('button',{name:'Back'});
        expect(backb).toBeInTheDocument();
        expect(backb).toHaveProperty('className','backButton')

        const del = screen.getByRole('button',{name:'Delete'});
        expect(del).toBeInTheDocument();
        expect(del).toHaveProperty('className','deleteButton');

        const twit = screen.getByRole('button',{name:'Twitter'});
        expect(twit).toBeInTheDocument();
        expect(twit).toHaveProperty('className','connectionButton')
        
        const fb = screen.getByRole('button',{name:'Facebook'});
        expect(fb).toBeInTheDocument();
        expect(fb).toHaveProperty('className','connectionButton')
    });

    test('Checking if images loaded',()=>{
        render(<Backend />);

        const name = ['Disk time chart', 'Ping chart','Disk used chart','Memory usage chart'];
        for(var i = 0; i < name.length; i++){
            expect(screen.getByRole('img',{name:name[i]})).toBeInTheDocument();
            expect(screen.getByRole('img',{name:name[i]})).toHaveProperty('alt',name[i]);
            expect(screen.getByRole('img',{name:name[i]})).toHaveProperty('src',window.location.href+'stats'+ (i+1) +'.png');
        }

        expect(screen.getByRole('complementary')).toBeInTheDocument();
        expect(screen.getByRole('complementary')).toHaveProperty('className', 'sidebar');
    });

    test('Checking if text loads',()=>{
        render(<Backend />);

        const name = ["Features:","Connections:","Website Stats:"];
        for(var i = 0; i < name.length; i++){
            expect(screen.getByText(name[i])).toBeInTheDocument();
            expect(screen.getByText(name[i])).toHaveProperty('className','boxTitle');
        }
    });

    test('Checking if textboxes load',()=>{
        render(<Backend />);

        const boxes = screen.queryAllByRole('checkbox')

        expect(boxes.length).toBe(3);
        
        expect(boxes[0]).not.toBeChecked();
        expect(boxes[1]).toBeChecked();
        expect(boxes[2]).not.toBeChecked();

        for(var i in boxes){ expect(boxes[i]).toHaveProperty('type','checkbox'); }
    });

    test('Checking if main panel loads',()=>{
        render(<Backend />);

        expect(screen.getByRole('main')).toBeInTheDocument();
        expect(screen.getByRole('main')).toHaveProperty('className','main');
    });

});