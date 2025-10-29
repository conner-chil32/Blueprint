---
layout: default
title: Canvas Load System
nav_order: 3
nav_exclude: false
search_exclude: false
---

# Canvas Load System

This document describes the automatic loading functionality implemented in the Canvas page, which restores user work from temporary JSON files when the page is accessed.

## Overview

The Canvas page features an automatic load system that restores the user's previous work session from temp.json when they navigate to the Canvas page. This ensures continuity between sessions and prevents data loss.

## Core Functionality

### loadTempJSON Function

The `loadTempJSON` function is the primary mechanism for loading canvas data from the server on page mount.

**Function Signature:**
```javascript
const loadTempJSON = async () => {
  // Implementation
}
```

**Parameters:**
- None (retrieves userId from UserCookie internally)

**Return Value:**
- Returns a Promise that resolves when the load operation completes or fails gracefully

### Trigger Point

The load function is called automatically once when the Canvas page component mounts:

```javascript
useEffect(() => {
  loadTempJSON();
}, []);
```

This `useEffect` hook with an empty dependency array ensures the load happens only on initial page render.

## Data Restoration

### What Gets Restored

When temp.json is successfully loaded, the following state variables are restored:

1. **pages** (required): Array of all page objects with their widgets
2. **selectedPageID** (optional): The ID of the currently selected page
3. **nextPageID** (optional): Counter for generating new page IDs
4. **nextWidgetId** (optional): Counter for generating new widget IDs

### Data Validation

The function validates that:
- `data.pages` exists
- `data.pages` is an array
- `data.pages` contains at least one page

If validation fails, the default state is used without error.

## Implementation Flow

### 1. Page Mount
```
User navigates to Canvas page
         ↓
Component renders
         ↓
useEffect triggers
         ↓
loadTempJSON() called
```

### 2. Load Process
```javascript
const loadTempJSON = async () => {
  try {
    // Get user ID from cookie
    const userId = getCookieValue('UserCookie') || 'user';
    
    // Fetch temp.json from server
    const response = await fetch(`/api/load-canvas?userId=${userId}&filename=temp`);
    
    // Handle 404 or error responses
    if (!response.ok) {
      console.log('No temp.json found or error loading, using default state');
      return;
    }
    
    // Parse response
    const data = await response.json();
    
    // Validate and restore data
    if (data.pages && Array.isArray(data.pages) && data.pages.length > 0) {
      console.log('Loaded temp.json successfully');
      setPages(data.pages);
      
      // Restore optional state
      if (data.selectedPageID !== undefined) setSelectedPageID(data.selectedPageID);
      if (data.nextPageID !== undefined) setNextPageID(data.nextPageID);
      if (data.nextWidgetId !== undefined) setNextWidgetId(data.nextWidgetId);
      
      setIsSaved(true);
    }
  } catch (error) {
    console.error('Error loading temp.json:', error);
    // Silently fail - use default state
  }
};
```

### 3. State Update
```
Data loaded successfully
         ↓
State variables updated
         ↓
Component re-renders with restored data
         ↓
User sees their previous work
```

## API Integration

### Endpoint

**GET** `/api/load-canvas`

### Request Parameters

Query string parameters:
- `userId` (string, required): User identifier for directory lookup
- `filename` (string, required): Name of file to load (typically "temp")

**Example Request:**
```
GET /api/load-canvas?userId=test-user-123&filename=temp
```

### Response Format

**Success Response (200):**
```json
{
  "success": true,
  "pages": [
    {
      "id": 0,
      "name": "Page 0",
      "width": 800,
      "height": 600,
      "backgroundColor": "#ffffff",
      "widgets": []
    }
  ],
  "path": "users/test-user-123/temp.json"
}
```

**File Not Found (404):**
```json
{
  "error": "File not found",
  "message": "No saved canvas found for user test-user-123"
}
```

**Invalid JSON (500):**
```json
{
  "error": "Invalid JSON file",
  "details": "Unexpected token..."
}
```

**Other Errors (500):**
```json
{
  "error": "Failed to load canvas",
  "details": "Error message"
}
```

## Error Handling

### Silent Failures

The load system is designed to fail gracefully without interrupting the user experience:

#### Scenario 1: File Does Not Exist
```javascript
if (!response.ok) {
  console.log('No temp.json found or error loading, using default state');
  return; // Use default state
}
```
- **User Experience**: Sees a fresh canvas with default page
- **Console Log**: "No temp.json found or error loading, using default state"
- **No Alert Shown**: User is not interrupted

#### Scenario 2: Network Error
```javascript
catch (error) {
  console.error('Error loading temp.json:', error);
  // Silently fail - use default state
}
```
- **User Experience**: Sees a fresh canvas with default page
- **Console Log**: Error details logged
- **No Alert Shown**: User is not interrupted

#### Scenario 3: Invalid Data
```javascript
if (data.pages && Array.isArray(data.pages) && data.pages.length > 0) {
  // Restore data
} // else: silently ignore and keep default state
```
- **User Experience**: Sees a fresh canvas with default page
- **Console Log**: No specific message
- **No Alert Shown**: User is not interrupted

### Why Silent Failures?

1. **Better UX**: No disruptive error dialogs on page load
2. **Graceful Degradation**: Always provides a working canvas
3. **Non-blocking**: First-time users don't see errors
4. **Developer Friendly**: All errors logged to console for debugging

## UserCookie Integration

The load system uses the same cookie mechanism as the save system:

```javascript
const getCookieValue = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const userId = getCookieValue('UserCookie') || 'user';
```

**Priority:**
1. UserCookie value (if set)
2. Fallback to `'user'` default

## File System Structure

### Load Path
```
project-root/
  users/
    {userId}/
      temp.json  ← Loaded from here
```

### Example
For user "test-user-123":
```
project-root/
  users/
    test-user-123/
      temp.json  ← GET /api/load-canvas?userId=test-user-123&filename=temp
```

## State Management

### Initial State vs Loaded State

**Initial State (Default):**
```javascript
const [pages, setPages] = useState([
  { 
    id: 0, 
    name: "Page 0", 
    width: 800, 
    height: 600, 
    backgroundColor: '#ffffff', 
    widgets: [] 
  }
]);
const [selectedPageID, setSelectedPageID] = useState(0);
const [nextPageID, setNextPageID] = useState(1);
const [nextWidgetId, setNextWidgetId] = useState(0);
```

**After Successful Load:**
```javascript
// All state replaced with loaded values
setPages(data.pages);
setSelectedPageID(data.selectedPageID || 0);
setNextPageID(data.nextPageID || 1);
setNextWidgetId(data.nextWidgetId || 0);
setIsSaved(true);
```

## Testing

Unit tests are located at:
```
lib/tests/front-end/pages/canvas-temp-save.test.js
```

### Load-Specific Tests

1. **should attempt to load temp.json when page mounts**
   - Verifies fetch is called with correct endpoint
   - Checks that filename=temp parameter is included

2. **should load pages from temp.json if it exists**
   - Mocks successful load with data
   - Verifies pages are rendered with loaded names

3. **should use default state if temp.json does not exist**
   - Mocks 404 response
   - Verifies default page ("Page 0") is displayed

4. **should use UserCookie when loading temp.json**
   - Sets UserCookie
   - Verifies userId from cookie is used in fetch URL

5. **should handle load errors gracefully without alerting user**
   - Mocks network error
   - Verifies error is logged but no alert shown

## Interaction with Auto-Save

The load and auto-save systems work together seamlessly:

### Workflow
```
1. User opens Canvas
        ↓
2. loadTempJSON() restores previous session
        ↓
3. User makes changes
        ↓
4. Auto-save updates temp.json
        ↓
5. User closes browser
        ↓
6. User reopens Canvas later
        ↓
7. loadTempJSON() restores latest changes
```

### Save State Tracking

After successful load, `isSaved` is set to `true`:
```javascript
setIsSaved(true);
```

This indicates that the current state matches the saved state. As soon as the user makes changes, `recordState()` sets it to `false`.

## Performance Considerations

### Load Time

The load operation is asynchronous and non-blocking:
- Page renders immediately with default state
- Load happens in background
- State updates when load completes
- Re-render occurs with loaded data

### Optimization Tips

1. **Keep temp.json size reasonable**
   - Large files increase load time
   - Consider pagination for projects with many pages

2. **Network conditions**
   - Load may be slower on poor connections
   - Silent failure ensures page remains usable

3. **File system performance**
   - SSD vs HDD affects read speed
   - Cached reads are faster

## Security Considerations

### Input Sanitization

The API route sanitizes all inputs to prevent security issues:

```javascript
const sanitizedFilename = filename.replace(/[^a-zA-Z0-9_-]/g, '_');
const sanitizedUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '_');
```

This prevents:
- Directory traversal attacks
- Path injection
- Special character exploits

### File Access Control

- Users can only access files in their own directory
- Filename is restricted to "temp" (hardcoded in frontend)
- No arbitrary file access is permitted

## Future Enhancements

### Planned Features

1. **Load from database**
   - Integrate with database storage
   - Fallback to temp.json if database unavailable

2. **Version conflict detection**
   - Detect if temp.json is newer than database
   - Prompt user to choose which version to use

3. **Partial loading**
   - Load pages on-demand for large projects
   - Initial load only loads first page

4. **Offline support**
   - Cache temp.json in browser storage
   - Load from cache when offline

5. **Load progress indicator**
   - Show loading state while fetching
   - Display progress for large files

## Troubleshooting

### Common Issues

**Issue: Canvas loads but shows default page instead of saved work**
- **Cause**: temp.json doesn't exist or couldn't be read
- **Solution**: Check console for errors, verify temp.json exists in `users/{userId}/`

**Issue: Load fails with 404 error**
- **Cause**: User has no saved work yet
- **Solution**: This is expected for new users - no action needed

**Issue: Load fails with JSON parse error**
- **Cause**: temp.json is corrupted
- **Solution**: Delete corrupted temp.json, canvas will use default state

**Issue: Wrong user's data is loaded**
- **Cause**: UserCookie is incorrect
- **Solution**: Clear cookies and log in again

## References

- **Source File**: `src/app/canvas/page.js` (lines 69-116)
- **API Route**: `src/app/api/load-canvas/route.js`
- **Auto-Save System**: `canvas-auto-save.md`
- **Tests**: `lib/tests/front-end/pages/canvas-temp-save.test.js`
