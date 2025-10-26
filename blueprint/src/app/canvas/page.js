"use client";

import { useEffect, useState, useRef } from "react";
import styles from './page.module.css';

import Navbar from "../components/navbar";
import { Canvas } from './Canvas';
import { LeftPanel } from './LeftPanel';
import { RightPanel } from './RightPanel';
import History from "./HistoryManager";

/** Christpher Parsons
 *  Angel Ramirez
 *  Jacob Francis
 *  (Other contributors add names here and where needed)
 * 
 * This function sets up the base layer for the canvas page. Sets up and runs
 * the RightPanel, LeftPanel, and the Canvas components.
 */
export default function CanvasPage() {
  // Pages, each containing widgets
  const [pages, setPages] = useState([{ id: 0, name: "Page 0", width: 800, height: 600, backgroundColor: '#ffffff', widgets: [] }]);
  const [selectedPageID, setSelectedPageID] = useState(0);
  const [nextPageID, setNextPageID] = useState(1);
  // .find() searches through each element of an array for a matching value
  const currentPage = pages.find(page => page.id === selectedPageID);

  // Creating widgets
  // If currentPage exists, widgets = currentPage.widgets : otherwise, empty array
  const widgets = currentPage ? currentPage.widgets : [];
  const [nextWidgetId, setNextWidgetId] = useState(0);

  // Moving and placing widgets
  const [isDragging, setIsDragging] = useState(false);

  // Selected widget container
  const [selectedWidgets, setSelectedWidgets] = useState([]);

  // Keep track of where the canvas page is
  const canvasRef = useRef(null);

  // Scaling managment
  const [scale, setScale] = useState(1);

  // History
  const history = useRef(null);
  const varState = useRef({
    pages,
    selectedWidgets,
    selectedPageID,
    nextPageID,
    nextWidgetId,
  });

  /** Christopher Parsons 10/11/2025
   * Keep varState updated with the current state's values.
   */
  useEffect(() => {
    varState.current = {
      pages,
      selectedWidgets,
      selectedPageID,
      nextPageID,
      nextWidgetId,
    }
  })

  /** Christopher Parsons 10/11/2025
   * Builds the instance of history only once. Used to
   * manage undo/redo functions by recording snapshots
   * of all necessary variables.
   * 
   * getState records the current history of the canvas page,
   * storing all variables to be re-rendered upon an undo or
   * redo function.
   * 
   * applyState applies an incoming state snapshot to the
   * canavas page.
   */
  useEffect(() => {
    history.current = History({
      // Record the current state of the canvas page
      getState: () => varState.current,

      // Apply the current state of the canvas page
      applyState: (recordedState) => {
        setPages(recordedState.pages);
        setSelectedWidgets(recordedState.selectedWidgets);
        setSelectedPageID(recordedState.selectedPageID);
        setNextPageID(recordedState.nextPageID);
        setNextWidgetId(recordedState.nextWidgetId);
      }
    })
  }, []);

  /**
   * Small function to make code easier to read.
   * Records the current state of the page and pushes
   * it to history for undo/redo.
   */
  function recordState() {
    console.log("Pushing history:", history.current);
    history.current?.pushHistory();
  }

  /** Christopher Parsons, 9/18/2025
   * Inputs:
   *  newWidgets: Widget object
   * Outputs:
   *  widgets: array
   * 
   * Replaces the widgets within the current selected page with
   * a new set of widgets. Allows for the manipulation/creation
   * of new widgets.
   */
  const setWidgets = (newWidgets) => {
    setPages(prev =>
      prev.map(page =>
        page.id === selectedPageID ? { ...page, widgets: newWidgets } : page
      )
    );
  };

  /** Christopher Parsons, 9/18/2025
   * Inputs:
   *  none
   * Outputs:
   *  pages: array
   *  selectedPageID: number
   *  nextPageID: number
   * 
   * Creates a new page. Replaces the pages variable with what
   * it was before, but with a new page added.
   */
  const createPage = () => {
    recordState();

    setPages([
      ...pages,
      {
        id: nextPageID,
        name: `Page ${nextPageID}`,
        widgets: [],
        width: 800,
        height: 600,
        backgroundColor: '#ffffff'
      }])

    setSelectedPageID(nextPageID);
    console.log('Created page', nextPageID);
    setNextPageID(nextPageID + 1);
  };

  /** 
   * Inputs:
   *  pageId: string
   * Outputs:
   *  pages: array
   * 
   * Deletes a page from the pages array by replacing the
   * pages variable with itself minus the page you want to delete.
   * Protects from accidentally deleting the last page.
   */
  const deletePage = (pageId) => {
    if (pages.length <= 1) {
      console.log('Cannot delete the last page');
      return;
    }
    recordState();

    setPages(prev => prev.filter(page => page.id !== pageId));
    if (selectedPageID === pageId) {
      setSelectedPageID(pages[0].id);
    }
  };

  // Update page name
  const updatePageName = (pageId, newName) => {
    recordState();
    setPages(prev => prev.map(page => page.id === pageId ? { ...page, name: newName } : page));
  };

  /** Christopher Parsons, 9/18/2025
   * Inputs:
   *  e: MouseEvent
   * Outputs:
   *  pageMousePos: { x: number, y: number }
   *  canvasMousePos: { x: number, y: number }
   * 
   * useEffect is essentially a hook that keeps track of actions performed on the page.
   * handleDocumentKeyDown keeps track of when something is clicked.
   */
  useEffect(() => {
    const handleDocumentKeyDown = (e) => {
      // Ignore when typing in any editable field
      const t = e.target;
      const tag = t?.tagName?.toLowerCase();
      const isTyping =
        tag === "input" ||
        tag === "textarea" ||
        t?.isContentEditable ||
        t?.getAttribute?.("role") === "textbox";

      if (isTyping) return;

      // If the user presses ctrl or command + z, undo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        console.log("Undoing");
        e.preventDefault();
        history.current?.undo();
      }

      // If the user presses ctrl or command + y, redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        console.log("Redoing");
        e.preventDefault();
        history.current?.redo();
      }

      // Do NOT delete widgets on Backspace/Delete anymore.
      // Prevent browser back navigation in some contexts.
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleDocumentKeyDown);

    return () => {
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, []);


  /** Christopher Parsons, 9/18/2025
   * Inputs:
   *  widgets: array
   *  selectedWidgets: array
   * Outputs:
   *  selectedWidgets: array
   * 
   * Ensure changes to the widgets updates the whole page. Whenever
   * a widget is changed, update React's state.
   */
  useEffect(() => {
    if (!selectedWidgets || selectedWidgets.length === 0) return;

    // Re-select updated widget objects from the widgets array
    const updatedSelection = selectedWidgets.map(sel =>
      widgets.find(w => w.id === sel.id)
    ).filter(Boolean); // Remove nulls in case of deletion

    setSelectedWidgets(updatedSelection);
  }, [widgets]);

  /** Christopher Parsons, 9/18/2025
   * 
   * Triggers when the canvas page itself is clicked. If nothing
   * is clicked on aside from the canvas, deselects all widgets.
   */
  const handleCanvasClick = () => {
    deselectAllWidgets();
  };

  /** Christopher Parsons, 9/18/2025
   * Inputs:
   *  widgetID: string | number
   *  newX: number
   *  newY: number
   *  newSize: { width: number, height: number } | null
   * Outputs:
   *  widgets: array
   * 
   * Replace the current widget with a clone,
   * but with a different attribute.
   * Cannot record state here, because doing so
   * will record every frame that a widget is 
   * being resized.
   */
  const updateWidget = (widgetID, newX, newY, newSize = null) => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === widgetID ? { ...widget, x: newX, y: newY, ...(newSize && { width: newSize.width, height: newSize.height }) } : widget
    );
    setWidgets(updatedWidgets);
  };

  /** Christopher Parsons, 9/18/2025
   * Inputs:
   *  typeToMake: string
   * Outputs:
   *  nextWidgetId: number
   * 
   * Create a new widget with default values. Determines
   * what type of widget to create depending on the
   * string fed in. Advances nextWidgetID + 1.
   */
  const createWidget = (typeToMake) => {
    recordState();
    let newWidget = null;
    const nextId = nextWidgetId;

    switch (typeToMake) {
      case 'box':
        newWidget = {
          type: 'box',
          id: nextId,
          x: currentPage.width / 2,
          y: currentPage.height / 2,
          width: 100,
          height: 100,
          isSelected: false,
          isMoving: false,
          backgroundColor: '#cccccc',
          pointerEventsNone: false,
          rotation: 0,
          opacity: 1.0,
          borderWidth: 1,
          borderColor: "#000000",
          borderStyle: "solid",
        };
        break;
      case 'circle':
          newWidget = {
          type: 'circle',
          id: nextId,
          x: currentPage.width / 2,
          y: currentPage.height / 2,
          width: 100,
          height: 100,
          isSelected: false,
          isMoving: false,
          backgroundColor: '#cccccc',
          pointerEventsNone: false,
          rotation: 0,
          opacity: 1.0,
          borderWidth: 1,
          borderColor: "#000000",
          borderStyle: "solid",
        };
        break;
      case 'triangle':
          newWidget = {
          type: 'triangle',
          id: nextId,
          x: currentPage.width / 2,
          y: currentPage.height / 2,
          width: 100,
          height: 100,
          isSelected: false,
          isMoving: false,
          backgroundColor: '#cccccc',
          pointerEventsNone: false,
          rotation: 0,
          opacity: 1.0,
          borderWidth: 1,
          borderColor: "#000000",
          borderStyle: "solid",
        };
        break;
          case 'polygon':
          newWidget = {
          type: 'polygon',
          id: nextId,
          x: currentPage.width / 2,
          y: currentPage.height / 2,
          width: 100,
          height: 100,
          isSelected: false,
          isMoving: false,
          backgroundColor: '#cccccc',
          pointerEventsNone: false,
          rotation: 0,
          opacity: 1.0,
                    borderWidth: 1,
          borderColor: "#000000",
          borderStyle: "solid",
        };
        break;
      case 'video':
        newWidget = {
          type: 'video',
          id: nextId,
          x: currentPage.width / 2,
          y: currentPage.height / 2,
          width: 320,
          height: 180,
          isSelected: false,
          isMoving: false,
          backgroundColor: '#000000',
          pointerEventsNone: false,
          rotation: 0,
          // custom props:
          videoUrl: '/images/DemoVideo.mp4',
          loop: false,
          muted: true,
          autoplay: true,
          controls: true,
          objectFit: 'contain',
        };
        break;

      case 'dropdown':
        newWidget = {
          type: 'dropdown',
          id: nextId,
          x: currentPage.width / 2,
          y: currentPage.height / 2,
          width: 220,
          height: 50,
          isSelected: false,
          isMoving: false,
          backgroundColor: '#ffffff',
          pointerEventsNone: false,
          rotation: 0,
          // custom props:
          options: ['Option 1', 'Option 2', 'Option 3'],
          value: 'Option 1',
          fontSize: 12,
          textColor: '#111111',
          bgColor: '#ffffff',
        };
        break;

      case 'advert':
        newWidget = {
          type: 'advert',
          id: nextId,
          x: currentPage.width / 2,
          y: currentPage.height / 2,
          width: 300,
          height: 250, // standard MPU size
          isSelected: false,
          isMoving: false,
          backgroundColor: '#ffffff',
          pointerEventsNone: false,
          rotation: 0,
          // custom props:
          imageUrl: '/images/Blueprint.png',
          linkUrl: 'http://localhost:3000/features',
          alt: 'Advertisement',
          objectFit: 'cover',
          showBorder: true,
          borderColor: '#333333',
          adSnippet: '',
        };
        break;

      case 'hyperlink':
        newWidget = {
          type: 'hyperlink',
          id: nextId,
          x: currentPage.width / 2,
          y: currentPage.height / 2,
          width: 150,
          height: 40,
          isSelected: false,
          isMoving: false,
          backgroundColor: 'transparent', // Links don't need a background
          pointerEventsNone: false,
          rotation: 0,
          // custom props:
          text: 'Click Here',
          url: 'http://localhost:3000/features',
          fontSize: 12,
          textColor: '#0000ee',
          openInNewTab: true,
        };
        break;

      case 'menuScroll':
        newWidget = {
          type: 'menuScroll',
          id: nextId,
          x: currentPage.width / 2,
          y: currentPage.height / 2,
          width: 200,
          height: 250,
          isSelected: false,
          isMoving: false,
          backgroundColor: '#f0f0f0',
          pointerEventsNone: false,
          rotation: 0,
          // custom props:
          items: ['Menu Item 1', 'Menu Item 2', 'Menu Item 3', 'Menu Item 4', 'Menu Item 5'],
          fontSize: 14,
          textColor: '#333333',
          itemPadding: 8,
          selectedValue: 'Menu Item 1', // Default to the first item
        };
        break;

      default:
        console.warn('Warning: Unknown widget type: ' + typeToMake);
        return;
    }

    // Set each widget's position on the canvas
    newWidget.x = currentPage.width / 2 - (newWidget.width / 2);
    newWidget.y = currentPage.height / 2 - (newWidget.height / 2);

    console.log('Created new widget: ', newWidget);

    setNextWidgetId((prevId) => prevId + 1);
    setWidgets([...widgets, newWidget]);
    setSelectedWidgets([newWidget]);
  };

  /** Christopher Parsons, 9/18/2025
   * Inputs:
   *  id: number
   * Outputs:
   *  widgets: array
   * Replaces the widgets of the current page with a clone
   * but without the designated widget.
   */
  function deleteWidget(id) {
    recordState();
    console.log('Deleting widget', id);
    setWidgets(widgets.filter(widget => widget.id !== id));
    deselectAllWidgets();
  }

  /** Christopher Parsons, 9/18/2025
   * Inputs:
   *  none
   * Outputs:
   *  selectedWidgets: null
   * 
   * Removes all widgets from selection.
   */
  function deselectAllWidgets() {
    setSelectedWidgets([]);
    console.log('Deselected all widgets');
  }

  /** Christopher Parsons, 9/18/2025
   * Inputs:
   *  pageID: number
   *  newProperties: object
   * Outputs:
   *  pages: array
   * 
   * Replaces the current page with a clone but
   * with a modified attribute.
   */
  function changePageProperty(pageID, newProperties) {
    recordState();
    const changedPages = pages.map(page =>
      // If this is the correct widget, then update the object
      page.id === pageID ? { ...page, ...newProperties }
        : page // Otherwise, leave it
    );

    setPages(changedPages);
  }

  return (
    <>
      <Navbar /> {/* <-- RENDERED NAVBAR */}

      <div className={styles.bodyContainer}>

        {/** Christopher Parsons, 9/18/2025
          * Inputs:
          *  createWidget: function
          * 
          * Renders the LeftPanel section on the left side of the screen.
          */}
        <aside className={`${styles.leftPanel} ${styles.sidePanel}`}>
          <LeftPanel createWidget={createWidget} />
        </aside>

        <main className={styles.centerColumn}>
          {/* Page navigation bar above the canvas */}
          <header className={styles.pageNavBar} style={{ top: '70px' }}>
            <PageNavigation
              pages={pages}
              selectedPageID={selectedPageID}
              setSelectedPageID={setSelectedPageID}
              createPage={createPage}
              updatePageName={updatePageName}
              deletePage={deletePage}
            />
          </header>

          {/** Christopher Parsons, 9/18/2025
           * Inputs:
           *  widgets: array
           *  recordState: function
           *  isDragging: Boolean
           *  selectedWidgets: array
           *  setSelectedWidgets: function
           *  setIsDragging: function
           *  updateWidget: function
           *  scale: number
           *  setScale: function
           *  currentPage: Page
           *  canvasRef: React reference, type unknown
           *  handleCanvasClick: function
           * 
           * Renders the central portion of the canvas page.
           */}
          <Canvas
            widgets={widgets}
            recordState={recordState}
            isDragging={isDragging}
            selectedWidgets={selectedWidgets}
            setSelectedWidgets={setSelectedWidgets}
            setIsDragging={setIsDragging}
            updateWidget={updateWidget}
            scale={scale}
            setScale={setScale}
            currentPage={currentPage}
            canvasRef={canvasRef}
            handleCanvasClick={handleCanvasClick}
            changeWidgetProperty={changeWidgetProperty}
          />
        </main>

        {/** Christopher Parsons, 9/18/2025
         * Inputs:
         *  selectedWidgets: array
         *  changePageProperty: function
         *  widgets: array
         *  deleteWidget: function
         *  pages: array
         *  selectedPageID: number
         *  setSelectedPageID: function
         *  currentPage: Page
         *  createPage: function
         *  changePageProperty: function
         * 
         * Renders the right panel for modifying the properties of selected
         * widgets and pages.
         */}
        <aside className={`${styles.rightPanel} ${styles.sidePanel}`}>
          <RightPanel selectedWidgets={selectedWidgets} changeWidgetProperty={changeWidgetProperty} widgets={widgets} deleteWidget={deleteWidget}
            pages={pages} selectedPageID={selectedPageID} setSelectedPageID={setSelectedPageID} currentPage={currentPage} createPage={createPage}
            changePageProperty={changePageProperty} recordState={recordState} />
        </aside>
      </div>
    </>
  );

  /** Christopher Parsons, 9/18/2025
   * Inputs:
   *  widgetID: number
   *  newProperties: JSX Attribute
   * Outputs:
   *  pages: array
   * 
   * Replaces a widget with itself but with a new attribute.
   */
  function changeWidgetProperty(widgetID, newProperties, preventUpdate) {
    const changedWidgets = widgets.map(widget =>
      // If this is the correct widget, then update the object
      widget.id === widgetID ? { ...widget, ...newProperties }
        : widget // Otherwise, leave it
    );
    setWidgets(changedWidgets);

    if (!preventUpdate) recordState();
  }
}

/** 
 * 
 */
function PageNavigation({ pages, selectedPageID, setSelectedPageID, createPage, updatePageName, deletePage }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const startEdit = (page) => {
    setEditingId(page.id);
    setEditName(page.name);
  };

  const saveEdit = (id) => {
    if (editName.trim()) {
      updatePageName(id, editName.trim());
    }
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this page?")) {
      deletePage(id);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', padding: '10px 0' }}>
      {pages.map(page => (
        <div
          key={page.id}
          style={{
            margin: '0 10px',
            padding: '5px 10px',
            cursor: 'pointer',
            backgroundColor: page.id === selectedPageID ? '#e2e8f0' : 'transparent',
            borderRadius: '4px',
            fontWeight: page.id === selectedPageID ? 'bold' : 'normal',
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={() => {
            if (editingId !== page.id) {
              setSelectedPageID(page.id);
            }
          }}
        >
          {editingId === page.id ? (
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onBlur={() => saveEdit(page.id)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  saveEdit(page.id);
                } else if (e.key === 'Escape') {
                  setEditingId(null);
                }
              }}
              autoFocus
              style={{ width: '100px' }}
            />
          ) : (
            <span onDoubleClick={() => startEdit(page)}>{page.name}</span>
          )}
          <span
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(page.id);
            }}
            style={{ cursor: 'pointer', marginLeft: '5px' }}
          >
            🗑️
          </span>
        </div>
      ))}
      <button onClick={createPage} style={{ marginLeft: '10px' }}>+ New Page</button>
    </div>
  );
}
