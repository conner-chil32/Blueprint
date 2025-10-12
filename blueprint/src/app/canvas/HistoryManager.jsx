"use client";

/** Christopher Parsons 10/8/2025
 * Inputs:
 *  parent: reference
 * 
 * Store the user's history through JSON. Allows
 * traversal through past actions, for use in
 * undo/redo commands on the page.
 */
export default function History(parent) {
    let undoStack = [];
    let redoStack = [];
    let isApplyingHistory = false;

    /** Christopher Parsons 10/9/2025
     * Create a snapshot by storing all state variables in a JSON.
     */
    const recordState = () => JSON.parse(JSON.stringify(parent.getState()));

    /** Christopher Parsons 10/9/2025
     * Push history onto the stack. Creates a new branch, so empty redoStack.
     * RedoHistory will be added to when the user presses undo.
     */
    function pushHistory() {
        const current = JSON.stringify(recordState());
        const previous = JSON.stringify(undoStack[undoStack.length - 1]);
        
        // Don't record history when undoing/redoing.
        if (isApplyingHistory) return;

        // If this state is equivelent to the last one, return.
        if (previous && previous === current) {
            console.log("Current state is equal to the previous.");
            return;
        } else {
            // Otherwise, reset redoStack and add this state to undoStack.
            redoStack.length = 0;
            undoStack.push(recordState());
        }
    }

    /** Christopher Parsons 10/9/2025
     * Replace the current page with a snapshot, as well as all necessary state
     * variables and selection. Applies without recording it.
     */
    function applyState(state) {
        isApplyingHistory = true;
        parent.applyState(state);
        isApplyingHistory = false;
    }

    /** Christopher Parsons 10/9/2025
     * If undoStack is not empty, pop the current state, apply it to redoPage,
     * and apply the previous one to the canvas page.
     */
    function undo() {
        if (undoStack.length === 0) return;

        redoStack.push(recordState());
        applyState(undoStack.pop());
    }

    /** Christopher Parsons 10/9/2025
     * If redoStack is not empty, pop the current state, apply it to undoPage,
     * and apply the previous one to the canvas page.
     */
    function redo() {
        if (redoStack.length === 0) return;

        undoStack.push(recordState());
        applyState(redoStack.pop());
    }

    return {
        pushHistory,
        undo,
        redo,
    }
}