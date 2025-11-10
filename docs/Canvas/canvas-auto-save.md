---
layout: default
title: Canvas Auto-Save System
nav_order: 2
nav_exclude: false
search_exclude: false
---

# Canvas Auto-Save System

This document describes the auto-save functionality implemented in the Canvas page, which automatically persists user work to temporary JSON files.

## Overview

The Canvas page features an automatic save system that captures all page states and user changes in real-time. This ensures that work is continuously backed up without requiring manual intervention from the user.

## Core Functionality

### savePagesToJSON Function

The `savePagesToJSON` function is the primary mechanism for saving canvas data to the server.

**Function Signature:**
```javascript
const savePagesToJSON = async (userId = null, filename = "canvas_pages") => {
  // Implementation
}
```

**Parameters:**
- `userId` (string, optional): User identifier for the directory structure. If not provided, the function retrieves it from the UserCookie, or falls back to 'user'.
- `filename` (string, optional): Name of the JSON file to save. Defaults to "canvas_pages". For auto-save operations, "temp" is used.

**Return Value:**
- Returns a Promise that resolves when the save operation completes.

### Data Structure

The function saves the following data structure:

```javascript
{
  pages: [...],      // Array of page objects
  userId: "...",     // User identifier
  filename: "..."    // Target filename
}
```

Each page object contains:
- `id`: Unique page identifier
- `name`: Page name
- `width`: Page width in pixels
- `height`: Page height in pixels
- `backgroundColor`: Page background color
- `widgets`: Array of widget objects

## Auto-Save Triggers

The auto-save system automatically triggers when any of the following actions occur:

### Page Operations
- **Creating a new page**: Triggers after `createPage()` completes
- **Deleting a page**: Triggers after `deletePage()` completes
- **Updating page name**: Triggers after `updatePageName()` completes
- **Changing page properties**: Triggers after `changePageProperty()` completes

### Widget Operations
- **Creating a widget**: Triggers after `createWidget()` completes
- **Deleting a widget**: Triggers after `deleteWidget()` completes
- **Changing widget properties**: Triggers after `changeWidgetProperty()` completes

### History Operations
- **Undo**: Triggers after `history.undo()` completes
- **Redo**: Triggers after `history.redo()` completes

## Implementation Details

### UserCookie Integration

The auto-save system integrates with the UserCookie to determine the correct user directory:

```javascript
const getCookieValue = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};
```

**Priority Order:**
1. Explicitly provided `userId` parameter
2. Value from `UserCookie`
3. Fallback to `'user'` default

### Timing Mechanism

Auto-save operations use `setTimeout` to ensure React state updates complete before capturing the state:

```javascript
setTimeout(() => recordState(), 0);
```

This deferred execution ensures that:
- State updates are flushed
- The history manager captures the correct state
- The auto-save receives the most recent data

### History Manager Integration

The History Manager automatically triggers saves through a reference-based callback:

```javascript
savePagesToJSON: () => {
  const userId = getCookieValue('UserCookie');
  savePagesToJSONRef.current?.(userId, "temp");
}
```

This ensures that every history stack change (via `pushHistory()`, `undo()`, or `redo()`) persists to the temp.json file.

## File Storage

### Directory Structure

Files are stored in the following directory structure:
```
users/
  {userId}/
    temp.json          // Auto-save file
    canvas_pages.json  // Manual save file (future use)
```

### API Endpoint

The function sends POST requests to:
```
/api/save-canvas
```

**Request Body:**
```json
{
  "pages": [...],
  "userId": "user-id",
  "filename": "temp"
}
```

**Response:**
```json
{
  "path": "users/user-id/temp.json",
  "success": true
}
```

## Error Handling

The auto-save system handles errors gracefully:

### Silent Failures
When saving to "temp" (auto-save), errors are logged but no alerts are shown to the user:

```javascript
if (filename !== "temp") {
  alert(`Failed to save pages: ${result.error}`);
}
```

This prevents interrupting the user's workflow with error dialogs during automatic operations.

### Error Logging
All errors are logged to the console for debugging:
- Successful saves: `"Saved pages to server: {path}"`
- Failed saves: `"Error saving pages: {error}"`
- Network errors: `"Error saving pages to JSON: {error}"`

## Save State Tracking

The system tracks whether changes have been saved using the `isSaved` state:

```javascript
const [isSaved, setIsSaved] = useState(true);
```

**State Changes:**
- Set to `false`: When `recordState()` is called (changes made)
- Set to `true`: When save operation completes successfully

## Manual Save vs Auto-Save

### Auto-Save (temp.json)
- Triggered automatically on every state change
- Saves to `temp.json`
- No user alerts on success/failure
- Uses UserCookie for userId

### Manual Save (Future Implementation)
- Triggered by Ctrl+S / Cmd+S
- Saves to database via PATCH request
- Shows success/error alerts
- Endpoint: `api/website?site_id=%SITEID%`

## Testing

Unit tests are located at:
```
lib/tests/front-end/pages/canvas-temp-save.test.js
```

**Test Coverage:**
- Auto-save on page creation
- Auto-save on page deletion
- Auto-save on undo/redo operations
- UserCookie integration
- Error handling
- Data integrity

## Performance Considerations

### Debouncing
Currently, each state change triggers an immediate save. For high-frequency operations, consider implementing debouncing to reduce server load.

### Network Optimization
The system uses `fetch` with JSON serialization. For large canvas projects, consider:
- Implementing delta/patch updates
- Compressing data before sending
- Batching multiple changes

## Future Enhancements

### Planned Features
1. Manual save to database (Ctrl+S)
2. Load from temp.json on page load
3. Conflict resolution for concurrent edits
4. Save history/versioning
5. Offline support with service workers

## References

- **Source File**: `src/app/canvas/page.js`
- **History Manager**: `src/app/canvas/HistoryManager.jsx`
- **API Route**: `src/app/api/save-canvas/route.js`
- **Tests**: `lib/tests/front-end/pages/canvas-temp-save.test.js`
