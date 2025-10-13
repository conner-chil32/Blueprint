import { render, screen } from '@testing-library/react'
import Pricing from '@/app/pricing/page'

describe('Pricing Page', () => {
    it('Checking to see if Pricing Page Loads', () => {
        render(<Pricing />);
        // Assert that a specific element or text is present on the page
        expect(screen.getByRole('heading', { name: "There is a plan for everyone" })).toBeInTheDocument();
    });

    // Add more tests to check for other elements, data loading, or user interactions
});