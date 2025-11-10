import { render, screen } from '@testing-library/react'
import Page from '@/components/adminActions'

describe('adminActions Component', () => {
    test('Checking to see if Button Loads', () => {
        render(<Page />);
        
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveProperty('className','adminButton');
    });

    test('Checking if Button loads arbitrary label',()=>{
        render(<Page label='oompa loompas' />)

        expect(screen.getByText('oompa loompas')).toBeInTheDocument();
    });
});