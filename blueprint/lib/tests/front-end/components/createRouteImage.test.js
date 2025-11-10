import { render, screen } from '@testing-library/react'
import Create from 'blueprint\\src\\app\\components\\CreateRouteImage.js'

describe('CreateRouteButton Component', () => {
    test('Checking if logo button loads with correct properties', () => {
        render(<Create code="logo"/>);

        const link = screen.getByRole('link',{name:'Blueprint logo'})
        expect(link).toBeInTheDocument();
        expect(link).toHaveProperty('href', window.location.href);

        const img = screen.getByRole('img',{name:'Blueprint logo'});
        expect(img).toBeInTheDocument();
        expect(img).toHaveProperty('alt','Blueprint logo');
        expect(img).toHaveProperty('className','default');
        expect(img).toHaveProperty('src',window.location.href+'images/Blueprint_trans.png');
    });
});
