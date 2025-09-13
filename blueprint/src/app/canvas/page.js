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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
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

  /**
   * When the mouse moves, keep track of its position.
   * useEffect is essentially a hook that keeps track of actions performed on the page.
   * @param {*} e 
   */
  useEffect(() => {
    const handleMouseMove = (e) => {
      const canvas = canvasRef.current;

      // If the canvas does not exist, return
      if (!canvas) return;

      // Calculate the position of the canvas, taking scale into account
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - transformCoords.posX) / scale;
      const y = (e.clientY - rect.top - transformCoords.posY) / scale;

      setMousePos({ x, y });

      // If in placement mode, move the widget with the mouse
      if (isPlacing && widgetToPlace) {
        setWidgetToPlace((prev) => ({
          ...prev,
          x: x - prev.width / 2,
          y: y - prev.height / 2,
        }));
      }
    };

    const handleKeyPresses = (e) => {
      if ((e.keyCode === 8 || e.keyCode === 46) && selectedWidgets?.length) {
        selectedWidgets.forEach(widget => {
          console.log("Button pressed ", e.key);
          deleteWidget(widget.id);
        })
      }
    };

    document.addEventListener('keydown', handleKeyPresses);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener('keydown', handleKeyPresses);
      window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [isPlacing, widgetToPlace, selectedWidgets]);

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
      {/*<Navbar />*/}
      
      {/* Panel on the left, showing options for adding widgets */}
      <div className={`${styles.leftPanel} ${styles.sidePanel}`}>
        <LeftPanel createWidget={createWidget} />
      </div>

      <TransformWrapper
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
        disabled={isPlacing || isDragging}
        limitToBounds={false}
        panning={{ velocityDisabled: true }}
        minScale={0.05}
        // Keep track of zoom transform and scale
        onTransformed={({ state }) => {
          setScale(state.scale);
          setTransformCoords({posX: state.positionX, posY: state.positionY});
        }}
      >
        {/* Canvas area, a window to view the current page */}
        <div className={styles.canvasArea}>

          <TransformComponent>

            {/* The component for moving/zooming the camera */}
            <div className={styles.canvasView} ref={canvasRef} onClick={handleCanvasClick}>
                
                {/* The page itself is its own component here */}
                <div className={styles.pages}
                  style={{
                    width: currentPage?.width + "px",
                    height: currentPage?.height + "px",
                    backgroundColor: currentPage.backgroundColor,
                  }}
                >
                  {/* Render new objects, only if widgets exists */}
                  {Array.isArray(widgets) &&
                    widgets.map((widget) => (
                      <WidgetRenderer
                        bounds="parent"
                        key={widget.id}
                        widget={widget}
                        // selectedWidgets? means if selectedWidgets is not null
                        // .some checks if any widgets in the array have the same id
                        isSelected={selectedWidgets?.some((w) => w.id === widget.id)}
                        onClick={() => {
                          // Select the widget when clicked
                          setSelectedWidgets([widget]);
                          console.log("Selected widget: " + widget.id);
                        }}
                        onDragStart={() => setIsDragging(true)}
                        onDragStop={() => setIsDragging(false)}
                        alertDragStop={updateWidget}
                        scale={scale}
                      />
                    ))}

                  {/* If placing a widget, render it at the mouse position */}
                  {isPlacing && widgetToPlace && (
                    <WidgetRenderer key={"placing-" + widgetToPlace.id} widget={widgetToPlace} scale={scale} />
                  )}
                </div>
            </div>
            </TransformComponent>
        </div>
      </TransformWrapper>

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

  function changePageProperty(pageID, newProperties) {
    const changedPages = pages.map(page =>
      // If this is the correct widget, then update the object
      page.id === pageID ? {...page, ...newProperties}
      : page // Otherwise, leave it
    );

    setPages(changedPages);
  }
}

function LeftPanel({ createWidget }) {
    return (
      <div>
          <div className={styles.sectionTitle}>Objects</div>
          <button className={styles.categoryItem}>Text Box</button>
          <button className={styles.categoryItem}>Image</button>

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
    pages, selectedPageID, setSelectedPageID, currentPage, createPage, changePageProperty
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
          : <RightPagePanel pages={pages} selectedPageID={selectedPageID} setSelectedPageID={setSelectedPageID} currentPage={currentPage} createPage={createPage} changePageProperty={changePageProperty} />}
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
            <button className={styles.deleteButton} onClick={() => {
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
                  changeWidgetProperty(widget.id, { rotation: parseInt(e.target.value, 10) })
              }/>
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

function RightPagePanel({ pages, selectedPageID, setSelectedPageID, currentPage, createPage, changePageProperty }) {

  const downloadHTMLPage = (currentPage) => {
    console.log("Downloading page", currentPage);

    const file = new Blob([RenderPage(currentPage)], {type: 'text/html'});

    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = "Page" + Date.now() + ".html";

    document.body.appendChild(element);
  }

  return(
    <div className={styles.widgetOptions}>
      {/* A view of all pages */}
      <select value={selectedPageID} onChange={e => setSelectedPageID(Number(e.target.value))}>
        {pages.map(page => (
          <option key={page.id} value={page.id}>{page.name}</option>
        ))}
      </select>
      
      {/* Buttons for editing pages */}
      <button onClick={createPage}>+ New Page</button>

      {/* Page size controls */}
      <div>
        <p>Width</p>
        <input 
          type="input"
          min="0"
          autoComplete="off"
          value={currentPage.width}
          onChange={e => {
            if (e?.target.value === "") {
              changePageProperty(selectedPageID, { width: 0 })
            } else {
              changePageProperty(selectedPageID, { width: parseInt(e.target.value, 10) })
            }
          }}/>

        <p>Height</p>
        <input 
          type="input"
          min="0"
          autoComplete="off"
          value={currentPage.height}
          onChange={e => {
            if (e?.target.value === "") {
              changePageProperty(selectedPageID, { height: 0 })
            } else {
              changePageProperty(selectedPageID, { height: parseInt(e.target.value, 10) })
            }
          }}
          />

          <p>Background Color</p>
          <input 
            type="color"
            onChange={e => {
              if (e?.target.value === "") {
                changePageProperty(selectedPageID, { backgroundColor: '#ffffff' })
              } else {
                changePageProperty(selectedPageID, { backgroundColor: e.target.value })
              }
            }}
          />
      </div>

      {/* Download current page as HTML */}
      <button >Download Page</button>
    </div>
  );
}