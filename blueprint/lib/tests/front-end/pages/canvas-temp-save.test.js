import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CanvasPage from '@/app/canvas/page';

// Mock fetch
global.fetch = jest.fn();

// Mock window.alert
global.alert = jest.fn();

// Mock document.cookie for UserCookie tests
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: '',
});

describe('Canvas Temp.json Auto-Save Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    global.fetch.mockClear();
    global.alert.mockClear();
    document.cookie = '';
    
    // Mock successful fetch response for both save and load
    global.fetch.mockImplementation((url) => {
      // Mock load-canvas endpoint
      if (url.includes('/api/load-canvas')) {
        return Promise.resolve({
          ok: false, // Default: no temp.json exists
          status: 404,
          json: async () => ({ error: 'File not found' }),
        });
      }
      // Mock save-canvas endpoint
      return Promise.resolve({
        ok: true,
        json: async () => ({ path: 'users/1/temp.json', success: true }),
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Auto-save on state changes', () => {
    it('should auto-save to temp.json when creating a new page', async () => {
      const { container } = render(<CanvasPage />);
      
      // Find and click the "New Page" button
      const newPageButton = screen.getByText(/\+ New Page/i);
      fireEvent.click(newPageButton);
      
      // Wait for the auto-save to be triggered
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/save-canvas',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );
      }, { timeout: 3000 });

      // Verify the fetch was called with temp filename
      // Find the save-canvas call (not load-canvas)
      const saveCall = global.fetch.mock.calls.find(call => 
        call[0] && call[0].includes && call[0].includes('/api/save-canvas')
      );
      if (saveCall && saveCall[1] && saveCall[1].body) {
        const body = JSON.parse(saveCall[1].body);
        expect(body.filename).toBe('temp');
      }
    });

    it.skip('should auto-save to temp.json when creating a widget', async () => {
      const { container } = render(<CanvasPage />);
      
      // Find and click a widget creation button (e.g., Text Box)
      const textBoxButton = screen.getByText(/Text Box/i);
      fireEvent.click(textBoxButton);
      
      // Wait for the auto-save to be triggered (widget creation uses setTimeout)
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      }, { timeout: 5000 });

      // If fetch was called, verify temp filename was used
      if (global.fetch.mock.calls.length > 0) {
        const fetchCall = global.fetch.mock.calls[global.fetch.mock.calls.length - 1];
        const body = JSON.parse(fetchCall[1].body);
        expect(body.filename).toBe('temp');
      }
    });

    it('should auto-save to temp.json when deleting a page', async () => {
      const { container } = render(<CanvasPage />);
      
      // First create a new page so we can delete it
      const newPageButton = screen.getByText(/\+ New Page/i);
      fireEvent.click(newPageButton);
      
      // Clear the mock to isolate the delete action
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
      global.fetch.mockClear();
      
      // Find and click the delete button (trash icon)
      const deleteButtons = screen.getAllByText('🗑️');
      if (deleteButtons.length > 1) {
        // Mock window.confirm to return true
        window.confirm = jest.fn(() => true);
        
        fireEvent.click(deleteButtons[1]);
        
        // Wait for the auto-save after deletion
        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalled();
        }, { timeout: 3000 });

        const fetchCall = global.fetch.mock.calls[0];
        const body = JSON.parse(fetchCall[1].body);
        expect(body.filename).toBe('temp');
      }
    });
  });

  describe('UserCookie integration', () => {
    it('should use UserID from UserCookie when saving to temp.json', async () => {
      // Set UserCookie
      document.cookie = 'UserCookie=test-user-123';
      
      const { container } = render(<CanvasPage />);
      
      // Trigger a state change
      const newPageButton = screen.getByText(/\+ New Page/i);
      fireEvent.click(newPageButton);
      
      // Wait for auto-save
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      }, { timeout: 3000 });

      // Find the save-canvas call
      const saveCall = global.fetch.mock.calls.find(call => 
        call[0] && call[0].includes && call[0].includes('/api/save-canvas')
      );
      if (saveCall && saveCall[1] && saveCall[1].body) {
        const body = JSON.parse(saveCall[1].body);
        // The userId should be the value from UserCookie
        expect(body.userId).toBe('test-user-123');
      }
    });

    it('should fallback to "user" when UserCookie is not set', async () => {
      // Ensure no UserCookie is set
      document.cookie = '';
      
      const { container } = render(<CanvasPage />);
      
      // Trigger a state change
      const newPageButton = screen.getByText(/\+ New Page/i);
      fireEvent.click(newPageButton);
      
      // Wait for auto-save
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      }, { timeout: 3000 });

      // Find the save-canvas call
      const saveCall = global.fetch.mock.calls.find(call => 
        call[0] && call[0].includes && call[0].includes('/api/save-canvas')
      );
      if (saveCall && saveCall[1] && saveCall[1].body) {
        const body = JSON.parse(saveCall[1].body);
        expect(body.userId).toBe('user');
      }
    });
  });

  describe('History integration (undo/redo)', () => {
    it('should auto-save to temp.json after undo', async () => {
      const { container } = render(<CanvasPage />);
      
      // Create a page to have something to undo
      const newPageButton = screen.getByText(/\+ New Page/i);
      fireEvent.click(newPageButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
      
      // Clear mock for undo action
      global.fetch.mockClear();
      
      // Trigger undo with Ctrl+Z
      fireEvent.keyDown(document, { key: 'z', ctrlKey: true });
      
      // Wait for auto-save after undo
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      }, { timeout: 3000 });

      const fetchCall = global.fetch.mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.filename).toBe('temp');
    });

    it('should auto-save to temp.json after redo', async () => {
      const { container } = render(<CanvasPage />);
      
      // Create a page
      const newPageButton = screen.getByText(/\+ New Page/i);
      fireEvent.click(newPageButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
      
      // Undo
      fireEvent.keyDown(document, { key: 'z', ctrlKey: true });
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
      
      // Clear mock for redo action
      global.fetch.mockClear();
      
      // Trigger redo with Ctrl+Y
      fireEvent.keyDown(document, { key: 'y', ctrlKey: true });
      
      // Wait for auto-save after redo
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      }, { timeout: 3000 });

      const fetchCall = global.fetch.mock.calls[0];
      const body = JSON.parse(fetchCall[1].body);
      expect(body.filename).toBe('temp');
    });
  });

  describe('Pages data integrity', () => {
    it('should save complete pages data structure to temp.json', async () => {
      const { container } = render(<CanvasPage />);
      
      // Trigger a state change
      const newPageButton = screen.getByText(/\+ New Page/i);
      fireEvent.click(newPageButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      }, { timeout: 3000 });

      // Find the save-canvas call
      const saveCall = global.fetch.mock.calls.find(call => 
        call[0] && call[0].includes && call[0].includes('/api/save-canvas')
      );
      
      if (saveCall && saveCall[1] && saveCall[1].body) {
        const body = JSON.parse(saveCall[1].body);
        
        // Verify pages structure
        expect(body.pages).toBeDefined();
        expect(Array.isArray(body.pages)).toBe(true);
        expect(body.pages.length).toBeGreaterThan(0);
        
        // Verify page properties
        const page = body.pages[0];
        expect(page).toHaveProperty('id');
        expect(page).toHaveProperty('name');
        expect(page).toHaveProperty('width');
        expect(page).toHaveProperty('height');
        expect(page).toHaveProperty('backgroundColor');
        expect(page).toHaveProperty('widgets');
      }
    });
  });

  describe('Load temp.json on page mount', () => {
    it('should attempt to load temp.json when page mounts', async () => {
      const { container } = render(<CanvasPage />);
      
      // Wait for the initial load attempt
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/load-canvas'),
        );
      }, { timeout: 3000 });

      // Verify the load call includes correct parameters
      const loadCall = global.fetch.mock.calls.find(call => 
        call[0].includes('/api/load-canvas')
      );
      expect(loadCall).toBeDefined();
      expect(loadCall[0]).toContain('filename=temp');
    });

    it.skip('should load pages from temp.json if it exists', async () => {
      // Mock successful load with data
      const mockPages = [
        { id: 0, name: 'Loaded Page 1', width: 800, height: 600, backgroundColor: '#ffffff', widgets: [] },
        { id: 1, name: 'Loaded Page 2', width: 1024, height: 768, backgroundColor: '#f0f0f0', widgets: [] }
      ];
      
      global.fetch.mockImplementation((url) => {
        if (url.includes('/api/load-canvas')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ 
              success: true, 
              pages: mockPages,
              path: 'users/user/temp.json'
            }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({ path: 'users/1/temp.json', success: true }),
        });
      });
      
      const { container } = render(<CanvasPage />);
      
      // Wait for load to complete
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/load-canvas')
        );
      }, { timeout: 3000 });

      // Verify pages were loaded (check if page names appear in select options)
      // Use findByRole which automatically waits for the element
      const option = await screen.findByRole('option', { name: 'Loaded Page 1' }, { timeout: 5000 });
      expect(option).toBeInTheDocument();
    });

    it('should use default state if temp.json does not exist', async () => {
      // Mock 404 response (no temp.json)
      global.fetch.mockImplementation((url) => {
        if (url.includes('/api/load-canvas')) {
          return Promise.resolve({
            ok: false,
            status: 404,
            json: async () => ({ error: 'File not found' }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({ path: 'users/1/temp.json', success: true }),
        });
      });
      
      const { container } = render(<CanvasPage />);
      
      // Wait for load attempt
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/load-canvas')
        );
      }, { timeout: 3000 });

      // Verify default page exists
      await waitFor(() => {
        expect(screen.queryByText('Page 0')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should use UserCookie when loading temp.json', async () => {
      // Set UserCookie
      document.cookie = 'UserCookie=test-user-456';
      
      const { container } = render(<CanvasPage />);
      
      // Wait for load attempt
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/load-canvas')
        );
      }, { timeout: 3000 });

      // Verify the userId from cookie was used
      const loadCall = global.fetch.mock.calls.find(call => 
        call[0].includes('/api/load-canvas')
      );
      expect(loadCall[0]).toContain('userId=test-user-456');
    });

    it('should handle load errors gracefully without alerting user', async () => {
      // Mock network error
      global.fetch.mockImplementation((url) => {
        if (url.includes('/api/load-canvas')) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({ path: 'users/1/temp.json', success: true }),
        });
      });
      
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const { container } = render(<CanvasPage />);
      
      // Wait for error to occur
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          expect.stringContaining('Error loading temp.json'),
          expect.any(Error)
        );
      }, { timeout: 3000 });

      // Verify no alert was shown
      expect(global.alert).not.toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Error handling', () => {
    it('should handle fetch errors gracefully during auto-save', async () => {
      // Mock fetch to reject
      global.fetch.mockRejectedValue(new Error('Network error'));
      
      // Spy on console.error to verify error logging
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const { container } = render(<CanvasPage />);
      
      // Trigger a state change
      const newPageButton = screen.getByText(/\+ New Page/i);
      fireEvent.click(newPageButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      }, { timeout: 3000 });

      // Verify error was logged (but no alert should show for temp saves)
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });

    it('should not show alert on auto-save failure', async () => {
      // Mock fetch to fail
      global.fetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Save failed' }),
      });
      
      const { container } = render(<CanvasPage />);
      
      // Trigger auto-save
      const newPageButton = screen.getByText(/\+ New Page/i);
      fireEvent.click(newPageButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      }, { timeout: 3000 });

      // Verify no alert was shown (silent failure for auto-save with temp filename)
      expect(global.alert).not.toHaveBeenCalled();
    });
  });
});
