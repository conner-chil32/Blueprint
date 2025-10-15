import { render, screen } from '@testing-library/react'
import Features from '@/app/features/page'

describe('Features Page', () => {
    it('Checking to see if Features Page Loads', () => {
        render(<Features />);
        // Assert that a specific element or text is present on the page
        expect(screen.getByRole('heading', { name: "Blueprint Features" })).toBeInTheDocument();
    });

    // Add more tests to check for other elements, data loading, or user interactions
});