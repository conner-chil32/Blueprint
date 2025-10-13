import { render, screen } from '@testing-library/react'
import Login from '@/app/login/page'

describe('Login Page', () => {
    it('Checking to see if Login Page Loads', () => {
    render(<Login />);
    // Assert that a specific element or text is present on the page
    expect(screen.getByText("CREATE ACCOUNT")).toBeInTheDocument();
    });

    // Add more tests to check for other elements, data loading, or user interactions
});