import { render, waitFor, screen } from '@testing-library/react'
import Page from '@/app/WordpressTest/page'

describe('Testing wordpressTest component',()=>{
    test('Checking if wordpress component renders', async ()=>{
        // Mock fetch since Jest runs in Node.js and can't access Docker localhost
        const mockFetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => [{
                title: { rendered: 'Sample Page' },
                content: { rendered: '<p>Sample WordPress Content</p>' }
            }]
        });
        global.fetch = mockFetch;

        render(<Page />);
        
        // Wait for WordPress content to load
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/wp-json/wp/v2/pages');
        }, { timeout: 2000 });
        
        // Verify content renders
        const heading = await screen.findByRole('heading', { name: 'Sample Page' }, { timeout: 3000 });
        expect(heading).toBeInTheDocument();
        
        // Verify HTML content is rendered
        expect(screen.getByText('Sample WordPress Content')).toBeInTheDocument();
    });
});
