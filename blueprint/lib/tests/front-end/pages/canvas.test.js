import { render, screen } from '@testing-library/react'
import Canvas from '@/app/canvas/page'

describe('Canvas Page', () => {
    it('Checking to see if Canvas Page Loads', () => {
        render(<Canvas />);
        // Assert that a specific element or text is present on the page
        expect(screen.getByText('Text Box')).toBeInTheDocument();
    });

    // Add more tests to check for other elements, data loading, or user interactions
});