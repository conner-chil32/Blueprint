import { render, screen } from '@testing-library/react'
import Pricing from '@/app/pricing/page'
import {planTypes} from '@/app/pricing/planTypes'

describe('Pricing Page', () => {
    test('Checking to see if Pricing Page Loads', () => {
        render(<Pricing />);
        // Assert that a specific element or text is present on the page
        expect(screen.getByRole('heading', { name: "There is a plan for everyone" })).toBeInTheDocument();
    });

    test('Checking if navbar loads',()=>{
        render(<Pricing />);
        expect(screen.getByAltText('blueprint logo',{exact:false})).toBeInTheDocument();
    });

    test('Checking if headings load',()=>{
        render(<Pricing />);

        expect(screen.getByRole('heading',{name:'There is a plan for everyone'})).toBeInTheDocument();

        for(const i in planTypes){
            expect(screen.getByRole('heading',{name:planTypes[i].name+' plan:'})).toBeInTheDocument();
        }
    });

    test('Checking if prices load',()=>{
        render(<Pricing />);

        const p = screen.getAllByRole('paragraph');
        const li = screen.getAllByRole('listitem');
        const s = screen.getAllByRole('strong');

        const strong = [];
        for(const i in planTypes){ strong.push(planTypes[i].price); }

        expect(p.length).toBe(strong.length);
        expect(li.length).toBe(p.length*4); //there are 4 commented out perks in each planType
        expect(s.length).toBe(strong.length)


        for(const i in strong){
            expect(screen.getByText(strong[i])).toBeInTheDocument();
        }
    });

    test('Checking if emojis load',()=>{
        render(<Pricing />);

        for(const i in planTypes){
            expect(screen.getByText(planTypes[i].icon)).toBeInTheDocument();
        }    })

    test('Checking if payment button loads',()=>{
        render(<Pricing />);

        const link = screen.getByRole('link',{name:'payment'})
        expect(link).toBeInTheDocument();
        expect(link).toHaveProperty('className','nav-button');
        expect(link).toHaveProperty('href',window.location.href+'payment');
    });
});