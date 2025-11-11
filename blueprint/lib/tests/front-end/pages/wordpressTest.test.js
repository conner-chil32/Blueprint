import { render, waitFor } from '@testing-library/react'
import Page from '@/app/wordpressTest/page'

describe('Testing wordpressTest component',()=>{
    test('Checking if wordpress is fetched', async ()=>{
        global.fetch = jest.fn();
        render(<Page />);

        await waitFor(()=>{ 
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(global.fetch).toHaveBeenCalledWith("http://localhost:8000/wp-json/wp/v2/pages");
        });
    });
});