"use client";

export default function History(parent) {
    // History storage, not using state because we don't want
    // react to update with these changes
    const undoStack= useState([]);
    const redoStack = useState([]);
    const isApplyingHistory= useState(false);

    /**
     * Create a snapshot by storing all state variables in a JSON.
     */
    const recordState = () => ({
        pages: JSON.parse(JSON.stringify(parent.pages)),
        selectedPages: parent.selectedPages,
        widgetToPlace: parent.widgetToPlace,
    });

    /**
     * Push history onto the stack. Creates a new branch, so empty redoStack.
     * RedoHistory will be added to when the user presses undo.
     */
    function pushHistory() {
        // Don't record history when undoing/redoing
        if (isApplyingHistory) return;
        redoStack = [];
        undoStack = [...undoStack, recordState];
    }

    /**
     * Replace the current page with a snapshot, as well as all necessary state
     * variables and selection.
     */
    function applyState() {
        
    }

    /**
     * If undoStack is not empty, pop the current state, apply it to redoPage,
     * and apply the previous one to the canvas page.
     */
    function undo() {

    }

    /**
     * If redoStack is not empty, pop the current state, apply it to undoPage,
     * and apply the previous one to the canvas page.
     */
    function redo() {

    }
}