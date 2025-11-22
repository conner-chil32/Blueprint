import { render, screen } from '@testing-library/react'
import Payment from '@/app/payment/page'

describe('Payment Page',()=>{
    test('Checking to see if Navbar loads',()=>{
        render(<Payment />);
        expect(screen.getByAltText("Blueprint Logo",{exact:false})).toBeInTheDocument();
    });

    test('Checking if text loads',()=>{
        render(<Payment />);
        expect(screen.getByText('choose a plan')).toBeInTheDocument();
    });

    test('Checking if button loads',()=>{
        render(<Payment />);
        expect(screen.getByRole('button',{name:'pay now'})).toBeInTheDocument();
    });

    test('Checking all options load',()=>{
        render(<Payment />);

        expect(screen.getByRole('option',{name:'free'})).toBeInTheDocument();
        expect(screen.getByRole('option',{name:'personal'})).toBeInTheDocument();
        expect(screen.getByRole('option',{name:'business'})).toBeInTheDocument();
        expect(screen.getByRole('option',{name:'enterprise'})).toBeInTheDocument();
    });

    test('Checking option box loads',()=>{
        render(<Payment />)
        expect(screen.getByRole('combobox',{name:'choose a plan'})).toBeInTheDocument();
    });
});