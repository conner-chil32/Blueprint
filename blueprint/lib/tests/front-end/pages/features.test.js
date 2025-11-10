import { render, screen } from '@testing-library/react'
import Features from '@/app/features/page'

describe('Features Page', () => {
    test('Checking to see if Features Page Loads', () => {
        render(<Features />);
        // Assert that a specific element or text is present on the page
        expect(screen.getByRole('heading', { name: "Blueprint Features" })).toBeInTheDocument();
    });

    test('Checking if navbar loads',()=>{
        render(<Features />);
        expect(screen.getByAltText('blueprint logo',{hidden:true,exact:false})).toBeInTheDocument();
    });
    
    test('checking if subheader loads',()=>{
        render(<Features />);
        expect(screen.getByRole('heading',{name:"Webdesign for goldfish"})).toBeInTheDocument();
    });

    test('Checking if list header loads',()=>{
        render(<Features />);
        expect(screen.getByRole('heading',{name:'Features List'})).toBeInTheDocument();
    });

    test('Checking if list contents load',()=>{
        render(<Features />);
        expect(screen.getByText('📄')).toBeInTheDocument();
        expect(screen.getByText("Dozens of Templates!")).toBeInTheDocument();

        expect(screen.getByText('✏️')).toBeInTheDocument();
        expect(screen.getByText("Edit your website at any time")).toBeInTheDocument();

        expect(screen.getByText('🛠️')).toBeInTheDocument();
        expect(screen.getByText("World class customer support")).toBeInTheDocument();
        
        expect(screen.getByText('🌐')).toBeInTheDocument();
        expect(screen.getByText("Choose your own domain")).toBeInTheDocument();
        
        expect(screen.getByText('➕')).toBeInTheDocument();
        expect(screen.getByText("And many more features")).toBeInTheDocument();

    })
});