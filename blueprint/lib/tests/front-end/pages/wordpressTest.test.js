import { render, waitFor, screen } from '@testing-library/react'
import Page from '@/app/wordpressTest/page'

describe('Testing wordpressTest component',()=>{
    test('Checking if wordpress is fetched', async ()=>{
        const mockFetch = jest.fn(() => 
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([{
                    title: { rendered: 'Test Title' },
                    content: { rendered: '<p>Test Content</p>' }
                }])
            })
        );
        global.fetch = mockFetch;
        
        render(<Page />);

        await waitFor(()=>{ 
            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(mockFetch).toHaveBeenCalledWith("http://localhost:8000/wp-json/wp/v2/pages");
        });
        
        // Verify content renders
        await waitFor(() => {
            expect(screen.getByText('Test Title')).toBeInTheDocument();
        });
    });
});
