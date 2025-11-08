---
layout: default
title: History
excerpt: HistoryManager keeps track of the user's changes, allowing for traversal between states.
nav_order: 1
nav_exclude: false
search_exclude: false
---
## HistoryManager
Inside of HistoryManager.jsx is how current state and past states are managed and stored. This allows the user to traverse past changes with undo and redo commands. State is recorded with the simple variable:

```const recordState = () => JSON.parse(JSON.stringify(parent.getState()));```

When called, this takes the current state of all pages and selection and stores them in a JSON format. This allows for easy and simple storage of states. The states of the user's changes are stored in two stacks:

```let undoStack = [];```  and ```let redoStack = [];```

These are not stored as state variables because we do not want to refresh them each time React refreshes.
##### ```pushHistory```
pushHistory stores the current state into undoStack and resets redoStack, with protections to prevent unnecessary storage and undo and redo commands from being stored.

First it checks if the previous page exists and we are not currently applying a state to the canvas page, and if so return. Then check to see if this state is equal to the previous one as a protection to prevent unnecessary storage.

If these checks pass, it sets redoStack's length to zero, emptying it. Then it places the current recorded state onto the stack.

##### ```applyState```
This calls a function in the canvas page to reapply stored variables. It also enables a flag to prevent the page from storing the change into the stacks recursively, then disables it when finished.

##### ```undo```
Undo, if undoStack is not empty, will place the current state onto the redoStack and pop undoStack, using applyState to reset the canvas page to the old state.

##### ```redo```
Redo, if redoStack is not empty, will place the current state into undoStack and pop redoStack, using applyState to reset the canvas page to the new state.

#### Return and Canvas Functions
At the end of the history manager is a return function that allows for external programs to use pushHistory, undo, and redo. This encapsulates the functionality of the history manager and allows the canvas to traverse states.

The canvas itself, within page.js, creates two references, history which is used as a reference to the history manager, and varState, which is used as a reference to all necessary variables in the canvas.

Two hooks are used here. When react refreshes, the first hook ensures that all variables within varState are updated approprately.

The second hook is what instantiates the history reference. This is necessary as history must only be created once, or it will reset every time react refreshes. It also creates two important functions, getState and applyState.

##### ```getState```
getState takes the variables within varState and gives them to the HistoryManager.

##### ```applyState```
This applies all variables within the given state to the canvas page through the canvas' own setters. This is what allows HistoryManager to apply its state.

##### ```recordState```
recordState calls pushHistory in HistoryManager, causing it to take a snapshot and store the current canvas state into the page. recordState is used in multiple places through the canvas page in order to properly keep track of what happens.

Where recordState is used:
- canvas/page.js:
	- createPage
	- deletePage
	- updatePageName
	- createWidget
	- deleteWidget
	- changePageProperty
	- changeWidgetProperty
		- This has an extra, optional boolean control to only update state if needed.
- RightPanel.jsx
	- Rotation
		- When something is rotated, a snapshot needs to be taken before the rotation starts. This prevents it from being reapplied over and over every time the rotation of a widget is changed.
- Widget.js
	- onResizeStart
		- When a widget starts being resized, record its state. This is done before resizing as doing so afterward causes the state to be taken after the resize is complete, which means it will not be stored in the previous state.
	- onDragStop
		- Only triggers if the widget has moved more than one pixel in any direction. This triggers whenever the widget is clicked, so checking prevents a state from being taken if the widget is only being selected.