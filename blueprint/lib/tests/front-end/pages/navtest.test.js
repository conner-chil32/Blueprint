import { render, screen } from '@testing-library/react'
import Nav from '@/app/navtest/page'
import {library} from '@/app/components/routeDictionaries'

describe('Login Page', () => {
    test('Checking to see if navbar loads',()=>{
        render(<Nav />);
        expect(screen.getByAltText("Blueprint Logo",{exact:false})).toBeInTheDocument();
    });

    test('Checking if the same buttons load in the navbar and the list',()=>{
        render(<Nav />);
        expect(screen.queryAllByRole('link',{name:"features"}).length).toBe(2);
        expect(screen.queryAllByRole('link',{name:"pricing"}).length).toBe(2);
        expect(screen.queryAllByRole('link',{name:"canvas"}).length).toBe(2);
        expect(screen.queryAllByRole('link',{name:"navtest"}).length).toBe(2);
        expect(screen.queryAllByRole('link',{name:"login"}).length).toBe(2);
    });

    test('Checking if nonduplicate buttons load',()=>{
        const known = ['features','pricing','canvas','navtest','login',undefined]
        render(<Nav />);

        for(const i in library){    //iterate through everything in the library
            if(!known.includes(library[i].label)){  //do not ask for the buttons in previous test
                expect(screen.getByRole('link',{name:(library[i].label)})).toBeInTheDocument();
            }
        }
    });
});