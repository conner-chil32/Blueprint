"use client";

import { useEffect, useState, useRef } from "react";
import styles from './page.module.css';
import { WidgetRenderer } from './WidgetRenderer';
import { RenderPage } from "./HtmlConverter";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import Navbar from "../components/navbar"; // <-- ADDED

export default function CanvasPage() {
  // Pages, each containing widgets
  const [pages, setPages] = useState([{ id: 0, name: "Page 0", widgets: [] }]);
  const [selectedPageID, setSelectedPageID] = useState(0);
  const [nextPageID, setNextPageID] = useState(1);
  // .find() searches through each element of an array for a matching value
  const currentPage = pages.find(page => page.id === selectedPageID);

  // Creating widgets
  // If currentPage exists, widgets = currentPage.widgets : otherwise, empty array
  const widgets = currentPage? currentPage.widgets : [];
  const [nextWidgetId, setNextWidgetId] = useState(0);

  // Moving and placing widgets
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isPlacing, setIsPlacing] = useState(false);
  const [widgetToPlace, setWidgetToPlace] = useState(null);

  // Selected widget container
  const [selectedWidgets, setSelectedWidgets] = useState(null);

  // Keep track of where the canvas page is
  const canvasRef = useRef(null);

  // Visibility
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [rightPanelVisible, setRightPanelVisible] = useState(true);

  // Zooming
  const [canZoom, setCanZoom] = useState(true);

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
    setPages([...pages, {id: nextPageID, name: `Page ${nextPageID}`, widgets: []}])
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
      const canvas = canvasRef.current;
      if (!canvas) return;
  
      // Calculate the position of the canvas
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      setMousePos({ x, y });
  
      // If in placement mode and the canvas area, move the widget with the mouse
      if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
        if (isPlacing && widgetToPlace) {
          setWidgetToPlace((prev) => ({
            ...prev,
            x,
            y
          }));
        }
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
          x: mousePos.x,
          y: mousePos.y,
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
        x: mousePos.x,
        y: mousePos.y,
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
        x: mousePos.x,
        y: mousePos.y,
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
        x: mousePos.x,
        y: mousePos.y,
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

  const ZoomControls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="tools">
      <button onClick={() => zoomIn()}>+</button>
      <button onClick={() => zoomOut()}>-</button>
      <button onClick={() => resetTransform()}>x</button>
    </div>
  );
};

  return (
    <>
      <Navbar /> {/* <-- RENDERED NAVBAR */}
      
        {/* Panel on the left, showing options for adding widgets */}
        <div className={`${styles.leftPanel} ${styles.sidePanel}`}>
          <LeftPanel createWidget={createWidget} />
        </div>
        
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

          {/* Canvas for displaying and adding widgets to the site. */}
          <div className={styles.canvasArea} ref={canvasRef} onClick={handleCanvasClick}>

            <TransformWrapper
              initialScale={1}
              initialPositionX={0}
              initialPositionY={0}
              disabled={true}
            >
            <TransformComponent>

            <div className={styles.canvasContent} id="canvas">
              {/* Render new objects, only if widgets exists */}
              {Array.isArray(widgets) && widgets.map((widget) => (
                <WidgetRenderer
                  key={widget.id}
                  widget={widget}
                  // selectedWidgets? means if selectedWidgets is not null
                  // .some checks if any widgets in the array have the same id
                  isSelected={selectedWidgets?.some(w => w.id === widget.id)}
                  onClick={() => {
                    // Select the widget when clicked
                    setSelectedWidgets([widget]);
                    console.log('Selected widget: ' + widget.id);
                  }}
                  alertDragStop={updateWidget}
                  changeWidgetProperty={changeWidgetProperty}
                />
              ))}

              {/* If placing a widget, render it at the mouse position */}
              {isPlacing && widgetToPlace && (
                <WidgetRenderer
                  key={"placing-" + widgetToPlace.id}
                  widget={widgetToPlace}
                />
              )}
            </div>

            </TransformComponent>
            </TransformWrapper>

          </div>

        {/* Panel on the right, showing options for the selected widgets and the canvas page */}
        <div className={`${styles.rightPanel} ${styles.sidePanel}`}>
          <RightPanel selectedWidgets={selectedWidgets} changeWidgetProperty={changeWidgetProperty} widgets={widgets} deleteWidget={deleteWidget}
          pages={pages} selectedPageID={selectedPageID} setSelectedPageID={setSelectedPageID} currentPage={currentPage} createPage={createPage} />
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

function LeftPanel({ createWidget }) {
    return (
      <div>
          <div className={styles.sectionTitle}>Objects</div>
          <button className={styles.categoryItem}>Text Box</button>
          <button className={styles.categoryItem}>Image</button>

          <div className={styles.divider}></div>

          <div className={styles.sectionTitle}>Widgets</div>
          <button className={styles.categoryItem} onClick={() => createWidget('video')}>Video</button>
          <button className={styles.categoryItem} onClick={() => createWidget('dropdown')}>Dropdown</button>
          <button className={styles.categoryItem} onClick={() => createWidget('advert')}>Advertisement</button>

          <div className={styles.divider}></div>

          <div className={styles.sectionTitle}>Shapes</div>
          <button className={styles.categoryItem} onClick={() => createWidget('box')}>Box</button>
          <button className={styles.categoryItem}>Forms</button>
          <button className={styles.categoryItem}>Images</button>
      </div>
    );
  }

  function RightPanel({
    changeWidgetProperty, selectedWidgets, widgets, deleteWidget,
    pages, selectedPageID, setSelectedPageID, currentPage, createPage
  }) {
    const [buttonSelected, setButtonSelected] = useState(false);

    const handleButtonClick = () => {
      setButtonSelected(!buttonSelected);
      console.log(`Canvas status: ${!buttonSelected}`);
    }

    // Return a button to switch between the selected widgets and canvas settings
    return (
      <div>
        {/* Button to switch, always rendered. When clicked, invert buttonSelected */}
        <button className={styles.switchButton} onClick={handleButtonClick}>Switch</button>

        {/* False = widget properties. True = page properties */}
        {!buttonSelected ? <RightWidgetPanel changeWidgetProperty={changeWidgetProperty} selectedWidgets={selectedWidgets} widgets={widgets} deleteWidget={deleteWidget} />
          : <RightPagePanel pages={pages} selectedPageID={selectedPageID} setSelectedPageID={setSelectedPageID} currentPage={currentPage} createPage={createPage} />}
      </div>

    );
  }

  function RightWidgetPanel({ changeWidgetProperty, selectedWidgets, widgets, deleteWidget }) {
    // Render the selected widgets panel
    if (selectedWidgets && selectedWidgets.length > 0) {
    // If something is selected
      return (
        <div>
          <div>
            {/* Button for deleting widgets */}
            <button
              className={styles.deleteButton}
              onClick={() => {
                selectedWidgets.forEach(widget => {
                  console.log('Deleting ', widget)
                  deleteWidget(widget.id);
                })
              }}
            >Delete Selected Widget</button>
          </div>
  
          {/* Menu to change widgets */}
          {selectedWidgets.map((widget) => (
            <div key={widget.id} className={styles.widgetOptions}>
              {/* Inputs to change widget properties */}
              <p>Color:</p>
              <input
                type="color"
                value={widget.backgroundColor || "#cccccc"}
                onChange={e => changeWidgetProperty(widget.id, { backgroundColor: e.target.value })}
              />
  
              {/* Two rotation inputs, one as an editable display and the other as a slider */}
              <p>Rotation: {widget.rotation}</p>
              <input
                type="number"
                min="0"
                max="360"
                value={widget.rotation || 0}
                onChange={e =>
                  changeWidgetProperty(widget.id, { rotation: parseInt(e.target.value, 10) })
                }/>
              <input
                type="range"
                min="0"
                max="360"
                value={widget.rotation || 0}
                onChange={e =>
                  changeWidgetProperty(widget.id, { rotation: parseInt(e.target.value || "0", 10) })
                }
              />
  
              {/* ===== Video controls ===== */}
              {widget.type === 'video' && (
                <>
                  <p>Video URL:</p>
                  <input
                    type="text"
                    placeholder="/videos/intro.mp4 or https://cdn.example.com/clip.mp4"
                    value={widget.videoUrl || ""}
                    onChange={e =>
                      changeWidgetProperty(widget.id, { videoUrl: e.target.value || null })
                    }
                  />
  
                  <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <span>Loop</span>
                  <input
                    type="checkbox"
                    checked={!!widget.loop}
                    onChange={e => changeWidgetProperty(widget.id, { loop: e.target.checked })}
                  />
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <span>Muted</span>
                  <input
                    type="checkbox"
                    checked={!!widget.muted}
                    onChange={e => changeWidgetProperty(widget.id, { muted: e.target.checked })}
                  />
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <span>Show controls</span>
                  <input
                    type="checkbox"
                    checked={!!widget.controls}
                    onChange={(e) =>
                      changeWidgetProperty(widget.id, { controls: e.target.checked })
                    }
                  />
                </label>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <span>Autoplay</span>
                  <input
                    type="checkbox"
                    checked={!!widget.autoplay}
                    onChange={(e) =>
                      changeWidgetProperty(widget.id, { autoplay: e.target.checked })
                    }
                  />
                </label>
                </>
              )}
  
              {/* ===== Dropdown controls ===== */}
              {widget.type === 'dropdown' && (() => {
                // Use a draft string while typing; default to current options joined with ", "
                const draft = widget.optionsText ?? (widget.options || []).join(", ");

                // Commit helper: turn the draft string into an options array and normalize it
                const commitOptions = (raw) => {
                  const arr = (raw || "")
                    .split(",")
                    .map(s => s.trim())
                    .filter(Boolean); // drop empty tokens on commit only

                  const nextValue = arr.includes(widget.value) ? widget.value : (arr[0] || "");
                  // Save normalized text too so the input shows tidy commas + spaces
                  const normalizedText = arr.join(", ");

                  changeWidgetProperty(widget.id, {
                    options: arr,
                    value: nextValue,
                    optionsText: normalizedText,
                  });
                };

                return (
                  <>
                    <p>Options (comma-separated):</p>
                    <input
                      type="text"
                      value={draft}
                      onChange={e => {
                        // While typing, only update the draft string; don't parse/sanitize yet.
                        changeWidgetProperty(widget.id, { optionsText: e.target.value });
                      }}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          commitOptions(e.currentTarget.value);
                          // keep focus if you want: e.currentTarget.blur();
                        }
                      }}
                      onBlur={e => commitOptions(e.currentTarget.value)}
                    />

                    <p>Selected Value:</p>
                    <input
                      type="text"
                      value={widget.value || ""}
                      onChange={e => changeWidgetProperty(widget.id, { value: e.target.value })}
                    />

                    <p>Font Size:</p>
                    <input
                      type="number"
                      min="10"
                      max="48"
                      value={widget.fontSize || 14}
                      onChange={e =>
                        changeWidgetProperty(
                          widget.id,
                          { fontSize: parseInt(e.target.value || "14", 10) }
                        )
                      }
                    />

                    <p>Text Color:</p>
                    <input
                      type="color"
                      value={widget.textColor || "#111111"}
                      onChange={e => changeWidgetProperty(widget.id, { textColor: e.target.value })}
                    />
                  </>
                );
              })()}

  
              {/* ===== Advertisement controls ===== */}
              {widget.type === 'advert' && (
                <>
                  <p>Image URL:</p>
                  <input
                    type="text"
                    placeholder="https://…/banner.jpg"
                    value={widget.imageUrl || ""}
                    onChange={e => changeWidgetProperty(widget.id, { imageUrl: e.target.value })}
                  />
  
                  <p>Link URL:</p>
                  <input
                    type="text"
                    placeholder="www.google.com"
                    value={widget.linkUrl || ""}
                    onChange={e => changeWidgetProperty(widget.id, { linkUrl: e.target.value })}
                  />
  
                  <p>Object Fit:</p>
                  <select
                    value={widget.objectFit || "cover"}
                    onChange={e => changeWidgetProperty(widget.id, { objectFit: e.target.value })}
                  >
                    <option value="contain">contain</option>
                    <option value="cover">cover</option>
                    <option value="fill">fill</option>
                    <option value="none">none</option>
                    <option value="scale-down">scale-down</option>
                  </select>
  
                  <label>
                    <input
                      type="checkbox"
                      checked={!!widget.showBorder}
                      onChange={e => changeWidgetProperty(widget.id, { showBorder: e.target.checked })}
                    />
                    Show border
                  </label>
  
                  <p>Border Color:</p>
                  <input
                    type="color"
                    value={widget.borderColor || "#333333"}
                    onChange={e => changeWidgetProperty(widget.id, { borderColor: e.target.value })}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      );
    }
  else {
      // If something is not selected
      return (
      <p>Select a widget to view its properties.</p>
    );
    }
  }  

function RightPagePanel({ pages, selectedPageID, setSelectedPageID, currentPage, createPage }) {

  const downloadHTMLPage = (currentPage) => {
    console.log("Downloading page", currentPage);

    const file = new Blob([RenderPage(currentPage)], {type: 'text/html'});

    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = "Page" + Date.now() + ".html";

    document.body.appendChild(element);
  }

  return(
    <div>
      {/* A view of all pages */}
      <select value={selectedPageID} onChange={e => setSelectedPageID(Number(e.target.value))}>
        {pages.map(page => (
          <option key={page.id} value={page.id}>{page.name}</option>
        ))}
      </select>
      
      {/* Buttons for editing pages */}
      <button onClick={createPage}>+ New Page</button>

      {/* Download current page as HTML */}
      <button >Download Page</button>
    </div>
  );
}
