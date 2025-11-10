import { render, screen } from '@testing-library/react'
import Create from 'blueprint\\src\\app\\components\\CreateRouteButton.js'

describe('CreateRouteButton Component', () => {
    test('Checking whether a bad code and type causes a crash',()=>{
        render(<Create code="codeTest" type="classTest" />)

        const button = screen.getByRole('link',{name:'Bad_Code_Default'})
        // Assert that a specific element or text is present on the page
        expect(button).toBeInTheDocument();

        // Assert button has expected features
        expect(button).toHaveProperty('className', 'classTest');
        expect(button).toHaveProperty('href', window.location.href);
    });

    test('Checking to see if specifically called button loads', () => {
        render(<Create code="features"/>);

        const features = screen.getByRole('link',{name:'features'})
        expect(features).toBeInTheDocument();

        expect(features).toHaveProperty('className','nav-button');
        expect(features).toHaveProperty('href', window.location.href+'features');
    });
});
