"use client";

import { useEffect, useState, useRef } from "react";
import styles from './page.module.css';

import Navbar from "../components/navbar";
import { Canvas } from './Canvas';
import { LeftPanel } from './LeftPanel';
import { RightPanel } from './RightPanel';

export default function CanvasPage() {
  // Pages, each containing widgets
  const [pages, setPages] = useState([{ id: 0, name: "Page 0", widgets: [], width: 800, height: 600, backgroundColor: '#ffffff' }]);
  const [selectedPageID, setSelectedPageID] = useState(0);
  const [nextPageID, setNextPageID] = useState(1);
  // .find() searches through each element of an array for a matching value
  const currentPage = pages.find(page => page.id === selectedPageID);

  // Creating widgets
  // If currentPage exists, widgets = currentPage.widgets : otherwise, empty array
  const widgets = currentPage? currentPage.widgets : [];
  const [nextWidgetId, setNextWidgetId] = useState(0);

  // Moving and placing widgets
  const [canvasMousePos, setCanvasMousePos] = useState({ x: 0, y: 0 });
  const [pageMousePos, setPageMousePos] = useState({ x: 0, y: 0 });
  const [isPlacing, setIsPlacing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [widgetToPlace, setWidgetToPlace] = useState(null);

  // Selected widget container
  const [selectedWidgets, setSelectedWidgets] = useState(null);

  // Keep track of where the canvas page is
  const canvasRef = useRef(null);

  // Scaling managment
  const [scale, setScale] = useState(1);
  const [transformCoords, setTransformCoords] = useState({ posX: 0, posY: 0 });

  // Update the current page to include new widgets
  const setWidgets = (newWidgets) => {
    setPages(prev => 
      prev.map(page =>
        page.id === selectedPageID ? { ...page, widgets: newWidgets } : page
      )
    );
  };

  // Create a new page
  const createPage = () => {
    setPages([
      ...pages,
      {id: nextPageID,
        name: `Page ${nextPageID}`,
        widgets: [],
        width: 800,
        height: 600,
        backgroundColor: '#ffffff'
      }])

    setSelectedPageID(nextPageID);
    console.log('Created page', nextPageID);
    setNextPageID(nextPageID+1);
  };

  // Delete a page
  const deletePage = (pageId) => {
    if (pages.length <= 1) {
      console.log('Cannot delete the last page');
      return;
    }
    setPages(prev => prev.filter(page => page.id !== pageId));
    if (selectedPageID === pageId) {
      setSelectedPageID(pages[0].id);
    }
  };

  // Update page name
  const updatePageName = (pageId, newName) => {
    setPages(prev => prev.map(page => page.id === pageId ? { ...page, name: newName } : page));
  };

  /**
   * When the mouse moves, keep track of its position.
   * useEffect is essentially a hook that keeps track of actions performed on the page.
   * @param {*} e 
   */
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPageMousePos({ x: e.clientX, y: e.clientY });
      const canvas = canvasRef.current;

      // If the canvas does not exist, return
      if (!canvas) return;

      // Calculate the position of the canvas, taking scale into account
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - transformCoords.posX) / scale;
      const y = (e.clientY - rect.top - transformCoords.posY) / scale;

      setCanvasMousePos({ x, y });

      // If in placement mode, move the widget with the mouse
      if (isPlacing && widgetToPlace) {
        setWidgetToPlace((prev) => ({
          ...prev,
          x: canvasMousePos.x,
          y: canvasMousePos.y,
        }));
      }
    };
  
    /* 
    Old keyDown handlen deleted widgets by pressing backspace or delete when typing in input fields.
    Now modified to prevent Backspace/Delete from navigating back or deleting widgets when typing in an input field.
    Can still delete widgets using the delete button in the right panel. 
    */
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
  
      // Do NOT delete widgets on Backspace/Delete anymore.
      // Prevent browser back navigation in some contexts.
      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
      }
    };
  
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("keydown", handleDocumentKeyDown);
  
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, [isPlacing, widgetToPlace]);
  

  /**
  * Ensure changes to the widgets updates the whole page
  * @param {*} e 
  */
  useEffect(() => {
    if (!selectedWidgets || selectedWidgets.length === 0) return;

    // Re-select updated widget objects from the widgets array
    const updatedSelection = selectedWidgets.map(sel =>
      widgets.find(w => w.id === sel.id)
    ).filter(Boolean); // Remove nulls in case of deletion

    setSelectedWidgets(updatedSelection);
  }, [widgets]);

  /**
   * Triggers when the canvas page itself is clicked.
   * Handles the placement of widgets and deselection of all widgets.
   * If in placement mode, it will drop the current widget.
   */
  const handleCanvasClick = () => {
    // If in placement mode, drop the current widget.
    if (isPlacing && widgetToPlace) {
      const placedWidget = {
        ...widgetToPlace,
        isSelected: false,
        isMoving: false,
        pointerEventsNone: false,
      };

      // Set the widgets to the old widgets array plus the new widget
      setWidgets([...widgets, placedWidget]);
      setIsPlacing(false);
      widgetToPlace.isSelected = false;
      widgetToPlace.isMoving = false;
      widgetToPlace.pointerEventsNone = false;

      console.log('Added widget', widgetToPlace.id, 'to page', selectedPageID);
    } else {
      // Deselect all widgets if not placing
      deselectAllWidgets();
    }
  };

  const updateWidget = (widgetID, newX, newY, newSize = null) => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === widgetID ? { ...widget, x: newX, y: newY, ...(newSize && { width: newSize.width, height: newSize.height }) } : widget
    );
    setWidgets(updatedWidgets);
  };

  /**
   * Create a new widget with default values.
   * @param {*} typeToMake 
   * @returns 
   */
  const createWidget = (typeToMake) => {
    let newWidget = null;
    const nextId = nextWidgetId;

    switch (typeToMake) {
      case 'box':
        newWidget = {
          type: 'box',
          id: nextId,
          x: canvasMousePos.x,
          y: canvasMousePos.y,
          width: 100,
          height: 100,
          isSelected: false,
          isMoving: true,
          backgroundColor: '#cccccc',
          pointerEventsNone: true,
          rotation: 0,
        };
        break;

      case 'video':
        newWidget = {
          type: 'video',
          id: nextId,
          x: canvasMousePos.x,
          y: canvasMousePos.y,
          width: 320,
          height: 180,
          isSelected: false,
          isMoving: true,
          backgroundColor: '#000000',
          pointerEventsNone: true,
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
          x: canvasMousePos.x,
          y: canvasMousePos.y,
          width: 220,
          height: 50,
          isSelected: false,
          isMoving: true,
          backgroundColor: '#ffffff',
          pointerEventsNone: true,
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
          x: canvasMousePos.x,
          y: canvasMousePos.y,
          width: 300,
          height: 250, // standard MPU size
          isSelected: false,
          isMoving: true,
          backgroundColor: '#ffffff',
          pointerEventsNone: true,
          rotation: 0,
          // custom props:
          imageUrl: '/images/Blueprint.png',
          linkUrl: 'http://localhost:3000/features',
          alt: 'Advertisement',
          objectFit: 'cover',
          showBorder: true,
          borderColor: '#333333',
        };
        break;

      case 'hyperlink':
        newWidget = {
          type: 'hyperlink',
          id: nextId,
          x: canvasMousePos.x,
          y: canvasMousePos.y,
          width: 150,
          height: 40,
          isSelected: false,
          isMoving: true,
          backgroundColor: 'transparent', // Links don't need a background
          pointerEventsNone: true,
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
          x: canvasMousePos.x,
          y: canvasMousePos.y,
          width: 200,
          height: 250,
          isSelected: false,
          isMoving: true,
          backgroundColor: '#f0f0f0',
          pointerEventsNone: true,
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
    console.log('Created new widget: ', newWidget);

    setNextWidgetId((prevId) => prevId + 1);
    setIsPlacing(true);
    setWidgetToPlace(newWidget);
  };
  
  function deleteWidget(id) {
    console.log('Deleting widget', id);
    setWidgets(widgets.filter(widget => widget.id !== id));
    deselectAllWidgets();
  }

  function deselectAllWidgets() {
    setSelectedWidgets(null);
    console.log('Deselected all widgets');
  }

  function changePageProperty(pageID, newProperties) {
    const changedPages = pages.map(page =>
      // If this is the correct widget, then update the object
      page.id === pageID ? {...page, ...newProperties}
      : page // Otherwise, leave it
    );

    setPages(changedPages);
  }

  return (
    <>
      <Navbar /> {/* <-- RENDERED NAVBAR */}
    
        {/* Page navigation bar above the canvas */}
        <div className={styles.pageNavBar} style={{ top: '70px' }}>
          <PageNavigation
            pages={pages}
            selectedPageID={selectedPageID}
            setSelectedPageID={setSelectedPageID}
            createPage={createPage}
            updatePageName={updatePageName}
            deletePage={deletePage}
          />
        </div>

      {/* Panel on the left, showing options for adding widgets */}
      <div className={`${styles.leftPanel} ${styles.sidePanel}`}>
        <LeftPanel createWidget={createWidget} />
      </div>

      <Canvas
        widgets={widgets}
        isPlacing={isPlacing}
        isDragging={isDragging}
        widgetToPlace={widgetToPlace}
        selectedWidgets={selectedWidgets}
        setSelectedWidgets={setSelectedWidgets}
        setIsDragging={setIsDragging}
        updateWidget={updateWidget}
        scale={scale}
        setScale={setScale}
        setTransformCoords={setTransformCoords}
        currentPage={currentPage}
        canvasRef={canvasRef}
        handleCanvasClick={handleCanvasClick}
        changeWidgetProperty={changeWidgetProperty}
      />

      {/* Panel on the right, showing options for the selected widgets and the canvas page */}
      <div className={`${styles.rightPanel} ${styles.sidePanel}`}>
        <RightPanel selectedWidgets={selectedWidgets} changeWidgetProperty={changeWidgetProperty} widgets={widgets} deleteWidget={deleteWidget}
        pages={pages} selectedPageID={selectedPageID} setSelectedPageID={setSelectedPageID} currentPage={currentPage} createPage={createPage} changePageProperty={changePageProperty} />
      </div>
    </>
  );
  
  function changeWidgetProperty(widgetID, newProperties) {
    const changedWidgets = widgets.map(widget =>
      // If this is the correct widget, then update the object
      widget.id === widgetID ? {...widget, ...newProperties}
      : widget // Otherwise, leave it
    );

    setWidgets(changedWidgets);
  }
}

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
