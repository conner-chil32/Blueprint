import { render, screen } from '@testing-library/react'
import Navbar from '@/components/navbar'

describe('Navbar Page', () => {
    it('Checking to see if Navbar Loads', () => {
        render(<Navbar />);
        // Assert that a specific element or text is present on the page
        expect(screen.getByText('Features')).toBeInTheDocument();
    });

    // Add more tests to check for other elements, data loading, or user interactions
});